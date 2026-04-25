"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Service } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import Decimal from "decimal.js";
import parse from "html-react-parser";
import { AlertCircle, Star } from "lucide-react";
import {
  useCreateServiceRating,
  useGetServiceRatings,
} from "@/hooks/use-serviceRating";
import type { ServiceRating } from "@/types/models/serviceRating";

interface Props {
  open: boolean;
  onClose: () => void;
  activeService: Service | null;
  modalQty: number;
  setModalQty: React.Dispatch<React.SetStateAction<number>>;
  navigateToNewOrder: (cat: string, id: number) => void;
  onAddToCart?: (service: Service, quantity?: number) => void;
}

const fieldClass = "rounded-xl border border-border bg-muted/40 p-3";

export const ServiceDialog = ({
  open,
  onClose,
  activeService,
  modalQty,
  setModalQty,
  navigateToNewOrder,
  onAddToCart,
}: Props) => {
  const convert = useCurrencyConverter();
  const { userCurrency, userInfo } = useAppContext();

  const [ratingValue, setRatingValue] = useState<number>(5);
  const [ratingReview, setRatingReview] = useState("");
  const [ratingsPage, setRatingsPage] = useState(1);

  const { data: ratingData, isLoading: isRatingsLoading } =
    useGetServiceRatings(
      userInfo ? activeService?.uid : undefined,
      ratingsPage,
      5,
    );
  const createRating = useCreateServiceRating();

  const canSubmitRating =
    Boolean(userInfo?.uid && activeService?.uid) && !createRating.isPending;

  const estimatedCost = useMemo(() => {
    if (!activeService) return "";

    return convert(
      activeService.currency,
      userCurrency,
      new Decimal(activeService.price).div(1000).mul(modalQty).toString(),
      true,
      false,
    ).formatted;
  }, [activeService, convert, modalQty, userCurrency]);

  if (!activeService) return null;

  const totalRatingPages = Math.max(
    1,
    Math.ceil(
      (ratingData?.pagination?.total || 0) /
        (ratingData?.pagination?.limit || 5),
    ),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setRatingsPage(1);
          onClose();
        }
      }}
    >
      <DialogContent className="w-full md:min-w-2xl lg:min-w-4xl max-h-[92vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Service</DialogTitle>
        </DialogHeader>

        <div
          className={`grid grid-cols-1 gap-5 ${
            userInfo ? "lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]" : ""
          }`}
        >
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-4 md:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                  {activeService.icon ? (
                    <img
                      src={activeService.icon}
                      alt={activeService.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-3xl">🧩</div>
                  )}
                </div>

                <div className="min-w-0 space-y-2">
                  <h2 className="text-xl font-semibold leading-tight text-foreground md:text-2xl">
                    {activeService.name}
                  </h2>
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
                    {parse(activeService?.description || "")}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className={fieldClass}>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="mt-1 text-sm font-semibold">
                    {
                      convert(
                        activeService.currency,
                        userCurrency,
                        activeService.price,
                        true,
                        true,
                      ).formatted
                    }{" "}
                    <span className="text-xs text-muted-foreground">/1000</span>
                  </p>
                </div>
                <div className={fieldClass}>
                  <p className="text-xs text-muted-foreground">Min</p>
                  <p className="mt-1 text-sm font-semibold">
                    {activeService.min.toLocaleString()}
                  </p>
                </div>
                <div className={fieldClass}>
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="mt-1 text-sm font-semibold">
                    {activeService.max.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-4">
              <Label htmlFor="modal-qty">Quantity</Label>
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setModalQty((q) =>
                      Math.max(activeService?.min ?? 1, Math.max(1, q - 1)),
                    )
                  }
                  className="h-9"
                >
                  -
                </Button>
                <Input
                  id="modal-qty"
                  type="number"
                  min={activeService.min}
                  max={activeService.max}
                  value={modalQty}
                  onChange={(e) =>
                    setModalQty(parseInt(e.target.value || "0", 10) || 0)
                  }
                  className="w-24 text-center"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setModalQty((q) =>
                      Math.min(
                        activeService?.max ?? Number.MAX_SAFE_INTEGER,
                        q + 1,
                      ),
                    )
                  }
                  className="h-9"
                >
                  +
                </Button>

                {(modalQty < activeService.min ||
                  modalQty > activeService.max) && (
                  <div className="flex items-center gap-1 text-destructive text-xs ml-auto">
                    <AlertCircle className="h-4 w-4" />
                    {modalQty < activeService.min
                      ? `Min: ${activeService.min}`
                      : `Max: ${activeService.max}`}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-sm text-muted-foreground">
                  Estimated Cost
                </div>
                <div className="text-lg font-bold text-primary">
                  {estimatedCost}
                </div>
              </div>
            </div>
          </div>

          {userInfo && (
            <aside className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Service ratings
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    {Number(ratingData?.stats?.averageRating || 0).toFixed(1)} /
                    5 ({ratingData?.stats?.totalRatings || 0})
                  </div>
                </div>

                {isRatingsLoading ? (
                  <p className="text-xs text-muted-foreground">
                    Loading ratings...
                  </p>
                ) : !ratingData?.ratings?.length ? (
                  <p className="text-xs text-muted-foreground">
                    No approved ratings yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {ratingData.ratings.map((rating: ServiceRating) => (
                      <div
                        key={rating.uid}
                        className="rounded-lg border border-border bg-muted/20 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: 5 }, (_, index) => (
                              <Star
                                key={index}
                                className={`h-3.5 w-3.5 ${
                                  index < rating.rating
                                    ? "fill-current"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(rating.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {rating.review && (
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground break-words">
                            {rating.review}
                          </p>
                        )}
                      </div>
                    ))}

                    {totalRatingPages > 1 && (
                      <div className="flex items-center justify-between pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setRatingsPage((current) =>
                              Math.max(1, current - 1),
                            )
                          }
                          disabled={ratingsPage === 1}
                        >
                          Previous
                        </Button>
                        <p className="text-[11px] text-muted-foreground">
                          Page {ratingsPage} of {totalRatingPages}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setRatingsPage((current) =>
                              Math.min(totalRatingPages, current + 1),
                            )
                          }
                          disabled={ratingsPage >= totalRatingPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Add your rating
                </h3>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRatingValue(value)}
                        className="transition hover:scale-105"
                        aria-label={`Rate ${value} star`}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            value <= ratingValue ? "fill-current" : "text-muted"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <Textarea
                  value={ratingReview}
                  onChange={(event) => setRatingReview(event.target.value)}
                  placeholder="Share your experience with this service"
                  className="min-h-20"
                />

                <Button
                  type="button"
                  onClick={async () => {
                    if (!activeService?.uid || !userInfo) return;
                    await createRating.mutateAsync({
                      serviceUid: activeService.uid,
                      rating: ratingValue,
                      review: ratingReview.trim() || undefined,
                    });
                    setRatingReview("");
                    setRatingValue(5);
                  }}
                  disabled={!canSubmitRating}
                  className="w-full"
                >
                  {createRating.isPending ? "Submitting..." : "Submit rating"}
                </Button>
              </div>
            </aside>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onAddToCart?.(activeService, modalQty);
              onClose();
            }}
            disabled={
              modalQty < activeService.min || modalQty > activeService.max
            }
          >
            Add to cart
          </Button>
          <Button
            onClick={() =>
              navigateToNewOrder(
                activeService.category ?? activeService.category,
                activeService.storeScopedId,
              )
            }
            disabled={
              modalQty < activeService.min || modalQty > activeService.max
            }
          >
            Proceed with {activeService.min > 0 ? `${modalQty}` : "Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
