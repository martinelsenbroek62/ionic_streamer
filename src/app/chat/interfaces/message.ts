export interface Message {
    // declaring Message interface to keep message object consistent across the chat
    // across the chat means while adding, editing, forwarding etc.
    // Added ?(questionmark) to make these declaration optional because chat.page.ts will not have these values, these var values will be later added in chat.service.ts
    userIdSenderReceiverArray: Array<any>, // this will have both sender and receiver id
    userIdSender, // this will be the user id of person sending message
    userIdReceiverArray: Array<any>, // list of user ids who are receiving messages
    chatId?,
    messageId?,
    messageType, // messageType could be ‘TEXT’, ‘IMAGE’, ‘VIDEO’, ‘FILE’
    text?,
    mediaURL?,
    mediaThumbURL?,
    latitude?,
    longitude?,
    timestamp?,
    isRead,
    groupId?, // if message is sending in group add groupId too
    isDeletedUserIds?: JSON
}
