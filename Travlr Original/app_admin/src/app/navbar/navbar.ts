import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Authentication } from '../authentication';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  constructor(
    private authenticationService: Authentication
  ) { }

  ngOnInit() { }

 public isLoggedIn(): boolean {
  return this.authenticationService.loggedIn();
}

  public onLogout(): void {
    return this.authenticationService.logout();
  }
}