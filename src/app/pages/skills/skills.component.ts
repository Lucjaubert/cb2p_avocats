import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { WordpressService } from '../../services/wordpress.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  skillsData: any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService
  ) {}

  ngOnInit(): void {

    this.titleService.setTitle('Compétences - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez nos domaines de compétences.'
    });

    this.wpService.getSkillsData().subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) {
        this.skillsData = data[0];
      }
    });
  }


  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
