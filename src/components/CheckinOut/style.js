import styled, { keyframes } from "styled-components";

const smoothBlink = keyframes`
  0%, 40%, 80%, 100% { opacity: 1; }
  20%, 60% { opacity: 0; }
`;

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: #f4f7fb;
  /* overflow: hidden; */
  font-family: "Inter", sans-serif;
  column-gap: 1.5rem;
  padding:1.5rem;

  .score  {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    min-width: 70px;
    .score-circle {
      width: 60px;
      height: 60px;
      border-radius:50%;
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


  .card ,.card-liveview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    p {
      font-size: 0.8rem;
      font-weight: 500;
      /* padding: 10px; */
    }
  }

  .card {
    .ant-avatar {
      border: 4px solid #fff;
      box-shadow: 0 0 20px 5px rgba(173, 216, 230, 0.6);
    }
    p {
      background: #E7F4FF;
      color: #2E7BE6;
      border-radius: 20px;
      padding: 6px 12px;
    }
  } 

  .card-liveview {
    .ant-avatar {
      border: 4px solid #fff;
      box-shadow: 0 0 20px 8px rgba(206, 150, 255, 0.6);
    }
    #capture-camera {
      border: 4px solid #fff;
      box-shadow: 0 0 20px 8px rgba(206, 150, 255, 0.6); 
    }
    p {
      background: linear-gradient(90deg, #EEDCFF 0%, #FDE6F8 100%); /* tím nhạt -> hồng nhạt */
      color: #A14BE8;
      border-radius: 20px;
      padding: 6px 12px;
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
    margin: 0 auto ;
    text-align: center;
  }

  .left-panel__top {
    width: 100%;
    background: #fff;
    border-radius: 24px ;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    /* margin: 24px; */
    /* padding-bottom: 40px; */
    flex: 1;
    flex-direction: column;
    display: flex;
    position: relative;
    /* padding: 24px 48px; */
  }

  .spin-container {
    position: absolute;
    border-radius: 24px;
    background: rgba(255,255,255,0.7);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .greeting-body {
    min-height: 450px;
    display: flex;
    align-items: center;
    flex: 1;
    flex-direction: column;
    /* justify-content: center; */
    justify-content: space-between;
    padding: 20px;
    gap: 10px;
  }

  /* ==== LEFT PANEL ==== */
  .left-panel {
    flex: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  /* Header gradient “Xin chào quý khách” */
  .greeting-title {
    width: 100%;
    background: linear-gradient(90deg, #4b6aff, #9f5cff);
   border-radius: 24px 24px 0 0;
    color: #fff;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    padding: 16px 0;
   
  }

  .face-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 60px;
    /* margin-bottom: 24px; */
    align-items: center;
    /* padding: 3rem 0; */
  }

  .camera-container {
    position: relative;
    /* width: 180px; */
    /* height: 180px; */

    video, img {
      border-radius: 50%;
      /* width: 180px; */
      /* height: 180px; */
      object-fit: cover;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
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
    background: #f7f9fe;
    border-radius: 16px;
    padding: 24px 36px;
    text-align: center;
    width: 80%;
    max-width: 480px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
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
    .anticon, .checkin-time {
      color: rgb(161, 75, 232);
    }
   
  }

  .status-checkin {
    background: #00c853;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    padding: 10px 24px;
    width: 95%;
    /* margin: 0 auto ; */
    text-align: center;
    margin-left: 5px;
    display: flex;
    justify-content: center;
    gap: 6px;
    align-items: center;
    .anticon {
      font-size: 1.5rem;
    }
  }

  .status-checkin.error {
    background: #ff9b34;
  }

  /* Stats below */
  .stats-row {
    display: flex;
    gap: 20px;
    margin-top: 1.5rem;
    width: 100%;
    justify-content: center;
  }

  .stat-card {
    flex: 1;
    border-radius: 16px;
    padding: 16px 20px;
    /* text-align: center; */
    color: white;
    font-weight: 700;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    position: relative;
    .stat-label__icon {
      font-size: 1.5rem;
      background: rgba(255,255,255,0.3);
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

  .stat-card:nth-child(1) {
    background: linear-gradient(135deg, #00c853, #00e676);
  }

  .stat-card:nth-child(2) {
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
  /* ==== RIGHT PANEL ==== */
  .right-panel {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    /* margin: 24px 24px 24px 0; */
    border-radius: 24px;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    padding-bottom: 24px;
    overflow: hidden;
    
  }

  .list-title {
    background: linear-gradient(90deg, #4b6aff, #9f5cff);
    color: #fff;
    font-weight: 700;
    font-size: 2rem;
    border-radius: 24px 24px 0 0;
    padding: 1rem;
    /* margin-bottom: 20px; */
  }

  .customer-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    padding-right: 4px;
    padding: 40px 20px;
  }

  .customer-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 12px 16px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.09);

    /* &:hover {
      background: #eef2ff;
    } */
  }

  .customer-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 16px;
    /* box-shadow: 0 2px 10px rgba(0,0,0,0.08); */
    border: 2px solid #fff;
    box-shadow: 0 0 20px 8px rgba(229, 211, 244, 0.6)
     /* box-shadow: 0 0 20px 5px rgba(173, 216, 230, 0.6); */
  }

  .customer-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* padding: 0 20px; */
    .status-customer__checkin {
      color: #188038;
      background-color: #E6F4EA;
      padding: 6px 12px;
      border-radius: 12px;
      font-weight: 500;
    }
    .status-customer__checkout {
        color: #ff9b34;
        background-color: #FFF8E1;
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
    .greeting-title ,.list-title {
      font-size:1.5rem;
    }
   }
  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto !important;
    .stat-count {
      font-size: 1.5rem;
    } 
    .left-panel, .right-panel {
      margin: 12px;
      width: auto;
    }

    .greeting-title ,.list-title {
      font-size:1.2rem;
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
