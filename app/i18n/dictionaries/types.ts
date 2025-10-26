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
    errors?: Record<string, string>;
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
    title: string,
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
    toggleOpen: string;
    toggleClose: string;
    expand: string;
    collapse: string;
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
    logoFallback: string;
    noData: string;
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
    directorFallback: string;
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
      groups: string;
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
    scoreCell: {
      addScore: string;
      enterScore: string;
    };
    groupsView: {
      title: string;
      actions: {
        save: string;
        cancel: string;
        autoDistribute: string;
        addFromSearch: string;
        filters: string;
        filtersUnavailable: string;
        menuTitle: string;
        moveTo: string;
        remove: string;
        addToGroup: string;
      };
      labels: {
        unassignedHeader: string;
        groupHeader: string;
        groupTitle: string;
        groupShort: string;
        unassignedShort: string;
        emptyGroup: string;
        noUnassigned: string;
        searchPlaceholder: string;
      };
      feedback: {
        removed: string;
        undo: string;
      };
      errors: {
        saveFailed: string;
      };
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
      participantsInGroup: string;
      advancePerGroup: string;
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
      errors: Record<string, string>;
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
        roleRequired: string;
      network: string;
      };
    };
  };
  telegramCreate: {
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    typeLabel: string;
    formatLabel: string;
    startDateLabel: string;
    endDateLabel: string;
    pyramidLevelsLabel: string;
    participantsInGroup: string;
    statusHeading: string;
    statusCreatedWithUrl: string;
    statusCreatedWithSlug: string;
    statusCreated: string;
    mainButton: {
      disabled: string;
      submit: string;
    };
    submitButton: {
      pending: string;
      submit: string;
    };
    errors: {
      createFailed: string;
    };
  };
  freeTournamentModal: {
    restoreTitle: string;
    restoreDescription: string;
    restoreQuestion: string;
    restoreButton: string;
    createNewButton: string;
    errors: {
      createFailed: string;
    };
    unknownFormat: string;
    statusHeading: string;
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
  tournamentTables: {
    group: {
      title: string;
      players: string;
      points: string;
      games: string;
      place: string;
    };
    playoff: {
      round: string;
      final: string;
      waiting: string;
      bye: string;
      empty: string;
    };
  };
  pyramidView: {
    levelLabel: string;
    benchLabel: string;
    daysSuffix: string;
    invalidChallenge: string;
    statusTitles: {
      attackerWinner: string;
      defenderWinner: string;
      attackerLoser: string;
      defenderLoser: string;
    };
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
    participantTitles: {
      bagelKing: string;
      spotlessWinner: string;
      mostActive: string;
      aggressiveWinner: string;
      relentlessChallenger: string;
      marathoner: string;
      ironDefender: string;
      unluckyDefender: string;
      bestGamesPair: string;
      bestGamesSingle: string;
      bestSetsPair: string;
      bestSetsSingle: string;
    };
  };
  controls: {
    select: {
      placeholder: string;
      searchPlaceholder: string;
      empty: string;
    };
    tabs: {
      ariaLabel: string;
    };
  };
  matchHistory: {
    searchPlaceholder: string;
    searchAria: string;
    empty: string;
  };
  matchHistoryModal: {
    playerFallback: string;
    teamFallback: string;
  };
  matchesPage: {
    title: string;
    loading: string;
    errorPrefix: string;
    updateFailed: string;
    deleteFailed: string;
    loadFailed: string;
  };
  matchesProvider: {
    loadFailed: string;
  };
  addMatchCard: {
    attackerSingle: string;
    attackerDouble: string;
    attackerPyramid: string;
    defenderSingle: string;
    defenderDouble: string;
    defenderPyramid: string;
    scorePlaceholder: string;
    invalidScore: string;
    saveScore: string;
  };
  matchCard: {
    scoreNumbersOnly: string;
    saveFailed: string;
    scorePlaceholder: string;
    save: string;
    cancel: string;
    tooltipPending: string;
    like: string;
    comment: string;
    edit: string;
    delete: string;
    setsIncomplete: string;
  };
  scoreKeyboard: {
    ariaLabel: string;
    formulaLabel: string;
    scorePlaceholder: string;
    cancel: string;
    save: string;
    backspace: string;
  };
  mePage: {
    title: string;
    loginRequired: string;
    playerNotFound: string;
    loadFailed: string;
    errorPrefix: string;
  };
  breadcrumbs: {
    ariaLabel: string;
    tournaments: string;
    clubFallback: string;
    tournamentFallback: string;
  };
  clubPage: {
    tabs: {
      about: string;
      participants: string;
      tournaments: string;
      rating: string;
    };
    loading: string;
    ariaLabel: string;
    noData: string;
    errors: {
      notLoaded: string;
    };
  };
  aboutTournament: {
    noData: string;
    organizerFallback: string;
    regulationTitle: string;
  };
  userCard: {
    call: string;
    email: string;
    whatsapp: string;
    telegram: string;
    unavailable: string;
    phoneMissing: string;
    emailMissing: string;
    whatsappMissing: string;
    telegramMissing: string;
  };
  users: {
    roles: {
      siteAdmin: string;
      tournamentAdmin: string;
      player: string;
      guest: string;
    };
  };
};
