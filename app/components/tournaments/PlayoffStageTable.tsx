"use client";

import "./PlayoffStageTable.css"

import React, { useCallback, useMemo } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, MatchPhase, PhaseType } from "@/app/models/Match";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { useDictionary } from "@/app/components/LanguageProvider";


/** Совпадает с тем, как блок плей-офф использовался внутри GroupPlusPlayoffView */
export type PlayoffStageTableProps = {
  playOffParticipants: (Participant | null)[];
  matches: Match[];

  /** Компонент для ввода счёта, который уже есть у родителя (используется, когда результата ещё нет) */
  ScoreCellAdapter: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter: MatchPhase;
    showHelpTooltip: boolean;
  }>;
};

/** Следующая степень двойки >= n */
function nextPow2(n: number) {
  if (n <= 1) return 1;
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

export function PlayoffStageTable({
  playOffParticipants,
  matches: _matches, // TODO зачем мы передаем через пропс если можно из useTournament брать, поиск работает все равно с учетом фазы турнира
  ScoreCellAdapter: ScoreCell,
}: PlayoffStageTableProps) {

  const {
    findMatchBetween
  } = useTournament();
  const { tournamentTables } = useDictionary();
  const playoffText = tournamentTables.playoff;
  
  /** Счёт матча "6:3, 4:6, 10:8" или null, если матча нет */
  function getMatchScore(
    aId: number | undefined,
    bId: number | undefined,
    meta: MatchPhase
  ): string | null {
    if(aId == undefined || bId == undefined)
      return "—";

    const match = findMatchBetween(aId, bId, meta);
    if (!match) return null;
    if (match.scores && match.scores.length > 0) {
      return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
    }
    return "—";
  }

  /** Получить ID победителя пары */
  function pairWinnerId(
    a: Participant | null,
    b: Participant | null,
    filter: MatchPhase
  ): number | null {
    if (!a || !b) return null;
    
    const match = findMatchBetween(a.getId, b.getId, filter);
    if (!match) return null;
    
    return match.getWinnerId?.() ?? null;
  }

  /** Получить ориентированные сеты для отображения в таблице */
  function getOrientedSetsFor(
    a: Participant | null,
    b: Participant | null,
    phaseFilter: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ): { aRow: (number | null)[]; bRow: (number | null)[] } | null {
    if (!a || !b) return null;

    const match = findMatchBetween(a.getId, b.getId, phaseFilter);
    if (!match || !match.scores || match.scores.length === 0) return null;

    const aRow: (number | null)[] = [];
    const bRow: (number | null)[] = [];

    match.scores.forEach(([scoreA, scoreB]) => {
      aRow.push(scoreA);
      bRow.push(scoreB);
    });

    // Дополняем до 3 сетов null значениями если нужно
    while (aRow.length < 3) aRow.push(null);
    while (bRow.length < 3) bRow.push(null);

    return { aRow, bRow };
  }
  
  const resolvedPlayoff = useMemo(() => {
    const byId = new Map<number, Participant>();
    for (const p of playOffParticipants) {
      if (p) {
        byId.set(p.getId, p);
      }
    }

    const valid = playOffParticipants.slice();
    const size = nextPow2(valid.length || 1);
    while (valid.length < size) valid.push(null);

    const rounds: (Array<[Participant | null, Participant | null]>)[] = [];
    const first: Array<[Participant | null, Participant | null]> = [];
    for (let i = 0; i < valid.length; i += 2) {
      first.push([valid[i] ?? null, valid[i + 1] ?? null]);
    }
    rounds.push(first);

    const winnerOfPair = (
      a: Participant | null,
      b: Participant | null,
      allowBye: boolean,
      roundIndex: number
    ): Participant | null => {
      if (allowBye) {
        if (a && !b) return a;
        if (!a && b) return b;
      }
      if (!a || !b) return null;

      const match = findMatchBetween(a.getId, b.getId, {
        phase: PhaseType.Playoff,
        roundIndex,
        groupIndex: null,
      });
      if (!match || !match.scores || match.scores.length === 0) return null;

      const wid = match.getWinnerId?.() ?? 0;
      if (!wid) return null;
      return byId.get(wid) ?? null;
    };

    let prev = first;
    let layer = 1;
    while (prev.length > 1) {
      const next: Array<[Participant | null, Participant | null]> = [];
      for (let i = 0; i < prev.length; i += 2) {
        const [a1, b1] = prev[i];
        const [a2, b2] = prev[i + 1] ?? [null, null];

        const allowBye = layer === 1;
        const winnerLeft = winnerOfPair(a1, b1, allowBye, layer - 1);
        const winnerRight = winnerOfPair(a2, b2, allowBye, layer - 1);

        next.push([winnerLeft, winnerRight]);
      }
      rounds.push(next);
      prev = next;
      layer += 1;
    }

    return rounds;
  }, [playOffParticipants, findMatchBetween]);

  /** Заголовок раунда плей-офф */
  const roundLabel = useCallback(
    (roundIndex: number, pairsCount: number) => {
      if (pairsCount === 0) {
        return playoffText.round.replace("{number}", String(roundIndex + 1));
      }
      if (pairsCount === 1) return playoffText.final;
      return `1/${pairsCount}`;
    },
    [playoffText]
  );

  const cell = (v: number | null) => (v == null ? "—" : String(v));

  return (
    <div className="card-container">
      {resolvedPlayoff.map((pairs, rIndex) => {
        const title = roundLabel(rIndex, pairs.length);
        return (
          <div key={rIndex} className="card bracket__round">
            <div className="bracket__round-title">
              <span className="bracket__badge">{title}</span>
            </div>

            <div className="bracket__matches">
              {pairs.length ? (
                pairs.map(([a, b], mIndex) => {
                  const phaseFilter = { phase: PhaseType.Playoff, roundIndex: rIndex as number, groupIndex: 0 };
                  const aId = a?.getId;
                  const bId = b?.getId;
                  const winnerId = pairWinnerId(a, b, phaseFilter);

                  const oriented = getOrientedSetsFor(a, b, phaseFilter);
                  const aRow = oriented?.aRow ?? [null, null, null];
                  const bRow = oriented?.bRow ?? [null, null, null];

                  return (
                    <div key={mIndex} className="el-match">
                      {/* Столбец с именами участников (2 строки) */}
                      <table className="bracket__table">
                        <tbody>
                          <tr
                            className={`bracket__row ${
                              winnerId && aId === winnerId ? "bracket__row--winner" : ""
                            }`}
                          >
                            <td className={`left rr-name-cell ${
                              winnerId && aId === winnerId ? "bracket__row--winner" : ""
                            }`}>
                              {a ? (
                                <span className={`rr-participant ${
                              winnerId && aId === winnerId ? "bracket__row--winner" : ""
                            }`}>{a.displayName()}</span>
                              ) : (
                                <span className="rr-participant grey">{playoffText.waiting}</span>
                              )}
                            </td>
                          </tr>
                          <tr
                            className={`bracket__row ${
                              winnerId && bId === winnerId ? "bracket__row--winner" : ""
                            }`}
                          >
                            <td className="left rr-name-cell">
                              {b ? (
                                <span className={`rr-participant ${
                              winnerId && aId === winnerId ? "bracket__row--winner" : ""
                            }`}>{b.displayName()}</span>
                              ) : (
                                <span className="rr-participant grey">{playoffText.waiting}</span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Таблица с геймами по сетам (1-й, 2-й, тай-брейк/3-й) */}
                      {oriented ? (
                        <table className="bracket__table">
                          <tbody>
                            <tr
                              className={`bracket__row ${
                                winnerId && aId === winnerId ? "bracket__row--winner" : ""
                              }`}
                            >
                              <td className="center">{cell(aRow[0])}</td>
                              <td className="center">{cell(aRow[1])}</td>
                              <td className="center">{cell(aRow[2])}</td>
                            </tr>
                            <tr
                              className={`bracket__row ${
                                winnerId && bId === winnerId ? "bracket__row--winner" : ""
                              }`}
                            >
                              <td className="center">{cell(bRow[0])}</td>
                              <td className="center">{cell(bRow[1])}</td>
                              <td className="center">{cell(bRow[2])}</td>
                            </tr>
                          </tbody>
                        </table>
                      ) : (
                        <table className="bracket__table">
                          <tbody>
                            <tr>
                              <td>
                                {/* Когда очков ещё нет — показываем знакомый редактор "vs" */}
                                <ScoreCell 
                                  a={a} 
                                  b={b} 
                                  scoreString={getMatchScore(a?.getId, b?.getId, phaseFilter)}
                                  phaseFilter={phaseFilter}
                                  showHelpTooltip={false} />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bracket__empty">{playoffText.empty}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
