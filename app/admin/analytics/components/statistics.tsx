"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "Jan", sales: 3200 },
  { month: "Feb", sales: 4100 },
  { month: "Mar", sales: 3900 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 5600 },
  { month: "Jun", sales: 6100 },
  { month: "Jul", sales: 5900 },
  { month: "Aug", sales: 7000 },
  { month: "Sep", sales: 6700 },
  { month: "Oct", sales: 7400 },
];

export default function Statistics() {
  return (
    <div className="flex min-h-screen w-full flex-col p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight ">
          Analytics Overview
        </h1>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-sm border border-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25,630</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              New Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,208</div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Successful Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">982</div>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Success Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-gray-500">Stable this month</p>
          </CardContent>
        </Card>
      </div>

      {/* SALES CHART */}
      <Card className="shadow-sm border border-card mb-8">
        <CardHeader>
          <CardTitle className=" text-lg">Monthly Sales Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--accent)" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* TRANSACTIONS TABLE */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4 ">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto border border-muted rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-background">
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: "#3210",
                  user: "Olivia Martin",
                  amount: "$42.25",
                  method: "Credit Card",
                  status: "Success",
                  date: "2023-06-23",
                },
                {
                  id: "#3209",
                  user: "Ava Johnson",
                  amount: "$175.00",
                  method: "PayPal",
                  status: "Success",
                  date: "2023-06-24",
                },
                {
                  id: "#3208",
                  user: "Liam Williams",
                  amount: "$89.99",
                  method: "Credit Card",
                  status: "Pending",
                  date: "2023-06-25",
                },
                {
                  id: "#3207",
                  user: "Noah Brown",
                  amount: "$299.99",
                  method: "Bank Transfer",
                  status: "Failed",
                  date: "2023-06-26",
                },
              ].map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell>{tx.user}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tx.status === "Success"
                          ? "text-green-600 border-green-600"
                          : tx.status === "Pending"
                          ? "text-yellow-600 border-yellow-600"
                          : "text-red-600 border-red-600"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{tx.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
