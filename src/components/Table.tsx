import "@aws-amplify/ui-react/styles.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import {
  DescribeInstancesCommand,
  DescribeInstancesCommandOutput,
  EC2Client,
  Reservation,
} from "@aws-sdk/client-ec2";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { AWS_IDENTITY_POOL_ID, AWS_REGION } from "../env";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { InstanceRow, User } from "../types";
import { fakeRowData } from "./__tests__/Table.data";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper } from "@mui/material";

export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
}

const getCognitoLoginData = (user: any) => {
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
  return {
    [COGNITO_ID]: COGNITO_ID_TOKEN,
  };
};

const getCognitoCredentials = (user: any) => {
  return fromCognitoIdentityPool({
    identityPoolId: AWS_IDENTITY_POOL_ID,
    clientConfig: { region: AWS_REGION },
    logins: getCognitoLoginData(user),
  });
};

const columns: GridColDef[] = [
  { field: "instanceId", headerName: "Instance Id", width: 150 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "state", headerName: "State", width: 150 },
  { field: "availabilityZone", headerName: "Availability Zone", width: 150 },
  { field: "publicIP", headerName: "Public IP", width: 150 },
  { field: "publicIP", headerName: "Private IP", width: 150 },
];

const newEc2Client = (user: any) =>
  new EC2Client({
    region: AWS_REGION,
    credentials: getCognitoCredentials(user),
  });

const getRecursiveDescribeInstancesCommand = (ec2: EC2Client) =>
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

export const Table = (props: { user: User }) => {
  const { user } = props;

  const ec2 = React.useMemo(() => newEc2Client(user), [user]);
  const recursiveDescribeInstancesCommand = React.useMemo(
    () => getRecursiveDescribeInstancesCommand(ec2),
    [ec2]
  );

  const [data, setData] = React.useState<Array<InstanceRow>>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    recursiveDescribeInstancesCommand({ data: [] })
      .then((data) => {
        setData(formatInstanceData(data));
      })
      .finally(() => setIsLoading(false));
  }, [recursiveDescribeInstancesCommand]);

  const formatInstanceData = (
    xs: DescribeInstancesCommandOutput["Reservations"]
  ): InstanceRow[] => {
    return xs
      ? xs.flatMap((x) => {
          return x.Instances
            ? x.Instances.map((instance): InstanceRow => {
                const name = instance.PublicDnsName ?? "";
                const instanceId = instance.InstanceId ?? "";
                const type = instance.InstanceType ?? "";
                const state = instance.State?.Name ?? "";
                const availabilityZone =
                  instance.Placement?.AvailabilityZone ?? "";
                const publicIP = instance.PublicIpAddress ?? "";
                const privateIP = instance.PrivateIpAddress ?? "";

                return {
                  id: instanceId,
                  name,
                  instanceId,
                  type,
                  state,
                  availabilityZone,
                  publicIP,
                  privateIP,
                };
              })
            : [];
        })
      : [];
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="space-around"
    >
      <Typography variant="h3">Active EC2 Instance Fleet</Typography>
      <Paper
        sx={{
          width: "100%",
          height: 750,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <CircularIndeterminate />
        ) : (
          <DataGrid rows={fakeRowData} columns={columns} />
        )}
      </Paper>
    </Box>
  );
};
