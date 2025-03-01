import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';

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

  lawyersList: Array<{
    id: number;
    photo: string;
    nameFuncHtml: string;
  }> = [];

  assistantsList: Array<{
    id: number;
    photo: string;
    nameFuncHtml: string;
  }> = [];

  constructor(
    private wpService: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wpService.getTeamData().subscribe((data) => {
      const item = Array.isArray(data) && data.length > 0 ? data[0] : data;
      this.teamData = item || null;

      if (!this.teamData) {
        return;
      }

      for (let i = 1; i <= 6; i++) {
        const photoKey = `lawyer_image_${i}`;
        const funcKey = `lawyer_name_function_${i}`;

        const photo = this.teamData[photoKey] || '';
        const funcHtml = this.teamData[funcKey] || '';

        this.lawyersList.push({
          id: i,
          photo,
          nameFuncHtml: funcHtml
        });
      }

      for (let a = 1; a <= 3; a++) {
        const photoKey = `assistant_image_${a}`;
        const nameKey = `assistant_name_${a}`;
        const funcKey = `assistant_name_${a}_function`;

        const photo = this.teamData[photoKey] || '';
        const name = this.teamData[nameKey] || '';
        const funcHtml = this.teamData[funcKey] || '';
        const nameFuncHtml = `<p>${name}</p>${funcHtml}`;

        this.assistantsList.push({
          id: 6 + a,
          photo,
          nameFuncHtml
        });
      }
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToSelectedMember(id: number): void {
    this.router.navigate(['/membre-equipe', id]);
  }
}
