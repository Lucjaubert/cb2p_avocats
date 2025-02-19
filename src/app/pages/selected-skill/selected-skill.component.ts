import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const encodedSlug = this.route.snapshot.paramMap.get('slug') || '';
    this.skillSlug = decodeURIComponent(encodedSlug);

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

          const allLawyersDict: { [key: string]: Lawyer } = {};

          if (data.acf.title_lawyer_name_1) {
            allLawyersDict['title_lawyer_name_1'] = {
              name: data.acf.title_lawyer_name_1,
              photo:
                data.acf.title_lawyer_name_1_image?.url ||
                data.acf.title_lawyer_name_1_image ||
                'assets/images/placeholder-lawyer.jpg',
              email: data.acf.email_lawyer_name_1 || '' 
            };
          }

          if (data.acf.title_lawyer_name_2) {
            allLawyersDict['title_lawyer_name_2'] = {
              name: data.acf.title_lawyer_name_2,
              photo:
                data.acf.title_lawyer_name_2_image?.url ||
                data.acf.title_lawyer_name_2_image ||
                'assets/images/placeholder-lawyer.jpg',
              email: data.acf.email_lawyer_name_2 || '' 
            };
          }

          if (data.acf.title_lawyer_name_3) {
            allLawyersDict['title_lawyer_name_3'] = {
              name: data.acf.title_lawyer_name_3,
              photo:
                data.acf.title_lawyer_name_3_image?.url ||
                data.acf.title_lawyer_name_3_image ||
                'assets/images/placeholder-lawyer.jpg',
              email: data.acf.email_lawyer_name_3 || '' 
            };
          }

          const lawyerKeys = this.skillLawyerMapping[boxTitle] || [];
          this.lawyersList = lawyerKeys
            .map((key) => allLawyersDict[key])
            .filter((l) => !!l?.name);

          if (isPlatformBrowser(this.platformId)) {
            this.setupLawyerRotation();
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  private areSlugsEqual(text1: string, text2: string): boolean {
    const slug1 = this.generateSlug(text1);
    const slug2 = this.generateSlug(text2);
    return slug1 === slug2;
  }

  private setupLawyerRotation(): void {
    if (this.lawyersList.length > 0) {
      this.currentIndex = 0;
      this.displayedLawyer = this.lawyersList[0];
      if (this.lawyersList.length > 1) {
        this.rotationInterval = setInterval(() => {
          this.currentIndex = (this.currentIndex + 1) % this.lawyersList.length;
          this.displayedLawyer = this.lawyersList[this.currentIndex];
        }, 3000);
      }
    } else {
      this.displayedLawyer = null;
    }
  }

  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
