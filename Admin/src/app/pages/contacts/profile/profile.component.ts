import { Component, OnInit } from '@angular/core';
import { UserControllerService } from 'src/app/services/services/user-controller.service';
import { UserResponse } from 'src/app/services/models/user-response';
import { FormBuilder, FormGroup } from '@angular/forms';
import { revenueBarChart, statData } from './data'; // si tu as ce fichier

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserResponse | null = null;
  editMode = false;
  profileForm: FormGroup;

  breadCrumbItems: Array<{}> = [{ label: 'Contacts' }, { label: 'Profile', active: true }];
  statData: any = statData; // ou [] si tu n'as pas de stats
  revenueBarChart: any = revenueBarChart; // ou {} si tu n'as pas de chart

  constructor(
    private userController: UserControllerService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userController.getAuthenticatedUserInfo().subscribe(user => {
      this.user = user;
      this.profileForm = this.fb.group({
        firstname: [user.firstname],
        lastname: [user.lastname],
        email: [user.email],
        phoneNumber: [user.phoneNumber],
        dateOfBirth: [user.dateOfBirth],
        sex: [user.sex],
        nationalIdNumber: [user.nationalIdNumber],
      });
    });
  }

  enableEdit() { this.editMode = true; }
  cancelEdit() { this.editMode = false; }

  saveProfile() {
    // À implémenter : appel au service pour mettre à jour le profil
    console.log('Profil sauvegardé (simulation)', this.profileForm.value);
    this.editMode = false;
  }
  // Ajoute ici la logique pour sauvegarder les modifications si tu as un endpoint de mise à jour
}