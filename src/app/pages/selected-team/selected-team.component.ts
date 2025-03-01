import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';

// La même fonction slugify
function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâ]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/ô/g, 'o')
    .replace(/ùû]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Component({
  selector: 'app-selected-team',
  standalone: true,
  templateUrl: './selected-team.component.html',
  styleUrls: ['./selected-team.component.scss'],
  imports: [CommonModule]
})
export class SelectedTeamComponent implements OnInit {

  displayedMember: {
    isLawyer: boolean;
    name: string;
    photo: string;
    functionHtml?: string;
    presentationHtml?: string;
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordpressService
  ) {}

  ngOnInit(): void {
    // Récupérer :slug (ex: "louis-coulaud")
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    // Charger l'unique post WP "team"
    this.wpService.getTeamData().subscribe((data: any) => {
      const item = Array.isArray(data) && data.length > 0 ? data[0] : data;
      const acfObj = item?.acf || null;
      if (!acfObj) return;

      // 1) Tenter de trouver un avocat (1..6) dont le "lawyer_name_X" slugifie = slug
      let foundId: number | null = null;
      let foundIsLawyer = false;

      for (let i = 1; i <= 6; i++) {
        const rawName = acfObj[`lawyer_name_${i}`];
        if (!rawName) continue;

        if (slugify(rawName) === slug) {
          foundId = i;
          foundIsLawyer = true;
          break;
        }
      }

      // 2) Sinon, tenter assistants (1..3)
      if (!foundId) {
        for (let a = 1; a <= 3; a++) {
          const rawName = acfObj[`assistant_name_${a}`];
          if (!rawName) continue;

          if (slugify(rawName) === slug) {
            foundId = a + 6; // 7, 8, 9
            foundIsLawyer = false;
            break;
          }
        }
      }

      if (!foundId) {
        // On n'a rien trouvé => optionnel, redirection ou message
        return;
      }

      // 3) Construire les clés ACF
      let nameKey = '';
      let photoKey = '';
      let presentationKey = '';
      let functionKey = '';

      if (foundIsLawyer) {
        nameKey = `lawyer_name_${foundId}`;
        photoKey = `lawyer_image_${foundId}`;
        presentationKey = `lawyer_name_${foundId}_presentation`;
        functionKey = `lawyer_name_function_${foundId}`;
      } else {
        const assistantIndex = foundId - 6;
        nameKey = `assistant_name_${assistantIndex}`;
        photoKey = `assistant_image_${assistantIndex}`;
        presentationKey = `assistant_name_${assistantIndex}_presentation`;
        functionKey = `assistant_name_${assistantIndex}_function`;
      }

      // 4) Alimente displayedMember
      this.displayedMember = {
        isLawyer: foundIsLawyer,
        name: acfObj[nameKey] || 'Inconnu',
        photo: acfObj[photoKey] || 'assets/images/placeholder.png',
        functionHtml: acfObj[functionKey] || '',
        presentationHtml: acfObj[presentationKey] || ''
      };
    });
  }
}
