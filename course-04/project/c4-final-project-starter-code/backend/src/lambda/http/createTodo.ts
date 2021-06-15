import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'

import * as uuid from 'uuid'
import { getUserId } from '../utils'
import * as AWS from 'aws-sdk'

import { createLogger } from '../../utils/logger'

//lambda function
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const userId = getUserId(event)
  const todo = await createTodo(newTodo, userId)

  const logger = createLogger('createTodo')

  logger.info(`userId:${userId} `)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      
      item: todo
    })
  }
}

//businessLogic function

async function createTodo(
  CreateTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const itemId = uuid.v4()
  const attachmentUrl = getAttachmentUrl(itemId)

  return await createTodoAccess({
    todoId: itemId,
    userId: userId,
    name: CreateTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: CreateTodoRequest.dueDate,
    done: false,
    attachmentUrl: attachmentUrl
  })
}

//DataAccess layer function
async function createTodoAccess(toDoitem: TodoItem): Promise<TodoItem> {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const toDoTable = process.env.TODOS_TABLE

  await docClient
    .put({
      TableName: toDoTable,
      Item: toDoitem
    })
    .promise()

  return toDoitem
}

//filestorage layer function
function getAttachmentUrl(itemId: string): string {
  const bucketName = process.env.TODOS_S3_BUCKET
  const region = process.env.REGION
  return `https://${bucketName}.s3.${region}.amazonaws.com/${itemId}`
}
