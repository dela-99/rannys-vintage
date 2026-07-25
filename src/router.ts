import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthState } from "./auth";

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined! as AuthState,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
