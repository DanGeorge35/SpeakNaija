/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from "joi";

const schema = Joi.object({
  user_id: Joi.string().required().min(1),
  speak_id: Joi.string().required().min(1),
  created_at: Joi.string().required().min(1),
});
// name : Joi.any().optional(); // for optional entry

  class LikesValidation {
        static async validateCreateLikes(data:any):  Promise<any> {
          const { error, value } = schema.validate(data);
          if (error!= null) {
              error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '');
              return { "result" : "error", "message" : error.details[0].message };
          }
          return { "result" : "success", "message" : value };
      }
  }


export default  LikesValidation;

/*--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
 { 
    "user_id" : "",
    "speak_id" : "",
    "created_at" : ""
  } 
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE*/