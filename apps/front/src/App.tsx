import React from 'react';
import logo from './logo.svg';
import './App.css';
import Connect from './components/Connect';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import Contact from './components/ContactList';
import styled from 'styled-components';
import Conversation from './components/Main';

const StyledFlex = styled.div`
  display: flex;
`;

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <Connect></Connect>
      <StyledFlex>
        <Contact />
        <Conversation />
      </StyledFlex>
    </div>
  );
}

export default App;

/**
 *
 *    <ChooseDestination></ChooseDestination>
 *    <ShowMessages></ShowMessages>
 */
