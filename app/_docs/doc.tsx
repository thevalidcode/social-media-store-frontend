import { BoxIcon, DollarSignIcon, ShoppingCartIcon, XIcon } from "lucide-react";

export const sortBy = [
  { value: "default", label: "sort by default" },
  { value: "alphabetical", label: "sort by alphabetical" },
  { value: "id", label: "sort by id" },
  { value: "date", label: "sort by date" },
];

// Service categories array. Each category contains a title and an array of services.
export const serviceCategories = [
  {
    // Category title for the select dropdown
    title: "YouTube Comments [GEO]",
    // Array of service objects for this category
    services: [
      {
        id: 1181, // Unique service ID
        name: "YouTube Custom Comments [Japan]", // Service name with region
        pricePer1000: 201.6, // Price per 1000 units
        min: 10, // Minimum order quantity
        max: 250, // Maximum order quantity
        description: "Custom YouTube comments from Japan.", // Service description
      },
      {
        id: 1182,
        name: "YouTube Custom Comments [South-Korea]",
        pricePer1000: 190.512,
        min: 10,
        max: 85,
        description: "Custom YouTube comments from South Korea.",
      },
      {
        id: 1183,
        name: "YouTube Custom Comments [USA] [S2]",
        pricePer1000: 218.4,
        min: 10,
        max: 2000,
        description: "Custom YouTube comments from USA.",
      },
    ],
  },
  {
    title: "Instagram Followers [GEO]",
    services: [
      {
        id: 2101,
        name: "Instagram Followers [USA]",
        pricePer1000: 15.99,
        min: 50,
        max: 5000,
        description: "Real Instagram followers from the USA.",
      },
      {
        id: 2102,
        name: "Instagram Followers [India]",
        pricePer1000: 7.49,
        min: 100,
        max: 10000,
        description: "Real Instagram followers from India.",
      },
      {
        id: 2103,
        name: "Instagram Followers [Brazil]",
        pricePer1000: 9.99,
        min: 100,
        max: 8000,
        description: "Real Instagram followers from Brazil.",
      },
    ],
  },
  {
    title: "TikTok Likes [GEO]",
    services: [
      {
        id: 3101,
        name: "TikTok Likes [USA]",
        pricePer1000: 12.5,
        min: 20,
        max: 3000,
        description: "High-quality TikTok likes from the USA.",
      },
      {
        id: 3102,
        name: "TikTok Likes [UK]",
        pricePer1000: 11.0,
        min: 20,
        max: 2500,
        description: "High-quality TikTok likes from the UK.",
      },
      {
        id: 3103,
        name: "TikTok Likes [Germany]",
        pricePer1000: 10.5,
        min: 20,
        max: 2000,
        description: "High-quality TikTok likes from Germany.",
      },
    ],
  },
  {
    title: "Twitter Followers [GEO]",
    services: [
      {
        id: 4101,
        name: "Twitter Followers [USA]",
        pricePer1000: 19.99,
        min: 50,
        max: 4000,
        description: "Genuine Twitter followers from the USA.",
      },
      {
        id: 4102,
        name: "Twitter Followers [Canada]",
        pricePer1000: 18.5,
        min: 50,
        max: 3500,
        description: "Genuine Twitter followers from Canada.",
      },
      {
        id: 4103,
        name: "Twitter Followers [Australia]",
        pricePer1000: 20.0,
        min: 50,
        max: 3000,
        description: "Genuine Twitter followers from Australia.",
      },
    ],
  },
  // ... Add more categories as needed
];

export const services = [
  {
    title: "Instagram Followers",
    icon: "👥",
    description: "Get real Instagram followers to boost your social presence",
    geo: {
      US: { price: 9.99, delivery: "24-48h" },
      UK: { price: 8.99, delivery: "24-48h" },
      EU: { price: 7.99, delivery: "24-48h" },
      ASIA: { price: 6.99, delivery: "24-48h" },
    },
  },
  {
    title: "Instagram Likes",
    icon: "❤️",
    description: "Increase engagement with authentic Instagram likes",
    geo: {
      US: { price: 4.99, delivery: "1-2h" },
      UK: { price: 4.49, delivery: "1-2h" },
      EU: { price: 3.99, delivery: "1-2h" },
      ASIA: { price: 3.49, delivery: "1-2h" },
    },
  },
  {
    title: "YouTube Comments",
    icon: "💬",
    description: "Get meaningful comments on your YouTube videos",
    geo: {
      US: { price: 12.99, delivery: "12-24h" },
      UK: { price: 11.99, delivery: "12-24h" },
      EU: { price: 10.99, delivery: "12-24h" },
      ASIA: { price: 9.99, delivery: "12-24h" },
    },
  },
];

export const metrics = [
  {
    icon: <ShoppingCartIcon />,
    label: "Your Orders",
    value: 0,
  },
  {
    icon: <XIcon />,
    label: "Failed Orders",
    value: 0,
  },
  {
    icon: <BoxIcon />,
    label: "Panel Orders",
    value: 61748,
  },
  {
    icon: <DollarSignIcon />,
    label: "You've Spent",
    value: "$0",
  },
];
