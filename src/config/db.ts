/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()
let sequelize: any
if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize(
    process.env.DB ?? '',
    process.env.DBUSER ?? '',
    process.env.DBPASS ?? '',
    {
      host: process.env.HOSTNAME,
      dialect: 'postgres',
      port: 5432,
      timezone: '+01:00'
    }
  )
} else {
  sequelize = new Sequelize(
    process.env.DB ?? '',
    process.env.DBUSER ?? '',
    process.env.DBPASS ?? '',
    {
      host: process.env.HOSTNAME,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: false,
          rejectUnauthorized: false
        }
      },
      port: 5432,
      timezone: '+01:00'
    }
  )
}

try {
  sequelize.authenticate()
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
  sequelize.close()
}

export default sequelize
