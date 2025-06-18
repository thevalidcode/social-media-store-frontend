"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp } from "lucide-react";

export default function Statistics() {
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Monthly Statistics
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 xl:grid-cols-5"></div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Transactions
          </h2>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Transaction ID
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#3210</TableCell>
                  <TableCell>Olivia Martin</TableCell>
                  <TableCell>$42.25</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="hidden md:table-cell">
                    txn_123abc456def
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      Success
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3209</TableCell>
                  <TableCell>Ava Johnson</TableCell>
                  <TableCell>$175.00</TableCell>
                  <TableCell>PayPal</TableCell>
                  <TableCell className="hidden md:table-cell">
                    txn_789ghi012jkl
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      Success
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">2023-06-24</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3208</TableCell>
                  <TableCell>Liam Williams</TableCell>
                  <TableCell>$89.99</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="hidden md:table-cell">
                    txn_345mno678pqr
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-yellow-600 border-yellow-600"
                    >
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">2023-06-25</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3207</TableCell>
                  <TableCell>Noah Brown</TableCell>
                  <TableCell>$299.99</TableCell>
                  <TableCell>Bank Transfer</TableCell>
                  <TableCell className="hidden md:table-cell">
                    txn_901stu234vwx
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-600"
                    >
                      Failed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">2023-06-26</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3206</TableCell>
                  <TableCell>Emma Jones</TableCell>
                  <TableCell>$120.50</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="hidden md:table-cell">
                    txn_567yza890bcd
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      Success
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">2023-06-27</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
