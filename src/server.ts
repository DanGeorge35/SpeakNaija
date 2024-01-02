import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
// import os from 'os'
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

// MiddleWare
// const allowedOrigins = ['*']

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Enable cookies or other credentials
}

app.use(helmet()) // Security first middleware
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors(corsOptions))
app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Get the home directory of the current user

app.use(
    `/${process.env.NODE_ENV}/public`,
    express.static(path.join(__dirname, '../public'))
)
// csurf config
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

app.use(errorHandler)

// console.log("port", process.env.PORT);

try {
  RouteHelper.initRoutes(endpoints, app)
} catch (error) {
  console.error(error)
}

export default app
