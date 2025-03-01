import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { WordpressService } from './services/wordpress.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cb2p_avocats';
  currentRoute: string = '';

  homepageData: any;
  officeData: any;
  skillsData: any[] = [];
  selectedLawyersData: any[] = [];
  teamData: any[] = [];
  contactData: any;
  auctionsData: any[] = [];
  selectedAuctionData: any;

  constructor(
    private router: Router,
    private wordpressService: WordpressService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.wordpressService.getHomepageData().subscribe(data => {
      this.homepageData = data;
    });

    this.wordpressService.getOfficeData().subscribe(data => {
      this.officeData = data;
    });

    this.wordpressService.getSkillsData().subscribe(data => {
      this.skillsData = data;
    });

    this.wordpressService.getSelectedLawyersData().subscribe(data => {
      this.selectedLawyersData = data;
    });

    this.wordpressService.getTeamData().subscribe(data => {
      this.teamData = data;
    });

    this.wordpressService.getContactData().subscribe(data => {
      this.contactData = data;
    });

    this.wordpressService.getAuctionsData().subscribe(data => {
      this.auctionsData = data;
    });

    this.wordpressService.getSelectedAuctionData().subscribe(data => {
      this.selectedAuctionData = data;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }
}
