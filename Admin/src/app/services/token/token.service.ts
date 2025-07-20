import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
 

  constructor() { }

  set token(token:string){
    localStorage.setItem('token', token);
  }

  get token(){
    return localStorage.getItem('token') as string;

  }

  logout() {
    localStorage.setItem('token', '');
  }

    // Get user information from local storage
    public getUserInfo(): any {
      const token = localStorage.getItem('token') as string;
      return this.decodeToken(token);
    }
  
  
  // Decode token and extract user information
  private decodeToken(token: string): any {
    if (!token) {
      console.warn('TokenService: Aucun token trouvé');
      return null;
    }
    
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length < 2) {
        console.error('TokenService: Token malformé - pas assez de parties');
        return null;
      }
      
      const payload = tokenParts[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log('TokenService: Token décodé avec succès:', decodedPayload);
      return decodedPayload;
    } catch (error) {
      console.error('TokenService: Erreur lors du décodage du token:', error);
      return null;
    }
  }

  // Get specific user properties
  public getUsername(): string {
    const userInfo = this.getUserInfo();
    const username = userInfo?.sub || userInfo?.username || '';
    console.log('TokenService: Username extrait:', username);
    return username;
  }

  public getEmail(): string {
    const userInfo = this.getUserInfo();
    if (!userInfo) {
      console.warn('TokenService: Impossible d\'extraire l\'email - userInfo est null');
      return '';
    }
    
    // Essayer différentes clés possibles pour l'email
    const possibleKeys = ['email', 'sub', 'username', 'user_email'];
    for (const key of possibleKeys) {
      if (userInfo[key]) {
        console.log(`TokenService: Email trouvé avec la clé '${key}':`, userInfo[key]);
        return userInfo[key];
      }
    }
    
    console.warn('TokenService: Aucune clé d\'email trouvée dans le token. Clés disponibles:', Object.keys(userInfo));
    return '';
  }

  public getRoles(): string[] {
    const userInfo = this.getUserInfo();
    if (!userInfo) {
      console.warn('TokenService: Impossible d\'extraire les rôles - userInfo est null');
      return [];
    }
    
    // Essayer différentes clés possibles pour les rôles
    const possibleKeys = ['authorities', 'roles', 'role', 'user_roles'];
    for (const key of possibleKeys) {
      if (userInfo[key]) {
        console.log(`TokenService: Rôles trouvés avec la clé '${key}':`, userInfo[key]);
        return Array.isArray(userInfo[key]) ? userInfo[key] : [userInfo[key]];
      }
    }
    
    console.warn('TokenService: Aucune clé de rôles trouvée dans le token. Clés disponibles:', Object.keys(userInfo));
    return [];
  }

  // Check if user has specific role
  public hasRole(role: string): boolean {
    const roles = this.getRoles();
    const hasRole = roles.includes(role);
    console.log(`TokenService: Vérification du rôle '${role}':`, hasRole);
    return hasRole;
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    const userInfo = this.getUserInfo();
    const isAuth = !!userInfo;
    console.log('TokenService: Utilisateur authentifié:', isAuth);
    return isAuth;
  }

  // Méthode de diagnostic pour afficher toutes les informations du token
  public diagnoseToken(): void {
    console.log('=== DIAGNOSTIC TOKEN SERVICE ===');
    const token = this.token;
    console.log('Token présent:', !!token);
    
    if (token) {
      console.log('Token brut (premiers 50 caractères):', token.substring(0, 50) + '...');
      
      const userInfo = this.getUserInfo();
      if (userInfo) {
        console.log('UserInfo complet:', userInfo);
        console.log('Clés disponibles:', Object.keys(userInfo));
        
        // Tester l'extraction de l'email
        const email = this.getEmail();
        console.log('Email extrait:', email);
        
        // Tester l'extraction des rôles
        const roles = this.getRoles();
        console.log('Rôles extraits:', roles);
        
        // Tester l'authentification
        const isAuth = this.isAuthenticated();
        console.log('Authentifié:', isAuth);
      } else {
        console.error('Impossible de décoder le token');
      }
    } else {
      console.error('Aucun token trouvé dans le localStorage');
    }
    console.log('================================');
  }
}
