import { Todo } from '../../domain/entities/Todo'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { MySQLDataSource } from '../data-sources/mysql-data-source'

export class TodoRepositoryImpl implements TodoRepository {
    constructor(private dataSource: MySQLDataSource) { }

    async getAll(): Promise<Todo[]> {
        return this.dataSource.getAll()
    }

    async getById(id: number): Promise<Todo | null> {
        return this.dataSource.getById(id)
    }

    async create(title: string): Promise<Todo> {
        return this.dataSource.create(title)
    }

    async update(id: number, title: string, completed: boolean): Promise<Todo | null> {
        return this.dataSource.update(id, title, completed)
    }

    async delete(id: number): Promise<boolean> {
        return this.dataSource.delete(id)
    }
}
