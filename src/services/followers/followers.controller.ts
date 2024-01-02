/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'

import Followers from '../../models/followers.model'
import FollowersValidation from './followers.validation'
import { getUIDfromDate } from '../../libs/utils/app.utility'

class FollowersController {
  /**
 * Create Followers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async createFollowers (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const validate = await FollowersValidation.validateCreateFollowers(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }
      const dir = '/public/followers'
      if (!fs.existsSync(`.${dir}`)) {
        fs.mkdirSync(`.${dir}`)
      }

      const checkExist = await Followers.findOne({ where: { ...data } })
      if (checkExist !== null) {
        return res.status(400).send({
          success: false,
          message: 'This Followers Record Already Exist',
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

      const dFollowers = await Followers.create({ ...data })

      return res.status(201).json({ success: true, data: dFollowers })
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        message: error.message,
        code: 400
      })
    }
  };

  /**
 * Single Followers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getSingleFollowers (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params

      const singleFollowers = await Followers.findOne({ where: { id } })

      if (!singleFollowers) {
        return res.status(400).json({ success: false, data: `No Followers with the id ${req.params.id}` })
      }

      return res.status(200).json({ success: true, data: singleFollowers })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Get All Followers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallFollowers (req: any, res: any, next: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allFollowers = await Followers.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allFollowers.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allFollowers.rows,
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
 * Update Followers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async updateFollowers (req: any, res: any, next: any): Promise<any> {
    try {
      const followersId = req.params.id
      const updatedInfo = req.body

      const followers = await Followers.findByPk(followersId)

      if (!followers) {
        return res.status(404).json({ success: false, message: 'Followers not found' })
      }

      const dfollowers = await followers.update(updatedInfo)

      return res.status(200).json({ success: true, data: dfollowers, message: 'Followers information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
 * Delete Followers
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async deleteFollowers (req: any, res: any, next: any): Promise<any> {
    try {
      const followersId = req.params.id

      const followers = await Followers.findByPk(followersId)

      if (!followers) {
        return res
          .status(404)
          .json({ success: false, message: 'Followers not found' })
      }

      await followers.destroy()

      return res.status(200).json({ success: true, message: 'Followers deleted' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default FollowersController
