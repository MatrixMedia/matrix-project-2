import { primaryColors } from "@/themes/_muiPalette";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";

export const SearchWrap = styled(Box)`
  .chat-content {
    height: 500px;
    overflow-y: auto;
    padding-right: 15px;
  }

  .bot-chat {
    padding-left: 70px;
    min-height: 40px;
    min-height: 40px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    font-size: 21px;
    color: #0DD395;
    line-height: 1.5;
    background: #0D1814;
    padding: 20px;
    border-radius: 20px;
    max-width: 60%;
    @media (max-width: 900px) {
      font-size: 16px;
    }

    .icon {
      position: absolute;
      left: 15px;
      top: 10px;
    }

    .bot-name {
      position: absolute;
      left: 35px;
      top: 16px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid var(--green);
      }
    }
  }

  .user-chat {
    padding-right: 50px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 30px 0 45px;
    font-size: 18px;
    color: ${primaryColors?.white};
    text-align: right;
    position: relative;

    @media (max-width: 900px) {
      font-size: 16px;
    }

    .user-name {
      position: absolute;
      right: 0px;
      top: 0;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid var(--white);
      }
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

  .categories-content {
    position: relative;
    z-index: 9;

    .item-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-left: -25px;
      margin-right: -25px;

      .item {
        padding-left: 25px;
        padding-right: 25px;
        width: 33.33%;

        @media (max-width: 900px) {
          width: 100%;
          margin-bottom: 15px;
        }
      }
    }
  }

  .select-box {
    border: 1px solid rgba(13, 221, 149, 0.4);
    border-radius: 10px;
    display: block;
    text-align: center;
    padding: 0px;
    background-color: rgba(0, 0, 0, 0.3);

    .MuiSelect-select {
      border: 0;
      padding-top: 15px;
      padding-bottom: 15px;
      font-size: var(--text-xxl);
      color: ${primaryColors?.white};
      border-radius: 0;
      background-color: ${primaryColors?.transparent};
      min-height: 25px;
      outline: 0;
      box-shadow: none;

      @media (max-width: 1600px) {
        font-size: var(--text-lg);
      }
    }

    em {
      font-style: normal;
    }

    .MuiSvgIcon-root {
      color: ${primaryColors?.white}!important;
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

  .list-container {
    padding: 120px 0 30px;
    position: relative;
    display: flex;
    transition: all 0.3s ease;
    z-index: 9;
    .collapse {
      position: absolute;
      right: 20px;
      top: 140px;
      z-index: 999;

      @media (max-width: 1600px) {
        top: 120px;
      }

      @media (max-width: 900px) {
        top: 73px;
      }
    }

    @media (max-width: 1199px) {
      flex-wrap: wrap;
      padding: 100px 0 30px;
      max-height: none;
      gap: 30px;
    }
  }
  .left {
    padding: 35px 35px 80px;
    position: relative;
    background-color: #000000c9;
    border-radius: 25px;
    border: 1px solid ${primaryColors?.primary};
    width: 100%;
    transition: all 0.3s ease;

    .search-wrapper {
      padding: 7px 10px;
      background-color: ${primaryColors?.black};
      border: 1px solid ${primaryColors?.primary};
      border-radius: 15px;
      position: absolute;
      left: 35px;
      bottom: 20px;
      width: calc(100% - 70px);
      display: flex;
      align-items: center;

      @media (max-width: 1199px) {
        width: calc(100% - 40px);
        left: 20px;
      }

      .input-box {
        width: calc(100% - 100px);

        input {
          background-color: transparent;
          border: 0;
          width: 100%;
          color: ${primaryColors?.white};
          font-size: 16px;
        }
      }
    }

    @media (max-width: 1199px) {
      padding: 20px 20px 80px;
      width: 100%;
    }
  }

  .right {
    width: 0;
    padding: 0px;
    position: relative;
    background-color: #000000c9;
    border-radius: 25px;
    border: 0px solid ${primaryColors?.primary};
    overflow: hidden;
    transition: all 0.3s ease;
    @media (max-width: 1199px) {
      padding: 0px;
      width: 0;
      height: 0;
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
        height: 250px;
        width: 100%;
        object-fit: cover;
        object-position: center;
        @media (max-width: 767px) {
          height: 150px;
        }
      }
    }

    .select-box {
      max-width: 170px;
      text-align: right;
      margin-left: auto;
      border: 0;

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
  }

  .list-container.collapsed {
    gap: 30px;

    .left {
      width: 40%;

      @media (max-width: 1199px) {
        width: 100%;
      }
    }

    .right {
      width: 60%;
      height: auto;
      padding: 35px;
      border: 1px solid ${primaryColors?.primary};

      @media (max-width: 1199px) {
        width: 100%;
        padding: 20px;
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
    display: flex;
    align-items: center;
    justify-content: flex-end;

    img {
      width: 35px;
    }

    a {
      margin-left: 10px;
      display: block;
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

  .sliderWrapper {
    position: relative;
    padding: 0px 40px;
    max-width: 900px;
    margin: auto;
  }

  .slide {
    padding: 0 10px;
    transition: transform 0.3s ease;
    opacity: 0.5;
    margin: 30px 0;
    min-height: 450px;

    @media (max-width: 767px) {
      min-height: 300px;
    }
  }

  .slick-center .slide {
    position: relative;
    transform: scale(1.5);

    opacity: 1;
    z-index: 9;
  }

  .slick-center .slide img {
    border-radius: 0px;
  }

  .imageWrapper {
    overflow: hidden;
    border-radius: 0px;
    background-color: black;
    img {
      width: 100%;
    }
  }

  .image {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 0px;
  }

  .buttons {
    text-align: center;
    margin-top: 20px;
  }

  .buttons button {
    margin: 0 10px;
    padding: 10px 20px;
  }

  .slick-prev::before,
  .slick-next::before {
    color: ${primaryColors?.primary};
  }

  .slick-prev:hover::before,
  .slick-next:hover::before {
    background-color: transparent;
    color: ${primaryColors?.white};
  }

  .slick-prev:hover,
  .slick-next:hover {
    background-color: transparent;
  }

  .slick-prev,
  .slick-next {
    width: 30px;
    height: 30px;
  }

  .slick-prev::before,
  .slick-next::before {
    font-size: 0px;
    font-family: inherit;
    content: "";
    width: 30px;
    height: 30px;
  }

  .slick-prev,
  .slick-prev:hover {
    left: -40px;
    background: url(/assets/images/arrow-left.svg) no-repeat;
    background-size: 99%;
  }
  .slick-next,
  .slick-next:hover {
    right: -40px;
    background: url(/assets/images/arrow-right.svg) no-repeat;
    background-size: 99%;
  }

  .slide .txt {
    padding: 10px;
    background-color: #222;
    text-align: center;
    h4 {
      font-size: 14px;
      font-weight: 600;
      padding-bottom: 10px;
      color: #fff;
    }

    p {
      font-size: 12px;
      line-height: 1.3;
      font-weight: 400;
      margin-bottom: 10px;
      color: #fff;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 48px;
    }

    a {
      font-size: 12px;
      background-color: ${primaryColors?.primary};
      padding: 5px 10px;
      border-radius: 10px;
      color: ${primaryColors?.white};
      display: inline-block;
    }
  }

  .slick-center .slide .txt {
    h4 {
      font-size: 10px;
    }

    p {
      font-size: 9px;
      margin-bottom: 5px;
      height: 35px;

      @media (max-width: 767px) {
        height: 35px;
        margin-bottom: 8px;
      }
    }

    a {
      font-size: 9px;
      padding: 0 10px;
      border-radius: 5px;
    }
  }

  .outer-container {
    min-height: calc(100vh - 74px);
  }

  .typing-dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    height: 20px;
  }

  .typing-dots span {
    width: 6px;
    height: 6px;
    background-color: #0dd395;
    border-radius: 50%;
    animation: typingBounce 1s infinite ease-in-out;
  }

  .typing-dots span:nth-child(1) {
    animation-delay: 0s;
  }
  .typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typingBounce {
    0%,
    100% {
      transform: translateY(0);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-5px);
      opacity: 1;
    }
  }

  span.user-txt {
    white-space: pre-wrap;

    /* max-width: 60%; */
    word-break: break-all;
    font-size: 20px;
    line-height: 1.5;
  }
  .bot-txt{
    padding-left: 70px;
  }
  span.message-actions {
    position: absolute;
    bottom: -13px;
    display: flex;
    right: 0;
    margin-top: 10px;
    button{
        background: transparent;
        border: 0;
        margin-left: 20px;
    }
}
p.user-message {
    max-width: 60%;
    background: #181818;
    padding: 20px;
  
  border-radius: 20px;
}
`;
