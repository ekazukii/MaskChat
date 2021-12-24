import { Router } from 'express';
import { addAddress, getPublic } from './controllers/Address';
import { addMessage, getContacts, getMessages } from './controllers/Message';
import { addSession, getSession, getContacts as getSessionContacts } from './controllers/Session';

const messageRouter = Router();
const addressRouter = Router();
const sessionRouter = Router();

/**
 * @api {get} /message Request all messages between two address
 * @apiName GetMessages
 * @apiGroup Message
 *
 * @apiQuery {string} addr1 ETH Address
 * @apiQuery {string} addr2 ETH Address
 *
 * @apiSuccess {Object[]} messages JSON Object representing a message
 * @apiSuccess {string} messages._id Message's id
 * @apiSuccess {string} messages.sender ETH Address of the sender of this message
 * @apiSuccess {string} messages.receiver ETH Address of the receiver of this message
 * @apiSuccess {string} messages.message Base64 encoded string (encrypted with AES Session key)
 *
 * @apiError {string} error Error message
 */
messageRouter.get('/', getMessages);

/**
 * @api {post} /message Send new message
 * @apiName SendMessage
 * @apiGroup Message
 *
 * @apiBody {string} sender ETH Address
 * @apiBody {string} receiver ETH Address
 * @apiBody {string} message Base64 encoded string (encrypted with AES Session key)
 *
 * @apiError {string} error Error message
 */
messageRouter.post('/', addMessage);

/**
 * @api {get} /message/contacts Request all contacts of an Ethereum address
 * @apiName GetContacts
 * @apiGroup Message
 *
 * @apiQuery {string} address ETH Address
 *
 * @apiSuccess {Object[]} contacts JSON Object representing a contact
 * @apiSuccess {string} contacts._id Contacts's ETH Address
 * @apiSuccess {string} contacts.key SessionKey of the conversation
 *
 * @apiError {string} error Error message
 *
 * @apiDeprecated Use now (#Session:GetSessionContacts).
 * This method will omit all contacts that have not yet sent a message to each other
 */
messageRouter.get('/contacts', getContacts);

/**
 * @api {get} /address Request public key of an Ethereum address
 * @apiName GetPublic
 * @apiGroup Address
 *
 * @apiQuery {string} address ETH Address
 *
 * @apiSuccess {string} pubKey Public key of ETH Address
 *
 * @apiError {string} error Error message
 */
addressRouter.get('/', getPublic);

/**
 * @api {post} /address Set public key of an Ethereum address
 * @apiName SetPublic
 * @apiGroup Address
 *
 * @apiBody {string} address ETH Address
 * @apiBody {string} publicKey Public key of ETH Address
 *
 * @apiError {string} error Error message
 */
addressRouter.post('/', addAddress);

/**
 * @api {get} /session Request session key of an conversation between two addresses
 * @apiName GetSession
 * @apiGroup Session
 *
 * @apiQuery {string} sender ETH Address
 * @apiQuery {string} receiver ETH Address
 *
 * @apiSuccess {string} sessionKey Session key of a conversation
 *
 * @apiError {string} error Error message
 */
sessionRouter.get('/', getSession);

/**
 * @api {get} /session/contacts Request all contacts of an Ethereum address
 * @apiName GetSessionContacts
 * @apiGroup Session
 *
 * @apiQuery {string} address ETH Address
 *
 * @apiSuccess {Object[]} contacts JSON Object representing a contact
 * @apiSuccess {string} contacts.receiver Contacts's ETH Address
 * @apiSuccess {string} contacts.sessionKey SessionKey of the conversation
 *
 * @apiError {string} error Error message
 */
sessionRouter.get('/contacts', getSessionContacts);

/**
 * @api {post} /session Set session key of conversation between two Ethereum Address
 * @apiName SetSession
 * @apiGroup Session
 *
 * @apiBody {string} sender ETH Address
 * @apiBody {string} receiver ETH Address
 * @apiBody {string} senderKey Public key of ETH Address
 * @apiBody {string} receiverKey Public key of ETH Address
 *
 * @apiError {string} error Error message
 */
sessionRouter.post('/', addSession); // Set public key from ETH Address

export { messageRouter, addressRouter, sessionRouter };
