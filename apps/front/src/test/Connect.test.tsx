import { act, render } from '@testing-library/react';
import Connect from '../components/Connect';
import web3React from '@web3-react/core';
import axios from 'axios';
import ReactDOM from 'react-dom';

const mockActivate = jest.fn();
const mockSend = jest.fn();

let container: any;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

describe('Connect test', () => {
  it('Should try to activate MetaMask', async () => {
    jest
      .spyOn(web3React, 'useWeb3React')
      //@ts-ignore
      .mockImplementation(() => ({
        active: false,
        activate: mockActivate
      }));
    await render(<Connect />);
    expect(mockActivate).toBeCalledTimes(1);
    expect(mockSend).not.toBeCalled();
  });

  it('Should get the publicKey from API', async () => {
    jest
      .spyOn(web3React, 'useWeb3React')
      //@ts-ignore
      .mockImplementation(() => ({
        active: true,
        account: 'accountTest',
        library: {
          send: mockSend
        }
      }));

    const axiosGet = jest.spyOn(axios, 'get').mockImplementation(async () => {
      return {
        data: {
          pubKey: 'publicTestKey'
        }
      };
    });

    const axiosPost = jest.spyOn(axios, 'post');

    await act(async () => {
      await ReactDOM.render(<Connect />, container);
    });

    expect(mockSend).not.toBeCalled();
    expect(axiosGet).toHaveBeenCalledWith('http://localhost:3001/address?address=accountTest');
    expect(axiosPost).not.toBeCalled();
  });

  it('Should get the publicKey from MetaMask and send to server', async () => {
    jest
      .spyOn(web3React, 'useWeb3React')
      //@ts-ignore
      .mockImplementation(() => ({
        active: true,
        account: 'accountTest',
        library: {
          send: mockSend.mockImplementation(async () => {
            return 'publicKeyTest';
          })
        }
      }));

    const axiosGet = jest.spyOn(axios, 'get').mockImplementation(async () => ({
      data: {}
    }));

    const axiosPost = jest.spyOn(axios, 'post');

    await act(async () => {
      await ReactDOM.render(<Connect />, container);
    });

    expect(mockSend).toBeCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('http://localhost:3001/address?address=accountTest');
    expect(axiosPost).toHaveBeenCalledWith('http://localhost:3001/address', {
      address: 'accountTest',
      publicKey: 'publicKeyTest'
    });
  });
});
