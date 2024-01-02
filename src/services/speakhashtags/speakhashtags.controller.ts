/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'
import Speakhashtags from '../../models/speakhashtags.model'
import SpeakhashtagsValidation from './speakhashtags.validation'
import { getUIDfromDate } from '../../libs/utils/app.utility'

class SpeakhashtagsController {
  /**
 * Create Speakhashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async createSpeakhashtags (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const validate = await SpeakhashtagsValidation.validateCreateSpeakhashtags(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }
      const dir = '/public/speakhashtags'
      if (!fs.existsSync(`.${dir}`)) {
        fs.mkdirSync(`.${dir}`)
      }

      const checkExist = await Speakhashtags.findOne({ where: { ...data } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'This Speakhashtags Record Already Exist',
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

      const dSpeakhashtags = await Speakhashtags.create({ ...data })

      return res.status(201).json({ success: true, data: dSpeakhashtags })
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        message: error.message,
        code: 400
      })
    }
  };

  /**
 * Single Speakhashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingleSpeakhashtags (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleSpeakhashtags = await Speakhashtags.findOne({ where: { id } })

      if (!singleSpeakhashtags) {
        return res.status(400).json({ success: false, data: `No Speakhashtags with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleSpeakhashtags })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All Speakhashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallSpeakhashtags (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allSpeakhashtags = await Speakhashtags.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allSpeakhashtags.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allSpeakhashtags.rows,
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
 * Update Speakhashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async updateSpeakhashtags (req: any, res: any, next: any): Promise<any> {
    try {
      const speakhashtagsId = req.params.id
      const updatedInfo = req.body

      const speakhashtags = await Speakhashtags.findByPk(speakhashtagsId)

      if (!speakhashtags) {
        return res.status(404).json({ success: false, message: 'Speakhashtags not found' })
      }

      const dspeakhashtags = await speakhashtags.update(updatedInfo)

      return res.status(200).json({ success: true, data: dspeakhashtags, message: 'Speakhashtags information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete Speakhashtags
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async deleteSpeakhashtags (req: any, res: any, next: any): Promise<any> {
    try {
      const speakhashtagsId = req.params.id

      const speakhashtags = await Speakhashtags.findByPk(speakhashtagsId)

      if (!speakhashtags) {
        return res
          .status(404)
          .json({ success: false, message: 'Speakhashtags not found' })
      }

      await speakhashtags.destroy()

      return res.status(200).json({ success: true, message: 'Speakhashtags deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default SpeakhashtagsController
