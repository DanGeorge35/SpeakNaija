/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  group_name: Joi.string().required().min(1),
  description: Joi.string().required().min(1),
  author_id: Joi.string().required().min(1),
  updated_at: Joi.string().required().min(1),
  created_at: Joi.string().required().min(1)
})
// name : Joi.any().optional(); // for optional entry

class _groupsValidation {
  static async validateCreate_groups (data: any): Promise<any> {
    const { error, value } = schema.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }
}

export default _groupsValidation

/* --------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
 {
    "group_name" : "",
    "description" : "",
    "author_id" : "",
    "updated_at" : "",
    "created_at" : ""
  }
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE */
