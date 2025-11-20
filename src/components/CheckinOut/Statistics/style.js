import styled from "styled-components";

export const StatisticsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 1.5rem;
  width: 100%;
  justify-content: center;

  .stat-card {
    flex: 1;
    border-radius: 16px;
    padding: 16px 20px;
    color: white;
    font-weight: 700;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    position: relative;

    .stat-label__icon {
      font-size: 1.5rem;
      background: rgba(255, 255, 255, 0.3);
      padding: 10px;
      border-radius: 10px;
      margin-right: 10px;
    }

    .blur-icon {
      position: absolute;
      right: 10px;
      font-size: 5rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.5;
    }
  }

  .stat-card-checkin {
    background: linear-gradient(135deg, #00c853, #00e676);
  }

  .stat-card-checkout {
    background: linear-gradient(135deg, #4b6aff, #7c4dff);
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

  @media (max-width: 1024px) {
    .stat-count {
      font-size: 1.5rem;
    }

    .stat-label {
      font-size: 1rem;
    }
  }
`;

