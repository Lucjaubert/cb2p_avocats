import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';

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
export class SelectedSkillComponent implements OnInit, OnDestroy {
  skillSlug = '';
  selectedSkill: {
    title?: string;
    title_selected?: string;
    columns?: Array<{ title: string; subtitle: string }>;
  } | null = null;

  lawyersList: Lawyer[] = [];
  displayedLawyer: Lawyer | null = null;
  filteredSkills: Array<{ title: string; slug: string }> = [];
  private rotationInterval: any;
  private currentIndex = 0;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const newSlug = decodeURIComponent(params.get('slug') || '');
      this.skillSlug = newSlug;
      this.loadSkillData();
    });
  }

  private loadSkillData(): void {
    this.wpService.getSkillsData().subscribe((data) => {
      if (data && data.acf) {
        const matchingKey = Object.keys(data.acf).find((key) =>
          key.startsWith('box_') &&
          this.areSlugsEqual(data.acf[key], this.skillSlug)
        );

        if (matchingKey) {
          const boxTitle = data.acf[matchingKey] || '';
          const skillColumns: Array<{ title: string; subtitle: string }> = [];
          const skillTitleSelected = data.acf.title_selected || '';

          for (let i = 1; i <= 4; i++) {
            const tKey = `title_${i}_${matchingKey}`;
            const sKey = `subtitle_${i}_${matchingKey}`;
            const colTitle = data.acf[tKey] || '';
            const colSubtitle = data.acf[sKey] || '';
            if (colTitle || colSubtitle) {
              skillColumns.push({ title: colTitle, subtitle: colSubtitle });
            }
          }

          this.selectedSkill = {
            title: boxTitle,
            title_selected: skillTitleSelected,
            columns: skillColumns
          };

          this.titleService.setTitle(`Compétence - ${boxTitle}`);
          this.setupLawyers(data.acf, boxTitle);
          this.setupFourthSection(data.acf);
        }
      }
    });
  }

  private areSlugsEqual(text1: string, text2: string): boolean {
    return this.generateSlug(text1) === this.generateSlug(text2);
  }

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

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

    const lawyerKeys = this.skillLawyerMapping[boxTitle] || [];
    this.lawyersList = lawyerKeys
      .map(key => allLawyersDict[key])
      .filter(l => !!l?.name);

    if (isPlatformBrowser(this.platformId)) {
      this.setupLawyerRotation();
    }
  }

  private setupFourthSection(acfData: any): void {
    const allSkills = Object.keys(acfData)
      .filter(key => key.startsWith('box_'))
      .map(key => ({
        title: acfData[key],
        slug: this.generateSlug(acfData[key])
      }));

    this.filteredSkills = allSkills.filter(skill => skill.slug !== this.skillSlug);
  }

  private setupLawyerRotation(): void {
    if (this.lawyersList.length > 0) {
      this.currentIndex = 0;
      this.displayedLawyer = this.lawyersList[0];
      if (this.lawyersList.length > 1) {
        this.rotationInterval = setInterval(() => {
          this.currentIndex = (this.currentIndex + 1) % this.lawyersList.length;
          this.displayedLawyer = this.lawyersList[this.currentIndex];
        }, 3500);
      }
    } else {
      this.displayedLawyer = null;
    }
  }

  navigateToSkill(skillSlug: string): void {
    this.router.navigate(['/competence-selectionnee', skillSlug]).then(() => {
      // Une fois la navigation terminée
      if (isPlatformBrowser(this.platformId)) {
        // On cible l'élément de la nouvelle page
        const firstSection = document.getElementById('first-section');
        if (firstSection) {
          firstSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }



  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }
}
