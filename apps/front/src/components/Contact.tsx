import styled from 'styled-components';
import { ContactType } from './ContactList';
import Blockies from 'react-blockies';
import { StyledEllipsisP } from './Styled';
import { useContact } from '../hooks/useContact';
import { useEffect, useState } from 'react';

const StyledContainer = styled.div`
  height: 3em;
  width: 100%;
  border-top: 1px solid black;

  box-sizing: border-box;

  padding: 10px 20px;

  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    cursor: pointer;
    background-color: #464649;
  }

  background-color: ${(p: { active?: boolean }) => (p.active ? '#464649' : 'inherit')};
`;

export default function Contact({ contact }: { contact: ContactType }) {
  const [activeContact, setActiveContact] = useContact();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(activeContact?.address === contact.address);
  }, [activeContact, contact]);

  return (
    <StyledContainer
      onClick={() => {
        setActiveContact(contact);
      }}
      active={active}
    >
      <Blockies seed={contact.address} />
      <StyledEllipsisP>{contact.ENS ? contact.ENS : contact.address}</StyledEllipsisP>
    </StyledContainer>
  );
}
