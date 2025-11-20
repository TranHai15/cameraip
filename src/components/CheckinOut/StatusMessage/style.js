import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
`;

export const StatusMessageWrapper = styled.h1`
  background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 16px;
  padding: 14px 20px;
  width: 90%;
  min-width: 300px;
  min-height: 50px;
  max-width: 100%;
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 200, 83, 0.4);
  animation: ${fadeIn} 0.5s ease-out, ${pulse} 2s ease-in-out infinite;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  flex-wrap: wrap;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }

  .anticon {
    font-size: 1.5rem;
    animation: ${float} 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* Ensure text nodes can wrap */
  & > * {
    word-wrap: break-word;
    word-break: break-word;
  }

  /* Text content styling */
  font-size: 1rem;
  line-height: 1.5;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 25px rgba(0, 200, 83, 0.5);
  }

  &.error {
    background: linear-gradient(135deg, #ff9b34 0%, #ffb74d 100%);
    box-shadow: 0 4px 20px rgba(255, 155, 52, 0.4);
    animation: ${fadeIn} 0.5s ease-out, ${pulse} 1.5s ease-in-out infinite;

    &:hover {
      box-shadow: 0 6px 25px rgba(255, 155, 52, 0.5);
    }
  }
`;
