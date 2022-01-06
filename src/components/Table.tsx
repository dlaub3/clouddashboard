import "@aws-amplify/ui-react/styles.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import {
  DescribeInstancesCommand,
  DescribeInstancesCommandOutput,
  EC2Client,
} from "@aws-sdk/client-ec2";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { AWS_IDENTITY_POOL_ID, AWS_REGION } from "../env";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

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

interface InstanceRow {
  id: string;
  name: string;
  instanceId: string;
  type: string;
  state: string;
  availabilityZone: string;
  publicIP: string;
  privateIP: string;
}

const columns: GridColDef[] = [
  { field: "instanceId", headerName: "Instance Id", width: 150 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "state", headerName: "State", width: 150 },
  { field: "availabilityZone", headerName: "Availability Zone", width: 150 },
  { field: "publicIP", headerName: "Public IP", width: 150 },
  { field: "publicIP", headerName: "Private IP", width: 150 },
];

export const Table = (props: { user: any }) => {
  const { user } = props;

  const ec2 = new EC2Client({
    region: AWS_REGION,
    credentials: getCognitoCredentials(user),
  });

  const getData = async () => {
    const command = new DescribeInstancesCommand({});
    const data = await ec2.send(command);
    setData(formatInstanceData(data.Reservations));
  };

  const [data, setData] = React.useState<Array<InstanceRow>>([]);

  React.useEffect(() => {
    getData();
  }, []);

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
    <Box>
      <Typography>EC2 Instances</Typography>
      <Box sx={{ width: 1200, height: 800 }}>
        <DataGrid rows={data} columns={columns} />
      </Box>
    </Box>
  );
};
