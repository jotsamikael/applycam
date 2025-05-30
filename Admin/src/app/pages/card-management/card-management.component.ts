import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-card-management',
  templateUrl: './card-management.component.html',
  styleUrls: ['./card-management.component.scss']
})
export class CardManagementComponent implements OnInit {
 // bread crumb items
 breadCrumbItems: Array<{}>;
 user:any;
  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Skote' }, { label: 'Card management', active: true }];
    this.user = this.tokenService.getRoles()
    
    console.log(this.user)
  }


  openEditModal(edit:any){

  }
}
