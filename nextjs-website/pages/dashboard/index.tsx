/* eslint-disable react/no-array-index-key */
import DashboardWrapper from "@/layout/DashboardWrapper/DashboardWrapper";
import { primaryColors } from "@/themes/_muiPalette";
import FileIcon1 from "@/ui/Icons/FileIcon1";
import FileIcon2 from "@/ui/Icons/FileIcon2";
import FileIcon3 from "@/ui/Icons/FileIcon3";
import FileIcon4 from "@/ui/Icons/FileIcon4";
import styled from "@emotion/styled";
import Box, { BoxProps } from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
import React from "react";

export const EachNumberCardWrapper = styled(Box)`
  padding: 20px 20px;
  background: ${primaryColors?.white};
  border-radius: 10px;
  .card_content {
    h2 {
      font-family: "Montserrat";
      font-weight: 600;
      font-size: 40px;
      line-height: 1;
      margin-bottom: 10px;
      color: ${primaryColors?.color060606};
    }
  }
  .card_icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    padding-left: 20px;
    &::after {
      content: "";
      width: 43px;
      height: 43px;
      background-color: ${primaryColors?.colorF6EFF8};
      border-radius: 100%;
      position: absolute;
      left: 0;
      top: 2px;
      z-index: -1;
    }
    i {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
export const HomeWrapper = styled(Box)``;
interface cardProps extends BoxProps {
  value: number;
  description: string;
  icon: React.ReactNode;
}

const EachNumberCard: React.FC<cardProps & BoxProps> = ({
  value,
  description,
  icon,
  ...props
}) => {
  return (
    <EachNumberCardWrapper {...props}>
      <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
        <Box className="card_content">
          <Typography variant="h2">{value}</Typography>
          <Typography>{description}</Typography>
        </Box>
        <Box className="card_icon">
          <Typography component="i">{icon}</Typography>
        </Box>
      </Stack>
    </EachNumberCardWrapper>
  );
};

const Index = () => {
  const cardList = [
    {
      value: 200,
      description: "Requests in Queue",
      icon: <FileIcon1 />
    },
    {
      value: 200,
      description: "Total Requests",
      icon: <FileIcon2 />
    },
    {
      value: 200,
      description: "Total Accepted Requests",
      icon: <FileIcon3 />
    },
    {
      value: 200,
      description: "Total Rejected Requests",
      icon: <FileIcon4 />
    }
  ];
  return (
    <DashboardWrapper headerTitle="Dashboard">
      <HomeWrapper>
        <Grid container spacing={3}>
          {cardList?.map((data, index) => (
            <Grid item xl={3} lg={4} md={6} xs={12} key={index}>
              <EachNumberCard {...data} />
            </Grid>
          ))}
        </Grid>
      </HomeWrapper>
    </DashboardWrapper>
  );
};

export default Index;
