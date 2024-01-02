/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  user_id: Joi.string().required().min(1),
  sender_id: Joi.string().required().min(1),
  speak_id: Joi.string().required().min(1),
  notification_type: Joi.string().required().min(1),
  created_at: Joi.string().required().min(1),
  is_read: Joi.string().required().min(1)
})
// name : Joi.any().optional(); // for optional entry

class NotificationsValidation {
  static async validateCreateNotifications (data: any): Promise<any> {
    const { error, value } = schema.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }
}

export default NotificationsValidation

/* --------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
 {
    "user_id" : "",
    "sender_id" : "",
    "speak_id" : "",
    "notification_type" : "",
    "created_at" : "",
    "is_read" : ""
  }
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE */
