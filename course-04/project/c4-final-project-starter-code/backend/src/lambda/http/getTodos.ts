import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from "../utils";
import * as AWS from 'aws-sdk'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)

  return getUserTodo(userId)


}




//businessslogic 

async function getUserTodo(userId: string) {
  const items = await getTodos(userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true

    },
    body: JSON.stringify({
      items: items
    })
  }



}
 
//dataAccess

async function getTodos(userId: string) {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const toDoTable = 'toDoTable'

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
