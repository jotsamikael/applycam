import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-help-support-inquiry',
  templateUrl: './help-support-inquiry.component.html',
  styleUrls: ['./help-support-inquiry.component.scss']
})
export class HelpSupportInquiryComponent {
  loading = false;

  constructor(private http: HttpClient) {}

  // Fonction pour télécharger les PDF
  downloadPDF(filename: string): void {
    this.loading = true;
    // Chemin vers les fichiers PDF dans les assets
    const fileUrl = `assets/documents/${filename}`;
    
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe({
      next: (res: Blob) => {
        // Créer un lien temporaire
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Créer un élément <a> invisible
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        
        // Ajouter au DOM et cliquer
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.loading = false;
      },
      error: error => {
        console.error('Erreur de téléchargement:', error);
        alert('Le document n\'a pas pu être téléchargé. Veuillez réessayer plus tard.');
        this.loading = false;
      }
    });
  }
}
