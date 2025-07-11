import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { PageTitleComponent } from './page-title/page-title.component';
import { StatComponent } from './stat/stat.component';

@NgModule({
  declarations: [
    PageTitleComponent,
    StatComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule
  ],
  exports: [  // ✅ Ajoute ceci
    PageTitleComponent,
    StatComponent
  ]
})

export class SharedModule { }
