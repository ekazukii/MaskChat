import axios from 'axios';
import { useEffect, useState } from 'react';

export type EncryptedMessage = {
  version: string;
  nonce: string;
  ephemPublicKey: string;
  ciphertext: string;
};

export type DBMessage = {
  encrypted: EncryptedMessage;
  destination: string; // ETH Address
  signature?: string;
};

let test: { [key: string]: string } = {
  ethad1: 'uhkygjhtf',
  ethad2: 'ljkhjyg',
  ethad3: 'lkuhygtf'
};

test = JSON.parse(window.localStorage.getItem('pubKeys') || '{}');

const messagesBD: Array<DBMessage> = [];

export function useDBPublicKey(address: string): [string, (pubKey: string) => void] {
  const addPubKey = (pubKey: string) => {
    test[address] = pubKey;
    window.localStorage.setItem('pubKeys', JSON.stringify(test));
  };
  return [test[address], addPubKey];
}

export function useMessage(
  address: string
): [Array<DBMessage>, (encrypted: EncryptedMessage, destination: string) => void, () => void] {
  const [messages, setMessages] = useState<Array<DBMessage>>([]);

  const refreshDB = () => {
    const newMessages = messagesBD.filter(message => {
      return message.destination === address;
    });

    setMessages(newMessages);
  };

  useEffect(() => {
    refreshDB();
  }, [address]);

  const addMessage = (encrypted: EncryptedMessage, destination: string) => {
    messagesBD.push({ encrypted, destination });
  };

  return [messages, addMessage, refreshDB];
}

export const getPublicKey = async (address: string) => {
  try {
    let res = await axios.get('http://localhost:3001/address?address=' + address);
    return res.data.pubKey;
  } catch (error) {
    console.error('Error occured', error);
  }
};
