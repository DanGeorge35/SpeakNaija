import SpeakhashtagsController from './speakhashtags.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/speakhashtags'
const SpeakhashtagsEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, SpeakhashtagsController.createSpeakhashtags]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, SpeakhashtagsController.updateSpeakhashtags]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [SpeakhashtagsController.getallSpeakhashtags]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [SpeakhashtagsController.getSingleSpeakhashtags]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, SpeakhashtagsController.deleteSpeakhashtags]
  }
]

export default SpeakhashtagsEndpoint
