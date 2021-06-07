import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'

import * as uuid from 'uuid'
import { getUserId } from "../utils";
import * as AWS from 'aws-sdk'




export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createTodo(newTodo, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }

}
async function createTodo(CreateTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await createTodoAccess({
    todoId: itemId,
    userId: userId,
    name: CreateTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: CreateTodoRequest.dueDate,
    done: false,
    attachmentUrl: null
  })
}

async function createTodoAccess(toDoitem: TodoItem): Promise<TodoItem> {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const toDoTable='toDoTable'

  await docClient.put({
    TableName: toDoTable,
    Item: toDoitem
  }).promise()

  return toDoitem
}


