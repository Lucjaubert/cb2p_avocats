import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';

@Component({
  selector: 'app-office',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss'],
})
export class OfficeComponent implements OnInit {
  officeData: any;
  skillList: Array<{ title: string; slug: string }> = [];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Le Cabinet - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez notre cabinet, nos valeurs et notre expertise juridique.'
    });

    this.wpService.getOfficeData().subscribe(
      (data) => {
        console.log('OfficeComponent - getOfficeData() response : ', data);
        this.officeData = data;
        this.buildSkillList();
      },
      (error) => {
        console.error('OfficeComponent - getOfficeData() error : ', error);
      }
    );
  }

  private buildSkillList(): void {
    for (let i = 1; i <= 10; i++) {
      const skillName = this.officeData?.[`skill_${i}`];
      if (skillName) {
        const slug = this.generateSlug(skillName);
        console.log(
          `OfficeComponent - buildSkillList: skill_${i} = `,
          skillName,
          'slug=',
          slug
        );
        this.skillList.push({ title: skillName, slug });
      }
    }
    console.log('OfficeComponent - skillList : ', this.skillList);
  }

  goToSelectedSkill(slug: string): void {
    console.log('OfficeComponent - goToSelectedSkill() slug=', slug);
    const encodedSlug = encodeURIComponent(slug);
    this.router.navigate(['/competence-selectionnee', encodedSlug]);
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

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
