/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'

import Comments from '../../models/comments.model'
import CommentsValidation from './comments.validation'
import { getUIDfromDate } from '../../libs/utils/app.utility'

class CommentsController {
  /**
 * Create Comments
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async createComments (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const validate = await CommentsValidation.validateCreateComments(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }
      const dir = '/public/comments'
      if (!fs.existsSync(`.${dir}`)) {
        fs.mkdirSync(`.${dir}`)
      }

      const checkExist = await Comments.findOne({ where: { ...data } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'This Comments Record Already Exist',
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

      const dComments = await Comments.create({ ...data })

      return res.status(201).json({ success: true, data: dComments })
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        message: error.message,
        code: 400
      })
    }
  };

  /**
 * Single Comments
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingleComments (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleComments = await Comments.findOne({ where: { id } })

      if (!singleComments) {
        return res.status(400).json({ success: false, data: `No Comments with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleComments })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All Comments
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallComments (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allComments = await Comments.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allComments.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allComments.rows,
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
 * Update Comments
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async updateComments (req: any, res: any, next: any): Promise<any> {
    try {
      const commentsId = req.params.id
      const updatedInfo = req.body

      const comments = await Comments.findByPk(commentsId)

      if (!comments) {
        return res.status(404).json({ success: false, message: 'Comments not found' })
      }

      const dcomments = await comments.update(updatedInfo)

      return res.status(200).json({ success: true, data: dcomments, message: 'Comments information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete Comments
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async deleteComments (req: any, res: any, next: any): Promise<any> {
    try {
      const commentsId = req.params.id

      const comments = await Comments.findByPk(commentsId)

      if (!comments) {
        return res
          .status(404)
          .json({ success: false, message: 'Comments not found' })
      }

      await comments.destroy()

      return res.status(200).json({ success: true, message: 'Comments deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default CommentsController
