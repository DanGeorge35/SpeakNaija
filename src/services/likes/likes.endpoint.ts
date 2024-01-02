import LikesController from "./likes.controller";
import { Authorization } from "../../libs/utils/app.utility";

const ENDPOINT_URL = "/api/v1/likes";
const LikesEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: "post",
    handler: [Authorization, LikesController.createLikes],
  },
   {
    path: `${ENDPOINT_URL}/:id`,
    method: "patch",
    handler: [Authorization, LikesController.updateLikes],
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: "get",
    handler: [LikesController.getallLikes],
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: "get",
    handler: [LikesController.getSingleLikes],
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: "delete",
    handler: [Authorization, LikesController.deleteLikes],
  },
];

export default LikesEndpoint;

