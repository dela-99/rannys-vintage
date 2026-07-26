/* eslint-disable prettier/prettier */
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function HomepageManagerComponent() {
  const [savedMessage, setSavedMessage] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedMessage("Changes saved");
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
      <div className="mb-6">
        <h3 className="font-display text-xl">Homepage Content</h3>
        <p className="text-sm text-muted-foreground">
          Edit the main content sections of your homepage. (UI Only)
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-4 border-b border-border pb-8">
          <h4 className="font-semibold">Hero Section</h4>
          <div className="space-y-2">
            <Label htmlFor="hero-title">Hero Title</Label>
            <Input id="hero-title" defaultValue="Chic Clothing. Confidently Stylish." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              defaultValue="Handpicked New Styles arriving weekly — for the woman who walks in like she owns the room."
            />
          </div>
        </div>

        <div className="space-y-4 border-b border-border pb-8">
          <h4 className="font-semibold">Announcement Bar</h4>
          <div className="space-y-2">
            <Label htmlFor="announcement-text">Announcement Text</Label>
            <Input id="announcement-text" defaultValue="Free delivery in Accra over GH₵ 500" />
          </div>
        </div>

        {savedMessage ? <p className="text-sm text-primary">{savedMessage}</p> : null}
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
