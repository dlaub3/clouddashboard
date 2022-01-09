import "@aws-amplify/ui-react/styles.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { DescribeInstancesCommandOutput } from "@aws-sdk/client-ec2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { InstanceRow, User } from "../types";
import { Paper } from "@mui/material";
import CircularIndeterminate from "./loaders/CircularIndeterminate";
import {
  getRecursiveDescribeInstancesCommand,
  newEc2Client,
} from "../helpers/ec2";
import { fakeRowData } from "./__tests__/Table.data";

const formatInstanceData = (
  xs: DescribeInstancesCommandOutput["Reservations"]
): InstanceRow[] => {
  return xs
    ? xs.flatMap((x) => {
        return x.Instances
          ? x.Instances.map((instance): InstanceRow => {
              const publicDnsName = instance.PublicDnsName ?? "";
              const instanceId = instance.InstanceId ?? "";
              const type = instance.InstanceType ?? "";
              const state = instance.State?.Name ?? "";
              const availabilityZone =
                instance.Placement?.AvailabilityZone ?? "";
              const publicIP = instance.PublicIpAddress ?? "";
              const privateIP = instance.PrivateIpAddress ?? "";

              return {
                id: instanceId,
                publicDnsName,
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

const columns: GridColDef[] = [
  { field: "instanceId", headerName: "Instance Id", width: 150 },
  { field: "publicDnsName", headerName: "Public DNS Name", width: 150 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "state", headerName: "State", width: 150 },
  { field: "availabilityZone", headerName: "Availability Zone", width: 150 },
  { field: "publicIP", headerName: "Public IP", width: 150 },
  { field: "privateIP", headerName: "Private IP", width: 150 },
];

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
          <DataGrid rows={data.concat(fakeRowData)} columns={columns} />
        )}
      </Paper>
    </Box>
  );
};
