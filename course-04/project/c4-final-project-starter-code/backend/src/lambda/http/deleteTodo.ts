import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'

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

