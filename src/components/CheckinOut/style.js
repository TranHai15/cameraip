import styled, { keyframes } from "styled-components";

// ============================================
// ANIMATIONS
// ============================================
const smoothBlink = keyframes`
  0%, 40%, 80%, 100% { opacity: 1; }
  20%, 60% { opacity: 0; }
`;

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

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
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

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
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

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(75, 106, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(75, 106, 255, 0.8);
  }
`;

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: linear-gradient(135deg, #f4f7fb 0%, #e8f0f8 100%);
  font-family: "Inter", sans-serif;
  column-gap: 1.5rem;
  padding: 1.5rem;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 50%,
        rgba(75, 106, 255, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(159, 92, 255, 0.05) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .score {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    min-width: 70px;
    .score-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(90deg, rgb(75, 106, 255), rgb(159, 92, 255));
      display: flex;
      justify-content: center;
      align-items: center;
      .anticon {
        color: #fff;
        font-size: 1.5rem;
      }
    }
  }

  .card,
  .card-liveview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    animation: ${scaleIn} 0.5s ease-out;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    p {
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.3s ease;
      animation: ${fadeIn} 0.5s ease-out 0.3s both;
    }
  }

  .card {
    .ant-avatar {
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
      background: linear-gradient(135deg, #e7f4ff 0%, #d0e8ff 100%);
      color: #2e7be6;
      border-radius: 20px;
      padding: 8px 16px;
      box-shadow: 0 2px 8px rgba(46, 123, 230, 0.2);
    }
  }

  .card-liveview {
    .ant-avatar {
      border: 4px solid #fff;
      box-shadow: 0 0 20px 8px rgba(206, 150, 255, 0.6);
      transition: all 0.3s ease;
      animation: ${pulse} 2s ease-in-out infinite;

      &:hover {
        box-shadow: 0 0 30px 12px rgba(206, 150, 255, 0.9);
      }
    }
    #capture-camera {
      border: 4px solid #fff;
      box-shadow: 0 0 20px 8px rgba(206, 150, 255, 0.6);
      transition: all 0.3s ease;
      animation: ${pulse} 2s ease-in-out infinite;

      &:hover {
        box-shadow: 0 0 30px 12px rgba(206, 150, 255, 0.9);
      }
    }
    p {
      background: linear-gradient(135deg, #eedcff 0%, #fde6f8 100%);
      color: #a14be8;
      border-radius: 20px;
      padding: 8px 16px;
      box-shadow: 0 2px 8px rgba(161, 75, 232, 0.2);
    }
  }

  .customer-list__empty {
    align-items: center;
    flex-direction: row !important;
    height: 100%;
  }
  .face-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f4f7fb;
    padding: 10px;
    gap: 0.5rem;
    border-radius: 12px;
    /* flex: 1; */
    justify-content: center;
    min-height: 200px;
  }

  .empty-list {
    background: #00c853;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    padding: 10px 24px;
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }

  .left-panel__top {
    width: 100%;
    min-width: 400px;
    min-height: 730px;
    max-height: 730px;
    height: 730px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    position: relative;
    animation: ${slideInLeft} 0.6s ease-out;
    transition: all 0.3s ease;
    overflow: hidden;
    box-sizing: border-box;

    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4b6aff, #9f5cff);
      background-size: 200% 100%;
      animation: ${gradientShift} 3s ease infinite;
    }
  }

  .spin-container {
    position: absolute;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(5px);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    animation: ${fadeIn} 0.3s ease-out;
    transition: all 0.3s ease;
  }

  .greeting-body {
    min-height: 350px;
    height: 350px;
    min-width: 400px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
    gap: 20px;
    animation: ${fadeIn} 0.8s ease-out 0.2s both;
    width: 100%;
    box-sizing: border-box;
  }

  /* ==== LEFT PANEL ==== */
  .left-panel {
    flex: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  /* Header gradient "Xin chào quý khách" */
  .greeting-title {
    width: 100%;
    height: 90px;
    min-height: 90px;
    max-height: 90px;
    background: linear-gradient(90deg, #4b6aff, #9f5cff);
    background-size: 200% 100%;
    border-radius: 24px 24px 0 0;
    color: #fff;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${gradientShift} 3s ease infinite, ${fadeIn} 0.6s ease-out;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(75, 106, 255, 0.3);
    box-sizing: border-box;
    flex-shrink: 0;

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

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .face-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 10px 0;
    animation: ${scaleIn} 0.6s ease-out 0.4s both;
    position: relative;
    min-width: 300px;
    min-height: 240px;
    height: 240px;
    width: 100%;
    flex-shrink: 0;
  }

  /* Container cho status message */
  .status-message-container {
    width: 100%;
    min-height: 80px;
    height: 80px;
    max-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  /* Container cho user info */
  .user-info-container {
    width: 100%;
    min-height: 120px;
    height: 120px;
    max-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .camera-container {
    position: relative;
    /* width: 180px; */
    /* height: 180px; */

    video,
    img {
      border-radius: 50%;
      /* width: 180px; */
      /* height: 180px; */
      object-fit: cover;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    }
  }

  .border-overlay {
    position: absolute;
    top: 0;
    left: 0;
    /* width: 180px; */
    /* height: 180px; */
    border-radius: 50%;
    pointer-events: none;
  }

  .success-border {
    border: 4px solid #00c853;
    animation: ${smoothBlink} 2s ease forwards;
  }

  .error-border {
    border: 4px solid red;
    animation: ${smoothBlink} 2s ease forwards;
  }

  .avatar-label {
    text-align: center;
    margin-top: 8px;
    font-size: 0.9rem;
    color: #9c27b0;
    font-weight: 500;
  }

  .face-status {
    position: absolute;
    top: -12px;
    right: -12px;
    background: #00c853;
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .greeting-info {
    background: linear-gradient(135deg, #f7f9fe 0%, #ffffff 100%);
    border-radius: 20px;
    padding: 28px 40px;
    text-align: center;
    width: 80%;
    max-width: 480px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    animation: ${fadeIn} 0.6s ease-out 0.5s both;
    transition: all 0.3s ease;
    border: 1px solid rgba(75, 106, 255, 0.1);

    &:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      transform: translateY(-3px);
    }
  }

  .greeting-name {
    font-size: 1.6rem;
    font-weight: 400;
    color: #333;
    /* margin-bottom: 8px; */
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

  .status-checkin {
    background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 16px;
    padding: 14px 28px;
    width: 95%;
    text-align: center;
    margin-left: 5px;
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 200, 83, 0.4);
    animation: ${fadeIn} 0.5s ease-out, ${pulse} 2s ease-in-out infinite;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

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
    }

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 25px rgba(0, 200, 83, 0.5);
    }
  }

  .status-checkin.error {
    background: linear-gradient(135deg, #ff9b34 0%, #ffb74d 100%);
    box-shadow: 0 4px 20px rgba(255, 155, 52, 0.4);
    animation: ${fadeIn} 0.5s ease-out, ${pulse} 1.5s ease-in-out infinite;

    &:hover {
      box-shadow: 0 6px 25px rgba(255, 155, 52, 0.5);
    }
  }

  /* Stats below */
  .stats-row {
    display: flex;
    gap: 20px;
    margin-top: 1.5rem;
    width: 100%;
    justify-content: center;
    animation: ${fadeIn} 0.6s ease-out 0.6s both;
  }

  .stat-card {
    flex: 1;
    border-radius: 20px;
    padding: 20px 24px;
    color: white;
    font-weight: 700;
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    animation: ${scaleIn} 0.5s ease-out;

    &:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
    }

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 70%
      );
      animation: ${pulse} 3s ease-in-out infinite;
    }

    .stat-label__icon {
      font-size: 1.5rem;
      background: rgba(255, 255, 255, 0.3);
      padding: 12px;
      border-radius: 12px;
      margin-right: 12px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      animation: ${float} 3s ease-in-out infinite;

      &:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: scale(1.1);
      }
    }
    .blur-icon {
      position: absolute;
      right: 10px;
      font-size: 5rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.3;
      animation: ${float} 4s ease-in-out infinite;
    }
  }

  .stat-card:nth-child(1) {
    background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
    animation: ${slideInLeft} 0.6s ease-out 0.7s both;

    &:hover {
      box-shadow: 0 10px 35px rgba(0, 200, 83, 0.3);
    }
  }

  .stat-card:nth-child(2) {
    background: linear-gradient(135deg, #4b6aff 0%, #7c4dff 100%);
    animation: ${slideInRight} 0.6s ease-out 0.8s both;

    &:hover {
      box-shadow: 0 10px 35px rgba(75, 106, 255, 0.3);
    }
  }

  .stat-label {
    font-size: 1.2rem;
    font-weight: 500;
    opacity: 0.85;
    display: block;
    margin-bottom: 0.8rem;
  }

  .stat-count {
    font-size: 2.5rem;
  }
  /* ==== RIGHT PANEL ==== */
  .right-panel {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    background: #fff;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    padding-bottom: 24px;
    overflow: hidden;
    animation: ${slideInRight} 0.6s ease-out;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4b6aff, #9f5cff);
      background-size: 200% 100%;
      animation: ${gradientShift} 3s ease infinite;
    }
  }

  .list-title {
    background: linear-gradient(90deg, #4b6aff, #9f5cff);
    background-size: 200% 100%;
    color: #fff;
    font-weight: 700;
    font-size: 2rem;
    border-radius: 24px 24px 0 0;
    padding: 20px 1rem;
    animation: ${gradientShift} 3s ease infinite, ${fadeIn} 0.6s ease-out;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(75, 106, 255, 0.3);

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
  }

  .customer-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    padding-right: 4px;
    padding: 40px 20px;
    animation: ${fadeIn} 0.6s ease-out 0.3s both;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #4b6aff, #9f5cff);
      border-radius: 10px;

      &:hover {
        background: linear-gradient(135deg, #5b7aff, #af6cff);
      }
    }
  }

  .customer-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16px;
    padding: 16px 20px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    animation: ${fadeIn} 0.5s ease-out;
    border: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: linear-gradient(135deg, #4b6aff, #9f5cff);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    &:hover {
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
      transform: translateX(5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);

      &::before {
        transform: scaleY(1);
      }
    }
  }

  .customer-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 16px;
    border: 3px solid #fff;
    box-shadow: 0 0 20px 8px rgba(229, 211, 244, 0.6);
    transition: all 0.3s ease;
    animation: ${scaleIn} 0.4s ease-out;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 25px 10px rgba(229, 211, 244, 0.8);
    }
  }

  .customer-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* padding: 0 20px; */
    .status-customer__checkin {
      color: #188038;
      background-color: #e6f4ea;
      padding: 6px 12px;
      border-radius: 12px;
      font-weight: 500;
    }
    .status-customer__checkout {
      color: #ff9b34;
      background-color: #fff8e1;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }
  }

  .customer-name {
    font-weight: 600;
    color: #333;
    font-size: 1rem;
  }

  .customer-cccd {
    font-size: 0.9rem;
    color: #555;
  }

  .customer-checkin {
    font-size: 0.85rem;
    color: rgb(161, 75, 232);
    margin-top: 2px;
  }

  .customer-status {
    color: #00c853;
    font-weight: 600;
    font-size: 0.9rem;
  }

  /* Responsive */
  @media (max-width: 1600px) {
    .greeting-title,
    .list-title {
      font-size: 1.5rem;
    }
  }
  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto !important;
    .stat-count {
      font-size: 1.5rem;
    }
    .left-panel,
    .right-panel {
      margin: 12px;
      width: auto;
    }

    .greeting-title,
    .list-title {
      font-size: 1.2rem;
    }

    .stat-label {
      font-size: 1rem;
    }

    .customer-list {
      flex: 1;
    }

    .right-panel {
      min-height: 400px;
    }

    .face-wrapper {
      gap: 24px;
    }

    .stats-row {
      /* flex-direction: column; */
      align-items: center;
    }

    .greeting-info {
      width: 100%;
    }
  }
  @media (max-width: 756px) {
    .face-wrapper {
      display: grid;
    }
  }
`;
