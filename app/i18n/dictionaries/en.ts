import type { Dictionary } from "./types";

export const enDictionary: Dictionary = {
  app: {
    name: "HoneyCup",
    slogan: "tournament platform for tennis, padel, and badminton",
    description:
      "Platform for managing amateur tournaments: bracket generator, schedules, results, and rankings.",
  },
  common: {
    loading: "Loading…",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    confirm: "Confirm",
    menu: {
      open: "Open menu",
      close: "Close menu",
    },
  },
  navigation: {
    home: "Home",
    clubs: "Clubs",
    tournaments: "Tournaments",
    rating: "Players",
    matches: "Matches",
    about: "About",
    login: "Log in",
    logout: "Log out",
    profile: "Profile",
    admin: "Admin",
  },
  landing: {
    fastTournamentCta: "Quick tournament",
    fastTournamentAria: "Go to quick tournament builder",
  },
  statsFooter: {
    loginPrefix: "Log in",
    registerPrefix: "Sign up",
    loginOr: " or ",
    loginSuffix: "to see your tournaments",
    stats: {
      clubs: "Clubs",
      tournaments: "Tournaments",
      players: "Players",
      matches: "Matches",
    },
  },
  guestIntroSlider: {
    close: "Close hints",
    previous: "Previous video",
    next: "Next video",
    dontShow: "Don't show again",
    unsupported: "Your browser does not support video playback.",
    slides: [
      {
        title: "Launch a tournament in minutes",
        description: "Add a club, create a tournament, and invite players.",
      },
      {
        title: "Brackets and standings",
        description: "Generate brackets, schedule matches, and update results automatically.",
      },
      {
        title: "Statistics and rankings",
        description: "Track player stats, rankings, and historical match data.",
      },
    ],
  },
  sidebar: {
    myClub: "My club",
    myClubs: "My clubs",
    sections: {
      admin: "Administration",
      profile: "My profile",
      navigation: "Navigation",
    },
    logout: "Log out",
  },
  metadata: {
    home: {
      title:
        "HoneyCup — online bracket generator and amateur tournaments for tennis, padel, and badminton",
      description:
        "Tournament platform for racket sports: online bracket generator, schedules, results, and player rankings.",
      keywords: [
        "free online tournament bracket generator",
        "online tournament table generator",
        "create tournament bracket online",
        "amateur tennis tournaments",
        "amateur padel tournaments",
        "build tournament bracket online",
        "build tournament table online",
        "create tournament bracket for free",
        "create tournament table for free",
        "tennis tournament platform",
        "padel tournament platform",
        "badminton tournament platform",
        "racket sports tournament software",
        "club tournament management system",
      ],
      ogDescription:
        "Create and run amateur tournaments: brackets, schedules, live results, stats, and rankings.",
    },
    tournaments: {
      title: "HoneyCup tournaments",
      description:
        "HoneyCup amateur tournaments: brackets, schedules, match results, and player statistics.",
      canonical: "/tournaments",
    },
    rating: {
      title: "HoneyCup player ratings",
      description:
        "HoneyCup player ratings: standings, points, and progress of amateur players.",
      canonical: "/rating",
    },
    matches: {
      title: "HoneyCup matches",
      description:
        "HoneyCup matches: recent results, scores, and tournament statistics.",
      canonical: "/matches",
    },
    freeTournament: {
      title: "Online tournament bracket generator",
      description:
        "Free bracket builder: launch a tournament, add players, and get a ready-to-play bracket in a couple of clicks.",
      openGraphDescription:
        "Create brackets easily: single and double elimination, round-robin, Swiss system, and more.",
      canonical: "/freetournament",
    },
    about: {
      title: "About HoneyCup",
      description:
        "Discover HoneyCup: tournament management, rankings, clubs, and player profiles for racket sports.",
      canonical: "/about",
    },
  },
  aboutPage: {
    hero: {
      title: "HoneyCup — tournament platform for tennis, padel, and badminton",
      description:
        "Create brackets, run amateur tournaments, publish schedules, results, and rankings. Supports singles, doubles, round-robin, group stages with playoffs, and pyramid formats.",
      ctaPlayer: "Start as player",
      ctaOrganizer: "Start as organizer",
    },
    stats: [
      { key: "matches", label: "MATCHES", link: "/matches", localized: true },
      { key: "players", label: "PLAYERS", link: "/rating", localized: true },
      { key: "tournaments", label: "TOURNAMENTS", link: "/tournaments", localized: true },
      { key: "clubs", label: "CLUBS", link: "/clubs", localized: true },
    ],
    intro: {
      title: "Everything for amateur tournaments",
      paragraph:
        "HoneyCup helps clubs, coaches, and organizers launch tournaments for tennis, padel, pickleball, and badminton in minutes. Build brackets, seed players, and track live results and rankings.",
      bullets: [
        "Free online bracket generator",
        "Brackets, standings, and schedules in one dashboard",
        "Match statistics and player ratings",
      ],
      aside:
        "HoneyCup is a tournament platform for tennis, padel, pickleball, and badminton. Run amateur events, generate brackets online, publish schedules and results, gather statistics and rankings, and keep match history. Supported formats include round robin, groups with playoffs, single and double elimination, and pyramid.",
    },
    features: [
      "SCHEDULE",
      "RESULTS",
      "STATISTICS",
      "LIVE SCOREBOARD",
      "NEWS & RECAPS",
      "PLAYER ACCOUNTS",
    ],
    generator: {
      title: "Bracket in two minutes",
      paragraph:
        "Launch a tournament without the paperwork: our online generator builds the bracket, seeds players, and prepares files for printing and export. Works for tennis and other racket sports.",
      bullets: [
        "Free online bracket generator",
        "Fast setup and printable layouts",
        "Formats: round-robin, single elimination, pyramid",
      ],
    },
    tennis: {
      title: "Manage tennis tournaments online",
      paragraph:
        "HoneyCup supports clubs and coaches with amateur tournaments: player registrations, brackets and standings, schedules, live scoreboard, automated scoring, player statistics, and rankings.",
      bullets: [
        "Amateur tennis tournaments for your club",
        "Live scoreboard and published results",
        "Statistics, rankings, match history",
      ],
    },
    ctaCards: {
      playerTitle: "Sign up as a player",
      playerBadge: "Join tournaments, improve your skills, win matches, and enter the top rankings",
      organizerTitle: "Sign up as an organizer",
      organizerBadge: "Run tournaments, choose any format, manage matches, and follow the results",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "Can I create a tournament bracket online for free?",
          answer: "Yes. Our free bracket generator is available for amateur events.",
        },
        {
          question: "Which formats are supported?",
          answer: "Round-robin, single elimination, pyramid, and more.",
        },
        {
          question: "Is it suitable for table tennis and padel?",
          answer: "Yes, HoneyCup supports tennis, table tennis, padel, and badminton.",
        },
      ],
    },
  },
  clubs: {
    searchPlaceholder: "Search by name or city…",
    creatingTitle: "Creating a new club…",
    loading: "Loading…",
    errorPrefix: "Error",
    deleteConfirm: "Delete club «{name}»?",
    listEmptyTitle: "Create club",
    addModal: {
      title: "Create club",
      namePlaceholder: "Club name",
      cityPlaceholder: "City",
      saveButton: "Save",
      closeAria: "Close modal",
      errors: {
        nameRequired: "Enter the club name",
        loginRequired: "You need to sign in",
      },
    },
    provider: {
      loadFailed: "Failed to load clubs",
      authRequired: "You must sign in to create a club.",
    },
    card: {
      emptyBadge: "No clubs found. Create a club and add players to get started.",
      openAria: "Open club {name}",
      membersLabel: "Members: {count}",
      tournamentsLabel: "Tournaments: {count}",
      applyTitle: "Apply to join",
      deleteTitle: "Delete club",
      tooltip: "Not implemented yet",
    },
  },
  languageSwitcher: {
    label: "Language",
    localeNames: {
      ru: "РУ",
      en: "EN",
    },
  },
};
