import ServiceList from "./components/ServiceList";
import AddButton from "./components/AddButton";

export default function ServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <ServiceList />
      <AddButton />
    </div>
  );
}
