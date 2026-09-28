import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../trip-data.service';

@Component({
  selector: 'app-add-trip',
  imports: [ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css',
})
export class AddTripComponent implements OnInit {
  addTripForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private tripDataService: TripDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addTripForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addTripForm.valid) {
      this.tripDataService.addTrip(this.addTripForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding trip:', error);
        }
      });
    }
  }
}