import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import { useDBPublicKey } from './useDatabase';

export function useWallet() {}

export function usePublicKey() {
  const [pubKey, setPubKey] = useState<string | undefined>();
  const { active, library, account } = useWeb3React();
  const [_, addKey] = useDBPublicKey(account || '');

  useEffect(() => {
    if (active && account) {
      const cached = window.localStorage.getItem(account);
      if (cached) return setPubKey(cached);
      library
        .send('eth_getEncryptionPublicKey', [account])
        .then((pub: string) => {
          window.localStorage.setItem(account, pub);
          addKey(pub);
          setPubKey(pub);
        })
        .catch((err: Error) => {
          console.error(err);
        });
    }
  }, [account]);

  return pubKey;
}

/**
 * Decode encrypted message with personnal private key
 * @param encoded Encrypted message
 * @returns Decoded message
 */
export function useDecryptedMessage(encoded: string | any) {
  const [message, setMessage] = useState<string | any>();
  const { active, account, library } = useWeb3React();

  useEffect(() => {
    if (active && account && encoded) {
      library
        .send('eth_decrypt', [JSON.stringify(encoded), account])
        .then((decryptedMessage: any) => setMessage(decryptedMessage))
        .catch((error: Error) => console.log(error.message));
    } else {
      console.log(active, account, encoded);
    }
  }, [encoded]);

  return message;
}

export function useDecodeMessage(encrypted: any) {
  const { active, account, library } = useWeb3React();

  return () => {
    if (active && account && encrypted) {
      console.log(encrypted.ciphertext);
      library
        .send('eth_decrypt', [JSON.stringify(encrypted), account])
        .then((decryptedMessage: any) => console.log('The decrypted message is:', decryptedMessage))
        .catch((error: Error) => console.log(error.message));
    }
  };
}

export function encodeMessage(message: string, pubKey: string) {
  const ephemeralKeyPair = nacl.box.keyPair();
  const pubKeyUInt8Array = naclUtil.decodeBase64(pubKey);
  const msgParamsUInt8Array = naclUtil.decodeUTF8(message);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  const encryptedMessage = nacl.box(
    msgParamsUInt8Array,
    nonce,
    pubKeyUInt8Array,
    ephemeralKeyPair.secretKey
  );

  return {
    version: 'x25519-xsalsa20-poly1305',
    nonce: naclUtil.encodeBase64(nonce),
    ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
    ciphertext: naclUtil.encodeBase64(encryptedMessage)
  };
}
