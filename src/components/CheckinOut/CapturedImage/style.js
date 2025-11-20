import styled, { keyframes } from "styled-components";

const successPulse = keyframes`
  0% {
    box-shadow: 0 0 20px 8px rgba(0, 200, 83, 0.6);
  }
  50% {
    box-shadow: 0 0 30px 12px rgba(0, 200, 83, 0.8);
  }
  100% {
    box-shadow: 0 0 20px 8px rgba(0, 200, 83, 0.6);
  }
`;

export const CapturedImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .screen-wrapper {
    width: 100%;
    height: 100%;
  }

  .captured-image-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .captured-avatar {
      border: 4px solid #fff;
      box-shadow: 0 0 20px 8px rgba(206, 150, 255, 0.6);
      transition: all 0.3s ease;
    }

    &.success {
      .captured-avatar {
        border: 4px solid #00c853;
        box-shadow: 0 0 20px 8px rgba(0, 200, 83, 0.6);
        animation: ${successPulse} 2s ease infinite;
      }

      &::after {
        content: "✓";
        position: absolute;
        top: -8px;
        right: -8px;
        width: 32px;
        height: 32px;
        background: #00c853;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 10;
      }
    }
  }

  p {
    font-size: 0.8rem;
    font-weight: 500;
    background: linear-gradient(90deg, #eedcff 0%, #fde6f8 100%);
    color: #a14be8;
    border-radius: 20px;
    padding: 6px 12px;
  }
`;

