/**
 * These fields are based on the output
 * of logging a logged in users data to the console.
 * The fields are incomplete. It would be better to find the correct
 * type from AWS Amplify.
 *
 * Daniel Laubacher
 * Thu 06 Jan 2022
 **/
export interface User {
  username: string;
  keyPrefix: string;
  storage: Record<string, string>;
}

export type OnLoginSubmit = (props: {
  username: string;
  password: string;
}) => void;

export type OnSignOut = () => void;

export interface InstanceRow {
  id: string;
  publicDnsName: string;
  instanceId: string;
  type: string;
  state: string;
  availabilityZone: string;
  publicIP: string;
  privateIP: string;
}
