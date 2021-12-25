import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { useContact } from '../hooks/useContact';
import { MessageType } from './Conversation';
import CryptoJS from 'crypto-js';

const StyledMessage = styled.p`
  background-color: #323234;
  margin: 15px;
  max-width: 40%;
  text-align: ${(p: { left?: boolean }) => (p.left ? 'left' : 'right')};
  margin-left: ${(p: { left?: boolean }) => (p.left ? '0' : 'auto')};
  margin-right: ${(p: { left?: boolean }) => (p.left ? 'auto' : '0')};
  padding: 10px;

  border-radius: 10px;
  position: relative;

  &:after {
    border-right: solid ${(p: { left?: boolean }) => (p.left ? '10px' : '2px')} transparent;
    border-left: solid ${(p: { left?: boolean }) => (p.left ? '2px' : '10px')} transparent;
    border-top: solid 10px #323234;
    border-radius: 1px;
    transform: translateX(-50%);
    position: absolute;
    z-index: 1;
    content: '';
    top: 100%;
    right: ${(p: { left?: boolean }) => (p.left ? 'auto' : '4px')};
    left: ${(p: { left?: boolean }) => (p.left ? '15px' : 'auto')};
    height: 0;
    width: 0;
  }

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export default function Message({ msg }: { msg: MessageType }) {
  //const decrypted = useDecryptedMessage(JSON.parse(msg.message));
  const [decrypted, setDecrypted] = useState<string | undefined>();
  const { account, library } = useWeb3React();
  const [contact] = useContact();
  useEffect(() => {
    console.log('RETRIGGERED');
    if (!contact || !contact.key) return;

    const cipher = CryptoJS.AES.decrypt(msg.message, contact.key);
    setDecrypted(CryptoJS.enc.Utf8.stringify(cipher));
  }, [contact?.key, msg]);

  const decrypt = async () => {
    if (!account) return;
    library
      .send('eth_decrypt', [msg.message, account])
      .then((decryptedMessage: any) => setDecrypted(decryptedMessage))
      .catch((error: Error) => toast.error("Can't decrypt the message"));
  };

  return (
    <StyledMessage left={msg.sender !== account} onClick={decrypt}>
      {decrypted ? decrypted : 'Click to decrypt message'}
    </StyledMessage>
  );
}
