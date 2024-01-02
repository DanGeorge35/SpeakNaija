/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  group_id: Joi.string().required().min(1),
  user_id: Joi.string().required().min(1),
  is_admin: Joi.string().required().min(1)
})
// name : Joi.any().optional(); // for optional entry

class GroupmembersValidation {
  static async validateCreateGroupmembers (data: any): Promise<any> {
    const { error, value } = schema.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }
}

export default GroupmembersValidation

/* --------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
 {
    "group_id" : "",
    "user_id" : "",
    "is_admin" : ""
  }
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE */
