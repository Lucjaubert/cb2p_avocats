import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-selected-skill',
  standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
      CommonModule,
      RouterModule,
    ],
  templateUrl: './selected-skill.component.html',
  styleUrl: './selected-skill.component.scss'
})
export class SelectedSkillComponent {

}
