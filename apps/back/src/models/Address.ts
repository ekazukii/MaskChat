import { Collection, MongoClient } from 'mongodb';
import { ETHAddress, PublicKey } from '../utils';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let collection: Collection;

client.connect().then(() => {
  const db = client.db('test');
  collection = db.collection('address');

  collection.createIndex({ address: 1 }, { unique: true });
});

export const addPublicKey = async (address: ETHAddress, pubKey: PublicKey) => {
  if (!collection) return Promise.reject('DB Not connected');
  return collection.insertOne({ address, pubKey });
};

export const getPublicKey = async (address: ETHAddress) => {
  if (!collection) return Promise.reject('DB Not connected');
  return collection.findOne({ address }, { projection: { pubKey: 1 } });
};
