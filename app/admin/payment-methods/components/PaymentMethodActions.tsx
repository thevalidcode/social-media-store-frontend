"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import PaymentMethodForm from "./PaymentMethodForm";
import { useState } from "react";
import { PaymentGateway } from "@/types";
import { Button } from "@/components/ui/button";
import {
  useCreatePaymentGateway,
  useDeletePaymentGateway,
  useUpdatePaymentGateway,
} from "@/hooks/use-paymentGateway";
import DeleteDialog from "../../components/DeleteDialog";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

export default function PaymentMethodActions({
  gateway,
  setGateways,
}: {
  gateway: PaymentGateway;
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteGateway } = useDeletePaymentGateway();
  const { mutateAsync: updateGateway } = useUpdatePaymentGateway();
  const { mutateAsync: createGateway } = useCreatePaymentGateway();
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  const handleDeleteConfirm = () => {
    deleteGateway(gateway.uid);
    setGateways((prev) => prev.filter((g) => g.id !== gateway.id));
  };

  const handleSave = async (updated: PaymentGateway) => {
    const mutation = editOpen ? updateGateway : createGateway;
    const usdMin = convert(userCurrency, "USD", updated.min).amount;
    const usdMax = convert(userCurrency, "USD", updated.max).amount;
    const response = await mutation({ ...updated, min: usdMin, max: usdMax });
    setGateways((prev) => prev.map((g) => (g.id === gateway.id ? updated : g)));

    return response;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600"
          >
            <Trash className="w-4 h-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PaymentMethodForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={gateway}
        onSave={(updated) => handleSave(updated)}
      />
      {/* Delete dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        count={1}
        names={[gateway.name]}
        entityName="payment method"
      />
    </>
  );
}
