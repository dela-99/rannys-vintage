import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  formatOperationalStatus,
  messageStatuses,
  type CustomerMessage,
  type MessageStatus,
} from "@/data/operations";
import { operationsService } from "@/services/operationsService";
import { Archive, Inbox, Loader2, MessageSquareText, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 25;
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function MessagesComponent() {
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<CustomerMessage | null>(null);
  const [status, setStatus] = useState<MessageStatus | "all">("new");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const selectedMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return messages;
    }

    return messages.filter((message) =>
      `${message.name} ${message.email} ${message.subject} ${message.body} ${message.status}`
        .toLowerCase()
        .includes(query),
    );
  }, [messages, search]);

  const loadMessages = useCallback(async () => {
    setLoading(true);

    try {
      const result = await operationsService.listMessages({
        status,
        search,
        limit: PAGE_SIZE,
        offset: 0,
      });
      setMessages(result.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Messages could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadMessages(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadMessages]);

  const patchMessage = async (updates: Partial<CustomerMessage>, successMessage: string) => {
    if (!selectedMessage) {
      return;
    }

    try {
      const updated = await operationsService.updateMessage(selectedMessage.id, updates);
      setSelectedMessage(updated);
      setMessages((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(successMessage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Message update failed.");
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !reply.trim()) {
      return;
    }

    try {
      const updated = await operationsService.replyToMessage(selectedMessage.id, reply.trim());
      setSelectedMessage(updated);
      setMessages((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setReply("");
      toast.success("Reply saved for customer communication.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reply could not be saved.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" />
      <div className="grid h-[75vh] grid-cols-1 rounded-2xl border border-border bg-white shadow-card md:grid-cols-[360px_1fr]">
        <div className="border-r border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">Inbox</h3>
            <Inbox className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages..."
              className="w-full rounded-lg border border-border bg-transparent py-2 pl-10 pr-4 text-sm"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStatus("all")}
              className={`rounded-full border px-3 py-2 text-xs ${
                status === "all" ? "border-primary text-primary" : "border-border"
              }`}
            >
              All
            </button>
            {messageStatuses.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`rounded-full border px-3 py-2 text-xs ${
                  status === item ? "border-primary text-primary" : "border-border"
                }`}
              >
                {formatOperationalStatus(item)}
              </button>
            ))}
          </div>

          <div className="mt-4 h-[calc(75vh-190px)] space-y-2 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
              </div>
            ) : selectedMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <Inbox className="h-12 w-12" />
                <p>No messages</p>
              </div>
            ) : (
              selectedMessages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => {
                    setSelectedMessage(message);
                    setInternalNotes(message.internalNotes);
                  }}
                  className={`block w-full rounded-xl border p-3 text-left transition hover:border-primary ${
                    selectedMessage?.id === message.id ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{message.name}</p>
                    {message.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{message.subject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatOperationalStatus(message.status)} ·{" "}
                    {dateFormatter.format(new Date(message.createdAt))}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {selectedMessage ? (
            <>
              <div className="border-b border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-accent text-[10px] text-primary">
                      {formatOperationalStatus(selectedMessage.status)}
                    </p>
                    <h2 className="font-display mt-1 text-2xl">{selectedMessage.subject}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedMessage.name} · {selectedMessage.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => patchMessage({ status: "resolved" }, "Message resolved.")}
                    >
                      Mark Resolved
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => patchMessage({ status: "archived" }, "Message archived.")}
                    >
                      <Archive className="mr-2 h-4 w-4" /> Archive
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <section className="rounded-2xl border border-border p-4">
                  <h3 className="font-accent mb-2 text-[10px] text-muted-foreground">
                    Customer Message
                  </h3>
                  <p className="whitespace-pre-wrap text-sm">{selectedMessage.body}</p>
                </section>

                <section className="rounded-2xl border border-border p-4">
                  <h3 className="font-accent mb-2 text-[10px] text-muted-foreground">Replies</h3>
                  {selectedMessage.replies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No replies yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedMessage.replies.map((item) => (
                        <div
                          key={`${item.author}-${item.createdAt}`}
                          className="rounded-xl bg-muted p-3"
                        >
                          <p className="whitespace-pre-wrap text-sm">{item.body}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.author} · {dateFormatter.format(new Date(item.createdAt))}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    className="mt-4 min-h-28 w-full rounded-lg border border-border p-3 text-sm"
                    placeholder="Write a reply to store for follow-up..."
                  />
                  <Button className="mt-3" onClick={sendReply}>
                    Save Reply
                  </Button>
                </section>

                <section className="rounded-2xl border border-border p-4">
                  <h3 className="font-accent mb-2 text-[10px] text-muted-foreground">
                    Internal Notes
                  </h3>
                  <textarea
                    value={internalNotes}
                    onChange={(event) => setInternalNotes(event.target.value)}
                    className="min-h-24 w-full rounded-lg border border-border p-3 text-sm"
                    placeholder="Assign internal notes..."
                  />
                  <Button
                    className="mt-3"
                    size="sm"
                    onClick={() => patchMessage({ internalNotes }, "Internal notes saved.")}
                  >
                    Save Notes
                  </Button>
                </section>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center text-muted-foreground">
              <MessageSquareText className="h-16 w-16" />
              <h3 className="mt-4 font-display text-xl">Select a message to read</h3>
              <p>Your conversations will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
