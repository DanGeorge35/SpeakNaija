/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from "joi";

const schema = Joi.object({
  following_id: Joi.string().required().min(1),
  created_at: Joi.string().required().min(1),
});
// name : Joi.any().optional(); // for optional entry

  class FollowersValidation {
        static async validateCreateFollowers(data:any):  Promise<any> {
          const { error, value } = schema.validate(data);
          if (error!= null) {
              error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '');
              return { "result" : "error", "message" : error.details[0].message };
          }
          return { "result" : "success", "message" : value };
      }
  }


export default  FollowersValidation;

/*--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
 { 
    "following_id" : "",
    "created_at" : ""
  } 
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE*/