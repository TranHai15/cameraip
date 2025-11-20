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

const errorPulse = keyframes`
  0% {
    box-shadow: 0 0 20px 8px rgba(255, 87, 34, 0.6);
  }
  50% {
    box-shadow: 0 0 30px 12px rgba(255, 87, 34, 0.8);
  }
  100% {
    box-shadow: 0 0 20px 8px rgba(255, 87, 34, 0.6);
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
        border: 6px solid #00c853 !important;
        box-shadow: 0 0 30px 15px rgba(0, 200, 83, 0.8) !important;
        animation: ${successPulse} 1.5s ease infinite;
        transform: scale(1.02);
      }

      &::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 3px solid #00c853;
        border-radius: 50%;
        animation: ${successPulse} 1.5s ease infinite;
        z-index: 1;
      }

      &::after {
        content: "✓";
        position: absolute;
        top: -12px;
        right: -12px;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #00c853, #00e676);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: bold;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0, 200, 83, 0.6);
        z-index: 10;
        animation: ${successPulse} 1.5s ease infinite;
      }

      .success-label {
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #00c853, #00e676);
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0, 200, 83, 0.4);
        z-index: 10;
      }
    }

    &.error {
      .captured-avatar {
        border: 6px solid #ff5722 !important;
        box-shadow: 0 0 30px 15px rgba(255, 87, 34, 0.8) !important;
        animation: ${errorPulse} 1.5s ease infinite;
      }

      &::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 3px solid #ff5722;
        border-radius: 50%;
        animation: ${errorPulse} 1.5s ease infinite;
        z-index: 1;
      }

      &::after {
        content: "✗";
        position: absolute;
        top: -12px;
        right: -12px;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #ff5722, #ff7043);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: bold;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(255, 87, 34, 0.6);
        z-index: 10;
        animation: ${errorPulse} 1.5s ease infinite;
      }

      .error-label {
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff5722, #ff7043);
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
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

