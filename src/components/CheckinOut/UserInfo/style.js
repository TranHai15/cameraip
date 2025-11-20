import styled from "styled-components";

export const UserInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f4f7fb;
  padding: 10px;
  gap: 0.5rem;
  border-radius: 12px;
  justify-content: center;
  min-height: 200px;

  .greeting-name {
    font-size: 1.6rem;
    font-weight: 400;
    color: #333;
  }

  .greeting-cccd,
  .greeting-checkin {
    font-size: 1rem;
    color: #555;
    margin-left: 2px;
  }

  .greeting-checkin {
    .anticon,
    .checkin-time {
      color: rgb(161, 75, 232);
    }
  }
`;

