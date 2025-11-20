import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const UserInfoWrapper = styled.div`
  width: 100%;
  min-width: 300px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f4f7fb 0%, #ffffff 100%);
  padding: 24px 20px;
  gap: 1rem;
  border-radius: 20px;
  justify-content: center;
  min-height: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.6s ease-out;
  transition: all 0.3s ease;
  border: 1px solid rgba(75, 106, 255, 0.1);
  overflow: visible;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-3px);
  }

  .greeting-name {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    animation: ${slideIn} 0.6s ease-out 0.2s both;
    text-align: center;
    width: 100%;
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    line-height: 1.3;
    padding: 0 10px;
  }

  .greeting-cccd,
  .greeting-checkin {
    font-size: 1rem;
    color: #555;
    margin-left: 2px;
    animation: ${fadeIn} 0.6s ease-out 0.4s both;
    width: 100%;
    text-align: center;
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    line-height: 1.4;
    padding: 0 10px;
  }

  .greeting-checkin {
    .anticon,
    .checkin-time {
      color: rgb(161, 75, 232);
      transition: all 0.3s ease;
    }

    .anticon {
      animation: pulse 2s ease-in-out infinite;
    }
  }
`;

