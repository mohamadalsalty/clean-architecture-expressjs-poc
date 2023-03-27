import { Todo } from '../entities/Todo'

export interface TodoRepository {
    getAll(): Promise<Todo[]>
    getById(id: number): Promise<Todo | null>
    create(title: string): Promise<Todo>
    update(id: number, title: string, completed: boolean): Promise<Todo | null>
    delete(id: number): Promise<boolean>
}
