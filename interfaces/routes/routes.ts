import { Router } from 'express'
import { TodoController } from '../controllers/TodoController'
import { TodoRepositoryImpl } from '../../infrastructure/repositories/TodoRepositoryImpl'
import { MySQLDataSource } from '../../infrastructure/data-sources/mysql-data-source'

const router = Router()
const dataSource = new MySQLDataSource()
const todoRepository = new TodoRepositoryImpl(dataSource)
const todoController = new TodoController(todoRepository)

router.get('/', todoController.index.bind(todoController))
router.post('/', todoController.store.bind(todoController))
router.put('/:id', todoController.update.bind(todoController))
router.delete('/:id', todoController.destroy.bind(todoController))

export default router
