import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripDataService } from '../trip-data.service';

@Component({
  selector: 'app-edit-trip',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css',
})
export class EditTripComponent implements OnInit {
  editTripForm!: FormGroup;
  tripCode: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private tripDataService: TripDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editTripForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.tripCode = this.route.snapshot.paramMap.get('code') || '';

    this.tripDataService.getTrip(this.tripCode).subscribe({
      next: (data: any) => {
        const trip = Array.isArray(data) ? data[0] : data;
        this.editTripForm.patchValue({
          code: trip.code,
          name: trip.name,
          length: trip.length,
          start: trip.start ? trip.start.substring(0, 10) : '',
          resort: trip.resort,
          perPerson: trip.perPerson,
          image: trip.image,
          description: trip.description,
        });
      },
      error: (error) => {
        console.error('Error fetching trip:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.editTripForm.valid) {
      this.tripDataService.updateTrip(this.editTripForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error updating trip:', error);
        }
      });
    }
  }
}