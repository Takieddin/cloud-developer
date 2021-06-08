import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'


import { getUserId } from "../utils"
import * as AWS from 'aws-sdk'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  const userId = getUserId(event)


  return deleteTodo(userId,todoId)
  
}



async function deleteTodo(userId:string , todoId :string ) {
  var docClient = new AWS.DynamoDB.DocumentClient()
  const toDoTable = 'toDoTable'

  var params = {
    TableName: toDoTable,
    Key: {
      "todoId": todoId,
      "userId": userId
    },
   
  }
  return await docClient.delete(params)   
}