import { PageHeader } from "@/components/PageHeader";
import { Placeholder } from "@/components/Placeholder";

const settingsSections = [
  "Store Information",
  "Business Hours",
  "Contact Details",
  "Social Media",
  "Shipping",
  "Branding",
  "Theme",
  "Security",
];

export function SettingsComponent() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {settingsSections.map((title) => (
          <div key={title} className="rounded-2xl border border-border bg-white p-8 shadow-card">
            <h3 className="font-display text-xl">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This management interface will be built in a future phase.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
