import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Modules
import { MaterialModule } from '../material/material.module';


@Component({
  selector: 'app-page-not-found',
  imports: [MaterialModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

  constructor(
    private router: Router
  ) {} 
  

  onLogout(): void {
    this.router.navigate(['/login']);
  }
}
