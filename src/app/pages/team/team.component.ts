import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâ]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/ô/g, 'o')
    .replace(/ùû]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-') // Remplace tout caractère non alphanum par des "-"
    .replace(/^-+|-+$/g, '');   // Retire des "-" en début ou fin de chaîne
}

@Component({
  selector: 'app-team',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  teamData: any = null;

  lawyersList: Array<{ photo: string; nameFuncHtml: string }> = [];
  assistantsList: Array<{ photo: string; nameFuncHtml: string }> = [];

  constructor(
    private wpService: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wpService.getTeamData().subscribe((data) => {
      // data peut être un tableau [ { ... } ] ou un objet { ... }
      const item = Array.isArray(data) && data.length > 0 ? data[0] : data;
      this.teamData = item || null;

      if (this.teamData) {
        // Avocats (IDs 1..6)
        for (let i = 1; i <= 6; i++) {
          const photoKey = `lawyer_image_${i}`;
          const funcKey = `lawyer_name_function_${i}`;
          this.lawyersList.push({
            photo: this.teamData[photoKey] || '',
            nameFuncHtml: this.teamData[funcKey] || ''
          });
        }

        // Assistants (IDs 1..3)
        for (let a = 1; a <= 3; a++) {
          const photoKey = `assistant_image_${a}`;
          const nameKey = `assistant_name_${a}`;
          const funcKey = `assistant_name_${a}_function`;

          const name = this.teamData[nameKey] || '';
          const funcHtml = this.teamData[funcKey] || '';
          const nameFuncHtml = `<p>${name}</p>` + funcHtml;

          this.assistantsList.push({
            photo: this.teamData[photoKey] || '',
            nameFuncHtml
          });
        }
      }
    });
  }

  /**
   * Permet de scroller en douceur vers la section choisie (first-section, second-section, etc.)
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Redirige vers /selected-team/:id
   * @param index l'indice de l'élément dans la liste
   * @param isLawyer true si c'est un avocat, false si c'est un assistant
   */
  goToSelectedMember(index: number, isLawyer: boolean): void {
    let finalId: number;
    if (isLawyer) {
      // Avocats : indices 0..5 => IDs 1..6
      finalId = index + 1;
    } else {
      // Assistants : indices 0..2 => IDs 7..9
      finalId = 6 + (index + 1);
    }
    // Navigate vers /selected-team/:id
    this.router.navigate(['/membre-equipe', finalId]);
  }
}
