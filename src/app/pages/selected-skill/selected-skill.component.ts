import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Lawyer {
  name: string;
  photo: string;
  email?: string;
}

@Component({
  selector: 'app-selected-skill',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  templateUrl: './selected-skill.component.html',
  styleUrls: ['./selected-skill.component.scss']
})
export class SelectedSkillComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  skillSlug = '';

  selectedSkill: {
    title?: string;
    title_selected?: string;
    columns?: Array<{ title: string; subtitle: string; icon?: string }>;
  } | null = null;
  filteredSkills: Array<{ title: string; slug: string; icon?: string }> = [];
  lawyersList: Lawyer[] = [];
  displayedLawyer: Lawyer | null = null;

  private rotationInterval: any;
  private currentIndex = 0;
  private transitionInProgress = false;
  private animationExecuted = false;

  private skillLawyerMapping: { [compTitle: string]: string[] } = {
    'Droit des affaires': ['title_lawyer_name_1'],
    'Droit bancaire et du crédit': ['title_lawyer_name_1', 'title_lawyer_name_3'],
    'Droit des suretés et des voies d’exécution': ['title_lawyer_name_1', 'title_lawyer_name_3'],
    'Saisies immobilières': ['title_lawyer_name_1', 'title_lawyer_name_3'],
    'Droit de la sécurité sociale': ['title_lawyer_name_3'],
    'Droit du travail': ['title_lawyer_name_3'],
    'Droit de la responsabilité, de la santé et des assurances': ['title_lawyer_name_2'],
    'Droit de la réparation du dommage corporel': ['title_lawyer_name_2'],
    'Droit de la construction et droit immobilier': ['title_lawyer_name_2']
  };

  @ViewChild('lawyerContainer', { static: false })
  lawyerContainer!: ElementRef<HTMLDivElement>;

  // ===== SECTION 1 (HERO) =====
  @ViewChild('firstSection') firstSection!: ElementRef;
  @ViewChild('mainTitle') mainTitle!: ElementRef;
  @ViewChild('subtitle') subtitleElement!: ElementRef;
  @ViewChild('scrollIndicatorFirst') scrollIndicatorFirst!: ElementRef;

  // ===== SECTION 2 (COLUMNS) =====
  @ViewChild('secondSection') secondSection!: ElementRef;
  @ViewChildren('skillColumn') skillColumns!: QueryList<ElementRef>;
  @ViewChild('scrollIndicatorSecond') scrollIndicatorSecond!: ElementRef;

  // ===== SECTION 3 (LAWYER) =====
  @ViewChild('thirdSection') thirdSection!: ElementRef;
  @ViewChild('lawyerText') lawyerText!: ElementRef;
  @ViewChild('lawyerPhoto') lawyerPhoto!: ElementRef;
  @ViewChild('scrollIndicatorThird') scrollIndicatorThird!: ElementRef;

  // ===== SECTION 4 (OTHER SKILLS) =====
  @ViewChild('fourthSection') fourthSection!: ElementRef;
  @ViewChild('otherSkillsContainer') otherSkillsContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const newSlug = decodeURIComponent(params.get('slug') || '');
      this.skillSlug = newSlug;
      this.loadSkillData();
    });
  }

  ngAfterViewInit(): void {}

  ngAfterViewChecked(): void {
    // Lance les animations GSAP une fois les données chargées
    if (this.selectedSkill && !this.animationExecuted) {
      this.launchAnimations();
      this.animationExecuted = true;
    }
  }

  ngOnDestroy(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }

  private launchAnimations(): void {
    // SECTION 1
    if (
      this.firstSection &&
      this.mainTitle &&
      this.subtitleElement &&
      this.scrollIndicatorFirst
    ) {
      gsap.set(this.scrollIndicatorFirst.nativeElement, { opacity: 0, y: 20 });
      const tlHero = gsap.timeline({
        scrollTrigger: {
          trigger: this.firstSection.nativeElement,
          start: 'top bottom'
        }
      });
      tlHero
        .from(this.mainTitle.nativeElement, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power2.out'
        })
        .from(this.subtitleElement.nativeElement, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power2.out'
        }, '-=0.5')
        .fromTo(
          this.scrollIndicatorFirst.nativeElement,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '>+0.3'
        );
    }

    // SECTION 2
    if (this.secondSection && this.skillColumns && this.scrollIndicatorSecond) {
      gsap.set(this.scrollIndicatorSecond.nativeElement, { opacity: 0, y: 20 });

      const columns = this.skillColumns.toArray().map(ref => ref.nativeElement);
      const lines = columns.map(col => col.querySelector('.line'));
      const h5s = columns.map(col => col.querySelector('h5'));
      const paras = columns.map(col => col.querySelector('div.skill-description'));

      const tlSecond = gsap.timeline({
        scrollTrigger: {
          trigger: this.secondSection.nativeElement,
          start: 'top bottom'
        }
      });

      tlSecond.from(lines, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power2.out'
      });

      tlSecond.from(h5s, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power2.out'
      }, '-=0.2');

      tlSecond.from(paras, {
        opacity: 0,
        y: 10,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.2');

      tlSecond.to(this.scrollIndicatorSecond.nativeElement, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '+=0.2');
    }

    // SECTION 3
    if (this.thirdSection && this.lawyerText && this.lawyerPhoto && this.scrollIndicatorThird) {
      const photoEl = this.lawyerPhoto.nativeElement.querySelector('img');
      if (photoEl) {
        gsap.set(photoEl, { opacity: 0, x: 50 });
      }
      gsap.set(this.scrollIndicatorThird.nativeElement, { opacity: 0, y: 20 });
      const leftEls = this.lawyerText.nativeElement.querySelectorAll('p, a.mail-link');

      const tlThird = gsap.timeline({
        scrollTrigger: {
          trigger: this.thirdSection.nativeElement,
          start: 'top 80%',
          once: true
        }
      });

      tlThird.from(leftEls, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.2,
        ease: 'power2.out'
      });

      if (photoEl) {
        tlThird.to(photoEl, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '+=0.2');
      }

      tlThird.to(this.scrollIndicatorThird.nativeElement, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, '+=0.2');
    }

    // SECTION 4
    if (this.fourthSection && this.otherSkillsContainer) {
      const tlFourth = gsap.timeline({
        scrollTrigger: {
          trigger: this.fourthSection.nativeElement,
          start: 'top bottom'
        }
      });
      tlFourth.from(this.fourthSection.nativeElement, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }

  private loadSkillData(): void {
    this.wpService.getSkillsData().subscribe((data) => {
      if (data && data.acf) {
        // On cherche la bonne key (ex: "box_2") dont la valeur match le slug
        const matchingKey = Object.keys(data.acf).find((key) =>
          key.startsWith('box_') && this.areSlugsEqual(data.acf[key], this.skillSlug)
        );

        if (matchingKey) {
          const boxTitle = data.acf[matchingKey] || '';
          const skillColumns: Array<{ title: string; subtitle: string; icon?: string }> = [];
          const skillTitleSelected = data.acf.title_selected || '';

          // On boucle 4 blocs max (title_1_, subtitle_1_, icon_1_, etc.)
          for (let i = 1; i <= 4; i++) {
            const tKey = `title_${i}_${matchingKey}`;
            const sKey = `subtitle_${i}_${matchingKey}`;
            const iconKey = `icon_${i}_${matchingKey}`; // on récupère l'icône

            const colTitle = data.acf[tKey] || '';
            const colSubtitle = data.acf[sKey] || '';
            const colIcon = data.acf[iconKey] || null;

            // On crée une colonne si au moins l'un des champs est défini
            if (colTitle || colSubtitle || colIcon) {
              skillColumns.push({
                title: colTitle,
                subtitle: colSubtitle,
                icon: colIcon
              });
            }
          }

          this.selectedSkill = {
            title: boxTitle,
            title_selected: skillTitleSelected,
            columns: skillColumns
          };

          // Mise à jour du titre de la page
          this.titleService.setTitle('Compétence - ' + boxTitle);

          // Mise à jour des avocats potentiels + section 4
          this.setupLawyers(data.acf, boxTitle);
          this.setupFourthSection(data.acf);

          // Scroll en haut si on est dans le navigateur
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
        }
      }
    });
  }

  // ===============================
  // ============ Lawyers ==========
  // ===============================
  private setupLawyers(acfData: any, boxTitle: string): void {
    const allLawyersDict: { [key: string]: Lawyer } = {};

    if (acfData.title_lawyer_name_1) {
      allLawyersDict['title_lawyer_name_1'] = {
        name: acfData.title_lawyer_name_1,
        photo: acfData.title_lawyer_name_1_image || 'assets/images/placeholder-lawyer.jpg',
        email: acfData.email_lawyer_name_1 || ''
      };
    }
    if (acfData.title_lawyer_name_2) {
      allLawyersDict['title_lawyer_name_2'] = {
        name: acfData.title_lawyer_name_2,
        photo: acfData.title_lawyer_name_2_image || 'assets/images/placeholder-lawyer.jpg',
        email: acfData.email_lawyer_name_2 || ''
      };
    }
    if (acfData.title_lawyer_name_3) {
      allLawyersDict['title_lawyer_name_3'] = {
        name: acfData.title_lawyer_name_3,
        photo: acfData.title_lawyer_name_3_image || 'assets/images/placeholder-lawyer.jpg',
        email: acfData.email_lawyer_name_3 || ''
      };
    }

    // On regarde dans skillLawyerMapping les avocats "associés" à cette compétence
    const lawyerKeys = this.skillLawyerMapping[boxTitle] || [];
    // On garde uniquement ceux qui existent vraiment
    this.lawyersList = lawyerKeys.map(key => allLawyersDict[key]).filter(l => !!l?.name);

    if (isPlatformBrowser(this.platformId)) {
      this.setupLawyerRotation();
    }
  }

  private setupFourthSection(acfData: any): void {
    const allSkills = Object.keys(acfData)
      .filter(key => key.startsWith('box_'))
      .map((key, index) => ({
        title: acfData[key],
        slug: this.generateSlug(acfData[key]),

        // On récupère l’icône si elle existe,
        // par exemple icon_${index+1} ou tout autre logique
        // selon tes noms de champs sur WordPress
        icon: acfData[`icon_${index + 1}`] || null
      }));

    // On enlève la compétence courante pour ne pas lister un lien vers elle-même
    this.filteredSkills = allSkills.filter(skill => skill.slug !== this.skillSlug);
  }

  private setupLawyerRotation(): void {
    if (this.lawyersList.length > 0) {
      this.currentIndex = 0;
      this.displayedLawyer = this.lawyersList[0];

      // S'il y a plusieurs avocats, on fait défiler
      if (this.lawyersList.length > 1) {
        this.rotationInterval = setInterval(() => {
          this.rotateLawyerWithGsap();
        }, 2000);
      }
    } else {
      this.displayedLawyer = null;
    }
  }

  private rotateLawyerWithGsap(): void {
    if (this.transitionInProgress || !this.lawyerContainer) return;

    this.transitionInProgress = true;
    gsap.to(this.lawyerContainer.nativeElement, {
      duration: 1.5,
      opacity: 0,
      onComplete: () => {
        // On passe à l'avocat suivant
        this.currentIndex = (this.currentIndex + 1) % this.lawyersList.length;
        this.displayedLawyer = this.lawyersList[this.currentIndex];
        // On refait apparaitre la div
        gsap.to(this.lawyerContainer.nativeElement, {
          duration: 1.5,
          opacity: 1,
          onComplete: () => {
            this.transitionInProgress = false;
          }
        });
      }
    });
  }

  // ===============================
  // ========= Outils divers ======
  // ===============================
  private areSlugsEqual(text1: string, text2: string): boolean {
    return this.generateSlug(text1) === this.generateSlug(text2);
  }

  private generateSlug(title: string): string {
    return title
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-')
      .replace(/-+$/g, '');
  }

  navigateToSkill(skillSlug: string): void {
    this.router.navigate(['/competence-selectionnee', skillSlug]).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        const firstSection = document.getElementById('first-section');
        if (firstSection) {
          firstSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
