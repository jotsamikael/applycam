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
    if (!token) return null;
    
    try {
      const tokenParts = token.split('.');
      const payload = tokenParts[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  }

  // Get specific user properties
  public getUsername(): string {
    const userInfo = this.getUserInfo();
    return userInfo?.sub || ''; // 'sub' is the standard JWT subject claim
  }

  public getEmail(): string {
    const userInfo = this.getUserInfo();
    return userInfo?.email || '';
  }

  public getRoles(): string[] {
    const userInfo = this.getUserInfo();
    return userInfo?.authorities || [];
  }

  // Check if user has specific role
  public hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.getUserInfo();
  }
}
