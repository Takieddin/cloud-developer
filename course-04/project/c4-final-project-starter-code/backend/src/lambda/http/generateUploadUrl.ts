import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getUserId } from '../utils'
import { setAttachmentUrl } from '../../businessLogic/todos'
import { getUrl } from '../../fileStorage/todosFileStorage'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  //lambda func
  await setAttachmentUrl(todoId, userId)
  return getUrl(todoId)
}
