/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { CandidateResponse } from '../models/candidate-response';
import { findCandidate } from '../fn/candidate/find-candidate';
import { FindCandidate$Params } from '../fn/candidate/find-candidate';
import { findCandidateByEmail } from '../fn/candidate/find-candidate-by-email';
import { FindCandidateByEmail$Params } from '../fn/candidate/find-candidate-by-email';
import { getAllCandidates } from '../fn/candidate/get-all-candidates';
import { GetAllCandidates$Params } from '../fn/candidate/get-all-candidates';
import { getCandidatesOfConnectedpromoterid } from '../fn/candidate/get-candidates-of-connectedpromoterid';
import { GetCandidatesOfConnectedpromoterid$Params } from '../fn/candidate/get-candidates-of-connectedpromoterid';
import { PageResponseCandidateResponse } from '../models/page-response-candidate-response';
import { updateCandidate } from '../fn/candidate/update-candidate';
import { UpdateCandidate$Params } from '../fn/candidate/update-candidate';

@Injectable({ providedIn: 'root' })
export class CandidateService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `updateCandidate()` */
  static readonly UpdateCandidatePath = '/candidate/update/{email}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateCandidate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateCandidate$Response(params: UpdateCandidate$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return updateCandidate(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateCandidate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateCandidate(params: UpdateCandidate$Params, context?: HttpContext): Observable<string> {
    return this.updateCandidate$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `getCandidatesOfConnectedpromoterid()` */
  static readonly GetCandidatesOfConnectedpromoteridPath = '/candidate/{promoterId}/{year}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCandidatesOfConnectedpromoterid()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCandidatesOfConnectedpromoterid$Response(params: GetCandidatesOfConnectedpromoterid$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseCandidateResponse>> {
    return getCandidatesOfConnectedpromoterid(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCandidatesOfConnectedpromoterid$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCandidatesOfConnectedpromoterid(params: GetCandidatesOfConnectedpromoterid$Params, context?: HttpContext): Observable<PageResponseCandidateResponse> {
    return this.getCandidatesOfConnectedpromoterid$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseCandidateResponse>): PageResponseCandidateResponse => r.body)
    );
  }

  /** Path part for operation `getAllCandidates()` */
  static readonly GetAllCandidatesPath = '/candidate/get-all';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllCandidates()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCandidates$Response(params?: GetAllCandidates$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseCandidateResponse>> {
    return getAllCandidates(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllCandidates$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCandidates(params?: GetAllCandidates$Params, context?: HttpContext): Observable<PageResponseCandidateResponse> {
    return this.getAllCandidates$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseCandidateResponse>): PageResponseCandidateResponse => r.body)
    );
  }

  /** Path part for operation `findCandidate()` */
  static readonly FindCandidatePath = '/candidate/find';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findCandidate()` instead.
   *
   * This method doesn't expect any request body.
   */
  findCandidate$Response(params: FindCandidate$Params, context?: HttpContext): Observable<StrictHttpResponse<CandidateResponse>> {
    return findCandidate(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findCandidate$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findCandidate(params: FindCandidate$Params, context?: HttpContext): Observable<CandidateResponse> {
    return this.findCandidate$Response(params, context).pipe(
      map((r: StrictHttpResponse<CandidateResponse>): CandidateResponse => r.body)
    );
  }

  /** Path part for operation `findCandidateByEmail()` */
  static readonly FindCandidateByEmailPath = '/candidate/find-by-email';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findCandidateByEmail()` instead.
   *
   * This method doesn't expect any request body.
   */
  findCandidateByEmail$Response(params?: FindCandidateByEmail$Params, context?: HttpContext): Observable<StrictHttpResponse<CandidateResponse>> {
    return findCandidateByEmail(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findCandidateByEmail$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findCandidateByEmail(params?: FindCandidateByEmail$Params, context?: HttpContext): Observable<CandidateResponse> {
    return this.findCandidateByEmail$Response(params, context).pipe(
      map((r: StrictHttpResponse<CandidateResponse>): CandidateResponse => r.body)
    );
  }

}
