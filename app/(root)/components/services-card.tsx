import { motion } from "framer-motion";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturesProps {
  icon: React.ReactNode;
  title: string;
  color: string;
}

export default function FeaturesCard({ icon, title, color }: FeaturesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.random() * 0.2 }}
      whileHover={{ scale: 1.05 }}
      className="m-2"
    >
      <Card className="rounded-full shadow-none">
        <CardContent className="flex flex-row items-center justify-start w-full max-w-fit h-[16px] py-1">
          <div className={`p-1.5 rounded-full ${color}`}>{icon}</div>
          <span className="font-semibold ml-2 text-xs whitespace-nowrap">
            {title}
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
