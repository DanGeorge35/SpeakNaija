import HashtagsController from './hashtags.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/hashtags'
const HashtagsEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, HashtagsController.createHashtags]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, HashtagsController.updateHashtags]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [HashtagsController.getallHashtags]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [HashtagsController.getSingleHashtags]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, HashtagsController.deleteHashtags]
  }
]

export default HashtagsEndpoint
