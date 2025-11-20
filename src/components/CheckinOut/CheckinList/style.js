import styled, { keyframes } from "styled-components";

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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
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

export const CheckinListWrapper = styled.div`
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
  position: relative;

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
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #5b7aff, #af6cff);
      }
    }

    &.customer-list__empty {
      align-items: center;
      flex-direction: row !important;
      height: 100%;
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

    .status-customer__checkin {
      color: #188038;
      background: linear-gradient(135deg, #e6f4ea 0%, #d4edda 100%);
      padding: 8px 14px;
      border-radius: 12px;
      font-weight: 500;
      box-shadow: 0 2px 6px rgba(24, 128, 56, 0.2);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 10px rgba(24, 128, 56, 0.3);
      }
    }

    .status-customer__checkout {
      color: #ff9b34;
      background: linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%);
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 500;
      box-shadow: 0 2px 6px rgba(255, 155, 52, 0.2);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 10px rgba(255, 155, 52, 0.3);
      }
    }
  }

  .customer-name {
    font-weight: 600;
    color: #333;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
      color: #4b6aff;
    }
  }

  .customer-cccd {
    font-size: 0.9rem;
    color: #555;
    transition: all 0.3s ease;
  }

  .customer-checkin {
    font-size: 0.85rem;
    color: rgb(161, 75, 232);
    margin-top: 2px;
    transition: all 0.3s ease;
  }

  @media (max-width: 1600px) {
    .list-title {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 1024px) {
    min-height: 400px;

    .list-title {
      font-size: 1.2rem;
    }

    .customer-list {
      flex: 1;
    }
  }
`;

