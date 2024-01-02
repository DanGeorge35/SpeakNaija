/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  speak_id: Joi.string().required().min(1),
  hashtag_id: Joi.string().required().min(1)
})
// name : Joi.any().optional(); // for optional entry

class SpeakhashtagsValidation {
  static async validateCreateSpeakhashtags (data: any): Promise<any> {
    const { error, value } = schema.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }
}

export default SpeakhashtagsValidation

/* --------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
 {
    "speak_id" : "",
    "hashtag_id" : ""
  }
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE */
