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
  const todoId = event.pathParameters.todoId

  const logger = createLogger('deleteTodo')

  // TODO: Remove a TODO item by id
  const userId = getUserId(event)

  logger.info(`userId:${userId} todoId:${todoId}`)

  return deleteTodo(userId, todoId)
}
//businesslogic
async function deleteTodo(userId: string, todoId: string) {
  return await deleteTodoaccess(userId, todoId)
}

//dataAccess
async function deleteTodoaccess(userId: string, todoId: string) {
  var docClient = new AWS.DynamoDB.DocumentClient()
  const toDoTable = process.env.TODOS_TABLE

  var params = {
    TableName: toDoTable,
    Key: {
      todoId: todoId,
      userId: userId
    }
  }

  await docClient.delete(params).promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      deleted: todoId
    })
  }
}
