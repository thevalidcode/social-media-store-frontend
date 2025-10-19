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

interface RecentActivity {
  id: string;
  serviceName: string;
  type: string;
  price: string;
  icon: string;
  category: string;
  date: string;
}

const sampleActivities: RecentActivity[] = [
  {
    id: "11082",
    serviceName: "YouTube Views",
    type: "Default",
    price: "$3.01",
    date: "Jun 9th, 2025",
    icon: "",
    category: "YouTube Views",
  },
  {
    id: "11081",
    serviceName: "YouTube Views [NEW]",
    type: "Default",
    price: "$3.046",
    date: "Jun 9th, 2025",
    icon: "",
    category: "YouTube Views",
  },
  {
    id: "11080",
    serviceName: "YouTube Views [NEW]",
    type: "Default",
    price: "$2.73",
    date: "Jun 9th, 2025",
    icon: "",
    category: "YouTube Views",
  },
  {
    id: "11079",
    serviceName: "YouTube Views [NEW]",
    type: "Default",
    price: "$4.396",
    date: "Jun 9th, 2025",
    icon: "",
    category: "YouTube Views",
  },
  {
    id: "11078",
    serviceName: "YouTube Views [NEW]",
    type: "Default",
    price: "$2.582",
    date: "Jun 7th, 2025",
    icon: "",
    category: "YouTube Views",
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
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Category</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Price</TableHead>
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
                <TableCell className="font-medium">
                  {activity.category}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {activity.type}
                </TableCell>
                <TableCell className="font-medium">{activity.price}</TableCell>
                <TableCell>
                  <Link
                    href={`/client/services/${activity.id}`}
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
