import FollowersController from './followers.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/followers'
const FollowersEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, FollowersController.createFollowers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, FollowersController.updateFollowers]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [FollowersController.getallFollowers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [FollowersController.getSingleFollowers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, FollowersController.deleteFollowers]
  }
]

export default FollowersEndpoint
