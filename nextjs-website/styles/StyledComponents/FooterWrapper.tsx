import { primaryColors } from "@/themes/_muiPalette";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";

export const FooterWrap = styled(Box)`
  
  .footer-container {background-image: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)); color: ${primaryColors?.primary}; padding: 25px 0; /*position: fixed; width: 100%; bottom: 0; left: 0;*/ position: relative; z-index: 9;
    @media (max-width: 900px) {
        text-align: center; 
        position: relative;
                   
                
    }  
    .MuiGrid-container { align-items: center;}

    }

    .social-list {
        ul {
            display: flex;
            justify-content: center;

            li {
                padding: 0 14px;
                @media (max-width: 900px) {
                    padding: 0 8px;                            
                            
                } 

                a {
                    opacity: 1;
                    transition: ease-in-out 0.5s;

                    &:hover {
                        opacity: 0.7;
                        transition: ease-in-out 0.5s;
                    }
                }
            }
        }
    }


     .link-list {
        ul {
            display: flex;
            justify-content: flex-end;

            @media (max-width: 900px) {
                justify-content: center;                
                
            }  

            li {
                padding: 0 10px;
                line-height: 100%;
                border-right: 1px solid  ${primaryColors?.primary};
                &:last-child {border-right: 0; padding-right: 0;}
                &:first-child {padding-left: 0;}

                a {
                    color: ${primaryColors?.primary};
                    transition: ease-in-out 0.5s;

                    &:hover {
                         color: ${primaryColors?.white};
                        transition: ease-in-out 0.5s;
                    }
                }
            }
        }
    }

 
`
