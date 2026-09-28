import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Authentication } from '../authentication';

@Component({
  selector: 'app-trip-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css',
})
export class TripCardComponent {
  @Input() trip: any;
  @Output() deleteTrip = new EventEmitter<string>();

  constructor(
    private authenticationService: Authentication
  ) { }

  onDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.trip.name}?`)) {
      this.deleteTrip.emit(this.trip.code);
    }
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.loggedIn()
  }
}