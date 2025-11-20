import styled from "styled-components";

export const CardImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .card-avatar {
    border: 4px solid #fff;
    box-shadow: 0 0 20px 5px rgba(173, 216, 230, 0.6);
  }

  p {
    font-size: 0.8rem;
    font-weight: 500;
    background: #e7f4ff;
    color: #2e7be6;
    border-radius: 20px;
    padding: 6px 12px;
  }
`;

