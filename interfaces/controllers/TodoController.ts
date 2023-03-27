import { Request, Response } from 'express'
import { Todo } from '../../domain/entities/Todo'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { GetAllTodos } from '../../domain/usecases/GetAllTodos'

export class TodoController {
    constructor(private todoRepository: TodoRepository) { }

    async index(req: Request, res: Response): Promise<void> {
        const usecase = new GetAllTodos(this.todoRepository)
        const todos = await usecase.execute()
        res.json(todos)
    }

    async store(req: Request, res: Response): Promise<void> {
        const { title } = req.body
        const todo = await this.todoRepository.create(title)
        res.json(todo)
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const { title, completed } = req.body
        const todo = await this.todoRepository.update(Number(id), title, completed)
        if (todo) {
            res.json(todo)
        } else {
            res.status(404).json({ message: `Todo with id ${id} not found` })
        }
    }

    async destroy(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const deleted = await this.todoRepository.delete(Number(id))
        if (deleted) {
            res.status(204).send()
        } else {
            res.status(404).json({ message: `Todo with id ${id} not found` })
        }
    }
}
