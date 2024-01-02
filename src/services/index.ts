import _groupsEndpoint from './_groups/_groups.endpoint'
import commentsEndpoint from './comments/comments.endpoint'
import followersEndpoint from './followers/followers.endpoint'
import groupmembersEndpoint from './groupmembers/groupmembers.endpoint'
import hashtagsEndpoint from './hashtags/hashtags.endpoint'
import likesEndpoint from './likes/likes.endpoint'
import messagesEndpoint from './messages/messages.endpoint'
import notificationsEndpoint from './notifications/notifications.endpoint'
import respeakEndpoint from './respeak/respeak.endpoint'
import speakhashtagsEndpoint from './speakhashtags/speakhashtags.endpoint'
import speaksEndpoint from './speaks/speaks.endpoint'
import usersEndpoint from './users/users.endpoint'

export default [
  ..._groupsEndpoint,
  ...commentsEndpoint,
  ...followersEndpoint,
  ...groupmembersEndpoint,
  ...hashtagsEndpoint,
  ...likesEndpoint,
  ...messagesEndpoint,
  ...notificationsEndpoint,
  ...respeakEndpoint,
  ...speakhashtagsEndpoint,
  ...speaksEndpoint,
  ...usersEndpoint
]
