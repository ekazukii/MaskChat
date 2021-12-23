import { Request, Response } from 'express';
import { addSessionKey, getSessionKey } from '../models/Session';

export const addSession = async (req: Request, res: Response) => {
  const { sender, receiver, senderKey, receiverKey } = req.body;
  if (!sender || !receiver || !senderKey || !receiverKey)
    return res.json({ error: 'Address or key undefined' });

  try {
    await addSessionKey(sender, receiver, senderKey, receiverKey);
    res.json({});
  } catch (e) {
    res.status(400).json({ error: 'Error' });
  }
};

export const getSession = async (req: Request, res: Response) => {
  const { sender, receiver } = req.query;
  if (!sender || typeof sender !== 'string')
    return res.json({ error: 'Address or publicKey undefined' });

  if (!receiver || typeof receiver !== 'string')
    return res.json({ error: 'Address or publicKey undefined' });

  try {
    const bdRes = await getSessionKey(sender, receiver);
    res.json({ sessionKey: bdRes?.sessionKey });
  } catch (e) {
    res.status(400).json({ error: 'Error' });
  }
};
