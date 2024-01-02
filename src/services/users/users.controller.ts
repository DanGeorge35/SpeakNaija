/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'
import Users from '../../models/users.model'
import UsersValidation from './users.validation'
import { IncomingForm } from 'formidable'
import { RenameUploadFile, getUIDfromDate, adjustFieldsToValue, EncryptPassword } from '../../libs/utils/app.utility'
import { Login } from '../../libs/helpers/auth.helper'
class UsersController {
  /**
 * Create Users Endpoint.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  public static async createUsers (req: any, res: any, next: any): Promise<any> {
    try {
      const data: any = req.body
      const validate = await UsersValidation.validateCreateUsers(data)

      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }

      // Check if users aldready exist
      const checkExist = await Users.findOne({ where: { email: data.email } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'Email Address Already Exist',
          code: 400
        })
      }
      data.passwordhash = await EncryptPassword(data.password)
      const DID = getUIDfromDate('USN')
      data.UniqueCode = DID
      data.status = 'pending'
      const newUsers = await Users.create({ ...data })
      return res.status(201).json({ success: true, data: newUsers })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Login Users Endpoint.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  public static async Login (req: any, res: any, next: any): Promise<any> {
    try {
      const data: any = req.body

      const resLog = await Login(data, Users)
      return res.status(resLog.code).json(resLog)
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Single Users
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingleUsers (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleUsers = await Users.findOne({ where: { id } })

      if (!singleUsers) {
        return res.status(400).json({ success: false, data: `No Users with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleUsers })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All Users
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallUsers (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allUsers = await Users.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allUsers.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allUsers.rows,
        pagination: {
          currentPage: page,
          totalPages,
          pageSize: PAGE_SIZE
        }
      })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Update Users
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async updateUsers (req: any, res: any, next: any): Promise<any> {
    try {
      const usersId = req.params.id
      const updatedInfo = req.body

      const users = await Users.findByPk(usersId)

      if (!users) {
        return res.status(404).json({ success: false, message: 'Users not found' })
      }

      const form = new IncomingForm({ multiples: false })
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) {
            return res
              .status(400)
              .json({ success: false, code: 400, message: 'Error parsing the request' })
          }
          const dir = '/public/users'
          if (!fs.existsSync(`.${dir}`)) {
            fs.mkdirSync(`.${dir}`)
          }
          const data: any = adjustFieldsToValue(fields)
          const validate = await UsersValidation.validateCreateUsers(data)

          if (validate.result === 'error') {
            const result: { code: number, message: string } = {
              code: 400,
              message: validate.message
            }
            return res.status(result.code).send(result)
          }

          // Check if users aldready exist
          const checkExist = await Users.findOne({ where: { ...data } })
          if (checkExist !== null) {
            return res.status(400).send({
              success: false,
              message: 'Record Already Exist In Server',
              code: 400
            })
          }

          const DID = getUIDfromDate()

          if (files.avatar_photo_url !== undefined) {
            const avatarphotourl = files.avatar_photo_url[0]
            data.avatar_photo_url = RenameUploadFile(avatarphotourl, `${dir}/${DID}-PHOTO`)
          }
          if (files.cover_image_url !== undefined) {
            const coverimageurl = files.cover_image_url[0]
            data.cover_image_url = RenameUploadFile(coverimageurl, `${dir}/${DID}-PHOTO`)
          }
          if (files.avatar_photo_url === undefined) {
            return res.status(400).send({ code: 400, message: 'avatar_photo_url must be uploaded' })
          }
          if (files.cover_image_url === undefined) {
            return res.status(400).send({ code: 400, message: 'cover_image_url must be uploaded' })
          }

          const newUsers = await Users.create({ ...data })
          return res.status(201).json({ success: true, data: newUsers })
        } catch (error: any) {
          const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
          console.error(error)
          return res.status(400).send(err)
        }
      })

      const dusers = await users.update(updatedInfo)

      return res.status(200).json({ success: true, data: dusers, message: 'Users information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete Users
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async deleteUsers (req: any, res: any, next: any): Promise<any> {
    try {
      const usersId = req.params.id

      const users = await Users.findByPk(usersId)

      if (!users) {
        return res
          .status(404)
          .json({ success: false, message: 'Users not found' })
      }

      await users.destroy()

      return res.status(200).json({ success: true, message: 'Users deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default UsersController
