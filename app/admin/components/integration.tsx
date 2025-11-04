"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Code2 } from "lucide-react"; // removed unused icons
import { useState } from "react";

import igPng from "@/public/images/ig.jpeg";
import wppPng from "@/public/images/whatsapp.png";

import Image, { StaticImageData } from "next/image"; // needed for StaticImageData

type IntegrationPosition = "left" | "right";

type IntegrationItemType = {
  id: string;
  name: string;
  image?: StaticImageData; // image is optional and StaticImageData
  Icon?: React.ElementType; // Icon is optional
  inputValue: string;
  placeholder: string;
  isTextarea?: boolean;
  showPositionButtons: boolean;
  position?: IntegrationPosition;
};

const initialIntegrationsData: IntegrationItemType[] = [
  {
    id: "whatsapp",
    name: "Whatsapp",
    image: wppPng,
    inputValue: "+2342000000000",
    placeholder: "Whatsapp Number",
    showPositionButtons: true,
    position: "right",
  },
  {
    id: "instagram",
    name: "Instagram",
    image: igPng,
    inputValue: "username",
    placeholder: "Instagram Username",
    showPositionButtons: true,
    position: "right",
  },
  {
    id: "other",
    name: "Other",
    Icon: Code2,
    inputValue: "",
    placeholder: "Enter your other integration code here",
    isTextarea: true,
    showPositionButtons: false,
  },
];

export default function Integration() {
  const [integrations, setIntegrations] = useState<IntegrationItemType[]>(
    initialIntegrationsData
  );

  const handleInputChange = (id: string, value: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inputValue: value } : item
      )
    );
  };

  const handlePositionChange = (
    id: string,
    newPosition: IntegrationPosition
  ) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id && item.showPositionButtons
          ? { ...item, position: newPosition }
          : item
      )
    );
  };

  const handleSave = () => {
    console.log("Saving integrations:", integrations);
  };

  return (
    <div className="bg-background text-foreground">
      <Card className="border-none shadow-none bg-background p-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col h-full"
        >
          <CardHeader className="flex flex-row justify-between items-center px-6 pt-6 pb-2">
            <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight">
              Integrations
            </CardTitle>
            <Button variant="secondary" type="submit" className="px-4 py-2">
              Save
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-2 space-y-4">
            {integrations.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-y-3 sm:gap-x-4 py-2"
              >
                <div className="flex items-center gap-x-3 w-full sm:w-auto flex-shrink-0 mb-2 sm:mb-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted flex-shrink-0">
                    {item.Icon ? (
                      <item.Icon className="w-5 h-5 text-muted-foreground" />
                    ) : item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-5 h-5 object-contain"
                        width={20}
                        height={20}
                      />
                    ) : null}
                  </div>
                  <label
                    htmlFor={item.id}
                    className="w-28 text-sm font-medium text-foreground flex-shrink-0"
                  >
                    {item.name}
                  </label>
                </div>

                <div className="flex flex-grow items-center gap-x-3 w-full">
                  {item.isTextarea ? (
                    <Textarea
                      id={item.id}
                      value={item.inputValue}
                      onChange={(e) =>
                        handleInputChange(item.id, e.target.value)
                      }
                      placeholder={item.placeholder}
                      className="flex-grow bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring min-h-[80px] resize-none rounded-md"
                    />
                  ) : (
                    <Input
                      id={item.id}
                      type="text"
                      value={item.inputValue}
                      onChange={(e) =>
                        handleInputChange(item.id, e.target.value)
                      }
                      placeholder={item.placeholder}
                      className="flex-grow bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring rounded-md"
                    />
                  )}

                  {item.showPositionButtons && item.position && (
                    <div className="flex space-x-1 flex-shrink-0">
                      {(["left", "right"] as IntegrationPosition[]).map(
                        (pos) => (
                          <Button
                            key={pos}
                            variant={
                              item.position === pos ? "secondary" : "outline"
                            }
                            size="sm"
                            type="button"
                            onClick={() => handlePositionChange(item.id, pos)}
                            className="px-3 py-1 rounded-md text-xs"
                          >
                            {pos.charAt(0).toUpperCase() + pos.slice(1)}
                          </Button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
