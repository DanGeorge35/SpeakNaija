/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'
import Speaks from '../../models/speaks.model'
import SpeaksValidation from './speaks.validation'
import { getUIDfromDate } from '../../libs/utils/app.utility'

class SpeaksController {
  /**
 * Create Speaks
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async createSpeaks (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const validate = await SpeaksValidation.validateCreateSpeaks(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }
      const dir = '/public/speaks'
      if (!fs.existsSync(`.${dir}`)) {
        fs.mkdirSync(`.${dir}`)
      }

      const checkExist = await Speaks.findOne({ where: { ...data } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'This Speaks Record Already Exist',
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

      const dSpeaks = await Speaks.create({ ...data })

      return res.status(201).json({ success: true, data: dSpeaks })
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        message: error.message,
        code: 400
      })
    }
  };

  /**
 * Single Speaks
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingleSpeaks (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleSpeaks = await Speaks.findOne({ where: { id } })

      if (!singleSpeaks) {
        return res.status(400).json({ success: false, data: `No Speaks with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleSpeaks })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All Speaks
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallSpeaks (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allSpeaks = await Speaks.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allSpeaks.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allSpeaks.rows,
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
 * Update Speaks
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async updateSpeaks (req: any, res: any, next: any): Promise<any> {
    try {
      const speaksId = req.params.id
      const updatedInfo = req.body

      const speaks = await Speaks.findByPk(speaksId)

      if (!speaks) {
        return res.status(404).json({ success: false, message: 'Speaks not found' })
      }

      const dspeaks = await speaks.update(updatedInfo)

      return res.status(200).json({ success: true, data: dspeaks, message: 'Speaks information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete Speaks
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async deleteSpeaks (req: any, res: any, next: any): Promise<any> {
    try {
      const speaksId = req.params.id

      const speaks = await Speaks.findByPk(speaksId)

      if (!speaks) {
        return res
          .status(404)
          .json({ success: false, message: 'Speaks not found' })
      }

      await speaks.destroy()

      return res.status(200).json({ success: true, message: 'Speaks deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default SpeaksController
