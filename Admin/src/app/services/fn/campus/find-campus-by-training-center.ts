/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CampusResponse } from '../../models/campus-response';

export interface FindCampusByTrainingCenter$Params {
  agreementNumber: string;
}

export function findCampusByTrainingCenter(http: HttpClient, rootUrl: string, params: FindCampusByTrainingCenter$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CampusResponse>>> {
  const rb = new RequestBuilder(rootUrl, findCampusByTrainingCenter.PATH, 'get');
  if (params) {
    rb.path('agreementNumber', params.agreementNumber, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<CampusResponse>>;
    })
  );
}

findCampusByTrainingCenter.PATH = '/campus/get-campus-by-training-center/{agreementNumber}';
