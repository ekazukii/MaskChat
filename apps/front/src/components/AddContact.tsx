import { useState } from 'react';
import styled from 'styled-components';
import Blockies from 'react-blockies';
import { utils } from 'ethers';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { encodeMessage } from '../hooks/useWallet';

const StyledCtn = styled.div`
  display: flex;
  padding: 10px 20px;
  gap: 10px;
`;

const StyledInput = styled.input`
  background-color: #464649;
  border: 1px solid #818188;
  border-radius: 5px;
  color: white;

  &:focus {
    outline: none;
    border: 1px solid white;
  }
`;

const URL = 'http://localhost:3001';

export default function AddContact({ onAdd }: { onAdd: Function }) {
  const { account } = useWeb3React();
  const [address, setAddress] = useState<string>('');

  const onClick = async () => {
    if (!utils.isAddress(address)) return toast.error('Invalid address');
    if (!account) return toast.error('You are not connected with metamask');

    try {
      const sesRes = await axios.get(
        `${URL}/session?sender=${account}&receiver=${address}`
      );
      if (sesRes.data.sessionKey)
        return onAdd({ address, key: sesRes.data.sessionKey });

      // Query contact publicKey
      const PKRes = await axios.get(
        'http://localhost:3001/address?address=' + address
      );
      if (!PKRes.data.pubKey)
        return toast.error('Address is not registered in database');

      // Query contact publicKey
      const OwnPKRes = await axios.get(
        'http://localhost:3001/address?address=' + account
      );
      if (!PKRes.data.pubKey)
        return toast.error('Address is not registered in database');

      // We generate the passphrase
      let pass = '';
      const pattern = /[a-zA-Z0-9_\-\+\.]/;
      while (pass.length < 45) {
        const array = new Uint8Array(1);
        //@ts-ignore
        const char = String.fromCharCode(crypto.getRandomValues(array));
        if (pattern.test(char)) pass += char;
      }

      const myCipher = encodeMessage(pass, OwnPKRes.data.pubKey);
      const hisCipher = encodeMessage(pass, PKRes.data.pubKey);

      await axios.post(`${URL}/session`, {
        sender: account,
        receiver: address,
        senderKey: JSON.stringify(myCipher),
        receiverKey: JSON.stringify(hisCipher),
      });

      onAdd({ address, key: pass, sessEncoded: myCipher });
    } catch (error) {
      toast.error('An error occured');
    }
  };

  return (
    <StyledCtn>
      <Blockies seed={address} />
      <StyledInput
        placeholder="Eth Address"
        type="text"
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={onClick}>Add</button>
    </StyledCtn>
  );
}
