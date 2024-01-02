/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  hashtag_name: Joi.string().required().min(1)
})
// name : Joi.any().optional(); // for optional entry

class HashtagsValidation {
  static async validateCreateHashtags (data: any): Promise<any> {
    const { error, value } = schema.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }
}

export default HashtagsValidation

/* --------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
 {
    "hashtag_name" : ""
  }
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE */
