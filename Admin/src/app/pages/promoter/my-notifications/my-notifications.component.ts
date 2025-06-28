import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../services/token/token.service';

interface Notification {
  title: string;
  message: string;
  date: string;
  read: boolean;
}

@Component({
  selector: 'app-my-notifications',
  templateUrl: './my-notifications.component.html',
  styleUrls: ['./my-notifications.component.scss']
})
export class MyNotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    // Exemple statique, à remplacer par un appel à un service backend
    const username = this.tokenService.getUsername();
    this.notifications = [
      {
        title: 'Nouvelle affectation',
        message: `Bonjour ${username}, vous avez été affecté à un nouveau centre.`,
        date: '2025-06-20 10:15',
        read: false
      },
      {
        title: 'Résultat disponible',
        message: 'Votre résultat pour la session Septembre 2024 est disponible.',
        date: '2025-06-15 09:00',
        read: true
}
    ];
  }
}