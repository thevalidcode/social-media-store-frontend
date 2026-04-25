"use client";

import { Provider } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FeatureGate } from "@/components/FeatureGate";
import { Network, Pencil, Trash2 } from "lucide-react";

interface ProviderCardListProps {
  providers: Provider[];
  selectedProviders: string[];
  onSelectProvider: (uid: string) => void;
  onEditProvider: (provider: Provider) => void;
  onDeleteProvider: (provider: Provider) => void;
  isSubscriptionActive: boolean;
}

export function ProviderCardList({
  providers,
  selectedProviders,
  onSelectProvider,
  onEditProvider,
  onDeleteProvider,
  isSubscriptionActive,
}: ProviderCardListProps) {
  return (
    <div className="grid gap-4">
      {providers.map((provider) => {
        const isSelected = selectedProviders.includes(provider.uid);

        return (
          <Card key={provider.uid} className="p-5">
            <div className="flex items-start gap-4">
              <label className="mt-2">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelectProvider(provider.uid)}
                />
              </label>

              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border bg-background">
                {provider.image ? (
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Network className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold">{provider.name}</h3>
                  <Badge variant="outline">#{provider.storeScopedId}</Badge>
                  <Badge variant={provider.sync ? "default" : "secondary"}>
                    {provider.sync ? "Sync enabled" : "Sync disabled"}
                  </Badge>
                </div>

                <p className="truncate text-sm text-muted-foreground">
                  {provider.url}
                </p>

                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                  <p>
                    Sync:{" "}
                    <span className="font-medium text-foreground">
                      {provider.sync ? "Yes" : "No"}
                    </span>
                  </p>
                  <p>
                    Percentage:{" "}
                    <span className="font-medium text-foreground">
                      {provider.sync ? `${provider.percentage || 0}%` : "N/A"}
                    </span>
                  </p>
                  <p>
                    Created:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(provider.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <FeatureGate
                  isAllowed={isSubscriptionActive}
                  featureLabel="Provider Management"
                  variant="tooltip"
                  description="You need an active subscription to manage providers. Please renew your subscription to continue."
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEditProvider(provider)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </FeatureGate>

                <FeatureGate
                  isAllowed={isSubscriptionActive}
                  featureLabel="Provider Management"
                  variant="tooltip"
                  description="You need an active subscription to manage providers. Please renew your subscription to continue."
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDeleteProvider(provider)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </FeatureGate>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
