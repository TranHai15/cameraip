import styled from 'styled-components';

const mainColor = "#2364C3";

export const LoginWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: auto;
  position: relative;
  background: rgba(230, 238, 255, 0.7);
  
  .header-landing {
    background: ${mainColor};
    color: #FFF;
    padding: 10px 15px;
    height: max-content;
    font-weight: bold;
    font-size: 20px;
    text-transform: uppercase;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 999;
  }
  
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .col-login {
    height: 100vh;
    min-height: 600px;
    
    .main-login {
      width: 100%;
      height: inherit;
      flex-direction: column;
      
      .go-title {
        color: ${mainColor};
        font-weight: bold;
        font-size: 40px;
        margin-bottom: 30px;
      }
      
      .login-input {
        width: 70%;
        
        .row {
          margin-bottom: 25px;
          
          .ant-input {
            height: 50px;
            border-radius: 16px;
            font-size: 18px;
          }
          
          button {
            width: 100%;
            height: 50px;
            border-radius: 16px;
            font-size: 18px;
          }
        }
        
        .row-message {
          color: red;
          min-height: 20px;
          font-size: 14px;
        }
      }
    }
  }
  
  .col-landing {
    height: 100vh;
    
    .main-landing {
      flex-direction: column;
      height: inherit;
      
      .landing-title {
        color: ${mainColor};
        font-size: 32px;
        text-align: center;
        font-weight: bold;
        margin-bottom: 30px;
        width: 90%;
      }
      
      .landing-description {
        text-align: center;
        font-size: 18px;
        color: #666;
        
        p {
          margin: 10px 0;
        }
      }
    }
  }
  
  .footer-login {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-size: 12px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.8);
  }
`;

