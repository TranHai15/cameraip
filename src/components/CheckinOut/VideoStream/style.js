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
      box-shadow: 0 0 20px 8px rgba(206, 150, 255, 0.6);
      border: 4px solid #fff;
    }

    .status-overlay {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 8px 12px;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      border-radius: 4px;
      z-index: 10;
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

