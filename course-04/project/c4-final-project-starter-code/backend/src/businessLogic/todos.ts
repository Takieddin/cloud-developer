import {
  createTodoAccess,
  deleteTodoaccess,
  getTodos,
  setAttachmentUrlAccess,
  updateTodoAccess
} from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getAttachmentUrl } from '../fileStorage/todosFileStorage'

//CREATE
export async function createTodo(
  CreateTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const itemId = uuid.v4()
  const attachmentUrl = ''

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

//GET
export async function getUserTodos(userId: string) {
  const items = await getTodos(userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: items
    })
  }
}

//UPDATE
export async function updateTodo(
  todoId: string,
  userId: string,
  updatedTodo: UpdateTodoRequest
) {
  return await updateTodoAccess(todoId, userId, updatedTodo)
}

//DELETE

export async function deleteTodo(userId: string, todoId: string) {
  return await deleteTodoaccess(userId, todoId)
}


//FILE_STORAGE
export async function setAttachmentUrl(todoId: string, userId: string) {
  const url = getAttachmentUrl(todoId)
  return setAttachmentUrlAccess(todoId, userId, url)
}

