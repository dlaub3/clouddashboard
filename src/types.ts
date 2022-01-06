export interface User {}

export type OnLoginSubmit = (props: {
  username: string;
  password: string;
}) => void;

export type OnSignOut = () => void;
