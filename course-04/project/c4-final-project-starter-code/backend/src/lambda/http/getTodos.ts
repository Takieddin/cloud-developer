import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { getUserId } from '../utils'
import { getUserTodos } from '../../businessLogic/todos'
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
