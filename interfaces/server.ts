import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import routes from './routes/routes'

const app = express()

// Middleware
app.use(morgan('common'))
app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/todos', routes)

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong' })
})

export default app
