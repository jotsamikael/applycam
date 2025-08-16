import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   
   const token: string = this.tokenService.token;
   console.log('HttpTokenInterceptor - Request URL:', request.url);
   console.log('HttpTokenInterceptor - Token present:', !!token);
   
   if(token){
    console.log('HttpTokenInterceptor - Adding Authorization header');
    const authRequest = request.clone(
      {
        headers: new HttpHeaders({
          Authorization:'Bearer '+token
        })
      }
    );
    console.log('HttpTokenInterceptor - Authorization header added:', authRequest.headers.get('Authorization')?.substring(0, 20) + '...');
    return next.handle(authRequest)
   } else {
     console.log('HttpTokenInterceptor - No token found, proceeding without Authorization header');
   }
   
    return next.handle(request);
  }
}
