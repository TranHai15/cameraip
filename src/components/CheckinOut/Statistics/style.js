import styled from "styled-components";

export const StatisticsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 1.5rem;
  width: 100%;
  min-height: 90px;
  justify-content: center;

  .stat-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    border-radius: 20px;
    padding: 16px 24px;
    color: white;
    font-weight: 700;
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: visible;
    min-height: 90px;

    .stat-label {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 8px;
    }

    .stat-label__icon {
      font-size: 1.5rem;
      background: rgba(255, 255, 255, 0.3);
      padding: 12px;
      border-radius: 12px;
      margin-right: 12px;
      backdrop-filter: blur(10px);
    }

    .blur-icon {
      position: absolute;
      right: 10px;
      font-size: 5rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.3;
    }
  }

  .stat-card-checkin {
    background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
  }

  .stat-card-checkout {
    background: linear-gradient(135deg, #4b6aff 0%, #7c4dff 100%);
  }

  .stat-card .stat-label {
    font-size: 1.2rem;
    font-weight: 500;
    opacity: 0.85;
  }

  .stat-card .stat-count {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
    padding: 0;
    display: block;
    width: 100%;
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
