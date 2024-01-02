/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'
import Notifications from '../../models/notifications.model'
import NotificationsValidation from './notifications.validation'
import { getUIDfromDate } from '../../libs/utils/app.utility'

class NotificationsController {
  /**
 * Create Notifications
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async createNotifications (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const validate = await NotificationsValidation.validateCreateNotifications(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }
      const dir = '/public/notifications'
      if (!fs.existsSync(`.${dir}`)) {
        fs.mkdirSync(`.${dir}`)
      }

      const checkExist = await Notifications.findOne({ where: { ...data } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'This Notifications Record Already Exist',
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

      const dNotifications = await Notifications.create({ ...data })

      return res.status(201).json({ success: true, data: dNotifications })
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        message: error.message,
        code: 400
      })
    }
  };

  /**
 * Single Notifications
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingleNotifications (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleNotifications = await Notifications.findOne({ where: { id } })

      if (!singleNotifications) {
        return res.status(400).json({ success: false, data: `No Notifications with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleNotifications })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All Notifications
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallNotifications (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allNotifications = await Notifications.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allNotifications.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allNotifications.rows,
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
 * Update Notifications
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async updateNotifications (req: any, res: any, next: any): Promise<any> {
    try {
      const notificationsId = req.params.id
      const updatedInfo = req.body

      const notifications = await Notifications.findByPk(notificationsId)

      if (!notifications) {
        return res.status(404).json({ success: false, message: 'Notifications not found' })
      }

      const dnotifications = await notifications.update(updatedInfo)

      return res.status(200).json({ success: true, data: dnotifications, message: 'Notifications information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete Notifications
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async deleteNotifications (req: any, res: any, next: any): Promise<any> {
    try {
      const notificationsId = req.params.id

      const notifications = await Notifications.findByPk(notificationsId)

      if (!notifications) {
        return res
          .status(404)
          .json({ success: false, message: 'Notifications not found' })
      }

      await notifications.destroy()

      return res.status(200).json({ success: true, message: 'Notifications deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default NotificationsController
