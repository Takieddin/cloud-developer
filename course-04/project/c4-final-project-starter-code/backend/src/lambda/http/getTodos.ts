import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { getUserId } from '../utils'
import * as AWS from 'aws-sdk'

import { createLogger } from '../../utils/logger'

//lambda
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)
  const logger = createLogger('getTodos')

  logger.info(`userId:${userId} `)

  return getUserTodos(userId)
}

//businessslogic

async function getUserTodos(userId: string) {
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
  const toDoTable = process.env.TODOS_TABLE

  const result = await docClient
    .query({
      TableName: toDoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    })
    .promise()

  return result.Items
}
