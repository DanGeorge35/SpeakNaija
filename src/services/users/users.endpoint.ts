import UsersController from './users.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/users'
const UsersEndpoint = [

  {
    path: `${ENDPOINT_URL}/login`,
    method: 'post',
    handler: [UsersController.Login]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [UsersController.createUsers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, UsersController.updateUsers]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [UsersController.getallUsers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [UsersController.getSingleUsers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, UsersController.deleteUsers]
  }
]

export default UsersEndpoint
