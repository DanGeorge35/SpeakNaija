import CommentsController from './comments.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/comments'
const CommentsEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, CommentsController.createComments]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, CommentsController.updateComments]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [CommentsController.getallComments]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [CommentsController.getSingleComments]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, CommentsController.deleteComments]
  }
]

export default CommentsEndpoint
