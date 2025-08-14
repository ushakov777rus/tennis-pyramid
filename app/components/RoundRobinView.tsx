"use client";

import { useMemo } from "react";
import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import "./PyramidView.css"; // переиспользуем стили таблиц/чипов/карточек
import "./RoundRobinView.css";


type RoundRobinViewProps = {
  participants: Participant[];
  matches: Match[]; // уже существующие матчи (чтобы подсветить/скрыть дубликаты)
};

type Unit = { id: number; name: string };

function unitFromParticipant(p: Participant): Unit | null {
  if (p.player) return { id: p.player.id, name: p.player.name };
  if (p.team) return {
    id: p.team.id,
    name: `${p.team.player1?.name ?? "??"} + ${p.team.player2?.name ?? "??"}`
  };
  return null;
}

/**
 * Классический "circle method"
 * - если нечётное число участников — добавляем BYE (null)
 * - раундов: n-1 (если n чётное) или n (если нечётное, с BYE)
 * - в каждом раунде попарно соединяем зеркальные элементы массива
 */
function buildRoundRobin(units: Unit[]): Unit[][][] {
  const list: (Unit | null)[] = units.map(u => u);
  const hadOdd = list.length % 2 === 1;
  if (hadOdd) list.push(null); // BYE

  const n = list.length;
  const roundsCount = n - 1; // при добавленном BYE это и будет нужное число
  const rounds: Unit[][][] = [];

  // фиксируем первый, остальные "вращаются"
  for (let r = 0; r < roundsCount; r++) {
    const pairs: Unit[][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a && b) pairs.push([a, b]);
      // пары с BYE пропускаем
    }
    rounds.push(pairs);

    // ротация: [0, 1, 2, 3, 4] -> [0, 4, 1, 2, 3]
    const fixed = list[0];
    const tail = list.slice(1);
    tail.unshift(tail.pop()!);
    list.splice(0, list.length, fixed, ...tail);
  }

  return rounds;
}

/** Быстрая проверка: матч уже есть в базе? */
function alreadyPlayedMap(matches: Match[]): Set<string> {
  const key = (a: number, b: number) => `${Math.min(a, b)}_${Math.max(a, b)}`;
  const set = new Set<string>();
  for (const m of matches) {
    const a = m.player1?.id ?? m.team1?.id;
    const b = m.player2?.id ?? m.team2?.id;
    if (a && b) set.add(key(a, b));
  }
  return set;
}

function getMatchScore(aId: number, bId: number, matches: Match[]): string | null {
  const match = matches.find(m => {
    const id1 = m.player1?.id ?? m.team1?.id;
    const id2 = m.player2?.id ?? m.team2?.id;
    return (
      (id1 === aId && id2 === bId) ||
      (id1 === bId && id2 === aId)
    );
  });

  if (!match) return null;

  // Форматируем счёт, например "6:3, 4:6, 10:8"
  if (match.scores && match.scores.length > 0) {
    return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }

  return "—";
}


export function RoundRobinView({ participants, matches }: RoundRobinViewProps) {
  // берём только валидные сущности и фиксируем порядок (по имени) — чтобы расписание было детерминированным
  const units = useMemo(() => {
    return participants
      .map(unitFromParticipant)
      .filter((u): u is Unit => !!u)
      .sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }, [participants]);

  const rounds = useMemo(() => buildRoundRobin(units), [units]);

  const dupes = useMemo(() => alreadyPlayedMap(matches), [matches]);
  const key = (a: number, b: number) => `${Math.min(a, b)}_${Math.max(a, b)}`;

  const totalPlanned = useMemo(() => {
    const n = units.length;
    return (n * (n - 1)) / 2; // теория для контроля
  }, [units.length]);

  return (
    <div className="roundrobin-wrap">
      {/*
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
          <div><strong>Формат:</strong> круговой турнир (каждый с каждым)</div>
          <div><strong>Участников:</strong> {units.length}</div>
          <div><strong>Матчей по плану:</strong> {totalPlanned}</div>
          <div><strong>Раундов:</strong> {rounds.length}</div>
        </div>
      </div>
*/}
      {/* Сетка раундов */}
{/* Сетка раундов */}
<div className="rounds-grid">
  {rounds.map((pairs, rIndex) => (
    <div key={rIndex} className="card">
      <div className="history-table-head">
        <strong>Раунд {rIndex + 1}</strong>
      </div>

      <table className="round-table">
        <colgroup>
          <col className="col-left" />
          <col className="col-score" />
          <col className="col-right" />
        </colgroup>

        <thead>
          <tr>
            <th>Игрок</th>
            <th>Счёт</th>
            <th>Игрок</th>
          </tr>
        </thead>

        <tbody>
          {pairs.length > 0 ? (
            pairs.map(([a, b], i) => {
              const score = getMatchScore(a.id, b.id, matches);
              return (
                <tr key={i}>
                  <td>
                    <span className="chip" title={`ID: ${a.id}`}>{a.name}</span>
                  </td>
                  <td>
                    <span className={score ? "badge" : "vs"}>
                      {score || "vs"}
                    </span>
                  </td>
                  <td>
                    <span className="chip" title={`ID: ${b.id}`}>{b.name}</span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="history-empty">
                В этом раунде нет пар (BYE).
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  ))}
</div>
    </div>
  );
}