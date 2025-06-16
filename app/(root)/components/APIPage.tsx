import React from "react";
import { TableSection } from "./APIPageTable";

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
    name: "\uD83D\uDD0B Instagram Followers",
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
const refillValue = { refill: 5 };
const refillsValue = [
  { order: 3, refill: 6 },
  { order: 4, refill: 7 },
  { order: 6, refill: { error: "Incorrect order ID" } },
];
const refillstatusValue = { status: "Pending" };
const refillsstatusValue = [
  { refill: 1, status: "Pending" },
  { refill: 3, status: "Pending" },
  { refill: 8, status: "Pending" },
];
const cancelValue = [
  { order: 9, cancel: { error: "Incorrect order ID" } },
  { order: 2, cancel: 1 },
];
const balanceValue = { balance: 6543.8373, currency: "USD" };

export default function APISection() {
  return (
    <div className="max-w-[80rem] mx-auto p-6 bg-background shadow-lg rounded-lg mt-10">
      {/* API Documentation Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          API Documentation
        </h1>
        <p className="text-muted-foreground text-base">
          Reference for integrating with our social media marketplace API.
        </p>
      </header>
      {/* API Info Table */}
      <TableSection
        title="API Info"
        parameters={[
          ["HTTP Method", "POST"],
          ["API URL", "https://validplug.com.ng/api/v2"],
          ["Response Format", "JSON"],
        ]}
        exampleResponse={""}
      />
      <TableSection
        title="Services List"
        parameters={[
          ["key", "Your API key"],
          ["action", "services"],
        ]}
        exampleResponse={JSON.stringify(servicesValue, null, 2)}
      />
      <TableSection
        title="Add Order"
        parameters={[
          ["key", "Your API key"],
          ["action", "add"],
          ["service", "Service ID"],
          ["link", "Link to page"],
          ["quantity", "Needed Quantity"],
          ["runs(optional)", "Runs to deliver"],
          ["interval(optional)", "Interval in minutes"],
        ]}
        exampleResponse={JSON.stringify(orderValue, null, 2)}
      />
      <TableSection
        title="Order Status"
        parameters={[
          ["key", "Your API key"],
          ["action", "status"],
          ["order", "Order ID"],
        ]}
        exampleResponse={JSON.stringify(statusValue, null, 2)}
      />
      <TableSection
        title="Multiple Order Status"
        parameters={[
          ["key", "Your API key"],
          ["action", "status"],
          ["order", "Order IDs (comma-separated)"],
        ]}
        exampleResponse={JSON.stringify(statusesValue, null, 2)}
      />
      <TableSection
        title="Create Refill"
        parameters={[
          ["key", "Your API key"],
          ["action", "refill"],
          ["order", "Order ID"],
        ]}
        exampleResponse={JSON.stringify(refillValue, null, 2)}
      />
      <TableSection
        title="Create Multiple Refill"
        parameters={[
          ["key", "Your API key"],
          ["action", "refill"],
          ["order", "Order IDs (comma-separated)"],
        ]}
        exampleResponse={JSON.stringify(refillsValue, null, 2)}
      />
      <TableSection
        title="Refill Status"
        parameters={[
          ["key", "Your API key"],
          ["action", "refill_status"],
          ["refill", "Refill ID"],
        ]}
        exampleResponse={JSON.stringify(refillstatusValue, null, 2)}
      />
      <TableSection
        title="Multiple Refill Status"
        parameters={[
          ["key", "Your API key"],
          ["action", "refill_status"],
          ["order", "Refill IDs (comma-separated)"],
        ]}
        exampleResponse={JSON.stringify(refillsstatusValue, null, 2)}
      />
      <TableSection
        title="Create Cancel"
        parameters={[
          ["key", "Your API key"],
          ["action", "cancel"],
          ["orders", "Orders IDs (comma-separated)"],
        ]}
        exampleResponse={JSON.stringify(cancelValue, null, 2)}
      />
      <TableSection
        title="User Balance"
        parameters={[
          ["key", "Your API key"],
          ["action", "balance"],
        ]}
        exampleResponse={JSON.stringify(balanceValue, null, 2)}
      />
    </div>
  );
}
