import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Inbox, MessageSquareText, Send } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesComponent,
});

function MessagesComponent() {
  return (
    <div className="space-y-6">
      <PageHeader title="Messages" />
      <div className="grid h-[75vh] grid-cols-1 rounded-2xl border border-border bg-white shadow-card md:grid-cols-3">
        <div className="border-r border-border p-4">
          <h3 className="font-semibold">Inbox</h3>
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <Inbox className="h-12 w-12" />
            <p>No messages</p>
          </div>
        </div>
        <div className="col-span-2 flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
          <MessageSquareText className="h-16 w-16" />
          <h3 className="mt-4 font-display text-xl">
            Select a message to read
          </h3>
          <p>Your conversations will appear here.</p>
        </div>
      </div>
    </div>
  );
}