import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {asyncScheduler, fromEvent, map, Observable, Subject, takeUntil, throttleTime} from "rxjs";
import {DOCUMENT} from "@angular/common";
import {AuthService} from "../auth/auth.service";


export enum Direction {
  None = 'None',
  Up = 'Up',
  Down = 'Down',
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public menuOpen = false;
  isScrolled = false;
  SCROLL_THRESHOLD = 20;

  currentRoute: Observable<string>;

  destroy$ = new Subject<void>();
  // userReport: any;
  errorStats: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    public authService: AuthService
  ) {
    this.currentRoute = route.url.pipe(map((segments) => segments.join('')));
    // this.authService.getUserInfo().subscribe((data) => {
    //   this.userReport = data;
    // })
  }

  ngOnInit(): void {}

  public toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.menuOpen
      ? this.document.body.classList.add('overflow-hidden')
      : this.document.body.classList.remove('overflow-hidden');
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.document.body.classList.remove('overflow-hidden');
  }

  // @HostListener("window:scroll")
  // scrollEvent() {
  //   console.log('scrolling')
  //   window.scrollY >= this.SCROLL_THRESHOLD ? (this.isScrolled = true) : (this.isScrolled = false);
  // }
}
