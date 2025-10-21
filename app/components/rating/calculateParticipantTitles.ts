import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import { Tournament, TournamentFormat, TournamentType } from "@/app/models/Tournament";
import type { Dictionary } from "@/app/i18n/dictionaries";

type TitlesMap = Map<number, string[]>;

type Params = {
  participants: Participant[];
  matches: Match[];
  tournament: Tournament | null;
};

type ParticipantTitlesText = Dictionary["ratingView"]["participantTitles"];

export function calculateParticipantTitles({
  participants,
  matches,
  tournament,
}: Params, titlesText: ParticipantTitlesText): TitlesMap {
  if (!participants.length || !matches.length) {
    return new Map();
  }

  if (tournament?.format === TournamentFormat.Pyramid) {
    return calculatePyramidTitles(participants, matches, titlesText);
  }

  if (tournament?.format === TournamentFormat.RoundRobin) {
    return calculateRoundRobinTitles(participants, matches, tournament.tournament_type, titlesText);
  }

  return new Map();
}

function calculatePyramidTitles(
  participants: Participant[],
  matches: Match[],
  titlesText: ParticipantTitlesText
): TitlesMap {
  const titles = new Map<number, string[]>();

  const tookPart = (participantId: number, match: Match) => {
    const sideA = match.player1?.id ?? match.team1?.id;
    const sideB = match.player2?.id ?? match.team2?.id;
    return sideA === participantId || sideB === participantId;
  };

  const isOnSide1 = (participantId: number, match: Match) =>
    (match.player1?.id ?? match.team1?.id) === participantId;

  const pushTitle = (participant: Participant, title: string) => {
    const key = participant.getId;
    if (!titles.has(key)) {
      titles.set(key, []);
    }
    const list = titles.get(key)!;
    if (!list.includes(title)) {
      list.push(title);
    }
  };

  const registerWinners = (title: string, ids: number[]) => {
    if (!ids.length) return;
    for (const participant of participants) {
      if (ids.includes(participant.getId)) {
        pushTitle(participant, title);
      }
    }
  };

  const winnerId = (match: Match) => match.getWinnerId();

  const bagelsById = new Map<number, number>();
  for (const participant of participants) {
    let count = 0;
    for (const match of matches) {
      if (!tookPart(participant.getId, match)) continue;
      const onFirstSide = isOnSide1(participant.getId, match);
      for (const [a, b] of match.scores ?? []) {
        const mine = onFirstSide ? a : b;
        const theirs = onFirstSide ? b : a;
        if (mine === 6 && theirs === 0) {
          count += 1;
        }
      }
    }
    bagelsById.set(participant.getId, count);
  }
  const bagelMax = Math.max(...bagelsById.values(), 0);
  if (bagelMax > 0) {
    const winners = Array.from(bagelsById.entries())
      .filter(([, value]) => value === bagelMax)
      .map(([id]) => id);
    registerWinners(titlesText.bagelKing, winners);
  }

  const straightWinsById = new Map<number, number>();
  for (const participant of participants) {
    let count = 0;
    for (const match of matches) {
      if (!tookPart(participant.getId, match)) continue;
      const onFirstSide = isOnSide1(participant.getId, match);
      const scores = match.scores ?? [];
      const wonStraight = scores.length > 0 && scores.every(([a, b]) => (onFirstSide ? a > b : b > a));
      if (wonStraight && winnerId(match) === participant.getId) {
        count += 1;
      }
    }
    straightWinsById.set(participant.getId, count);
  }
  const straightMax = Math.max(...straightWinsById.values(), 0);
  if (straightMax > 0) {
    const winners = Array.from(straightWinsById.entries())
      .filter(([, value]) => value === straightMax)
      .map(([id]) => id);
    registerWinners(titlesText.spotlessWinner, winners);
  }

  const matchesById = new Map<number, number>();
  for (const participant of participants) {
    let count = 0;
    for (const match of matches) {
      if (tookPart(participant.getId, match)) count += 1;
    }
    matchesById.set(participant.getId, count);
  }
  const maxMatches = Math.max(...matchesById.values(), 0);
  if (maxMatches > 0) {
    const winners = Array.from(matchesById.entries())
      .filter(([, value]) => value === maxMatches)
      .map(([id]) => id);
    registerWinners(titlesText.mostActive, winners);
  }

  const attackWinsById = new Map<number, number>();
  for (const participant of participants) {
    let count = 0;
    for (const match of matches) {
      if (!tookPart(participant.getId, match)) continue;
      if (isOnSide1(participant.getId, match) && winnerId(match) === participant.getId) {
        count += 1;
      }
    }
    attackWinsById.set(participant.getId, count);
  }
  const maxAttack = Math.max(...attackWinsById.values(), 0);
  if (maxAttack > 0) {
    const winners = Array.from(attackWinsById.entries())
      .filter(([, value]) => value === maxAttack)
      .map(([id]) => id);
    registerWinners(titlesText.aggressiveWinner, winners);
  }

  const attackLossById = new Map<number, number>();
  for (const participant of participants) {
    let count = 0;
    for (const match of matches) {
      if (!tookPart(participant.getId, match)) continue;
      const onFirstSide = isOnSide1(participant.getId, match);
      const winner = winnerId(match);
      if (onFirstSide && winner && winner !== participant.getId) {
        count += 1;
      }
    }
    attackLossById.set(participant.getId, count);
  }
  const maxAttackLoss = Math.max(...attackLossById.values(), 0);
  if (maxAttackLoss > 0) {
    const winners = Array.from(attackLossById.entries())
      .filter(([, value]) => value === maxAttackLoss)
      .map(([id]) => id);
    registerWinners(titlesText.relentlessChallenger, winners);
  }

  const longMatchById = new Map<number, number>();
  for (const participant of participants) {
    let count = 0;
    for (const match of matches) {
      if (!tookPart(participant.getId, match)) continue;
      if ((match.scores ?? []).length >= 3) {
        count += 1;
      }
    }
    longMatchById.set(participant.getId, count);
  }
  const maxLongMatches = Math.max(...longMatchById.values(), 0);
  if (maxLongMatches > 0) {
    const winners = Array.from(longMatchById.entries())
      .filter(([, value]) => value === maxLongMatches)
      .map(([id]) => id);
    registerWinners(titlesText.marathoner, winners);
  }

  const defenseWinsById = new Map<number, number>();
  for (const participant of participants) {
    let count = 0;
    for (const match of matches) {
      if (!tookPart(participant.getId, match)) continue;
      const onDefense = !isOnSide1(participant.getId, match);
      if (onDefense && winnerId(match) === participant.getId) {
        count += 1;
      }
    }
    defenseWinsById.set(participant.getId, count);
  }
  const maxDefense = Math.max(...defenseWinsById.values(), 0);
  if (maxDefense > 0) {
    const winners = Array.from(defenseWinsById.entries())
      .filter(([, value]) => value === maxDefense)
      .map(([id]) => id);
    registerWinners(titlesText.ironDefender, winners);
  }

  const defenseLossById = new Map<number, number>();
  for (const participant of participants) {
    let count = 0;
    for (const match of matches) {
      if (!tookPart(participant.getId, match)) continue;
      const onDefense = !isOnSide1(participant.getId, match);
      const winner = winnerId(match);
      if (onDefense && winner && winner !== participant.getId) {
        count += 1;
      }
    }
    defenseLossById.set(participant.getId, count);
  }
  const maxDefenseLoss = Math.max(...defenseLossById.values(), 0);
  if (maxDefenseLoss > 0) {
    const winners = Array.from(defenseLossById.entries())
      .filter(([, value]) => value === maxDefenseLoss)
      .map(([id]) => id);
    registerWinners(titlesText.unluckyDefender, winners);
  }

  return titles;
}

