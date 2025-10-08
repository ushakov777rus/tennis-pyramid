"use client";

import "./PlayoffStageTable.css"

import React from "react";
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";


/** Совпадает с тем, как блок плей-офф использовался внутри GroupPlusPlayoffView */
export type PlayoffStageTableProps = {
  resolvedPlayoff: Array<Array<[Participant | null, Participant | null]>>;
  matches: Match[];
  /** Заголовок раунда (например, "Финал", "1/2", "1/4" и т.п.) */
  roundLabel: (roundIndex: number, pairsCount: number) => string;

  /** Хелперы из родителя — переиспользуем логику без дублирования */
  pairWinnerId: (
    a: Participant | null,
    b: Participant | null,
    matches: Match[],
    filter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) => number | null;

  getOrientedSetsFor: (
    a: Participant | null,
    b: Participant | null,
    phaseFilter: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) => { aRow: (number | null)[]; bRow: (number | null)[] } | null;

  /** Компонент для ввода счёта, который уже есть у родителя (используется, когда результата ещё нет) */
  ScoreCellAdapter: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null };
  }>;
};

/** Найти матч между участниками с учётом фазы/раунда (если проставлены в модели Match) */
function findMatchBetweenWithPhase(
  aId: number,
  bId: number,
  matches: Match[],
  meta?: { phase?: PhaseType; roundIndex?: number | null }
): Match | undefined {
  return matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    const samePair = (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
    if (!samePair) return false;

    if (meta?.phase && (m as any).phase !== meta.phase) return false;
    if (meta?.phase === PhaseType.Playoff && meta.roundIndex != null) {
      if (((m as any).roundIndex ?? null) !== (meta.roundIndex ?? null)) return false;
    }
    return true;
  });
}


/** Счёт матча "6:3, 4:6, 10:8" или null, если матча нет */
function getMatchScore(
  aId: number | undefined,
  bId: number | undefined,
  matches: Match[],
  meta?: { phase?: PhaseType; roundIndex?: number | null }
): string | null {
  if(aId == undefined || bId == undefined)
    return "—";

  const match = findMatchBetweenWithPhase(aId, bId, matches, meta);
  if (!match) return null;
  if (match.scores && match.scores.length > 0) {
    return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }
  return "—";
}


export function PlayoffStageTable({
  resolvedPlayoff,
  matches,
  roundLabel,
  pairWinnerId,
  getOrientedSetsFor,
  ScoreCellAdapter: ScoreCell,
}: PlayoffStageTableProps) {
  const cell = (v: number | null) => (v == null ? "—" : String(v));

  return (
    <div className="bracket">
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
                  const phaseFilter = { phase: PhaseType.Playoff, roundIndex: rIndex as number };
                  const aId = a?.getId;
                  const bId = b?.getId;
                  const winnerId = pairWinnerId(a, b, matches, phaseFilter);

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
                            <td className="left rr-name-cell">
                              {a ? (
                                <span className="rr-participant">{a.displayName()}</span> ) : (
                                  <span className="rr-participant grey">{"Ожидается"}</span>
                                )
                              }
                            </td>
                          </tr>
                          <tr
                            className={`bracket__row ${
                              winnerId && bId === winnerId ? "bracket__row--winner" : ""
                            }`}
                          >
                            <td className="left rr-name-cell">
                              {b ? (
                                <span className="rr-participant">{b.displayName()}</span> ) : (
                                  <span className="rr-participant grey">{"Ожидается"}</span>
                                )
                              }
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
                        <div className="el-score-vs-wrap">
                          {/* Когда очков ещё нет — показываем знакомый редактор "vs" */}
                          <ScoreCell 
                            a={a} 
                            b={b} 
                            scoreString={getMatchScore(a?.getId, b?.getId, matches, phaseFilter)}
                            phaseFilter={phaseFilter} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bracket__empty">Нет пар</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
