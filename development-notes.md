# Cloud Dashboard

## Day 1
**Acceptance Criteria**
- Deployed Web App
- Username/Password Login

**Table Requirements**
- [ ] data: all *active* EC2 instances
- [ ] columns: name, id (e.g. a-123456abcd), type (e.g. t2.medium), state (e.g. 
running), az (e.g. “us-east-1b”), public IP (e.g. “54.210.167.204"), private IPs 
(e.g. “10.20.30.40”)
- [ ] columns should support sorting 
- [ ] pagination: the API supports pagination with `MaxResults` and pagination via a continuation token. 
  https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/describeinstancescommandinput.html

**Delivery**
- Git
- Deployed Live (Public Cloud of choice (Amplify or similar))
- Include a short write-up on how to launch the app locally.

### Research
- Does AWS have a JavaScript SDK that supports username/password login?
  - https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-browser-credentials-cognito.html
- How do I access EC2 information from the SDK?
  - https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/classes/describeinstancescommand.html
  - https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/modules/instance.html
- How to setup Congnito?
  - https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-browser-credentials-cognito.html
- How to deploy to Amplify?
- What are the API fees?
- How does API rate limiting work?

## Notes
### Authentication
- Use `@aws-sdk/credential-providers` configured with a Cognito identity pool. 
  The identity pool is associated with IAM roles. The `logins` property enables 
  authentication.

## Day 2
### Authentication
- A User Pool is for user authentication
- An Identity Pool is for user authorization
- Use Amplify to provide the authentication, and use the JavaScript SDK to get the EC2 information.
  First test the SDK code with an unauthenticated Identity Pool to simplify 
  testing, then add Amplify logins.
- User Pools can be configured with predefined username/password accounts. Use 
  this method and disable account creation/sign-up. This isn't an app for anyone 
  to just log-in to and poke around. (I'm not sure exactly how to prevent 
  "sign-up", I may need to use something other than the Cognito Hosted UI like 
  the example here https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/)

I think this is enough background research to start the implementation. 

1. Use a Cognito Identity Pool (without Authentication) to grant Authorization to EC2 resources.
2. Validate the EC2 payload data
3. Add Authentication via Amplify pre-built components https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#option-1-use-pre-built-ui-components
 4. Deploy the app using Amplify
 5. Test login
 6. Build the table for the EC2 UI
 7. Update the login implementation as needed and require Authentication for the Cognito the Identity Pool
 8. Publish changes
 10. Deliver


Day 3

Setup Amplify login and Cognito Authorization with real table data

Day 4

Cleaned-up up the UI
Cleaned-up the auth flow
Deployed site to AWS Amplify

## Summary

I spent the first two days researching and planning the application since I'm 
not familiar with Cognito and Amplify (they were not covered to any depth by the 
solutions architect curriculum I worked through). I had trouble finding good 
information on authenticating the JavaScript SDK after logging in with Amplify. 
My solution, though working, does not feel sound. 

The dashboard will only allow previously setup accounts to login. There is no 
"sign-up" flow. This is by design since the intention is for the app to be used 
internally by auditors. So an admin must create accounts in the Cognito User 
Pool. This grants access only to specific AWS resources allowed by an IAM Role 
and does not require giving out IAM credentials. Admittedly, my login code is 
rough and in need of refinement.

In order to support table column sorting it was necessary to load all of the EC2 
instance data and sort on the frontend of the application. Ideally the backend 
would support sorting. There were no requirements for updating the table state 
as EC2 instance deployment status changed. The pagination is frontend only since 
it would not be possible to sort the columns accurately without this.

## Running the application locally
- Use `npm install` to install dependencies
- Use `npm start` to launch the UI
- You'll need to set the following environment variables in `env.local` file for 
  the login to work. Contact me if you need these for testing beyond the hosted 
  UI. Alternatively you may override the login logic in `Authentication.tsx` and
  use `fakeRowData`, for the table.
 
```bash
REACT_APP_AWS_REGION=
REACT_APP_AWS_IDENTITY_POOL_ID=
REACT_APP_AWS_USER_POOL_ID=
```


