declare module "yametrika" {
  interface YandexMetrikaOptions {
    clickmap?: boolean;
    trackLinks?: boolean;
    accurateTrackBounce?: boolean;
    webvisor?: boolean;
    trackHash?: boolean;
    ecommerce?: string;
  }

  class YaMetrika {
    constructor(options: { id: number } & YandexMetrikaOptions);
    reachGoal(target: string, params?: Record<string, any>): void;
    hit(url: string, options?: Record<string, any>): void;
  }

  export = YaMetrika;
}