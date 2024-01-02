/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'
import Hashtags from '../../models/hashtags.model'
import HashtagsValidation from './hashtags.validation'
import { getUIDfromDate } from '../../libs/utils/app.utility'

class HashtagsController {
  /**
 * Create Hashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async createHashtags (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const validate = await HashtagsValidation.validateCreateHashtags(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }
      const dir = '/public/hashtags'
      if (!fs.existsSync(`.${dir}`)) {
        fs.mkdirSync(`.${dir}`)
      }

      const checkExist = await Hashtags.findOne({ where: { ...data } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'This Hashtags Record Already Exist',
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

      const dHashtags = await Hashtags.create({ ...data })

      return res.status(201).json({ success: true, data: dHashtags })
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        message: error.message,
        code: 400
      })
    }
  };

  /**
 * Single Hashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingleHashtags (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleHashtags = await Hashtags.findOne({ where: { id } })

      if (!singleHashtags) {
        return res.status(400).json({ success: false, data: `No Hashtags with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleHashtags })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All Hashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallHashtags (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allHashtags = await Hashtags.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allHashtags.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allHashtags.rows,
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
 * Update Hashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async updateHashtags (req: any, res: any, next: any): Promise<any> {
    try {
      const hashtagsId = req.params.id
      const updatedInfo = req.body

      const hashtags = await Hashtags.findByPk(hashtagsId)

      if (!hashtags) {
        return res.status(404).json({ success: false, message: 'Hashtags not found' })
      }

      const dhashtags = await hashtags.update(updatedInfo)

      return res.status(200).json({ success: true, data: dhashtags, message: 'Hashtags information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete Hashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async deleteHashtags (req: any, res: any, next: any): Promise<any> {
    try {
      const hashtagsId = req.params.id

      const hashtags = await Hashtags.findByPk(hashtagsId)

      if (!hashtags) {
        return res
          .status(404)
          .json({ success: false, message: 'Hashtags not found' })
      }

      await hashtags.destroy()

      return res.status(200).json({ success: true, message: 'Hashtags deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default HashtagsController
