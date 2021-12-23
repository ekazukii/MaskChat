import { createContext, useContext, useState } from 'react';
import { ContactType } from '../components/ContactList';

export type IContactContext = [
  contact: ContactType | undefined,
  setContact: (contact: ContactType) => void
];

export const ContactContext = createContext<IContactContext>([undefined, e => {}]);

export const ContactProvider = ({ children }: { children: JSX.Element }) => {
  const [contact, setContact] = useState<ContactType | undefined>();
  return (
    <ContactContext.Provider value={[contact, setContact]}>{children}</ContactContext.Provider>
  );
};

export const useContact = () => {
  return useContext(ContactContext);
};
