import { EC2Client } from "@aws-sdk/client-ec2";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const REGION = 'us-east-1'
const IDENTITY_POOL_ID = 'us-east-1:ce141a7e-dcc9-4ae2-8cff-08d505721424'

export const ec2 = new EC2Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: REGION }, 
    identityPoolId: IDENTITY_POOL_ID,
    logins: {},
  })})
