import { Message, SingleMessage } from '../../types/message';

export const mapSingleMessageToMessage = (singleMessage: SingleMessage): Message => ({
  _id: singleMessage._id,
  senderId: singleMessage.sender._id,
  receiverId: singleMessage.receiver._id,
  text: singleMessage.text,
  createdAt: singleMessage.createdAt,
  updatedAt: singleMessage.updatedAt,
  isDeleted: singleMessage.isDeleted,
  image: singleMessage.image,
})
