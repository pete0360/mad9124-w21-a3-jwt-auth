import morgan from 'morgan'
import express from 'express'
import studentRouter from './routes/students.js'
import sanitizeMongo from 'express-mongo-sanitize'
import authRouter from './routes/auth/index.js'
import classRouter from './routes/classes.js'
import handleErrors from './middleware/handleErrors.js'
import logErrors from './middleware/logErrors.js'

import connectDatabase from './startup/connectDatabase.js'
connectDatabase()

const app = express()



app.use(morgan('tiny'))
app.use(express.json())
app.use(sanitizeMongo())

app.use('/auth', authRouter)
app.use('/api/classes', classRouter)
app.use('/api/students', studentRouter)
app.get('/', (req, res) => res.send({data: {healthStatus: 'UP'}}))

app.use(logErrors)
app.use(handleErrors)

export default app
