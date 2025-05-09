/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PageResponsePromoterResponse } from '../../models/page-response-promoter-response';

export interface GetAllStaffs1$Params {
  offset?: number;
  pageSize?: number;
  field?: string;
  order?: boolean;
}

export function getAllStaffs1(http: HttpClient, rootUrl: string, params?: GetAllStaffs1$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponsePromoterResponse>> {
  const rb = new RequestBuilder(rootUrl, getAllStaffs1.PATH, 'get');
  if (params) {
    rb.query('offset', params.offset, {});
    rb.query('pageSize', params.pageSize, {});
    rb.query('field', params.field, {});
    rb.query('order', params.order, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageResponsePromoterResponse>;
    })
  );
}

getAllStaffs1.PATH = '/promoter/get-all';
