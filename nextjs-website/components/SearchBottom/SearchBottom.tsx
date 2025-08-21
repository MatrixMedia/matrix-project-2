import { FormControl, MenuItem, Select } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface SearchBottomProps {
  isCollapsed: boolean;
}

const SearchBottom: React.FC<SearchBottomProps> = ({ isCollapsed }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const handleChange = (event:any) => {
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
    <div className="categories-content">
      <div className="item-row">
        <div className="item">
          <Link href="/" className="link-btn">
            FinderShop.Ai
          </Link>
        </div>
        <div className="item">
          <Link href="/" className="link-btn">
            FinderCommunity.Ai
          </Link>
        </div>
        {!isCollapsed && (
          <div className="item">
            <div className="select-box">
              <FormControl>
                <Select
                  value={selectedCategory}
                  onChange={handleChange}
                  autoWidth
                  displayEmpty
                  inputProps={{ "aria-label": "Select Category" }}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBottom;
