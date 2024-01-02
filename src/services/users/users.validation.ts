/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  firstname: Joi.string().required().min(1),
  lastname: Joi.string().required().min(1),
  email: Joi.string().required().min(1),
  password: Joi.string().required().min(1)
})
// name : Joi.any().optional(); // for optional entry

class UsersValidation {
  static async validateCreateUsers (data: any): Promise<any> {
    const { error, value } = schema.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }
}

export default UsersValidation

/* --------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
  firstname
  lastname
  username
  email
  phone
  passwordhash
  bio
  avatar_photo_url
  cover_image_url
  location
  website
  date_of_birth
  created_at
  updated_at
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE */
