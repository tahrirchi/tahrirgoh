import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard {
  constructor(private router: Router, private authSvc: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.authSvc.userValue;

    // console.log(user);

    if (user && user.token) {
      return true;
    }

    this.router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
