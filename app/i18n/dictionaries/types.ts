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
};
