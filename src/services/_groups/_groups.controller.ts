/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'
import { getUIDfromDate } from '../../libs/utils/app.utility'
import _groups from '../../models/_groups.model'
import _groupsValidation from './_groups.validation'

class _groupsController {
  /**
 * Create _groups
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async create_groups (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const validate = await _groupsValidation.validateCreate_groups(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }
      const dir = '/public/_groups'
      if (!fs.existsSync(`.${dir}`)) {
        fs.mkdirSync(`.${dir}`)
      }

      const checkExist = await _groups.findOne({ where: { ...data } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'This _groups Record Already Exist',
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

      const dgroups = await _groups.create({ ...data })

      return res.status(201).json({ success: true, data: dgroups })
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        message: error.message,
        code: 400
      })
    }
  };

  /**
 * Single _groups
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingle_groups (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleGroups = await _groups.findOne({ where: { id } })

      if (!singleGroups) {
        return res.status(400).json({ success: false, data: `No _groups with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleGroups })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All _groups
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallGroups (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allGroups = await _groups.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allGroups.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allGroups.rows,
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
 * Update _groups
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async update_groups (req: any, res: any, next: any): Promise<any> {
    try {
      const _groupsId = req.params.id
      const updatedInfo = req.body

      const Thisgroups = await _groups.findByPk(_groupsId)

      if (!Thisgroups) {
        return res.status(404).json({ success: false, message: 'group not found' })
      }

      const dgroups = await _groups.update(updatedInfo)

      return res.status(200).json({ success: true, data: dgroups, message: '_groups information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete _groups
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async delete_groups (req: any, res: any, next: any): Promise<any> {
    try {
      const _groupsId = req.params.id

      const Thegroups = await _groups.findByPk(_groupsId)

      if (!Thegroups) {
        return res
          .status(404)
          .json({ success: false, message: '_groups not found' })
      }

      await _groups.destroy()

      return res.status(200).json({ success: true, message: '_groups deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default _groupsController
