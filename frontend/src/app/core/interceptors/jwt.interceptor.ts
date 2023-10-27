import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authSvc.userValue;

    const isLoggedIn = user && user.token;
    if (isLoggedIn) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    }

    return next.handle(request);
  }
}
