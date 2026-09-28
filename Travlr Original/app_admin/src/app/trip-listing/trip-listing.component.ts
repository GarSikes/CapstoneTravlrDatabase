import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripDataService } from '../trip-data.service';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { Authentication } from '../authentication';

@Component({
  selector: 'app-trip-listing',
  imports: [TripCardComponent, CommonModule, RouterLink],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css',
})
export class TripListingComponent implements OnInit {
  trips = signal<any[]>([]);

  constructor(
    private tripDataService: TripDataService,
    private authenticationService: Authentication
  ) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (data: any) => {
        this.trips.set(data);
      },
      error: (error) => {
        console.error('Error fetching trips:', error);
      }
    });
  }

  onDeleteTrip(code: string): void {
    this.tripDataService.deleteTrip(code).subscribe({
      next: () => {
        this.loadTrips();
      },
      error: (error) => {
        console.error('Error deleting trip:', error);
      }
    });
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.loggedIn()
  }
}