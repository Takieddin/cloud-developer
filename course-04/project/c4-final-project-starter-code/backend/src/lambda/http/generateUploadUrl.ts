import 'source-map-support/register'
import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id


  return getUrl(todoId)
}

async function getUrl(todoId: string) {

  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

  const bucketName = process.env.TODOS_S3_BUCKET
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION

  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true

    },
    body: JSON.stringify({
      uploadUrl: url,
      Expires: urlExpiration
    })
  }



}
