/* eslint-disable no-console */
import assests from "@/json/assest";
import { HeaderWrap } from "@/styles/StyledComponents/HeaderWrapper";
import Container from "@mui/material/Container";
import FormControl from '@mui/material/FormControl';
import Grid from "@mui/material/Grid";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Image from "next/image";
import Link from "next/link";
import { SetStateAction, useState } from "react";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = [
        { id: 1, label: 'Categories 1' },
        { id: 2, label: 'Categories 2' }
    ];

    const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <HeaderWrap>
            <div className="header-container">
                <Container className="full-container">
                    <Grid container spacing={2}>
                        <Grid item xs={8} sm={8} md={4} lg={4}>
                            <div className="logo list-logo">
                                <Link href="/">
                                    <div className="robot"><Image src={assests?.robot} width={102} height={102} alt="robot" /></div>
                                    <Image src={assests?.logo} width={70} height={28} alt="logo" />
                                </Link>
                            </div>
                        </Grid>
                        <Grid item xs={4} sm={4} md={8} lg={8}>
                            <div className="header-right">
                                <div className="header-btn">
                                    <FormControl>
                                        <Select
                                            value={selectedCategory}
                                            onChange={handleChange}
                                            autoWidth
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}

                                        >
                                            <MenuItem value="">
                                                <em>Categories</em>
                                            </MenuItem>
                                            {categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Link href="#" className="btn-register">Register Now</Link>
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
                                            <li><Link href="/">Home</Link></li>
                                            <li><Link href="/about">About</Link></li>
                                            <li><Link href="/services">Services</Link></li>
                                            <li><Link href="/contact">Contact</Link></li>

                                        </ul>
                                        <div className="mob-menu">
                                            <Link href="#" className="btn-register">Register Now</Link>
                                            <FormControl>
                                                <Select
                                                    value={selectedCategory}
                                                    onChange={handleChange}
                                                    autoWidth
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}

                                                >
                                                    <MenuItem value="">
                                                        <em>Categories</em>
                                                    </MenuItem>
                                                    {categories.map((category) => (
                                                        <MenuItem key={category.id} value={category.id}>
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
