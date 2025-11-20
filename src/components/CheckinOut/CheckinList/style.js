import styled from "styled-components";

export const CheckinListWrapper = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding-bottom: 24px;
  overflow: hidden;

  .list-title {
    background: linear-gradient(90deg, #4b6aff, #9f5cff);
    color: #fff;
    font-weight: 700;
    font-size: 2rem;
    border-radius: 24px 24px 0 0;
    padding: 1rem;
  }

  .customer-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    padding-right: 4px;
    padding: 40px 20px;

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
    border-radius: 12px;
    padding: 12px 16px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.09);
  }

  .customer-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 16px;
    border: 2px solid #fff;
    box-shadow: 0 0 20px 8px rgba(229, 211, 244, 0.6);
  }

  .customer-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

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

