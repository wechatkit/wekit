import { Wekit } from "./core/Wekit";
import { defComponent } from "./defComponent";
import { defPage } from "./defPage";

export function globalBindPage(Page: any) {
  Wekit.Page = Page;
  return defPage;
}

export function globalBindComponent(Component: any) {
  Wekit.Component = Component;
  return defComponent;
}
