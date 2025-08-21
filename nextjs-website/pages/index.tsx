/* eslint-disable react/jsx-no-useless-fragment */
import Search from "@/components/Search/Search";
import Wrapper from "@/layout/wrapper/Wrapper";
import { useState } from "react";

export default function Home() {
const [collapse,setCollapse] = useState(false)

  const handleDataFromSearch = (value:any) => {
    setCollapse(value)
  };
  return (
    <Wrapper value={collapse}>

      <Search onValueSend={handleDataFromSearch}  />

    </Wrapper>
  );
}
