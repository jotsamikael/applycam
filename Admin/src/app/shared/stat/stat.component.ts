import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent {
  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() icon: string = '';
}