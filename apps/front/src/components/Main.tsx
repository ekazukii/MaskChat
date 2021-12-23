import styled from 'styled-components';
import Conversation from './Conversation';
import Navbar from './Navbar';
import SendMessageStyle from './SendMessageStyle';

const StyledContainer = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #1e1e1f;
`;

const StyledFlexC = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Main() {
  return (
    <StyledContainer>
      <Navbar />
      <StyledFlexC>
        <Conversation />
        <SendMessageStyle />
      </StyledFlexC>
    </StyledContainer>
  );
}
