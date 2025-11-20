import styled from "styled-components";

export const VideoStreamWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .video-container {
    position: relative;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ddd;
    }

    .status-overlay {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.7);
      padding: 8px 12px;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      border-radius: 4px;
      z-index: 10;
      color: #fff;
    }
  }

  p {
    font-size: 0.8rem;
    font-weight: 500;
    background: #f5f5f5;
    color: #666;
    border-radius: 12px;
    padding: 6px 12px;
  }
`;

