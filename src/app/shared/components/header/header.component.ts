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
  currentUrl: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });
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
  isInfosAuctionActive(): boolean {
    return this.currentUrl.includes('/infos-encheres');
  }
}
