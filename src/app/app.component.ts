import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import {
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';
import { WordpressService } from './services/wordpress.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PaymentPopupComponent } from './shared/components/payment/payment-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, PaymentPopupComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cb2p_avocats';
  currentRoute: string = '';
  showFooter = false;

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
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
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
    this.wordpressService.getAllAuctionsSummary().subscribe((data: any) => {
      this.auctionsData = data;
    });
    this.wordpressService.getAuctionDetailsByIndex(1).subscribe((data: any) => {
      this.selectedAuctionData = data;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showFooter = false;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {

        setTimeout(() => {
          this.showFooter = true;
        }, 1000);

        this.currentRoute = this.router.url || '';
        if (isPlatformBrowser(this.platformId)) {
          if (this.currentRoute.includes('/contact')) {
            this.renderer.addClass(document.body, 'contact-page');
          } else {
            this.renderer.removeClass(document.body, 'contact-page');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }
}

