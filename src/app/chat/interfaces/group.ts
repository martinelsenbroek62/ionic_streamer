// In firebase User nd Group are stored in single Node(table), named: 'users'
export interface Group {
    id, // id is the node name
    groupId, // groupId is also the node name
    userIdArray: Array<any>, // this key is common for user and groups
    firstName: '',
    lastName?: '',
    timestamp?,
    timestampUpdate?
}
