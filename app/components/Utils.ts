
export function formatDate(date: Date): string {
  if (!date) return "";
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Простая маска телефона под формат +7 (...) ...-..-.. */
export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return phone;
  const tail = digits.slice(-10);
  return `+7${digits.slice(0, digits.length - 10)} (${tail.slice(0, 3)}) ${tail.slice(
    3,
    6
  )}-${tail.slice(6, 8)}-${tail.slice(8)}`.replace(/\(\)/, "");
}
