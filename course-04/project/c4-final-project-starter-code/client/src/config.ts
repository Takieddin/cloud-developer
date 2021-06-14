// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'yx5rzkdpzk'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'ta9i.auth0.com',            // Auth0 domain
  clientId: 'Zr0gFiS0CJ98569zdTlucpyFQfYRk30t',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
