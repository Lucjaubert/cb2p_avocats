import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-office',
  standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
      CommonModule,
      RouterModule,
    ],
  templateUrl: './office.component.html',
  styleUrl: './office.component.scss'
})
export class OfficeComponent {

}
