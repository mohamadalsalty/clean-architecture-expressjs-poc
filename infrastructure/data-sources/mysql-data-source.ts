import { createPool, Pool, PoolConnection, RowDataPacket, FieldPacket, OkPacket } from 'mysql2/promise'
import { Todo } from '../../domain/entities/Todo'
import { TodoRepository } from '../../domain/repositories/TodoRepository'

export class MySQLDataSource implements TodoRepository {
    private pool: Pool

    constructor() {
        this.pool = createPool({
            host: process.env.MYSQL_HOST || 'mysql',
            port: Number(process.env.MYSQL_PORT) || 3306,
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'root',
            database: process.env.MYSQL_DATABASE || 'todo_app',
            connectionLimit: 10,
            timezone: 'UTC',
            typeCast: function (field: any, next: any) {
                if (field.type === 'TINY' && field.length === 1) {
                    return field.string() === '1' // 1 = true, 0 = false
                }
                return next()
            },
        })
    }

    async getAll(): Promise<Todo[]> {
        const conn = await this.getConnection()
        try {
            const [rows] = await conn.execute('SELECT * FROM todos') as [RowDataPacket[], FieldPacket[]]
            const todos = rows.map((row) => new Todo(row.id, row.title, row.completed))
            return todos
        } finally {
            conn.release()
        }
    }

    async getById(id: number): Promise<Todo | null> {
        const conn = await this.getConnection()
        try {
            const [rows] = await conn.execute('SELECT * FROM todos WHERE id = ?', [id]) as [RowDataPacket[], FieldPacket[]]
            const todo = rows[0] ? new Todo(rows[0].id, rows[0].title, rows[0].completed) : null
            return todo
        } finally {
            conn.release()
        }
    }

    async create(title: string): Promise<Todo> {
        const conn = await this.getConnection()
        try {
            const [result] = await conn.execute('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, false]) as [OkPacket, FieldPacket[]]
            const todoId = result.insertId
            const todo = new Todo(todoId, title)
            return todo
        } finally {
            conn.release()
        }
    }

    async update(id: number, title: string, completed: boolean): Promise<Todo | null> {
        const conn = await this.getConnection()
        try {
            const [result] = await conn.execute('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, id]) as [OkPacket, FieldPacket[]]
            if (result.affectedRows === 0) {
                return null
            }
            const todo = new Todo(id, title, completed)
            return todo
        } finally {
            conn.release()
        }
    }
    async delete(id: number): Promise<boolean> {
        const conn = await this.getConnection()
        try {
            const [result] = await conn.execute('DELETE FROM todos WHERE id = ?', [id]) as [OkPacket, FieldPacket[]]
            return result.affectedRows > 0
        } finally {
            conn.release()
        }
    }

    private async getConnection(): Promise<PoolConnection> {
        const conn = await this.pool.getConnection()
        return conn
    }
}
