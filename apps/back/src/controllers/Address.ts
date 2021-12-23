import { Request, Response } from 'express';
import { addPublicKey, getPublicKey } from '../models/Address';

export const addAddress = async (req: Request, res: Response) => {
  console.log(req.body);
  const { address, publicKey } = req.body;
  if (!address || !publicKey)
    return res.json({ error: 'Address or publicKey undefined' });

  try {
    await addPublicKey(address, publicKey);
    res.json({});
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Error' });
  }
};

export const getPublic = async (req: Request, res: Response) => {
  const { address } = req.query;
  if (!address || typeof address !== 'string')
    return res.json({ error: 'Address or publicKey undefined' });

  try {
    const bdRes = await getPublicKey(address);
    res.json({ pubKey: bdRes?.pubKey });
  } catch (e) {
    res.status(400).json({ error: 'Error' });
  }
};
