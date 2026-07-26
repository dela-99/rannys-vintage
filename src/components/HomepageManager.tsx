/* eslint-disable prettier/prettier */
import * as React from "react";
import { Button } from "@/components/ui/button";

const sections = [
  "Hero Banner",
  "Featured Products",
  "Trending Products",
  "Collections",
  "Announcement Bar",
  "Newsletter",
  "Instagram Feed",
  "Brand Story",
];

export function HomepageManagerComponent() {
  return (
    <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
      <div className="mb-6">
        <h3 className="font-display text-xl">Homepage Content</h3>
        <p className="text-sm text-muted-foreground">
          Edit the main content sections of your homepage.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section}
            className="flex items-center justify-between rounded-lg border border-border p-4"
          >
            <h4 className="font-semibold">{section}</h4>
            <Button variant="outline">Edit</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
