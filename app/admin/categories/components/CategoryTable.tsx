"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Category, CategoryStatus } from "@/types";
import Image from "next/image";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDeleteSingle: (id: number) => void;
  onToggleStatus: (categoryId: number, newStatus: CategoryStatus) => void;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDeleteSingle,
  onToggleStatus,
}: CategoryTableProps) {
  const [sortKey, setSortKey] = useState<keyof Category>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: keyof Category) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === "string" && typeof valB === "string")
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    if (typeof valA === "number" && typeof valB === "number")
      return sortAsc ? valA - valB : valB - valA;
    return 0;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table className="w-full min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-1">
                Name <ArrowUpDown className="w-3 h-3" />
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-1">
                Status <ArrowUpDown className="w-3 h-3" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {sortedCategories.map((category) => (
              <motion.tr
                key={category.storeScopedId}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-border"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      {category.icon ? (
                        <Image
                          src={category.icon}
                          alt={category.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-xs">📁</div>
                      )}
                    </div>
                    <span>{category.name}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {category.description || "No description"}
                  </span>
                </TableCell>

                <TableCell>
                  <Switch
                    checked={category.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      onToggleStatus(
                        category.storeScopedId,
                        checked ? "ACTIVE" : "DISABLED"
                      )
                    }
                  />
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    type="button"
                    variant="destructive"
                    onClick={() => onDeleteSingle(category.storeScopedId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
