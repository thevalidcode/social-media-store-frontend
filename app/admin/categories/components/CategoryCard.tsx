"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Category, CategoryStatus } from "@/types";
import Image from "next/image";

interface CategoryCardProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDeleteSingle: (id: number) => void;
  onToggleStatus: (categoryId: number, newStatus: CategoryStatus) => void;
}

export default function CategoryCard({
  categories,
  onEdit,
  onDeleteSingle,
  onToggleStatus,
}: CategoryCardProps) {
  return (
    <>
      {categories.map((category) => {
        const { storeScopedId, name, description, status, icon } = category;

        return (
          <motion.div
            key={storeScopedId}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            whileHover={{ scale: 1.01 }}
            className="w-full"
          >
            <Card className="rounded-2xl border border-border/60 shadow-sm bg-card hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                      {icon ? (
                        <Image
                          src={icon}
                          alt={name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-sm">📁</div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-base">{name}</h2>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {description || "No description"}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      onToggleStatus(
                        storeScopedId,
                        checked ? "ACTIVE" : "DISABLED"
                      )
                    }
                  />
                </div>
              </CardHeader>

              <CardContent className="text-sm">
                <div>
                  <span className="block text-muted-foreground text-xs">
                    Description
                  </span>
                  <p className="text-sm line-clamp-2">
                    {description || "No description provided"}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-xl hover:bg-muted/60"
                  onClick={() => onEdit(category)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="rounded-xl"
                  onClick={() => onDeleteSingle(storeScopedId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </>
  );
}
