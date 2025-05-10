import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnDestroy,
  AfterViewChecked,
  ViewChildren,
  QueryList,
  AfterViewInit
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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-team',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  @ViewChild('teamContainer') teamContainer!: ElementRef;

  // Récupération des données WP
  teamData: any = null;
  lawyersList: Array<{ id: number; photo: string; nameFuncHtml: string }> = [];
  assistantsList: Array<{ id: number; photo: string; nameFuncHtml: string }> = [];

  private scrollListener?: () => void;
  private hasScrolledToTop = false;
  private dataLoaded = false;

  // SECTION 1
  @ViewChild('section1') section1!: ElementRef;
  @ViewChild('teamSubtitle') teamSubtitle!: ElementRef;
  @ViewChild('teamLine') teamLine!: ElementRef;
  @ViewChildren('lawyerCard') lawyerCards!: QueryList<ElementRef>;

  // SECTION 2
  @ViewChild('section2') section2!: ElementRef;
  @ViewChild('assistantTitle') assistantTitle!: ElementRef;
  @ViewChild('assistantLine') assistantLine!: ElementRef;
  @ViewChildren('assistantCard') assistantCards!: QueryList<ElementRef>;

  constructor(
    private wpService: WordpressService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollListener = () => {
      };
      window.addEventListener('scroll', this.scrollListener);
    }

    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationStart))
      .subscribe((ev) => {
        if ((ev as NavigationStart).url === '/equipe') {
          console.log('TeamComponent => NavigationStart /equipe');
          if (isPlatformBrowser(this.platformId)) {
            window.history.scrollRestoration = 'manual';
            this.hasScrolledToTop = false;
            this.dataLoaded = false;
          }
        }
      });

    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe((ev) => {
        if (isPlatformBrowser(this.platformId) && (ev as NavigationEnd).urlAfterRedirects.startsWith('/equipe')) {
          console.log('TeamComponent => NavigationEnd /equipe');
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

      // On remplit lawyersList (6 avocats)
      for (let i = 1; i <= 6; i++) {
        const photoKey = `lawyer_image_${i}`;
        const funcKey = `lawyer_name_function_${i}`;
        const photo = this.teamData[photoKey] || '';
        const funcHtml = this.teamData[funcKey] || '';
        this.lawyersList.push({ id: i, photo, nameFuncHtml: funcHtml });
      }

      // On remplit assistantsList (3 assistants)
      for (let a = 1; a <= 3; a++) {
        const photoKey = `assistant_image_${a}`;
        const nameKey = `assistant_name_${a}`;
        const funcKey = `assistant_name_${a}_function`;

        const photo = this.teamData[photoKey] || '';
        const name = this.teamData[nameKey] || '';
        const funcHtml = this.teamData[funcKey] || '';
        const nameFuncHtml = `<p>${name}</p>${funcHtml}`;
        // ID = 6 + a pour les assistants
        this.assistantsList.push({ id: 6 + a, photo, nameFuncHtml });
      }

      // On rend visible le container
      setTimeout(() => {
        if (this.teamContainer) {
          this.teamContainer.nativeElement.classList.remove('hidden');
          this.dataLoaded = true;
        }
      }, 100);
    });
  }

  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this.platformId) && !this.hasScrolledToTop && this.dataLoaded && this.teamContainer) {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        this.hasScrolledToTop = true;
        setTimeout(() => {
          window.history.scrollRestoration = 'auto';
        }, 100);
      }, 200);
    }
  }

  ngAfterViewInit(): void {
    if (this.lawyerCards.length > 0) {
      this.animateLawyers();
    }
    this.lawyerCards.changes.subscribe((list: QueryList<ElementRef>) => {
      if (list.length > 0) {
        this.animateLawyers();
      }
    });

    if (this.assistantCards.length > 0) {
      this.animateAssistants();
    }
    this.assistantCards.changes.subscribe((list: QueryList<ElementRef>) => {
      if (list.length > 0) {
        this.animateAssistants();
      }
    });
  }

  private animateLawyers(): void {
    // console.log('↪ animateLawyers() called');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.section1.nativeElement,
        start: 'top 80%',
        once: true
      }
    });

    // Sous-titre 1
    tl.from(this.teamSubtitle.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: 'power2.out'
    }, '+=0.3');

    // La ligne
    gsap.set(this.teamLine.nativeElement, { scaleX: 0, transformOrigin: 'left' });
    tl.to(this.teamLine.nativeElement, {
      scaleX: 1,
      duration: 1,
      ease: 'power2.out'
    }, '+=0.3');

    // Les cartes avocats
    this.lawyerCards.forEach((card, i) => {
      tl.from(card.nativeElement, {
        opacity: 0,
        rotateY: 90,
        transformOrigin: 'center',
        duration: 0.6,
        ease: 'power2.out'
      }, i === 0 ? '+=0.3' : '-=0.4');
    });
  }

  private animateAssistants(): void {

    const tlAssistants = gsap.timeline({
      scrollTrigger: {
        trigger: this.section2.nativeElement,
        start: 'top 80%',
        once: true
      }
    });

    // Titre "Assistants"
    tlAssistants.from(this.assistantTitle.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: 'power2.out'
    });

    // La ligne
    gsap.set(this.assistantLine.nativeElement, { scaleX: 0, transformOrigin: 'left' });
    tlAssistants.to(this.assistantLine.nativeElement, {
      scaleX: 1,
      duration: 1,
      ease: 'power2.out'
    }, '+=0.3');

    // Les cartes assistants
    this.assistantCards.forEach((card, i) => {
      tlAssistants.from(card.nativeElement, {
        opacity: 0,
        rotateY: 90,
        transformOrigin: 'center',
        duration: 0.6,
        ease: 'power2.out'
      }, i === 0 ? '+=0.3' : '-=0.4');
    });
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
