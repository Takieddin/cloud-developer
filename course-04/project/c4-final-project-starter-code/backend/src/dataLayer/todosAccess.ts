import * as AWS from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

//CREATE
export async function createTodoAccess(toDoitem: TodoItem): Promise<TodoItem> {
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

//GET
export async function getTodos(userId: string) {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const toDoTable = process.env.TODOS_TABLE

  const result = await docClient
    .query({
      TableName: toDoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    })
    .promise()

  return result.Items
}

//UPDATE
export async function updateTodoAccess(
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

//DELETE

export async function deleteTodoaccess(userId: string, todoId: string) {
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


//FILE STORAGE
export async function setAttachmentUrlAccess(
  todoId: string,
  userId: string,
  attachmentUrl: string
) {
  var docClient = new AWS.DynamoDB.DocumentClient()
  const toDosTable = process.env.TODOS_TABLE

  const params = {
    TableName: toDosTable,
    Key: {
      userId: userId,
      todoId: todoId
    },

    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    },
    UpdateExpression: 'SET  attachmentUrl = :attachmentUrl',
    ReturnValues: 'UPDATED_NEW'
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
