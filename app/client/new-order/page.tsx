import { TypographyH1 } from "@/components/typography";
import NewOrderComponent from "../component/new-order";

export default function NewOrderPage() {
  return (
    <div className="flex  flex-col gap-4 items-center">
      <TypographyH1>New Order</TypographyH1>
      <NewOrderComponent />
    </div>
  );
}
