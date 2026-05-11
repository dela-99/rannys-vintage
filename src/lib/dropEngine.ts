export type DropStatus = "JUST_DROPPED" | "NEW_ARRIVAL" | "TRENDING" | null;

export function getDropStatus(
  createdAt: Date | string,
  trending = false,
): DropStatus {
  const days = (Date.now() - new Date(createdAt).getTime()) / 86400000;
  if (days <= 7) return "JUST_DROPPED";
  if (days <= 21) return "NEW_ARRIVAL";
  if (trending) return "TRENDING";
  return null;
}

export function isJustDropped(createdAt: Date | string) {
  return (Date.now() - new Date(createdAt).getTime()) / 86400000 <= 7;
}

export function isNewArrival(createdAt: Date | string) {
  return (Date.now() - new Date(createdAt).getTime()) / 86400000 <= 21;
}

export function formatPrice(amount: number): string {
  return `GH₵ ${amount.toLocaleString("en-GH", { minimumFractionDigits: 0 })}`;
}
