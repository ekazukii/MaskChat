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

  collection.createIndex({ sender: 1, receiver: 1 }, { unique: true, name: 'session' });
});

export const addSessionKey = async (
  sender: ETHAddress,
  receiver: ETHAddress,
  senderKey: string,
  receiverKey: string
) => {
  if (!collection) return Promise.reject('DB Not connected');

  await collection.insertOne({ sender, receiver, sessionKey: senderKey });
  await collection.insertOne({
    sender: receiver,
    receiver: sender,
    sessionKey: receiverKey
  });

  return true;
};

export const getSessionKey = async (sender: ETHAddress, receiver: ETHAddress) => {
  if (!collection) return Promise.reject('DB Not connected');
  return collection.findOne({ sender, receiver }, { projection: { sessionKey: 1 } });
};

export const removeSessionKey = async (sender: ETHAddress, receiver: ETHAddress) => {
  if (!collection) return Promise.reject('DB Not connected');

  await collection.deleteOne({ sender, receiver });
  await collection.deleteOne({ receiver: sender, sender: receiver });

  return true;
};
export const getSessionsOf = async (address: ETHAddress) => {
  if (!collection) return Promise.reject('DB Not connected');

  return collection
    .find({ sender: address }, { projection: { receiver: 1, sessionKey: 1 } })
    .toArray();
};
