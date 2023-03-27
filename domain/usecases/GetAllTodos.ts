import { Todo } from '../entities/Todo'
import { TodoRepository } from '../repositories/TodoRepository'

export class GetAllTodos {
    constructor(private todoRepository: TodoRepository) { }

    async execute(): Promise<Todo[]> {
        const todos = await this.todoRepository.getAll()
        return todos
    }
}
