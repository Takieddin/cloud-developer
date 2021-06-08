import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'


import { getUserId } from "../utils";
import * as AWS from 'aws-sdk'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  const userId = getUserId(event)
  var docClient = new AWS.DynamoDB.DocumentClient()
  const toDoTable = 'toDoTable'

  var params = {
    TableName: toDoTable,
    Key: {
      "todoId": todoId,
      "userId": userId
    },
    UpdateExpression: "set name = :name, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues: {
      name: updatedTodo.name,
      dueDate: updatedTodo.dueDate,
      done: updatedTodo.done,
    },
    ReturnValues: "UPDATED_NEW"
  }
  return docClient.update(params) 
}


