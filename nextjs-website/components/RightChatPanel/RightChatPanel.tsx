import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import assests from "@/json/assest";

export default function RightChatPanel({ sliderData = [] }: { sliderData?: any[] }) {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    centerMode: true,
    slidesToShow: 3,
    focusOnSelect: true,
    infinite: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div className="right">
      <div className="list-top">
        <div className="list-name">Cars for Buy</div>
      </div>

      <div className="list-pic">
        <div className="sliderWrapper">
          <Slider ref={sliderRef} {...settings}>
            {sliderData?.map((item, index) => (
              <div className="slide" key={index}>
                <div className="imageWrapper">
                  <Image
                    src={item.image_url || assests?.felpicon }
                    alt={item.name}
                    width={400}
                    height={500}
                    className="image"
                  />
                </div>
                <div className="txt">
                  <h4>{item.name}</h4>
                  <p>{item.description_of_attributes}</p>
                  {item.domain_url && (
                    <Link href={item.domain_url} target="_blank" rel="noopener noreferrer">
                      Read More
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
