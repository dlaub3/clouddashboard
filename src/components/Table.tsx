import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./../aws-exports";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import {
  DescribeInstancesCommand,
  DescribeInstancesCommandOutput,
  EC2Client,
} from "@aws-sdk/client-ec2";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

Amplify.configure(awsExports);

interface InstanceRow {
  name: string;
  instanceId: string;
  type: string;
  state: string;
  availabilityZone: string;
  publicIP: string;
  privateIP: string;
}

export const Table = (props: { user: any }) => {
  const { user } = props;

  /**
   * NOTE:
   * Find a more conventional way to do this.
   * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-browser-credentials-cognito.html
   *
   * Daniel Laubacher
   * Wed 05 Jan 2022
   **/
  const COGNITO_ID = (user.client.endpoint.replace("https://", "") +
    user.pool.userPoolId) as string;
  const COGNITO_TOKEN_KEY = user.keyPrefix + "." + user.username + ".idToken";
  const COGNITO_ID_TOKEN = () =>
    Promise.resolve<string>(user.pool.storage[COGNITO_TOKEN_KEY]);
  const logins = {
    [COGNITO_ID]: COGNITO_ID_TOKEN,
  };

  const credentials = fromCognitoIdentityPool({
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID ?? "",
    clientConfig: { region: process.env.REACT_APP_REGION ?? "" },
    logins,
  });

  const ec2 = new EC2Client({
    region: process.env.REACT_APP_REGION ?? "",
    credentials: credentials,
  });

  const getData = async (set: (x: {}) => void) => {
    const command = new DescribeInstancesCommand({});
    const data = await ec2.send(command);
    set(formatInstanceData(data.Reservations));
  };

  const [data, setData] = React.useState({});

  React.useEffect(() => {
    getData(setData);
  }, []);

  const formatInstanceData = (
    xs: DescribeInstancesCommandOutput["Reservations"]
  ) => {
    return xs
      ? xs.map((x) => {
          return x.Instances?.map((instance): InstanceRow => {
            const name = instance.PublicDnsName ?? "";
            const instanceId = instance.InstanceId ?? "";
            const type = instance.InstanceType ?? "";
            const state = instance.State?.Name ?? "";
            const availabilityZone = instance.Placement?.AvailabilityZone ?? "";
            const publicIP = instance.PublicIpAddress ?? "";
            const privateIP = instance.PrivateIpAddress ?? "";

            return {
              name,
              instanceId,
              type,
              state,
              availabilityZone,
              publicIP,
              privateIP,
            };
          });
        })
      : [];
  };

  return (
    <Box>
      <Typography>EC2 Instances</Typography>
      {JSON.stringify(data, null, 2)}
    </Box>
  );
};
