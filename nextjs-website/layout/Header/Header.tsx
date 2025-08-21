/* eslint-disable no-console */
import assests from "@/json/assest";
import { HeaderWrap } from "@/styles/StyledComponents/HeaderWrapper";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Image from "next/image";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";

export default function Header({ isCollapse }: any) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  console.log(isCollapse, "isCollapse");

  const categories = [
    { label: "Motors", value: "https://car.motorsfinder.ai/" },
    { label: "Holidays", value: "https://holidaysfinder.ai" },
    { label: "Properties", value: "https://propertiesfinder.ai" },
    { label: "Talents", value: "https://talentsfinder.ai" },
    { label: "Pets", value: "https://petsfinder.ai" },
    { label: "Events", value: "https://eventsfinder.ai" },
    { label: "Businesses", value: "https://businessesfinder.ai" },
    { label: "Restaurant", value: "https://restaurantsfinder.ai" },
    { label: "Products", value: "https://productsfinder.ai" },
    { label: "Services", value: "https://servicesfinder.ai" },
    { label: "FinderShop.Ai", value: "https://findershop.ai" }
  ];
  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    const url = event.target.value as string;
    setSelectedCategory(url);
    localStorage.setItem("category", url);
  };

  useEffect(() => {

    const clearCategoryOnUnload = () => {
      localStorage.removeItem("category");
    };
  
    window.addEventListener("beforeunload", clearCategoryOnUnload);
  
    return () => {
      window.removeEventListener("beforeunload", clearCategoryOnUnload);
    };
  }, []);

  return (
    <HeaderWrap>
      <div className="header-container">
        <Container className="full-container">
          <Grid container spacing={2}>
            <Grid item xs={8} sm={8} md={4} lg={4}>
              <div className="logo list-logo">
                <Link href="/">
                  <div className="robot">
                    <Image
                      src={assests?.robot}
                      width={102}
                      height={102}
                      alt="robot"
                    />
                  </div>
                  <Image
                    src={assests?.logo}
                    width={70}
                    height={28}
                    alt="logo"
                  />
                </Link>
              </div>
            </Grid>
            <Grid item xs={4} sm={4} md={8} lg={8}>
              <div className="header-right">
                <div className="header-btn">
                  {isCollapse && (
                    <FormControl>
                      <Select
                        value={selectedCategory}
                        onChange={handleChange}
                        autoWidth
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="">
                          <em>Categories</em>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.value} value={category.value}>
                            {category.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  <Link href="#" className="btn-register">
                    Register Now
                  </Link>
                </div>
                <div className="burger-container">
                  <div
                    className={`burger ${open ? "open" : ""}`}
                    onClick={() => setOpen(!open)}
                  >
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>

                  <nav className={`menu ${open ? "show" : ""}`}>
                    <ul>
                      <li>
                        <Link href="/">Home</Link>
                      </li>
                      <li>
                        <Link href="/about">About</Link>
                      </li>
                      <li>
                        <Link href="/services">Services</Link>
                      </li>
                      <li>
                        <Link href="/contact">Contact</Link>
                      </li>
                    </ul>
                    <div className="mob-menu">
                      <Link href="#" className="btn-register">
                        Register Now
                      </Link>
                      <FormControl>
                        <Select
                          value={selectedCategory}
                          onChange={handleChange}
                          autoWidth
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="">
                            <em>Categories</em>
                          </MenuItem>
                          {categories.map((category) => (
                            <MenuItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </nav>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </HeaderWrap>
  );
}
