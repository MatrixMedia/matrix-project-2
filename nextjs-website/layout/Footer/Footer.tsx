/* eslint-disable react/no-array-index-key */
import assests from "@/json/assest";
import { FooterWrap } from "@/styles/StyledComponents/FooterWrapper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "next/link";


const Footer = () => {

  return (
    <FooterWrap>
      <div className="footer-container">
        <Container className="full-container">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <div className="copy-txt">© 2025 FinderGroup. All rights reserved. </div>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <div className="social-list">
                <ul>
                  <li><Link href="#"><Image src={assests?.instagram} width={16} height={16} alt="instagram" /></Link></li>
                  <li><Link href="#"><Image src={assests?.linkedin} width={16} height={16} alt="linkedin" /></Link></li>
                  <li><Link href="#"><Image src={assests?.xhandle} width={16} height={16} alt="x" /></Link></li>
                  <li><Link href="#"><Image src={assests?.youtube} width={22} height={16} alt="youtube" /></Link></li>
                  <li><Link href="#"><Image src={assests?.facebook} width={10} height={16} alt="facebook" /></Link></li>
                </ul>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <div className="link-list">
                <ul>
                  <li><Link href="#">Privacy Policy</Link></li>
                  <li><Link href="#">Terms of Use</Link></li>
                </ul>
              </div>
            </Grid>

          </Grid>
        </Container>
      </div>
    </FooterWrap>
  );
};

export default Footer;
