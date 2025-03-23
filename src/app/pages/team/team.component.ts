import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnDestroy,
  AfterViewChecked
} from '@angular/core';
import {
  Router,
  RouterModule,
  NavigationEnd,
  Event as RouterEvent,
  NavigationStart
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { WordpressService } from '../../services/wordpress.service';

@Component({
  selector: 'app-team',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('teamContainer') teamContainer!: ElementRef;

  teamData: any = null;
  lawyersList: Array<{ id: number; photo: string; nameFuncHtml: string }> = [];
  assistantsList: Array<{ id: number; photo: string; nameFuncHtml: string }> = [];

  private scrollListener?: () => void;
  private hasScrolledToTop = false;
  private dataLoaded = false;

  constructor(
    private wpService: WordpressService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollListener = () => {
        console.log('scroll =>', window.scrollY);
      };
      window.addEventListener('scroll', this.scrollListener);
    }

    this.router.events
      .pipe(
        filter((event: RouterEvent): event is NavigationStart => event instanceof NavigationStart)
      )
      .subscribe((ev: NavigationStart) => {
        if (ev.url === '/equipe') {
          console.log('TeamComponent => NavigationStart sur /equipe, désactivation de la restauration de scroll');
          if (isPlatformBrowser(this.platformId)) {
            window.history.scrollRestoration = 'manual';
            this.hasScrolledToTop = false;
            this.dataLoaded = false;
          }
        }
      });

    this.router.events
      .pipe(
        filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((ev: NavigationEnd) => {
        if (isPlatformBrowser(this.platformId) && ev.urlAfterRedirects.startsWith('/equipe')) {
          console.log('TeamComponent => NavigationEnd sur /equipe');
        }
      });
  }

  ngOnInit(): void {
    console.log('TeamComponent - ngOnInit => chargement des données Team...');

    this.wpService.getTeamData().subscribe((data) => {
      console.log('TeamComponent - getTeamData() response:', data);

      const item = Array.isArray(data) && data.length > 0 ? data[0] : data;
      this.teamData = item || null;
      if (!this.teamData) return;

      for (let i = 1; i <= 6; i++) {
        const photoKey = `lawyer_image_${i}`;
        const funcKey = `lawyer_name_function_${i}`;
        const photo = this.teamData[photoKey] || '';
        const funcHtml = this.teamData[funcKey] || '';
        this.lawyersList.push({ id: i, photo, nameFuncHtml: funcHtml });
      }

      for (let a = 1; a <= 3; a++) {
        const photoKey = `assistant_image_${a}`;
        const nameKey = `assistant_name_${a}`;
        const funcKey = `assistant_name_${a}_function`;
        const photo = this.teamData[photoKey] || '';
        const name = this.teamData[nameKey] || '';
        const funcHtml = this.teamData[funcKey] || '';
        const nameFuncHtml = `<p>${name}</p>${funcHtml}`;
        this.assistantsList.push({ id: 6 + a, photo, nameFuncHtml });
      }

      setTimeout(() => {
        if (this.teamContainer) {
          this.teamContainer.nativeElement.classList.remove('hidden');
          console.log('TeamComponent => Data chargée et container visible');
          this.dataLoaded = true; // Mark data as loaded
        }
      }, 100);
    });
  }

  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this.platformId) && !this.hasScrolledToTop && this.dataLoaded && this.teamContainer) {
      setTimeout(() => {
        console.log('TeamComponent - ngAfterViewChecked => tentative de scroll top');
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        this.hasScrolledToTop = true;
        setTimeout(() => {
          window.history.scrollRestoration = 'auto';
          console.log('TeamComponent - ngAfterViewChecked => restauration de scroll réactivée');
        }, 100);
      }, 200); // Increased delay in ngAfterViewChecked
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToSelectedMember(id: number): void {
    this.router.navigate(['/membre-equipe', id]);
  }
}
