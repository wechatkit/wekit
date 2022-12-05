import { Wekit } from "./core/Wekit";
import { defBehavior } from "./defBehavior";
import { defComponent } from "./defComponent";
import { defPage } from "./defPage";

export function bindGlobalPage(Page: any) {
  Wekit.Page = Page;
  return defPage;
}

export function bindGlobalComponent(Component: any) {
  Wekit.Component = Component;
  return defComponent;
}

export function bindGlobalBehavior(Behavior: any) {
  Wekit.Behavior = Behavior;
  return defBehavior;
}
