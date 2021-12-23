import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';

const StyledNav = styled.nav`
  width: auto;
  height: 50px;

  display: flex;
  align-items: center;
`;

const StyledP = styled.p`
  margin: 0;
`;

export default function Navbar() {
  const { account } = useWeb3React();
  return (
    <StyledNav>
      <StyledP>Account : {account}</StyledP>
    </StyledNav>
  );
}