function calculateRoundRobinTitles(
  participants: Participant[],
  matches: Match[],
  tournamentType: Tournament["tournament_type"],
  titlesText: ParticipantTitlesText
): TitlesMap {
  const titles = new Map<number, string[]>();

  const gamesWon = new Map<number, number>();
  const setsWon = new Map<number, number>();

  const register = (map: Map<number, number>, participantId: number, value: number) => {
    map.set(participantId, (map.get(participantId) ?? 0) + value);
  };

  const track = (participantId: number, map: Map<number, number>, value: number) => {
    if (!participantId) return;
    register(map, participantId, value);
  };

  for (const match of matches) {
    const sideA = match.player1?.id ?? match.team1?.id ?? 0;
    const sideB = match.player2?.id ?? match.team2?.id ?? 0;
    if (!sideA && !sideB) continue;

    let setsA = 0;
    let setsB = 0;
    let gamesA = 0;
    let gamesB = 0;

    for (const [a, b] of match.scores ?? []) {
      if (a > b) setsA += 1;
      else if (b > a) setsB += 1;
      gamesA += a;
      gamesB += b;
    }

    track(sideA, setsWon, setsA);
    track(sideB, setsWon, setsB);
    track(sideA, gamesWon, gamesA);
    track(sideB, gamesWon, gamesB);

  }

  const push = (participantId: number, title: string) => {
    if (!participantId) return;
    const participant = participants.find((p) => p.getId === participantId);
    if (!participant) return;
    if (!titles.has(participantId)) {
      titles.set(participantId, []);
    }
    const list = titles.get(participantId)!;
    if (!list.includes(title)) {
      list.push(title);
    }
  };

  const registerLeaders = (map: Map<number, number>, title: string, { uniqueOnly = false } = {}) => {
    if (!map.size) return;
    const maxValue = Math.max(...map.values());
    if (maxValue <= 0) return;
    const leaders = Array.from(map.entries()).filter(([, value]) => value === maxValue);
    if (uniqueOnly && leaders.length !== 1) {
      return;
    }
    for (const [id] of leaders) {
      push(id, title);
    }
  };

  const gamesTitle =
    tournamentType === TournamentType.Double
      ? titlesText.bestGamesPair
      : titlesText.bestGamesSingle;
  const setsTitle =
    tournamentType === TournamentType.Double
      ? titlesText.bestSetsPair
      : titlesText.bestSetsSingle;

  registerLeaders(gamesWon, gamesTitle);
  registerLeaders(setsWon, setsTitle, { uniqueOnly: true });

  return titles;
}
