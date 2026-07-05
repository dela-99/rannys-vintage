/* eslint-disable prettier/prettier */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function HomepageManagerComponent() {
  return (
    <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
      <div className="mb-6">
        <h3 className="font-display text-xl">Homepage Content</h3>
        <p className="text-sm text-muted-foreground">
          Edit the main content sections of your homepage.
        </p>
      </div>

      <form className="space-y-8">
        <div className="space-y-4 border-b border-border pb-8">
          <h4 className="font-semibold">Hero Section</h4>
          <div className="space-y-2">
            <Label htmlFor="hero-title">Hero Title</Label>
            <Input id="hero-title" defaultValue="Chic. Stylishly Confident." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              defaultValue="Handpicked New Styles arriving weekly — for the woman who walks in like she owns the room."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-image">Hero Image</Label>
            <Input id="hero-image" type="file" />
            <p className="text-xs text-muted-foreground">
              Upload a new background image for the hero section.
            </p>
          </div>
        </div>

        <div className="space-y-4 border-b border-border pb-8">
          <h4 className="font-semibold">Announcement Bar</h4>
          <div className="space-y-2">
            <Label htmlFor="announcement-text">Announcement Text</Label>
            <Input id="announcement-text" defaultValue="Free delivery in Accra over GH₵ 500" />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Homepage Sections</h4>
          <p className="text-sm text-muted-foreground">
            (Section management UI will be here. e.g., re-ordering, enabling/disabling sections)
          </p>
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
