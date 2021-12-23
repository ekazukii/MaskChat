import { Collection, MongoClient } from 'mongodb';
import { isAddress, ETHAddress, PublicKey } from '../utils';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let collection: Collection;

client.connect().then(() => {
  const db = client.db('test');
  collection = db.collection('messages');

  collection.createIndex({ sender: 1 });
  collection.createIndex({ receiver: 1 });
});

export const getMessages = (addr1: ETHAddress, addr2: ETHAddress) => {
  if (!collection) return Promise.reject('DB Not connected');
  if (!isAddress(addr1)) return Promise.reject('Sender address is not valid');
  if (!isAddress(addr2)) return Promise.reject('Receiver address is not valid');

  return collection
    .find({
      $and: [
        {
          $or: [{ sender: addr1 }, { receiver: addr1 }],
        },
        {
          $or: [{ sender: addr2 }, { receiver: addr2 }],
        },
      ],
    })
    .toArray();
};

export const addMessage = (
  sender: ETHAddress,
  receiver: ETHAddress,
  message: string
) => {
  if (!collection) return Promise.reject('DB Not connected');
  if (!isAddress(sender)) return Promise.reject('Sender address is not valid');
  if (!isAddress(receiver))
    return Promise.reject('Receiver address is not valid');

  return collection.insertOne({ sender, receiver, message });
};

export const removeMessage = (id: any) => {
  //TODO: Query DB
};

export const getContactsOf = async (address: ETHAddress) => {
  if (!collection) return Promise.reject('DB Not connected');
  if (!isAddress(address)) return Promise.reject('Sender address is not valid');

  return collection
    .aggregate([
      {
        $match: {
          $or: [
            {
              receiver: address,
            },
            {
              sender: address,
            },
          ],
        },
      },
      {
        $addFields: {
          contact: {
            $cond: [
              {
                $eq: [address, '$sender'],
              },
              '$receiver',
              '$sender',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$contact',
        },
      },
      {
        $lookup: {
          from: 'session',
          localField: '_id',
          foreignField: 'receiver',
          as: 'public',
        },
      },
      {
        $unwind: {
          path: '$public',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $set: {
          key: '$public.sessionKey',
        },
      },
      {
        $project: {
          public: 0,
        },
      },
    ])
    .toArray();
};
