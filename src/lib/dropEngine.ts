export type DropStatus = "JUST_DROPPED" | "NEW_ARRIVAL" | null;

export function getDropStatus(createdAt: Date | string): DropStatus {
  const created = new Date(createdAt).getTime();
  const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
  if (days <= 7) return "JUST_DROPPED";
  if (days <= 21) return "NEW_ARRIVAL";
  return null;
}

export function formatPrice(amount: number): string {
  return `GH₵ ${amount.toLocaleString("en-GH", { minimumFractionDigits: 0 })}`;
}
