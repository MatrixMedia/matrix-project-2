import { primaryColors } from "@/themes/_muiPalette";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";

export const ListhWrap = styled(Box)`
  .list-container {
    padding: 120px 0 80px;
    position: relative;
    display: flex;
    gap: 30px;
    height: 100vh;
    z-index: 9;

    @media (max-width: 900px) {
      flex-wrap: wrap;
      padding: 100px 0 50px;
    }
  }
  .left {
    padding: 35px 35px 70px;
    position: relative;
    background-color: ${primaryColors?.black};
    border-radius: 25px;
    border: 1px solid ${primaryColors?.primary};
    width: 40%;

    @media (max-width: 900px) {
      padding: 20px 20px 70px;
      width: 100%;
    }
  }

  .right {
    width: 60%;
    padding: 35px;
    position: relative;
    background-color: ${primaryColors?.black};
    border-radius: 25px;
    border: 1px solid ${primaryColors?.primary};
    overflow: hidden;
    @media (max-width: 900px) {
      padding: 20px;
      width: 100%;
    }

    .list-top {
      display: flex;
      align-items: center;
      gap: 15px;

      @media (max-width: 900px) {
        flex-wrap: wrap;
      }

      .list-name {
        width: 70%;
        font-size: var(--text-lg);
        color: ${primaryColors?.white};
        @media (max-width: 900px) {
          width: 100%;
          order: 2;
        }
      }

      .list-filter {
        width: 30%;
        @media (max-width: 900px) {
          width: 100%;
          order: 1;
        }
      }
    }

    .list-pic {
      margin-top: 30px;
      text-align: center;
      max-height: 100%;
      overflow-y: auto;

      img {
        max-height: 100%;
        width: auto;
      }
    }
  }

  .chat-content {
    max-height: 100%;
    overflow-y: auto;
    padding-right: 15px;

    @media (max-width: 900px) {
      height: 250px;
    }
  }

  .function-btn {
    position: absolute;
    right: 20px;
    bottom: 20px;
    display: flex;
    align-items: center;

    img {
      width: 40px;
    }

    a {
      margin-left: 10px;
      display: block;
    }

    @media (max-width: 900px) {
      a img {
        max-width: 35px;
      }
    }
  }

  .bot-chat {
    padding-left: 30px;
    position: relative;
    margin-bottom: 10px;
    font-size: 18px;
    color: ${primaryColors?.primary};
    @media (max-width: 900px) {
      font-size: 16px;
    }

    .icon {
      position: absolute;
      left: 0;
      top: 0px;
    }

    .bot-name {
      font-weight: 700;
      padding-right: 5px;
      display: inline-block;
    }
  }

  .user-chat {
    padding-left: 30px;
    margin-bottom: 10px;
    font-size: 18px;
    color: ${primaryColors?.white};
    @media (max-width: 900px) {
      font-size: 16px;
    }

    .user-name {
      font-weight: 700;
      padding-right: 5px;
      display: inline-block;
    }
  }

  .link-btn {
    font-size: var(--text-xxl);
    color: ${primaryColors?.white};
    border: 1px solid rgba(13, 221, 149, 0.4);
    border-radius: 10px;
    display: block;
    text-align: center;
    padding: 15px 20px;
    background-color: rgba(0, 0, 0, 0.3);

    &:hover {
      color: ${primaryColors?.primary};
    }

    @media (max-width: 1600px) {
      font-size: var(--text-lg);
    }
  }

  .select-box {
    max-width: 170px;
    text-align: right;
    margin-left: auto;

    .MuiSelect-select {
      border: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 20px;
      font-size: var(--text-lg);
      color: ${primaryColors?.black};
      font-weight: 500;
      border-radius: 0;
      background-color: ${primaryColors?.primary};
      min-height: 25px;
      outline: 0;
      box-shadow: none;
      border-radius: 50px;
    }

    em {
      font-style: normal;
    }

    .MuiSvgIcon-root {
      color: ${primaryColors?.black}!important;
    }

    .MuiOutlinedInput-notchedOutline {
      border-color: ${primaryColors?.transparent};
    }
  }

  .bg-video {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;

    img,
    video {
      width: 100%;
      height: 100vh;
      object-fit: cover;
      object-position: center top;
    }
  }
`;
