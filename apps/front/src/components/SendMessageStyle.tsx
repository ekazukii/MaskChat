import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { useState, KeyboardEvent, useContext, SyntheticEvent } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { useContact } from '../hooks/useContact';
import { encodeMessage } from '../hooks/useWallet';
import { ContactType } from './ContactList';
import CryptoJS from 'crypto-js';

const StyledContainer = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const StyledInput = styled.textarea`
  background-color: #464649;
  border: 1px solid #818188;
  color: white;
  width: 90%;
  resize: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 1em;
  text-indent: 0.2em;
  border-radius: 5px;

  &:focus {
    outline: none;
    border: 1px solid white;
  }
`;

const StyledSend = styled.button``;

export default function SendMessage() {
  const [contact, setContact] = useContact();
  const [message, setMessage] = useState('');
  const { account } = useWeb3React();

  const send = (e: SyntheticEvent) => {
    if (!contact) {
      e?.preventDefault();
      return toast.error('No contact selected');
    }

    if (!account) {
      e?.preventDefault();
      return toast.error('You are not connected');
    }

    if (!contact.key) {
      e?.preventDefault();
      return toast.error('An error occured please refresh the page');
    }

    console.log(message, contact.key);
    const cipher = CryptoJS.AES.encrypt(message, contact.key).toString();
    //const cipher = encodeMessage(message, contact.pubKey);

    const apiCall = axios.post('http://localhost:3001/message', {
      sender: account,
      receiver: contact.address,
      message: cipher
    });

    //TODO: Change placeholder
    toast.promise(apiCall, {
      loading: 'Loading',
      success: 'Succes',
      error: 'Error'
    });
  };

  const keyDown = (e: KeyboardEvent) => {
    if (e.code !== 'Enter') return;

    send(e);
  };

  return (
    <StyledContainer>
      <StyledInput
        placeholder="Message"
        onChange={e => setMessage(e.target.value)}
        onKeyDown={keyDown}
      />
      <StyledSend onClick={send}>⬆</StyledSend>
    </StyledContainer>
  );
}
