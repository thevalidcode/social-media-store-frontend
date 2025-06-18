"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RecentActivity {
  id: string;
  serviceName: string;
  description: string;
  price: string;
  status: string;
  date: string;
  serviceUrl: string;
}

const sampleActivities: RecentActivity[] = [
  {
    id: "11082",
    serviceName: "YouTube Views",
    description: "YouTube Views - [ Speed: 10K/...",
    price: "$3.01",
    status: "Default",
    date: "Jun 9th, 2025",
    serviceUrl: "/services/11082",
  },
  {
    id: "11081",
    serviceName: "YouTube Views [NEW]",
    description: "YouTube Views - [ Speed: 20K-...",
    price: "$3.046",
    status: "Default",
    date: "Jun 9th, 2025",
    serviceUrl: "/services/11081",
  },
  {
    id: "11080",
    serviceName: "YouTube Views [NEW]",
    description: "YouTube Views - [ Speed: 1000...",
    price: "$2.73",
    status: "Default",
    date: "Jun 9th, 2025",
    serviceUrl: "/services/11080",
  },
  {
    id: "11079",
    serviceName: "YouTube Views [NEW]",
    description: "YouTube Views - [ Speed: 4K-7...",
    price: "$4.396",
    status: "Default",
    date: "Jun 9th, 2025",
    serviceUrl: "/services/11079",
  },
  {
    id: "11078",
    serviceName: "YouTube Views [NEW]",
    description: "YouTube Views - [ Speed: 50K/...",
    price: "$2.582",
    status: "Default",
    date: "Jun 7th, 2025",
    serviceUrl: "/services/11078",
  },
];

interface RecentActivityProps {
  activities?: RecentActivity[];
}

export default function RecentActivity({
  activities = sampleActivities,
}: RecentActivityProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Recently Added Services</p>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium px-6">ID</TableHead>
              <TableHead className="font-medium">Service Name</TableHead>
              <TableHead className="font-medium">Description</TableHead>
              <TableHead className="font-medium">Price</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Date</TableHead>
              <TableHead className="font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium px-6">
                  {activity.id}
                </TableCell>
                <TableCell className="font-medium">
                  {activity.serviceName}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {activity.description}
                </TableCell>
                <TableCell className="font-medium">{activity.price}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{activity.status}</Badge>
                </TableCell>
                <TableCell>{activity.date}</TableCell>
                <TableCell>
                  <Link
                    href={activity.serviceUrl}
                    className="text-primary hover:underline font-medium"
                  >
                    View Service
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
