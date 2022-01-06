export interface User {}

export type OnLoginSubmit = (props: {
  username: string;
  password: string;
}) => void;

export type OnSignOut = () => void;

export interface InstanceRow {
  id: string;
  name: string;
  instanceId: string;
  type: string;
  state: string;
  availabilityZone: string;
  publicIP: string;
  privateIP: string;
}
