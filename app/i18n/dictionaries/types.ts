export type Dictionary = {
  app: {
    name: string;
    slogan: string;
    description: string;
  };
  common: {
    loading: string;
    cancel: string;
    save: string;
    close: string;
    confirm: string;
    menu: {
      open: string;
      close: string;
    };
  };
  navigation: {
    home: string;
    clubs: string;
    tournaments: string;
    rating: string;
    matches: string;
    about: string;
    login: string;
    logout: string;
    profile: string;
    admin: string;
  };
  landing: {
    fastTournamentCta: string;
    fastTournamentAria: string;
  };
  statsFooter: {
    loginPrefix: string;
    registerPrefix: string;
    loginOr: string;
    loginSuffix: string;
    stats: {
      clubs: string;
      tournaments: string;
      players: string;
      matches: string;
    };
  };
  guestIntroSlider: {
    close: string;
    previous: string;
    next: string;
    dontShow: string;
    unsupported: string;
    slides: Array<{
      title: string;
      description: string;
    }>;
  };
  metadata: {
    home: {
      title: string;
      description: string;
      keywords: string[];
      ogDescription: string;
    };
    tournaments: {
      title: string;
      description: string;
      canonical: string;
    };
    rating: {
      title: string;
      description: string;
      canonical: string;
    };
    matches: {
      title: string;
      description: string;
      canonical: string;
    };
    freeTournament: {
      title: string;
      description: string;
      openGraphDescription: string;
      canonical: string;
    };
    about: {
      title: string;
      description: string;
      canonical: string;
    };
  };
  sidebar: {
    myClub: string;
   myClubs: string;
   sections: {
     admin: string;
     profile: string;
     navigation: string;
   };
   logout: string;
  };
  aboutPage: {
    hero: {
      title: string;
      description: string;
      ctaPlayer: string;
      ctaOrganizer: string;
    };
    stats: Array<{
      key: "matches" | "players" | "tournaments" | "clubs";
      label: string;
      link: string;
      localized: boolean;
    }>;
    intro: {
      title: string;
      paragraph: string;
      bullets: string[];
      aside: string;
    };
    features: string[];
    generator: {
      title: string;
      paragraph: string;
      bullets: string[];
    };
    tennis: {
      title: string;
      paragraph: string;
      bullets: string[];
    };
    ctaCards: {
      playerTitle: string;
      playerBadge: string;
      organizerTitle: string;
      organizerBadge: string;
    };
    faq: {
      title: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
  };
  languageSwitcher: {
    label: string;
    localeNames: Record<string, string>;
  };
  clubs: {
    searchPlaceholder: string;
    creatingTitle: string;
    loading: string;
    errorPrefix: string;
    deleteConfirm: string;
    listEmptyTitle: string;
    addModal: {
      title: string;
      namePlaceholder: string;
      cityPlaceholder: string;
      saveButton: string;
      closeAria: string;
      errors: {
        nameRequired: string;
        loginRequired: string;
      };
    };
    provider: {
      loadFailed: string;
      authRequired: string;
    };
    card: {
      emptyBadge: string;
      openAria: string;
      membersLabel: string;
      tournamentsLabel: string;
      applyTitle: string;
      deleteTitle: string;
      tooltip: string;
    };
  };
  tournaments: {
    title: string;
    searchPlaceholder: string;
    loading: string;
    errorPrefix: string;
    deleteConfirm: string;
    loginRequired: string;
    filters: {
      typeAny: string;
      formatAny: string;
      statusAny: string;
      onlyMineLabel: string;
      onlyMineAria: string;
      resetTitle: string;
    };
    provider: {
      loadFailed: string;
    };
    typeLabels: {
      single: string;
      double: string;
    };
    formatLabels: {
      pyramid: string;
      roundRobin: string;
      singleElimination: string;
      doubleElimination: string;
      groupsPlayoff: string;
      swiss: string;
      custom: string;
    };
    statusLabels: {
      draft: string;
      registration: string;
      ongoing: string;
      finished: string;
    };
    tabs: {
      about: string;
      bracket: string;
      matches: string;
      participants: string;
      results: string;
      ariaLabel: string;
    };
    alerts: {
      selectPlayersAndDate: string;
      addMatchFailed: string;
      addMatchRetry: string;
      enterScore: string;
      saveScoreFallback: string;
      updateMatchFailed: string;
      deleteMatchFailed: string;
    };
    empty: {
      addParticipantsButton: string;
      addParticipantsMessage: string;
    };
    errors: {
      tournamentIdMissing: string;
      createTeamFailed: string;
    };
    card: {
      typeLabel: string;
      formatLabel: string;
      datesLabel: string;
      participantsLabel: string;
      matchesLabel: string;
      deleteTitle: string;
      statusUpdateFailed: string;
    };
    modal: {
      title: string;
      namePlaceholder: string;
      advShow: string;
      advHide: string;
      minNTRPPlaceholder: string;
      maxNTRPPlaceholder: string;
      pyramidLevelsLabel: string;
      pyramidLevelsHelp: string;
      groupsCountLabel: string;
      groupsCountHelp: string;
      errors: {
        nameRequired: string;
        dateRange: string;
        pyramidLevels: string;
        ntrpRange: string;
      };
      saveButton: string;
      closeAria: string;
    };
  };
  footer: {
    contactTitle: string;
    rights: string;
    brandLine: string;
  };
  auth: {
    login: {
      title: string;
      emailPlaceholder: string;
      passwordPlaceholder: string;
      submit: string;
      errorFallback: string;
      noAccountPrefix: string;
      registerLink: string;
    };
    register: {
      title: string;
      rolePlaceholder: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      ntrpPlaceholder: string;
      passwordPlaceholder: string;
      passwordRepeatPlaceholder: string;
      submit: string;
      submitPending: string;
      hasAccountPrefix: string;
      loginLink: string;
      closeAria: string;
      roles: {
        player: string;
        organizer: string;
      };
      errors: {
        nameRequired: string;
        emailRequired: string;
        emailInvalid: string;
        passwordRequired: string;
        passwordLength: string;
        passwordMismatch: string;
        ntrpRequired: string;
        registrationFailed: string;
        network: string;
      };
    };
  };
  participants: {
    loading: string;
    playersDoubleTitle: string;
    playersSingleTitle: string;
    playersClubTitle: string;
    participantsTournamentTitle: string;
    membersClubTitle: string;
    leftFilterPlaceholder: string;
    rightFilterPlaceholder: string;
    createPlayerTournament: string;
    createPlayerClub: string;
    emptyHint: string;
    addToTournament: string;
    addToClub: string;
    createTeam: string;
    removeFromTournament: string;
    removeFromClub: string;
  };
  profile: {
    unknownPlayer: string;
    copyPhone: string;
    sexBadge: {
      male: string;
      female: string;
    };
    stats: {
      wins: string;
      losses: string;
      winRate: string;
      rank: string;
      tournaments: string;
    };
    actions: {
      message: string;
      edit: string;
      showAll: string;
    };
    matchesTitle: string;
    matchesEmpty: string;
  };
  players: {
    ntrp: string;
    matches: string;
    wins: string;
    winRateShort: string;
    tooltipPending: string;
    actions: {
      like: string;
      comment: string;
      edit: string;
      delete: string;
    };
    fallbackName: string;
  };
  ratingView: {
    loadFailed: string;
    tournamentMissing: string;
    loading: string;
    searchPlaceholder: string;
    noParticipants: string;
    noMatches: string;
    noTitle: string;
    unknownPlayer: string;
  };
};
