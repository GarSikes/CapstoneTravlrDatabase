import { Inject, Injectable, signal } from '@angular/core';
import { BROWSER_STORAGE } from './storage.service';
import { User } from './models/user.model';
import { AuthResponse } from './models/auth-response.model';
import { TripDataService } from './trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class Authentication {

  // Setup our storage and service access
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {
    this.loggedIn.set(this.checkLoggedIn());
  }

  // Variable to handle Authentication Responses
  authResp: AuthResponse = new AuthResponse();

  // Signal tracking login state so templates react automatically
  loggedIn = signal<boolean>(false);

  // Get our token from our Storage provider.
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');

    if (!out) {
      return '';
    }
    return out;
  }

  // Save our token to our Storage provider.
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout of our application and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem('travlr-token');
    this.loggedIn.set(false);
  }

  // Boolean to determine if we are logged in and the token is
  // still valid. (Used internally / on init; templates should use
  // the loggedIn signal instead.)
  private checkLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  // Retrieve the current user.
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  // Login method that leverages the login method in tripDataService
 public login(user: User, passwd: string, onComplete?: () => void): void {
  this.tripDataService.login(user, passwd)
    .subscribe({
      next: (value: any) => {
        if (value) {
          this.authResp = value;
          this.saveToken(this.authResp.token);
          this.loggedIn.set(true);
          if (onComplete) onComplete();
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    })
}

  // Register method that leverages the register method in tripDataService
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd)
      .subscribe({
        next: (value: any) => {
          if (value) {
            this.authResp = value;
            this.saveToken(this.authResp.token);
            this.loggedIn.set(true);
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
  }
}