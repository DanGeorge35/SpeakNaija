import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
// import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import errorHandler from './middleware/error'
import endpoints from './services/'
import RouteHelper from './libs/helpers/route.helper'

// const app: express.Application = express();
const app = express()

dotenv.config()

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Enable cookies or other credentials
}
// MiddleWare
app.use(helmet()) // Security first middleware
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors(corsOptions))
app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(
    `/${process.env.NODE_ENV}/public`,
    express.static(path.join(__dirname, '../public'))
)

app.use(errorHandler)

try {
  RouteHelper.initRoutes(endpoints, app)
} catch (error) {
  console.error(error)
}

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port}`)
})
