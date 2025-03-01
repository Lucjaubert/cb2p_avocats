import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skillsData: any;
  skillsList: Array<{ title: string; slug: string }> = [];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Compétences - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez nos domaines de compétences.'
    });

    this.wpService.getSkillsData().subscribe((data) => {
      if (data && data.acf) {
        this.skillsData = data.acf;
        this.skillsList = Object.keys(this.skillsData)
          .filter(key => key.startsWith('box_'))
          .map(key => {
            const boxTitle = this.skillsData[key];
            return {
              title: boxTitle,
              slug: this.generateSlug(boxTitle)
            };
          });
      }
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      ;
  }

  goToSelectedSkill(slug: string): void {
    console.log('Original slug:', slug);

    const encodedSlug = encodeURIComponent(slug);
    console.log('Encoded slug:', encodedSlug);

    this.router.navigate(['/competence-selectionnee', encodedSlug]);
  }


  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
