import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useContact } from '../hooks/useContact';
import AddContact from './AddContact';
import Contact from './Contact';

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 18em;
  max-width: 18em;

  background-color: #28282a;

  overflow-y: scroll;
`;

export type ContactType = {
  address: string;
  key?: string;
  sessEncoded: string;
  ENS?: string;
};

export default function ContactList() {
  const { account } = useWeb3React();
  const [contacts, setContacts] = useState<ContactType[]>([]);

  const addAddress = (contact: ContactType) => {
    setContacts([...contacts, contact]);
  };

  useEffect(() => {
    if (!account) return;
    //TODO: REPLACE PLACEHOLDER
    axios.get(`http://localhost:3001/message/contacts?address=${account}`).then(res => {
      setContacts(
        res.data.map((ctc: any) => {
          console.log(ctc);
          return {
            address: ctc._id,
            sessEncoded: ctc.key
          };
        })
      );
    });
  }, [account]);

  return (
    <StyledContainer>
      <AddContact onAdd={addAddress} />
      {contacts.map(contact => {
        return <Contact contact={contact} key={contact.address} />;
      })}
    </StyledContainer>
  );
}
