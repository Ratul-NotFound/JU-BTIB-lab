import { getEquipmentList } from "@/server/queries/equipment";
import { EquipmentClient } from "./equipment-client";

export const dynamic = "force-dynamic";

export default async function AdminEquipmentPage() {
  const items = await getEquipmentList(true);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <EquipmentClient initialData={items} />
    </div>
  );
}
