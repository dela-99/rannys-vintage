import { PageHeader } from "@/components/PageHeader";
import { HomepageManagerComponent } from "@/components/HomepageManager";

export function HomepageManager() {
  return (
    <div className="space-y-6">
      <PageHeader title="Homepage Manager" />
      <HomepageManagerComponent />
    </div>
  );
}
