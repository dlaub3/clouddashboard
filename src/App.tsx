import React from "react";
import "./App.css";
import {
  EC2Client,
  DescribeInstancesCommand,
  DescribeInstancesCommandOutput,
} from "@aws-sdk/client-ec2";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { MenuPage } from "./components/layout/MenuPage";
import MenuBar from "./components/layout/MenuBar";
import { Authentication } from "./components/Authentication";
import { SignInForm } from "./components/SignInForm";
import { Table } from "./components/Table";

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

const Temp = (user: any) => {
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
    identityPoolId: "IDENTITY_POOL_ID",
    clientConfig: { region: "REGION" },
    logins,
  });

  const ec2 = new EC2Client({
    region: "REGION",
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
};

function App() {
  return (
    <Authentication
      unauthenticatedPage={({ onSubmit, isSubmitting }) => (
        <MenuPage menu={<MenuBar isAuthenticated={false} />}>
          <SignInForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </MenuPage>
      )}
      authenticatedPage={({ user, onSignOut }) => (
        <MenuPage menu={<MenuBar isAuthenticated={true} logout={onSignOut} />}>
          <>
            Welcome {(user as any).username}
            <Table />
          </>
        </MenuPage>
      )}
    />
  );
}

export default App;
