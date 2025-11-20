import styled from "styled-components";

export const StatusMessageWrapper = styled.h1`
  background: #00c853;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 10px 24px;
  width: 95%;
  text-align: center;
  margin-left: 5px;
  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;

  .anticon {
    font-size: 1.5rem;
  }

  &.error {
    background: #ff9b34;
  }
`;

