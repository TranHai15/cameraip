import styled, { keyframes } from "styled-components";

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const CardImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: ${scaleIn} 0.5s ease-out;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .card-avatar {
    border: 4px solid #fff;
    box-shadow: 0 0 20px 5px rgba(173, 216, 230, 0.6);
    transition: all 0.3s ease;
    animation: ${float} 3s ease-in-out infinite;

    &:hover {
      box-shadow: 0 0 30px 10px rgba(173, 216, 230, 0.8);
      transform: scale(1.05);
    }
  }

  p {
    font-size: 0.8rem;
    font-weight: 500;
    background: linear-gradient(135deg, #e7f4ff 0%, #d0e8ff 100%);
    color: #2e7be6;
    border-radius: 20px;
    padding: 8px 16px;
    box-shadow: 0 2px 8px rgba(46, 123, 230, 0.2);
    animation: ${fadeIn} 0.5s ease-out 0.3s both;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(46, 123, 230, 0.3);
    }
  }
`;

