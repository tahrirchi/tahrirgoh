import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // @ts-ignore
    return next.handle(request).pipe(
      // @ts-ignore
      catchError((error) => {
        if (![401, 403, 498].includes(error.status) || !this.authSvc.userValue) {
          return throwError(error);
        }

        return this.authSvc.logout()
      })
    );
  }
}
