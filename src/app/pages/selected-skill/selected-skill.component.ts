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
  gender?: 'homme' | 'femme';
}

@Component({
  selector: 'app-selected-skill',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  templateUrl: './selected-skill.component.html',
  styleUrls: ['./selected-skill.component.scss']
})
export class SelectedSkillComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  skillSlug = '';

  selectedSkill: {
    title?: string;
    title_selected?: string;
    columns?: Array<{ title: string; subtitle: string; icon?: string }>;
  } | null = null;
  filteredSkills: Array<{ title: string; slug: string; icon?: string }> = [];
  lawyersList: Lawyer[] = [];
  displayedLawyer: Lawyer | null = null;

  backgroundImages: string[] = [
    '/assets/img/skills/int-4.webp',
    '/assets/img/skills/int-5.webp',
    '/assets/img/skills/office-wall-2.webp'
  ];
  backgroundImageUrl: string = this.backgroundImages[0];
  private backgroundIndex = 0;

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

  @ViewChild('lawyerContainer', { static: false }) lawyerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('firstSection') firstSection!: ElementRef;
  @ViewChild('mainTitle') mainTitle!: ElementRef;
  @ViewChild('subtitle') subtitleElement!: ElementRef;
  @ViewChild('scrollIndicatorFirst') scrollIndicatorFirst!: ElementRef;
  @ViewChild('secondSection') secondSection!: ElementRef;
  @ViewChildren('skillColumn') skillColumns!: QueryList<ElementRef>;
  @ViewChild('scrollIndicatorSecond') scrollIndicatorSecond!: ElementRef;
  @ViewChild('thirdSection') thirdSection!: ElementRef;
  @ViewChild('lawyerText') lawyerText!: ElementRef;
  @ViewChild('lawyerPhoto') lawyerPhoto!: ElementRef;
  @ViewChild('scrollIndicatorThird') scrollIndicatorThird!: ElementRef;
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
      this.startBackgroundRotation();
    });
  }

  ngAfterViewInit(): void {}

  ngAfterViewChecked(): void {
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

  get lawyerIntroText(): string {
    const count = this.lawyersList.length;
    if (count === 2) return 'Deux associés à votre écoute';

    const lawyer = this.displayedLawyer;
    if (!lawyer) return 'Un de nos associés à votre écoute';

    const gender = lawyer.gender;
    if (gender === 'femme') return 'Une associée à votre écoute';
    if (gender === 'homme') return 'Un associé à votre écoute';

    return 'Un(e) de nos associés à votre écoute';
  }

  private startBackgroundRotation(): void {
    setInterval(() => {
      this.backgroundIndex = (this.backgroundIndex + 1) % this.backgroundImages.length;
      this.backgroundImageUrl = this.backgroundImages[this.backgroundIndex];
    }, 5000);
  }

  private launchAnimations(): void {
    // Animation logic here
  }

  private loadSkillData(): void {
    this.wpService.getSkillsData().subscribe((data) => {
      if (data && data.acf) {
        const matchingKey = Object.keys(data.acf).find(
          (key) => key.startsWith('box_') && this.areSlugsEqual(data.acf[key], this.skillSlug)
        );

        if (matchingKey) {
          const boxTitle = data.acf[matchingKey] || '';
          const skillColumns: Array<{ title: string; subtitle: string; icon?: string }> = [];
          const skillTitleSelected = data.acf.title_selected || '';

          for (let i = 1; i <= 4; i++) {
            const tKey = `title_${i}_${matchingKey}`;
            const sKey = `subtitle_${i}_${matchingKey}`;
            const iconKey = `icon_${i}_${matchingKey}`;

            const colTitle = data.acf[tKey] || '';
            const colSubtitle = data.acf[sKey] || '';
            const colIcon = data.acf[iconKey] || null;

            if (colTitle || colSubtitle || colIcon) {
              skillColumns.push({ title: colTitle, subtitle: colSubtitle, icon: colIcon });
            }
          }

          this.selectedSkill = {
            title: boxTitle,
            title_selected: skillTitleSelected,
            columns: skillColumns
          };

          this.titleService.setTitle('Compétence - ' + boxTitle);
          this.setupLawyers(data.acf, boxTitle);
          this.setupFourthSection(data.acf);

          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
        }
      }
    });
  }

  private setupLawyers(acfData: any, boxTitle: string): void {
    const allLawyersDict: { [key: string]: Lawyer } = {
      'title_lawyer_name_1': {
        name: acfData.title_lawyer_name_1,
        photo: acfData.title_lawyer_name_1_image || 'assets/images/placeholder-lawyer.jpg',
        email: acfData.email_lawyer_name_1 || '',
        gender: 'homme'
      },
      'title_lawyer_name_2': {
        name: acfData.title_lawyer_name_2,
        photo: acfData.title_lawyer_name_2_image || 'assets/images/placeholder-lawyer.jpg',
        email: acfData.email_lawyer_name_2 || '',
        gender: 'femme'
      },
      'title_lawyer_name_3': {
        name: acfData.title_lawyer_name_3,
        photo: acfData.title_lawyer_name_3_image || 'assets/images/placeholder-lawyer.jpg',
        email: acfData.email_lawyer_name_3 || '',
        gender: 'femme'
      }
    };

    const lawyerKeys = this.skillLawyerMapping[boxTitle] || [];
    this.lawyersList = lawyerKeys.map((key) => allLawyersDict[key]).filter((l) => !!l?.name);

    if (isPlatformBrowser(this.platformId)) {
      this.setupLawyerRotation();
    }
  }

  private setupFourthSection(acfData: any): void {
    const allSkills = Object.keys(acfData)
      .filter((key) => key.startsWith('box_'))
      .map((key, index) => ({
        title: acfData[key],
        slug: this.generateSlug(acfData[key]),
        icon: acfData[`icon_${index + 1}`] || null
      }));

    this.filteredSkills = allSkills.filter((skill) => skill.slug !== this.skillSlug);
  }

  private setupLawyerRotation(): void {
    if (this.lawyersList.length > 0) {
      this.currentIndex = 0;
      this.displayedLawyer = this.lawyersList[0];

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
        this.currentIndex = (this.currentIndex + 1) % this.lawyersList.length;
        this.displayedLawyer = this.lawyersList[this.currentIndex];
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
