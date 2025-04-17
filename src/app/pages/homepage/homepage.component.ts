import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
})
export class HomepageComponent implements OnInit, AfterViewInit {
  homepageData: any;
  officeData: any;
  lawyersList: Array<{ photo: string; name: string; function: string }> = [];

  // ================= SECTION 1 =================
  @ViewChild('logo') logo!: ElementRef;
  @ViewChild('separator') separator!: ElementRef;
  @ViewChild('words') words!: ElementRef;
  @ViewChild('title_1') title1!: ElementRef; // si besoin
  @ViewChild('scrollIndicator') scrollIndicator!: ElementRef; // si besoin
  @ViewChild('sectionTitle') sectionTitle!: ElementRef;

  // ================= SECTION 4 =================
  @ViewChild('section4', { static: false }) section4!: ElementRef;
  @ViewChild('line4a', { static: false }) line4a!: ElementRef;
  @ViewChild('line4b', { static: false }) line4b!: ElementRef;
  @ViewChild('line4c', { static: false }) line4c!: ElementRef;
  @ViewChild('title4a', { static: false }) title4a!: ElementRef;
  @ViewChild('title4b', { static: false }) title4b!: ElementRef;
  @ViewChild('title4c', { static: false }) title4c!: ElementRef;
  @ViewChild('subtitle4a', { static: false }) subtitle4a!: ElementRef;
  @ViewChild('subtitle4b', { static: false }) subtitle4b!: ElementRef;
  @ViewChild('subtitle4c', { static: false }) subtitle4c!: ElementRef;
  @ViewChild('scrollIndicator4', { static: false }) scrollIndicator4!: ElementRef;

  // ================= SECTION 2 =================
  @ViewChild('title2') title2!: ElementRef;
  @ViewChild('subtitle2') subtitle2!: ElementRef;
  @ViewChild('arrowRight') arrowRight!: ElementRef;
  @ViewChild('scrollIndicator2') scrollIndicator2!: ElementRef;

  // ================= SECTION 3 =================
  @ViewChild('thirdSection') thirdSection!: ElementRef; // conteneur
  @ViewChild('title3') title3!: ElementRef;
  @ViewChildren('portrait') portraits!: QueryList<ElementRef>;
  @ViewChild('teamCallToAction') teamCallToAction!: ElementRef;

  // ================= SECTION 6 =================
  @ViewChild('section6', { static: false }) section6!: ElementRef;
  @ViewChild('title6', { static: false }) title6!: ElementRef;
  @ViewChild('subtitle6', { static: false }) subtitle6!: ElementRef;
  @ViewChild('line6', { static: false }) line6!: ElementRef;
  @ViewChild('scrollIndicator6', { static: false }) scrollIndicator6!: ElementRef;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Accueil - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Avocats, contentieux, conseils à Bordeaux',
    });

    this.wpService.getHomepageData().subscribe((homepage) => {
      this.homepageData = homepage;

      this.wpService.getOfficeData().subscribe((office) => {
        this.officeData = office;
        this.lawyersList = [];

        for (let i = 1; i <= 6; i++) {
          const imageKey = `image_${i}`;
          const nameKey = `lawyer_name_${i}`;
          const functionKey = `lawyer_${i}_function`;

          const photo = this.homepageData?.[imageKey] || '';
          const name = this.officeData?.acf?.[nameKey] || '';
          const func = this.officeData?.acf?.[functionKey] || '';

          if (photo) {
            this.lawyersList.push({ photo, name, function: func });
          }
        }
      });
    });
  }


  ngAfterViewInit(): void {

    const tl1 = gsap.timeline();
    tl1
      .from(this.logo.nativeElement, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power2.out',
      })
      .to(this.separator.nativeElement, {
        scaleY: 1,
        duration: 1.5,
        transformOrigin: 'top',
        ease: 'power2.out',
      }, '-=0.4')
      .from(this.words.nativeElement.children, {
        opacity: 0,
        y: 20,
        duration: 2.5,
        stagger: 0.7,
        ease: 'power2.out',
      }, '-=0.2')
      .from(this.sectionTitle.nativeElement, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out'
      }, '>');

    // ============= SECTION 4 =============
    const tlSection4 = gsap.timeline({
      scrollTrigger: {
        trigger: this.section4.nativeElement,
        start: 'top 80%',
        once: true
      }
    });
    tlSection4.to(
      [this.line4a.nativeElement, this.line4b.nativeElement, this.line4c.nativeElement],
      {
        scaleX: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.2
      }
    );
    tlSection4.from(
      [this.title4a.nativeElement, this.title4b.nativeElement, this.title4c.nativeElement],
      {
        opacity: 0,
        y: 40,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.2
      },
      '+=0.3'
    );
    tlSection4.from(
      [this.subtitle4a.nativeElement, this.subtitle4b.nativeElement, this.subtitle4c.nativeElement],
      {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.2
      },
      '+=0.3'
    );
    if (this.scrollIndicator4) {
      tlSection4.from(
        this.scrollIndicator4.nativeElement,
        {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: 'power2.out'
        },
        '+=0.3'
      );
    }

    // ============= SECTION 2 : Title2, Subtitle2... =============
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: this.title2.nativeElement,
        start: 'top 80%',
        once: true,
      },
    });
    tl2
      .from(this.title2.nativeElement, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
      })
      .from(
        [this.subtitle2.nativeElement, this.arrowRight.nativeElement],
        {
          opacity: 0,
          y: 20,
          stagger: 0.2,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .from(this.scrollIndicator2.nativeElement, {
        opacity: 0,
        y: 10,
        duration: 1,
        ease: 'power2.out',
      }, '+=0.3');

    // ============= SECTION 3 : PORTRAITS =============
    // On appelle buildThirdSectionTimeline pour l'utiliser vraiment
    if (this.portraits.length > 0) {
      this.buildThirdSectionTimeline();
    } else {
      // S'il n'y a pas encore de portraits, on attend le changement
      this.portraits.changes.subscribe(() => {
        this.buildThirdSectionTimeline();
      });
    }

    // ============= SECTION 6 =============
    const tlSection6 = gsap.timeline({
      scrollTrigger: {
        trigger: this.section6.nativeElement,
        start: 'top 80%',
        once: true
      }
    });
    tlSection6.from(this.title6.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power2.out'
    });
  }

  /**
   * Anime la troisième section (titre3, portraits, callToAction) au scroll.
   */
  private buildThirdSectionTimeline(): void {
    const list = this.portraits.toArray();
    if (!this.thirdSection || list.length === 0) return;

    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: this.thirdSection.nativeElement,
        start: 'top 80%',
        once: true
      },
    });

    // Titre
    tl3.from(this.title3.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out',
    });

    // Portraits en cascade
    list.forEach((portraitRef) => {
      tl3.from(
        portraitRef.nativeElement,
        {
          opacity: 0,
          rotateY: 90,
          transformOrigin: 'center',
          duration: 0.6,
          ease: 'power2.out',
        },
        '>'
      );
    });

    // CTA final
    tl3.from(this.teamCallToAction.nativeElement, {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power2.out',
    }, '>');
  }

  goToTeam(): void {
    this.router.navigate(['/equipe']);
  }

  goToSkills(): void {
    this.router.navigate(['/competences']);
  }
}
