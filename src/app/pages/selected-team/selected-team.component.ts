import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';

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
    email?: string;
    functionHtml?: string;
    presentationHtml?: string;
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordpressService
  ) {}

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    if (!rawId) {
      return;
    }

    const id = +rawId;
    this.wpService.getTeamData().subscribe((data: any) => {
      const item = Array.isArray(data) && data.length > 0 ? data[0] : data;
      if (!item) {
        return;
      }

      const isLawyer = (id <= 6);

      let nameKey = '';
      let photoKey = '';
      let presentationKey = '';
      let functionKey = '';

      if (isLawyer) {
        nameKey = `lawyer_name_${id}`;
        photoKey = `lawyer_image_${id}`;
        presentationKey = `lawyer_name_${id}_presentation`;
        functionKey = `lawyer_name_function_${id}`;
      } else {
        const assistantIndex = id - 6;
        nameKey = `assistant_name_${assistantIndex}`;
        photoKey = `assistant_image_${assistantIndex}`;
        presentationKey = `assistant_name_${assistantIndex}_presentation`;
        functionKey = `assistant_name_${assistantIndex}_function`;
      }

      const nameVal = item[nameKey] || 'Inconnu';
      const photoVal = item[photoKey] || 'assets/images/placeholder.png';
      const funcVal = item[functionKey] || '';
      const presentationVal = item[presentationKey] || '';

      this.displayedMember = {
        isLawyer,
        name: nameVal,
        photo: photoVal,
        functionHtml: funcVal,
        presentationHtml: presentationVal
      };
    });
  }
}
