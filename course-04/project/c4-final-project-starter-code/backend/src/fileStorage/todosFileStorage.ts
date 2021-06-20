import * as AWS from 'aws-sdk'

//filestorage layer function
export async function getUrl(todoId: string) {
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

//filestorage layer function
export function getAttachmentUrl(itemId: string): string {
  const bucketName = process.env.TODOS_S3_BUCKET
  const region = process.env.REGION
  return `https://${bucketName}.s3.${region}.amazonaws.com/${itemId}`
}
