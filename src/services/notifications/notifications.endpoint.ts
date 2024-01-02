import NotificationsController from './notifications.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/notifications'
const NotificationsEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, NotificationsController.createNotifications]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, NotificationsController.updateNotifications]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [NotificationsController.getallNotifications]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [NotificationsController.getSingleNotifications]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, NotificationsController.deleteNotifications]
  }
]

export default NotificationsEndpoint
