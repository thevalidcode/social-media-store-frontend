import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import FeaturesCard from "./services-card";
import {
  Boxes,
  Globe,
  LineChart,
  MapPin,
  Percent,
  Receipt,
  Users,
} from "lucide-react";

// Service features data with icons and color schemes
const features = [
  {
    title: "Multiple Locations",
    icon: <MapPin />,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Manage Inventories",
    icon: <Boxes />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Analytics",
    icon: <LineChart />,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Staff Accounts",
    icon: <Users />,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Invoice/Receipt",
    icon: <Receipt />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Run Discounts",
    icon: <Percent />,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Business Website",
    icon: <Globe />,
    color: "bg-green-100 text-green-600",
  },
];

function CardsCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
    rtl: false,
    swipeToSlide: false,
    touchMove: false,
    responsive: [
      {
        breakpoint: 1400, // Large screens
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          speed: 3000,
          autoplaySpeed: 0,
          cssEase: "linear",
          dots: false,
          arrows: false,
          pauseOnHover: false,
          swipeToSlide: false,
          touchMove: false,
        },
      },
      {
        breakpoint: 1024, // Medium screens
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          speed: 3000,
          autoplaySpeed: 0,
          cssEase: "linear",
          dots: false,
          arrows: false,
          pauseOnHover: false,
          swipeToSlide: false,
          touchMove: false,
        },
      },
      {
        breakpoint: 768, // Small tablets
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          speed: 3000,
          autoplaySpeed: 0,
          cssEase: "linear",
          dots: false,
          arrows: false,
          pauseOnHover: false,
          swipeToSlide: false,
          touchMove: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          speed: 3000,
          autoplaySpeed: 0,
          cssEase: "linear",
          dots: false,
          arrows: false,
          pauseOnHover: false,
          swipeToSlide: false,
          touchMove: false,
        },
      },
      {
        breakpoint: 480, // Mobile portrait
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          speed: 3000,
          autoplaySpeed: 0,
          cssEase: "linear",
          dots: false,
          arrows: false,
          pauseOnHover: false,
          swipeToSlide: false,
          touchMove: false,
        },
      },
    ],
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Left gradient overlay for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

      {/* Right gradient overlay for smooth fade effect */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Slider container with optimized padding */}
      <div className="slider-container py-6 px-4">
        <Slider {...settings}>
          {features.map((feature, index) => (
            <FeaturesCard
              key={index}
              title={feature.title}
              icon={feature.icon}
              color={feature.color}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default CardsCarousel;
