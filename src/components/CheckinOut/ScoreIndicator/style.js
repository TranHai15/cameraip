import styled from "styled-components";

export const ScoreIndicatorWrapper = styled.div`
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

  p {
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

