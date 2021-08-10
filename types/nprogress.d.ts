declare module 'nprogress' {
  export interface NProgressConfig {
    minimum?: number;
    template?: string;
    easing?: string;
    speed?: number;
    trickle?: boolean;
    trickleRate?: number;
    trickleSpeed?: number;
    showSpinner?: boolean;
    parent?: string | HTMLElement;
  }

  export interface NProgress {
    start(): void;
    done(): void;
    remove(): void;
    set(value: number): void;
    inc(): void;
    configure(config: NProgressConfig): void;
  }

  declare var NProgress: NProgress;
  export = NProgress;
}
