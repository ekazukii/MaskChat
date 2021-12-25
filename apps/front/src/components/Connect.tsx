import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import toast from 'react-hot-toast';
import axios from 'axios';
const injected = new InjectedConnector({});

export default function Connect() {
  let { active, activate, account, library } = useWeb3React();
  useEffect(() => {
    const connect = async () => {
      try {
        await injected.isAuthorized();
        await activate(injected);
      } catch (error) {
        toast.error("Can't connect to metamask");
      }
    };

    // Check if account is registered, if not send publicKey to server
    const checkPubKey = async () => {
      try {
        const res = await axios.get('http://localhost:3001/address?address=' + account);
        if (!res.data.pubKey) {
          const publicKey = await library.send('eth_getEncryptionPublicKey', [account]);
          const res = await axios.post('http://localhost:3001/address', {
            address: account,
            publicKey: publicKey
          });
        }
      } catch (error) {
        toast.error("Can't connect to server");
      }
    };

    if (!active) {
      connect();
    } else {
      checkPubKey();
    }
  }, [active, account, activate, library]);

  return <></>;
}
