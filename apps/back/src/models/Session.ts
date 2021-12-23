import { Collection, MongoClient } from 'mongodb';
import { ETHAddress } from '../utils';

/** 
{
    sender: ETHADDRESS
    receiver: ETHADDRESS
    sessionKey: string
}
*/

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let collection: Collection;

client.connect().then(() => {
  const db = client.db('test');
  collection = db.collection('session');

  collection.createIndex({ sender: 1 });
});

export const addSessionKey = async (
  sender: ETHAddress,
  receiver: ETHAddress,
  senderKey: string,
  receiverKey: string
) => {
  if (!collection) return Promise.reject('DB Not connected');
  collection.insertOne({ sender, receiver, sessionKey: senderKey });
  collection.insertOne({
    sender: receiver,
    receiver: sender,
    sessionKey: receiverKey,
  });
};

export const getSessionKey = async (
  sender: ETHAddress,
  receiver: ETHAddress
) => {
  if (!collection) return Promise.reject('DB Not connected');
  return collection.findOne(
    { sender, receiver },
    { projection: { sessionKey: 1 } }
  );
};
