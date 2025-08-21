import { primaryColors } from "@/themes/_muiPalette";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";

export const HeaderWrap = styled(Box)`
  

  .header-container {padding: 25px 0; background-image: linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,1)); position: fixed; top:0; left:0; width: 100%; z-index: 99;
    @media (max-width: 900px) {
      padding: 15px 0; 
      
      .MuiGrid-container {
        align-items: center;
      }
                
    } 
  
  }
  .logo { text-align: center; width: 102px;
  
    @media (max-width: 900px) {
      width: auto;
      a  
      {width: auto; 
        display: flex;
        align-items: center; 
      }   
      
      .robot {

        width: 50px;
        margin-right: 10px;
      }
                  
    } 
  
  }


  .logo.list-logo {
    width: auto;
    a  
      {width: auto; 
        display: flex;
        align-items: center; 
      }   
      
      .robot {

        width: 60px;
        margin-right: 10px;

        @media (max-width: 900px) {

          width: 50px;

        }

      }

  }


  .burger-container { position: relative;}
  .burger {
  width: 30px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  margin-left: auto;
  justify-content:flex-end;

    @media (max-width: 900px) {
      margin-top: 0px;        
                  
    } 
}

.burger div {
  height: 3px;
  border-radius: 5px;
  background-color: ${primaryColors?.primary};
  transition: 0.3s;
  display:inline-block;
}

.burger div:nth-child(2) {
  width: 25px;
  margin-left: auto;
}
.burger div:nth-child(3) {
  width: 20px;
  margin-left: auto;
}


.burger.open div:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.burger.open div:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.burger.open div:nth-child(2) {
  opacity: 0;
}
.burger.open div:nth-child(3) {
  transform: rotate(-45deg) translate(9px, -10px);
  margin-left: 0;
  width: 30px;
}

.menu {
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  background-color: ${primaryColors?.black};
  border: 1px solid ${primaryColors?.primary};
  width: 300px;
  position: absolute;
  top: 50px;
  right: -500px;
  transition: ease-in-out 0.5s;

  @media (max-width: 900px) {
    right: -350px;        
                  
  }   

  ul {

    li { padding: 10px 0; border-bottom: 1px solid ${primaryColors?.grayDark};
    &:last-child { border-bottom: 0;}
    a {color: ${primaryColors?.white};
    &:hover { color: ${primaryColors?.primary};}
  
      }
    }
  }
}


.menu.show {
  right: 0;
  transition: ease-in-out 0.5s;
}


.header-right {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;

  .header-btn {
    display: flex;
    align-items: center;
    padding-right: 50px;

    @media (max-width: 900px) {
    display: none;        
                  
    } 

    .btn-register {
      border: 1px solid ${primaryColors?.primary};
      color: ${primaryColors?.white};
      background-color: ${primaryColors?.black};
      padding: 10px 20px;
      margin-left: 20px;
      border-radius: 30px;
      display: inline-block;
      &:hover {
        background-color:  ${primaryColors?.primary};

      }
    }

    .MuiSelect-select {
      border: 1px solid ${primaryColors?.primary};
      color: ${primaryColors?.white};
      background-color: ${primaryColors?.black};
      padding: 10px 40px 10px 20px;
      border-radius: 30px;
      &:hover {
        outline: none;
        box-shadow: none;
      }

      em {
        font-style: normal;
      }
      
    }

    .MuiSvgIcon-root {
        color: ${primaryColors?.white};
    }

    .MuiOutlinedInput-notchedOutline {
      border-color: transparent;
    }

  }
  .burger {
    margin-top: 0;
  }
}

.mob-menu {
  border-top: 1px solid #333;
  padding-top: 10px;
  display: none;

  @media (max-width: 900px) {
    display: block;        
                  
  } 

  .btn-register {
      border: 1px solid ${primaryColors?.primary};
      color: ${primaryColors?.white};
      background-color: ${primaryColors?.black};
      padding: 10px 20px;      
      border-radius: 30px;
      display: block;
      text-align: center;
      margin-bottom: 10px;
      &:hover {
        background-color:  ${primaryColors?.primary};

      }
  }

  .MuiFormControl-root {
    width: 100%;
  }

  .MuiSelect-select {
      border: 1px solid ${primaryColors?.primary};
      color: ${primaryColors?.white};
      background-color: ${primaryColors?.black};
      padding: 10px 40px 10px 20px;
      border-radius: 30px;
      
      &:hover {
        outline: none;
        box-shadow: none;
      }

      em {
        font-style: normal;
      }
      
    }

    .MuiSvgIcon-root {
        color: ${primaryColors?.white};
    }


}
 
`
