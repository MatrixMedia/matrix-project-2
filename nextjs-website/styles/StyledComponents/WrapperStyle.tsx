import styled from "@emotion/styled";
import Box from "@mui/material/Box";

export const WrapperStyle = styled(Box)`

  .main_body {
    min-height: calc(100vh - 96px);

  }
  strong,
  b {
    font-weight: 700;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: #00a5d0;
    display: inline-block;
    text-decoration: none;
  }

  a:hover {
    color: #00a5d0;
  }

  a:focus {
    outline: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    padding: 0;
    margin: 0;
    color: var(--color07171E);
  }
  h1 {
    text-transform: capitalize;
    
  }
  p:last-child {
    margin-bottom: 0;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  ul li {
    padding: 0;
    position: relative;
    list-style: none;
  }

  button {
    .MuiTouchRipple-root {
      display: none;
    }
  }

  a,
  button {
    transition: 0.3s all ease-in-out 0s;
    -webkit-transition: 0.3s all ease-in-out 0s;
    -moz-transition: 0.3s all ease-in-out 0s;
  }

  input[type="text"],
  input[type="email"],
  input[type="url"],
  input[type="password"],
  input[type="search"],
  input[type="number"],
  input[type="tel"],
  input[type="range"],
  input[type="date"],
  input[type="month"],
  input[type="week"],
  input[type="time"],
  input[type="datetime"],
  input[type="datetime-local"],
  input[type="color"],
  textarea {
    padding: 5px 10px;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    border: 2px solid #656664;
    border-radius: 0;
  }

  select {
    background: url(/assets/images/down-arrow.svg) right 10px center no-repeat;
    background-size: 20px;
  }

  select[multiple] {
    background: transparent;
  }

  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: pink;
  }

  ::-moz-placeholder {
    /* Firefox 19+ */
    color: pink;
  }

  :-ms-input-placeholder {
    /* IE 10+ */
    color: pink;
  }

  :-moz-placeholder {
    /* Firefox 18- */
    color: pink;
  }

  /* button, */
  input[type="button"],
  input[type="submit"] {
    text-align: center;
    padding: 8px 20px;
    font-size: 18px;
    line-height: 22px;
    font-weight: 400;
    color: #fff;
    background: #51bff0;
    border: 1px solid #51bff0;
    transition: 0.3s all ease-in-out 0s;
    -webkit-transition: 0.3s all ease-in-out 0s;
    -moz-transition: 0.3s all ease-in-out 0s;
    cursor: pointer;
    display: inline-block;
    border-radius: 0;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
  }

  button:hover,
  input[type="button"]:hover,
  input[type="submit"]:hover {
    background-color: #51bff0;
    color: #ffffff;
    outline: none;
    text-decoration: none;
  }

  .MuiButtonBase-root {
    text-transform: none !important;
  }

  



  // ====================================================

  // contact input
  .form_group {
    margin-bottom: 19px;
    label {
      display: block;
      margin-bottom: 11px;
    }
    input[type="text"],
    input[type="email"],
    input[type="url"],
    input[type="password"],
    input[type="search"],
    input[type="number"],
    input[type="tel"],
    input[type="range"],
    input[type="date"],
    input[type="month"],
    input[type="week"],
    input[type="time"],
    input[type="datetime"],
    input[type="datetime-local"],
    input[type="color"],
    textarea {
      width: 100%;
      background: var(--white);
      border: 1px solid var(--colorEBEBEB);
      border-radius: 10px;
      padding: 21.5px 28px;
      font-size: 16px;

      &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: var(--color748992);
        opacity: 1; /* Firefox */
      }

      &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: var(--color748992);
      }

      &::-ms-input-placeholder {
        /* Microsoft Edge */
        color: var(--color748992);
      }
    }
    textarea {
      resize: none;
      height: 140px !important;
      font-family: "Work Sans";
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
    }
  }

  ::-webkit-scrollbar {
    width: 6px;
    background: #f9f9f9;
    border-radius: 44px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
  }

  ::-webkit-scrollbar-thumb {
    width: 6px;
    background: #329691;
    border-radius: 44px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #329691;
  }

  // &::-webkit-scrollbar:vertical {
  //   display: none;
  // }

  .slick-slider {
    width: 100%;
  }

  // validation message
  .MuiFormHelperText-root {
    font-size: 16px !important;
    color: var(--colorff0000) !important;
  }

  .errSpan {
    color: red;
  }

  input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px black inset !important;
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}

  
`
