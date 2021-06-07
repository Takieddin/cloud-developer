import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from "../utils";
import * as AWS  from 'aws-sdk'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)
  const items = await getTodos(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: items
    })
  }
  
  
}




async function getTodos(userId: string) {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const toDoTable='toDoTable'

  const result = await docClient.query({
    TableName: toDoTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  return result.Items
}
