import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import { type Fields } from 'formidable'

function Authorization (req: any, res: any, next: any): any {
  // eslint-disable-next-line no-unused-vars
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]
  if (token == null) return res.status(401).send('Not Authorised')

  // eslint-disable-next-line consistent-return
  const JWT_KEY: any = process.env.jwtkey
  jwt.verify(token, JWT_KEY, (err: any, user: any) => {
    if (err !== null) return res.status(403).send('Invalid Token')
    req.user = user
    next()
  })
}

function GenerateToken (data: any): string {
  const JWT_SECRET: any = process.env.jwtkey
  return jwt.sign({ data }, JWT_SECRET, { expiresIn: '30d' })
}
async function CheckPassword (password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

async function EncryptPassword (password: string): Promise<string> {
  try {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    console.error('Error encrypting password:', error)
    return password
  }
}

function adjustFieldsToValue (
  fieldsObject: Fields<string>
): Record<string, string> {
  const adjustedFields: Record<string, string> = {}

  for (const fieldName in fieldsObject) {
    if (fieldName in fieldsObject) {
      const fieldValue = fieldsObject[fieldName]?.[0] ?? '' // Using optional chaining and nullish coalescing
      adjustedFields[fieldName] = fieldValue
    }
  }
  return adjustedFields
}

function RenameUploadFile (uploadedfile: any, filename: string): string {
  const oldPath = uploadedfile.filepath
  const extension = uploadedfile.originalFilename.substring(
    uploadedfile.originalFilename.lastIndexOf('.')
  )
  const newPath = `.${filename}${extension}`
  const publicPath = `${process.env.DOMAIN}/${process.env.NODE_ENV}${filename}${extension}`
  fs.renameSync(oldPath, newPath)
  return publicPath
}

function getUIDfromDate (prefix = ''): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // Months are zero-based
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const random = (Math.floor(Math.random() * 9) + 1).toString()
  const uniqueNumber =
    year.toString() +
    month.toString() +
    day.toString() +
    hour.toString() +
    minute.toString() +
    second.toString() +
    random.substring(0, 2)
  // uniqueNumber = uniqueNumber.substring(uniqueNumber.length - length);

  if (prefix !== '') {
    return prefix + uniqueNumber.toString() // Append prefix if it is provided
  }
  return `IDN${uniqueNumber.toString()}`
}

export {
  Authorization,
  GenerateToken,
  EncryptPassword,
  CheckPassword,
  RenameUploadFile,
  adjustFieldsToValue,
  getUIDfromDate
}
