import styled, { keyframes } from "styled-components";

const successGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px 4px rgba(0, 200, 83, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 6px rgba(0, 200, 83, 0.6);
  }
`;

const errorGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px 4px rgba(255, 87, 34, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 6px rgba(255, 87, 34, 0.6);
  }
`;

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
      border: 3px solid #fff;
      box-shadow: 0 0 15px 4px rgba(206, 150, 255, 0.4);
      transition: all 0.3s ease;
    }

    &.success {
      .captured-avatar {
        border: 3px solid #00c853 !important;
        animation: ${successGlow} 2s ease-in-out infinite;
        box-shadow: 0 0 15px 4px rgba(0, 200, 83, 0.4);
      }

      &::after {
        content: "✓";
        position: absolute;
        top: -8px;
        right: -8px;
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #00c853, #00e676);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0, 200, 83, 0.5);
        z-index: 10;
        animation: ${scaleIn} 0.5s ease-out;
      }
    }

    &.error {
      .captured-avatar {
        border: 3px solid #ff5722 !important;
        animation: ${errorGlow} 2s ease-in-out infinite;
        box-shadow: 0 0 15px 4px rgba(255, 87, 34, 0.4);
      }

      &::after {
        content: "✗";
        position: absolute;
        top: -8px;
        right: -8px;
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #ff5722, #ff7043);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(255, 87, 34, 0.5);
        z-index: 10;
        animation: ${scaleIn} 0.5s ease-out;
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
