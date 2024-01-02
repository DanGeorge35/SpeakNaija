import SpeaksController from './speaks.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/speaks'
const SpeaksEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, SpeaksController.createSpeaks]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, SpeaksController.updateSpeaks]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [SpeaksController.getallSpeaks]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [SpeaksController.getSingleSpeaks]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, SpeaksController.deleteSpeaks]
  }
]

export default SpeaksEndpoint
