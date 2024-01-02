import RespeakController from './respeak.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/respeak'
const RespeakEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, RespeakController.createRespeak]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, RespeakController.updateRespeak]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [RespeakController.getallRespeak]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [RespeakController.getSingleRespeak]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, RespeakController.deleteRespeak]
  }
]

export default RespeakEndpoint
