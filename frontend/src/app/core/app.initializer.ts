import {AuthService} from "../auth/auth.service";

export function appInitializer(authSvc: AuthService) {
  return () => authSvc.checkIfAuthorized();
}
