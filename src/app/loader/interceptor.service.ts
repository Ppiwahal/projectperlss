import { LoaderService } from './loader.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
 reqCount=0;
  constructor(
    public loaderService:LoaderService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.reqCount++;
    this.loaderService.isLoading.next(true);
    const progress = req.params.get('progress');
    if (progress && progress === 'no') {
      this.loaderService.isLoading.next(false);
    req.params.delete('progress');
    }
    return next.handle(req).pipe(
      finalize(
        ()=> {
          this.reqCount--;
          if(this.reqCount===0){
          this.loaderService.isLoading.next(false);
        }
        }
      )
    )

  }
}
