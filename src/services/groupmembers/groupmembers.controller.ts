/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'
import Groupmembers from '../../models/groupmembers.model'
import GroupmembersValidation from './groupmembers.validation'
import { getUIDfromDate } from '../../libs/utils/app.utility'

class GroupmembersController {
  /**
 * Create Groupmembers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async createGroupmembers (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const validate = await GroupmembersValidation.validateCreateGroupmembers(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }
      const dir = '/public/groupmembers'
      if (!fs.existsSync(`.${dir}`)) {
        fs.mkdirSync(`.${dir}`)
      }

      const checkExist = await Groupmembers.findOne({ where: { ...data } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'This Groupmembers Record Already Exist',
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

      const dGroupmembers = await Groupmembers.create({ ...data })

      return res.status(201).json({ success: true, data: dGroupmembers })
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        message: error.message,
        code: 400
      })
    }
  };

  /**
 * Single Groupmembers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingleGroupmembers (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleGroupmembers = await Groupmembers.findOne({ where: { id } })

      if (!singleGroupmembers) {
        return res.status(400).json({ success: false, data: `No Groupmembers with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleGroupmembers })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All Groupmembers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallGroupmembers (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allGroupmembers = await Groupmembers.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allGroupmembers.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allGroupmembers.rows,
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
 * Update Groupmembers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async updateGroupmembers (req: any, res: any, next: any): Promise<any> {
    try {
      const groupmembersId = req.params.id
      const updatedInfo = req.body

      const groupmembers = await Groupmembers.findByPk(groupmembersId)

      if (!groupmembers) {
        return res.status(404).json({ success: false, message: 'Groupmembers not found' })
      }

      const dgroupmembers = await groupmembers.update(updatedInfo)

      return res.status(200).json({ success: true, data: dgroupmembers, message: 'Groupmembers information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete Groupmembers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async deleteGroupmembers (req: any, res: any, next: any): Promise<any> {
    try {
      const groupmembersId = req.params.id

      const groupmembers = await Groupmembers.findByPk(groupmembersId)

      if (!groupmembers) {
        return res
          .status(404)
          .json({ success: false, message: 'Groupmembers not found' })
      }

      await groupmembers.destroy()

      return res.status(200).json({ success: true, message: 'Groupmembers deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default GroupmembersController
