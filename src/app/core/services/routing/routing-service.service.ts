import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  currentPageId: string;
  pageId = new Subject<string>();
  subscribed: Array<Subscription>;
  errorMessage = new Subject<string>();
  currentPageError: string;
  currentUrl: string;
  waiting = new Subject<boolean>();
  started = false;
  currentUrlSubject = new Subject<string>();
  currentUrl$ = this.currentUrlSubject.asObservable();

  constructor(
    private router: Router
  ) {

    console.log("Start routing service");

    this.subscribed = new Array<Subscription>();

    this.subscribed.push(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.currentUrl = (this.currentUrl.indexOf("?") > -1) ? this.currentUrl.substring(0,this.currentUrl.indexOf("?")) : this.currentUrl;
      this.currentPageId = this.currentUrl.split('/').pop();
      this.pageId.next(this.currentPageId);
      this.currentPageError = null;
      this.currentUrlSubject.next(this.currentUrl);
      console.log("Routing services: " + this.currentUrl);
    }));

    this.subscribed.push(this.router.events.pipe(
      filter(event => event instanceof NavigationError)
    ).subscribe((event: NavigationError) => {
      this.currentPageError = 'Could not find route to ' + event.url;
      this.errorMessage.next(this.currentPageError);
    }));
  }

  public getCurrentPageId(): string {
    return this.currentPageId;
  }

  public setCurrentPageId(routeId: string) {
    this.pageId.next(routeId);
  }

  viewport = null;

  public pageId$ = this.pageId.asObservable();

  public errorMessage$ = this.errorMessage.asObservable();

  public waiting$ = this.waiting.asObservable();

  public setWaiting(state: boolean) {
    this.waiting.next(state);
  }

  ngOnDestroy() {
    console.log("Routing service unsubscribed");
    this.subscribed.forEach(subscription => { subscription.unsubscribe(); });
  }

}
