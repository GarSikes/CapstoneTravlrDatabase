import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models/user.model';
import { AuthResponse } from './models/auth-response.model';
import { BROWSER_STORAGE } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiUrl = 'http://localhost:3000/api/trips';
  baseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  getTrips(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTrip(code: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${code}`);
  }

  addTrip(trip: any): Observable<any> {
    return this.http.post(this.apiUrl, trip);
  }

  updateTrip(trip: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${trip.code}`, trip);
  }

  deleteTrip(code: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${code}`);
  }

  // Call to our /login endpoint, returns JWT
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to our /register endpoint, creates user and returns JWT
  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  // helper method to process both login and register methods
  handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    let formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };

    return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint, formData);
  }
}