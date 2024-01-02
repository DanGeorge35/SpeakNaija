/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'
import Messages from '../../models/messages.model'
import MessagesValidation from './messages.validation'
import { getUIDfromDate } from '../../libs/utils/app.utility'

class MessagesController {
  /**
 * Create Messages
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async createMessages (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const validate = await MessagesValidation.validateCreateMessages(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }
      const dir = '/public/messages'
      if (!fs.existsSync(`.${dir}`)) {
        fs.mkdirSync(`.${dir}`)
      }

      const checkExist = await Messages.findOne({ where: { ...data } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'This Messages Record Already Exist',
          code: 400
        })
      }

      const DID = getUIDfromDate('ATD')
      if (data.Signature !== undefined) {
        const Signature = `${DID}-SIG`
        const base64Str = data.Signature
        const base64 = base64Str.replace('data:image/png;base64,', '')
        const imagePath = `.${dir}/${Signature}.png`
        const buffer = Buffer.from(base64, 'base64')
        fs.writeFileSync(imagePath, buffer)
        data.Signature = `${process.env.DOMAIN}/${process.env.NODE_ENV}${dir}/${Signature}.png`
      }

      const dMessages = await Messages.create({ ...data })

      return res.status(201).json({ success: true, data: dMessages })
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        message: error.message,
        code: 400
      })
    }
  };

  /**
 * Single Messages
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingleMessages (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleMessages = await Messages.findOne({ where: { id } })

      if (!singleMessages) {
        return res.status(400).json({ success: false, data: `No Messages with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleMessages })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All Messages
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallMessages (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allMessages = await Messages.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allMessages.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allMessages.rows,
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
 * Update Messages
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async updateMessages (req: any, res: any, next: any): Promise<any> {
    try {
      const messagesId = req.params.id
      const updatedInfo = req.body

      const messages = await Messages.findByPk(messagesId)

      if (!messages) {
        return res.status(404).json({ success: false, message: 'Messages not found' })
      }

      const dmessages = await messages.update(updatedInfo)

      return res.status(200).json({ success: true, data: dmessages, message: 'Messages information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete Messages
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async deleteMessages (req: any, res: any, next: any): Promise<any> {
    try {
      const messagesId = req.params.id

      const messages = await Messages.findByPk(messagesId)

      if (!messages) {
        return res
          .status(404)
          .json({ success: false, message: 'Messages not found' })
      }

      await messages.destroy()

      return res.status(200).json({ success: true, message: 'Messages deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default MessagesController
