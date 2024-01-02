import GroupmembersController from './groupmembers.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/groupmembers'
const GroupmembersEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, GroupmembersController.createGroupmembers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, GroupmembersController.updateGroupmembers]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [GroupmembersController.getallGroupmembers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [GroupmembersController.getSingleGroupmembers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, GroupmembersController.deleteGroupmembers]
  }
]

export default GroupmembersEndpoint
