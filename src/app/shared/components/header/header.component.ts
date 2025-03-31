import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterLink]
})
export class HeaderComponent implements OnInit {
  currentUrl = '';
  navbarExpanded = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  toggleMenu() {
    this.navbarExpanded = !this.navbarExpanded;
  }

  closeMenu() {
    this.navbarExpanded = false;
  }


  isCompetencesActive(): boolean {
    return (
      this.currentUrl.includes('/competences') ||
      this.currentUrl.includes('/competence-selectionnee')
    );
  }
  isEquipeActive(): boolean {
    return this.currentUrl.includes('/equipe');
  }
  isContactActive(): boolean {
    return this.currentUrl.includes('/contact');
  }
  isHomepageActive(): boolean {
    return this.currentUrl === '/';
  }
  isOfficeActive(): boolean {
    return this.currentUrl.includes('/le-cabinet');
  }
  isAuctionsActive(): boolean {
    return this.currentUrl.includes('/ventes-aux-encheres');
  }
}
