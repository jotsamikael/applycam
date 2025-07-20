import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { SharedModule } from '../../shared/shared.module';

import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [ListComponent, DetailComponent],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    UIModule,
    SharedModule,
    TooltipModule.forRoot()
  ]
})
export class InvoicesModule { }
