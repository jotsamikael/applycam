import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CampusService } from '../../../services/services/campus.service';
import { TrainingcenterService } from '../../../services/services/trainingcenter.service';
import { 
  CampusResponse, 
  PageResponseCampusResponse,
  TrainingCenterResponse 
} from '../../../services/models';
import { 
  FindCampusByTown$Params
} from '../../../services/fn/campus/find-campus-by-town';
import { 
  CreateCampus$Params,
} from '../../../services/fn/campus/create-campus';

@Component({
  selector: 'app-campus-management',
  templateUrl: './campus-management.component.html',
  styleUrls: ['./campus-management.component.scss']
})
export class CampusManagementComponent {
  
}