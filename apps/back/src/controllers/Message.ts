import { Request, Response } from 'express';
import {
  getContactsOf,
  getMessages as getModelMessages,
  addMessage as addModelMessage
} from '../models/Message';

export const getContacts = async (req: Request, res: Response) => {
  const { address } = req.query;
  if (!address || typeof address !== 'string') return res.json({ error: 'Address is undefinbed' });

  try {
    const dbRes = await getContactsOf(address);
    res.json(dbRes);
  } catch (e) {
    res.status(400).json({ error: 'Error' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { addr1, addr2 } = req.query;
  if (typeof addr1 !== 'string' || typeof addr2 !== 'string')
    return res.json({ error: 'Address is undefinbed' });

  try {
    const dbRes = await getModelMessages(addr1, addr2);
    res.json(dbRes);
  } catch (error) {
    res.status(400).json({ error: 'Error' });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  const { sender, receiver, message } = req.body;
  if (typeof sender !== 'string' || typeof receiver !== 'string' || typeof message !== 'string')
    return res.json({ error: 'Address or message is undefinbed' });
  try {
    await addModelMessage(sender, receiver, message);
    res.send({});
  } catch (error) {
    res.status(400).json({ error: 'Error' });
  }
};
