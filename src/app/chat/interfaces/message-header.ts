// In firebase User nd Group are stored in single Node(table), named: 'users'
export interface MessageHeader {
    id: any;
    groupName: any;
    lastMessage: any;
    timestamp?: any;
    userArr: any;
    userNamesObj: any;
    profileImagePathObj: any;
    unreadCount?: any;
    unreadUserId?: any;
}
