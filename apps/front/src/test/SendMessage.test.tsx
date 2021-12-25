import SendMessage from '../components/SendMessage';
import * as contactHook from '../hooks/useContact';
import { ContactType } from '../components/ContactList';
import { IContactContext } from '../hooks/useContact';
import { fireEvent, render, screen } from '@testing-library/react';
import toast from 'react-hot-toast';
import web3React from '@web3-react/core';

let container: any;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

describe('SendMessage test', () => {
  it('Should not send message if contact is not selected', async () => {
    jest.spyOn(contactHook, 'useContact').mockImplementation(() => [undefined, jest.fn()]);
    const toastError = jest.spyOn(toast, 'error');
    const Component = await render(<SendMessage />);

    const input = Component.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hey frerot' } });
    fireEvent.keyDown(input, { code: 'Enter' });

    expect(toastError).toHaveBeenCalledWith('No contact selected');

    const button = Component.getByRole('button');
    fireEvent.click(button);

    expect(toastError).toHaveBeenCalledTimes(2);
  });

  it('Should not send message if user is not connected', async () => {
    let ctc: ContactType = {
      address: 'address',
      sessEncoded: 'sessKey'
    };

    jest.spyOn(contactHook, 'useContact').mockImplementation(() => [ctc, jest.fn()]);
    const toastError = jest.spyOn(toast, 'error');
    const Component = await render(<SendMessage />);

    const input = Component.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hey frerot' } });
    fireEvent.keyDown(input, { code: 'Enter' });

    expect(toastError).toHaveBeenCalledWith('You are not connected');
  });

  it('Should send message to backend and display toast', async () => {
    let ctc: ContactType = {
      address: 'address',
      sessEncoded: 'sessKeyEncoded',
      key: 'SessionDecoded'
    };
    jest.spyOn(contactHook, 'useContact').mockImplementation(() => [ctc, jest.fn()]);

    //@ts-ignore
    jest.spyOn(web3React, 'useWeb3React').mockImplementation(() => ({
      account: 'accountTest'
    }));

    const toastPromise = jest.spyOn(toast, 'promise');
    const Component = await render(<SendMessage />);

    const input = Component.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hey frerot' } });
    fireEvent.keyDown(input, { code: 'Enter' });

    expect(toastPromise).toBeCalled();
  });
});
