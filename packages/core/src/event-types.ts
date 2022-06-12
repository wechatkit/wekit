import { createEvent } from "@wekit/shared";
import { CreateAppOptions } from "./createApp";
import { DefPageOptions } from "./defPage";

export const ON_START_UP =
  createEvent<(options: CreateAppOptions<unknown>) => void>("startUp");

export const ON_SHOW =
  createEvent<(options: CreateAppOptions<unknown>) => void>("onShow");

export const ON_HIDE =
  createEvent<(options: CreateAppOptions<unknown>) => void>("onHide");

export const ON_ERROR = createEvent<(err: Error) => void>("onError");

export type OnPageNotFoundRes = {
  path: string;
  query: AnyObject;
  isEntryPage: boolean;
};
export const ON_PAGE_NOT_FOUND =
  createEvent<(res: OnPageNotFoundRes) => void>("onPageNotFound");

export type OnUnhandledRejection = {
  reason: string;
  promise: Promise<unknown>;
};
export const ON_UNHANDLED_REJECTION = createEvent<
  (res: OnUnhandledRejection) => void
>("onUnhandledRejection");

export const ON_THEME_CHANGE =
  createEvent<(theme: "dark" | "light") => void>("onThemeChange");

export const ON_PRELOAD =
  createEvent<(options: DefPageOptions<unknown, unknown>) => void>("onPreload");

export const ON_READY =
  createEvent<(options: DefPageOptions<unknown, unknown>) => void>("onReady");

export const ON_UNLOAD =
  createEvent<(options: DefPageOptions<unknown, unknown>) => void>("onUnload");

export const ON_PULL_DOWN_REFRESH =
  createEvent<(options: DefPageOptions<unknown, unknown>) => void>(
    "onPullDownRefresh"
  );

export const ON_REACH_BOTTOM =
  createEvent<(options: DefPageOptions<unknown, unknown>) => void>(
    "onReachBottom"
  );
