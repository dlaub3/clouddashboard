import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { AWS_IDENTITY_POOL_ID, AWS_REGION, AWS_USER_POOL_ID } from "../env";
import { User } from "../types";

const getCognitoLoginData = (user: User) => {
  /**
   * NOTE:
   * Find a more conventional way to do this.
   * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-browser-credentials-cognito.html
   *
   * Daniel Laubacher
   * Wed 05 Jan 2022
   **/
  const COGNITO_ID = `cognito-idp.${AWS_REGION}.amazonaws.com/${AWS_USER_POOL_ID}`;
  const COGNITO_TOKEN_KEY = user.keyPrefix + "." + user.username + ".idToken";

  return {
    [COGNITO_ID]: user.storage[COGNITO_TOKEN_KEY],
  };
};

export const getCognitoCredentials = (user: any) => {
  return fromCognitoIdentityPool({
    identityPoolId: AWS_IDENTITY_POOL_ID,
    clientConfig: { region: AWS_REGION },
    logins: getCognitoLoginData(user),
  });
};
