import _groupsController from './_groups.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/_groups'
const _groupsEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, _groupsController.create_groups]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, _groupsController.update_groups]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [_groupsController.getallGroups]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [_groupsController.getSingle_groups]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, _groupsController.delete_groups]
  }
]

export default _groupsEndpoint
