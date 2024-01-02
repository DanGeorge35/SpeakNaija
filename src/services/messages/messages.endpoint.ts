import MessagesController from './messages.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/messages'
const MessagesEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, MessagesController.createMessages]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, MessagesController.updateMessages]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [MessagesController.getallMessages]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [MessagesController.getSingleMessages]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, MessagesController.deleteMessages]
  }
]

export default MessagesEndpoint
