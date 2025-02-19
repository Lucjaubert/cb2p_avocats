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
        // On génère une liste { title, slug } à partir des "box_?"
        this.skillsList = Object.keys(this.skillsData)
          .filter(key => key.startsWith('box_'))
          .map(key => {
            const boxTitle = this.skillsData[key];
            return {
              title: boxTitle,
              // IMPORTANT : on retire ou on adapte la regex
              // pour NE PAS supprimer les accents.
              // Minimalement, on peut faire :
              slug: this.generateSlug(boxTitle)
            };
          });
      }
    });
  }

  // Simplifie ou adapte la regex pour AUTORISER les accents
  // (ex. en supprimant la ligne [^\w-]).
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      // .replace(/[\u0300-\u036f]/g, '') // (déjà commenté)
      .replace(/\s+/g, '-')
      // si vous laissez cette ligne, TOUT caractère non [a-z0-9_-] sera supprimé
      // => accent supprimé !
      // .replace(/[^\w-]+/g, '')
      ;
  }

  goToSelectedSkill(slug: string): void {
    console.log('Original slug:', slug);

    // ENCODAGE du slug (caractères spéciaux -> %xx)
    const encodedSlug = encodeURIComponent(slug);
    console.log('Encoded slug:', encodedSlug);

    // Navigation : on place encodedSlug dans l’URL
    this.router.navigate(['/competence-selectionnee', encodedSlug]);
  }


  /**
   * Scroll fluide vers une section de la page (usage facultatif).
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
