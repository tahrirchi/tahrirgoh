import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, EMPTY, of, shareReplay, tap} from "rxjs";
import {Router} from "@angular/router";
import {switchMap} from "rxjs/operators";

export type LoginData = {
  username: string;
  password: string;
};


interface User {
  username: string;
  token: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access-token';
  private readonly USER_NAME = 'username'

  constructor(private http: HttpClient, private router: Router) {
  }


  private _user$ = new BehaviorSubject<User | null>(null);

  public userInfo$ = new BehaviorSubject<any>(null);

  public user$ = this._user$.asObservable();

  public get userValue(): User {
    return this._user$.value!;
  }

  public login(data: LoginData) {

    return this.http
      .post(`${environment.api}/user/authorize`, {
        ...data,
      })
      .pipe(
        tap((d: any) => {
          const accessToken = d.access_token;

          const user: User = {
            username: data.username,
            token: accessToken
          };

          this._user$.next(user);

          this.saveToLocalStorage(this.ACCESS_TOKEN_KEY, this.userValue.token);
          this.saveToLocalStorage(this.USER_NAME, this.userValue.username);

        }),
        switchMap((e) => this.getUserInfo()),
        tap((d) => this.userInfo$.next(d)),
        shareReplay(),
      );
  }

  private saveToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private removeTokenFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  private getFromLocalStorage(key: string) {
    return localStorage.getItem(key)
  }


  checkIfAuthorized() {
    let token: string | null = this.getFromLocalStorage(this.ACCESS_TOKEN_KEY);
    let username: string = this.getFromLocalStorage(this.USER_NAME)!
    if (token && username) {
      const user: User = {
        username,
        token
      }
      this._user$.next(user);
      return of(1).pipe(
        switchMap((e) => this.getUserInfo()),
        tap((d) => this.userInfo$.next(d)),
      )
    }
    else {
    return EMPTY
    }
  }

  getUserInfo() {
    if (this.userValue) {
      return this.http.get(`${environment.api}/user/report?username=${this.userValue.username}`)
    }
    return EMPTY
  }

  logout() {
    this.removeTokenFromLocalStorage(this.ACCESS_TOKEN_KEY);
    this.removeTokenFromLocalStorage(this.USER_NAME);
    return this.router.navigate(['/', 'auth', 'login']);
  }
}
