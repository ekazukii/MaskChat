import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useDBPublicKey, useMessage } from '../hooks/useDatabase';
import { usePublicKey, encodeMessage, useDecodeMessage } from '../hooks/useWallet';

export default function Test() {
  const [message, setMessage] = useState<string | undefined>();
  const [encrypted, setEncrypted] = useState<any>();
  const [pK, addPK] = useDBPublicKey('ethadT');
  const decode = useDecodeMessage(encrypted);
  const { account } = useWeb3React();
  const [_, addMessage] = useMessage(account || '');
  const pubKey = usePublicKey();

  useEffect(() => {
    console.log(encrypted);
  });

  return (
    <div>
      <textarea
        name=""
        id=""
        cols={30}
        rows={10}
        onChange={e => {
          setMessage(e.target.value);
        }}
      ></textarea>

      <button
        onClick={() => {
          if (message && pubKey) {
            const cipher = encodeMessage(message, pubKey);
            setEncrypted(cipher);
            addMessage(cipher, account || '');
          }
        }}
      >
        Encrypt
      </button>
      <button
        onClick={() => {
          decode();
        }}
      >
        Decrypt
      </button>
      <p>pubKey : {pubKey}</p>
    </div>
  );
}
