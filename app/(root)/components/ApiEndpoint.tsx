"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface ApiEndpointProps {
  title: string;
  description: string;
  method: "POST" | "GET";
  endpoint: string;
  parameters: [string, string][];
  exampleResponse: string;
}

export function ApiEndpoint({
  title,
  description,
  method,
  endpoint,
  parameters,
  exampleResponse,
}: ApiEndpointProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-4 mb-4">
            <span
              className={`text-sm font-bold px-2 py-1 rounded-md ${
                method === "POST" ? "bg-blue-500/80" : "bg-green-500/80"
              } text-white`}
            >
              {method}
            </span>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          <p className="text-muted-foreground mb-6">{description}</p>
          <h4 className="text-lg font-semibold mb-2">Endpoint</h4>
          <code className="text-sm bg-muted p-2 rounded-md block mb-6">
            {endpoint}
          </code>
          <h4 className="text-lg font-semibold mb-2">Parameters</h4>
          <ul className="space-y-2">
            {parameters.map(([param, desc]) => (
              <li key={param}>
                <code className="text-sm bg-muted p-1 rounded-md">{param}</code>
                <span className="text-muted-foreground"> - {desc}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Tabs defaultValue="response">
            <TabsList>
              <TabsTrigger value="response">Example Response</TabsTrigger>
            </TabsList>
            <TabsContent value="response">
              <pre className="rounded-md p-4 overflow-x-auto bg-muted text-foreground text-sm mt-2 h-[400px]">
                {exampleResponse}
              </pre>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
