import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { getUserId } from '../utils'
import * as AWS from 'aws-sdk'

import { createLogger } from '../../utils/logger'

//lambda
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const logger = createLogger('updateTodo')


  const userId = getUserId(event)
  logger.info(`userId:${userId} todoId:${todoId}`)
  return await updateTodo(todoId, userId, updatedTodo)
}

//businesslogic
async function updateTodo(
  todoId: string,
  userId: string,
  updatedTodo: UpdateTodoRequest
) {
  return await updateTodoAccess(todoId, userId, updatedTodo)
}

//dataAccess

async function updateTodoAccess(
  todoId: string,
  userId: string,
  updatedTodo: UpdateTodoRequest
) {
  var docClient = new AWS.DynamoDB.DocumentClient()
  const toDosTable = process.env.TODOS_TABLE

  const params = {
    TableName: toDosTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    ExpressionAttributeNames: {
      '#todo_name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': updatedTodo.name,
      ':dueDate': updatedTodo.dueDate,
      ':done': updatedTodo.done
    },
    UpdateExpression:
      'SET #todo_name = :name, dueDate = :dueDate, done = :done',
    ReturnValues: 'ALL_NEW'
  }

  const result = await docClient.update(params).promise()

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      result
    })
  }
}
