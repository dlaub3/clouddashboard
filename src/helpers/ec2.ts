import {
  DescribeInstancesCommand,
  EC2Client,
  Reservation,
} from "@aws-sdk/client-ec2";
import { AWS_REGION } from "../env";
import { getCognitoCredentials } from "./cognito";

export const newEc2Client = (user: any) =>
  new EC2Client({
    region: AWS_REGION,
    credentials: getCognitoCredentials(user),
  });

export const getRecursiveDescribeInstancesCommand = (ec2: EC2Client) =>
  async function recursiveDescribeInstancesCommand(params: {
    NextToken?: string;
    data: Reservation[];
  }) {
    // It appears that MaxResults is 1000
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/describeinstancescommandinput.html
    // so additional calls will be required to load all of the instances for FE sorting
    // since the API doesn't appear to provide sorting based on Instance fields.
    const command = new DescribeInstancesCommand({
      // 0 (pending), 16 (running), 32 (shutting-down), 48 (terminated), 64 (stopping), and 80 (stopped).
      Filters: [
        { Name: "instance-state-code", Values: ["0", "16", "32", "48", "64"] },
      ],
      NextToken: params.NextToken,
    });

    const data: Reservation[] = await ec2
      .send(command)
      .then(({ Reservations, NextToken }) => {
        return NextToken
          ? recursiveDescribeInstancesCommand({
              data: Reservations ?? [],
              NextToken,
            })
          : Reservations ?? [];
      });

    return params.data.concat(data);
  };
