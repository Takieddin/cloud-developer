import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todos'

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
