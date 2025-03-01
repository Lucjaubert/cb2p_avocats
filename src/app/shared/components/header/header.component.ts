import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    RouterLink
  ]
})
export class HeaderComponent implements OnInit {

  currentUrl: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // On met à jour currentUrl à chaque fin de navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  isCompetencesActive(): boolean {
    // On retourne true si l'URL inclut "/competences"
    // OU "/competence-selectionnee"
    return (
      this.currentUrl.includes('/competences') ||
      this.currentUrl.includes('/competence-selectionnee')
    );
  }
}
