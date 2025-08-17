// app/utils/maskName.ts
export function maskWord(word: string): string {
  const w = word.trim();
  if (w.length <= 1) return "*";
  if (w.length === 2) return w[0] + "*";
  // 3+ символов: первая + звёздочки + последняя
  return w[0] + "*".repeat(w.length - 2) + w[w.length - 1];
}

export function maskFullName(fullName: string): string {
  // Разбиваем по пробелам/дефисам/множественным пробелам
  const parts = fullName
    .split(/[\s]+/)
    .filter(Boolean);

  if (parts.length === 0) return "";

  // Часто у нас: Имя Фамилия. Маскируем каждую часть.
  const masked = parts.map(maskWord).join(" ");
  return masked;
}

// Если показываешь команду вида "Имя1 Фамилия1 + Имя2 Фамилия2"
export function maskTeamName(teamName: string): string {
  // поддержим формат "A + B" и "A&B"
  return teamName
    .split(/\s*[+&]\s*/g)
    .map(maskFullName)
    .join(" + ");
}