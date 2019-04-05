import styled, { css } from 'styled-components';

// https://github.com/jonsuh/hamburgers/blob/master/dist/hamburgers.css  <-- Check if needed.

export const openNav = 'hamburger hamburger--spring is-active';

export const closeNav = 'hamburger hamburger--spring';

export const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  border: 2px solid green;
  top: 0;
  position: sticky;
  width: 100%;

  ul {
    list-style: none;
    border: 2px solid red;
    display: flex;
    width: 40%;
    padding: 0;
    justify-content: flex-end;
    transition-property: width;
    transition-duration: 500ms;
    ${props =>
      props.isActive &&
      css`
        min-width: 40%;
      `}
    li {
      margin-left: 5%;
    }
  }

  button:nth-child(1) {
  }
`;

export const Cart = styled.button``;
