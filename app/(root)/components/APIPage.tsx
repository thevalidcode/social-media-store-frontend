"use client";

import React from "react";
import { ApiEndpoint } from "./ApiEndpoint";
import { useAppContext } from "@/context/appContext";

// All example data for API documentation
const servicesValue = [
  {
    service: 1,
    description: "Hello world",
    name: "Tiktok Likes",
    category: "Tiktok",
    rate: 10,
    min: 50,
    max: 5000,
  },
  {
    service: 2,
    description: "Stable Services",
    name: "🚀 Instagram Followers",
    category: "Instagram",
    rate: 8794,
    min: 43,
    max: 1000000,
  },
  {
    service: 3,
    description: "Guarantee: 365 Days Refill",
    name: "Facebook Followers",
    category: "Facebook",
    rate: 5644,
    min: 90,
    max: 600000,
  },
];
const orderValue = {
  order: 4,
  category: "Tiktok",
  service: "Tiktok Likes",
  link: "https://facebook.com",
  quantity: 900,
  price: "9.000",
};
const statusValue = {
  charge: "7712.338",
  status: "Pending",
  start_count: 0,
  remains: 0,
  currency: "USD",
};
const statusesValue = {
  1: {
    charge: "7712.338",
    start_count: 0,
    status: "Pending",
    remains: 0,
    currency: "USD",
  },
  4: {
    charge: "9.000",
    start_count: 0,
    status: "Pending",
    remains: 0,
    currency: "USD",
  },
  99: { error: "Incorrect order ID" },
};
const balanceValue = { balance: 6543.8373, currency: "USD" };

export default function APISection() {
  const { domain } = useAppContext();
  return (
    <div className="relative py-24 bg-background overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            "url(https://www.transparenttextures.com/patterns/cubes.png)",
        }}
      ></div>
      <div className="relative max-w-[80rem] mx-auto p-6">
        {/* API Documentation Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            API Documentation
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            Integrate with our powerful API to automate your social media
            service orders.
          </p>
        </header>

        <ApiEndpoint
          title="API Info"
          description="Basic information about our API."
          method="POST"
          endpoint={`https://${domain}/api/v2`}
          parameters={[["Response Format", "JSON"]]}
          exampleResponse=""
        />

        <ApiEndpoint
          title="Services List"
          description="Retrieve a list of all available services."
          method="POST"
          endpoint={`https://${domain}/api/v2`}
          parameters={[
            ["key", "Your API key"],
            ["action", "services"],
          ]}
          exampleResponse={JSON.stringify(servicesValue, null, 2)}
        />

        <ApiEndpoint
          title="Add Order"
          description="Place a new order for a service."
          method="POST"
          endpoint={`https://${domain}/api/v2`}
          parameters={[
            ["key", "Your API key"],
            ["action", "add"],
            ["service", "Service ID"],
            ["link", "Link to page"],
            ["quantity", "Needed Quantity"],
            ["runs (optional)", "Runs to deliver"],
            ["interval (optional)", "Interval in minutes"],
          ]}
          exampleResponse={JSON.stringify(orderValue, null, 2)}
        />

        <ApiEndpoint
          title="Order Status"
          description="Check the status of a single order."
          method="POST"
          endpoint={`https://${domain}/api/v2`}
          parameters={[
            ["key", "Your API key"],
            ["action", "status"],
            ["order", "Order ID"],
          ]}
          exampleResponse={JSON.stringify(statusValue, null, 2)}
        />

        <ApiEndpoint
          title="Multiple Order Status"
          description="Check the status of multiple orders at once."
          method="POST"
          endpoint={`https://${domain}/api/v2`}
          parameters={[
            ["key", "Your API key"],
            ["action", "status"],
            ["orders", "Order IDs (comma-separated)"],
          ]}
          exampleResponse={JSON.stringify(statusesValue, null, 2)}
        />

        <ApiEndpoint
          title="User Balance"
          description="Check your account balance."
          method="POST"
          endpoint={`https://${domain}/api/v2`}
          parameters={[
            ["key", "Your API key"],
            ["action", "balance"],
          ]}
          exampleResponse={JSON.stringify(balanceValue, null, 2)}
        />
      </div>
    </div>
  );
}
