import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { useContact } from '../hooks/useContact';
import Message from './Message';

const StyledContainer = styled.div`
  width: calc(100% - 20px);
  height: calc(100vh - 120px);

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  padding: 0px 10px;
  overflow-y: scroll;
`;

export type MessageType = {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
};

export default function Conversation() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [contact, setContact] = useContact();
  const { account, library } = useWeb3React();

  useEffect(() => {
    if (!contact || !account) return;
    axios
      .get(`http://localhost:3001/message?addr1=${account}&addr2=${contact?.address}`)
      .then(res => {
        setMessages(res.data);
      });

    axios
      .get(`http://localhost:3001/session?sender=${account}&receiver=${contact?.address}`)
      .then(res => {
        if (!res.data.sessionKey) return toast.error('An error occured');
        library
          .send('eth_decrypt', [res.data.sessionKey, account])
          .then((decryptedMessage: any) => {
            setContact({ ...contact, key: decryptedMessage });
          })
          .catch((error: Error) => toast.error("Can't decrypt the message"));
      });
  }, [account, contact?.address]);

  return (
    <StyledContainer>
      {messages.map(msg => {
        return <Message msg={msg} key={msg._id}></Message>;
      })}
    </StyledContainer>
  );
}
