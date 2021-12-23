import { useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { useDBPublicKey, useMessage } from '../hooks/useDatabase';
import { encodeMessage } from '../hooks/useWallet';

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledP = styled.p`
  margin: 0;
`;

export default function SendMessage() {
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [pub] = useDBPublicKey(address);
  const [_, addMessage] = useMessage(address);

  const send = () => {
    if (!pub) return toast.error("Address don't have public key");
    const cipher = encodeMessage(message, pub);
    addMessage(cipher, address);
  };

  return (
    <StyledContainer>
      <input
        type="text"
        placeholder="Message"
        onChange={e => setMessage(e.target.value)}
      />
      <input
        type="text"
        placeholder="address"
        onChange={e => setAddress(e.target.value)}
      />
      <StyledP>pub : {pub}</StyledP>
      <button onClick={send}>Send</button>
    </StyledContainer>
  );
}
