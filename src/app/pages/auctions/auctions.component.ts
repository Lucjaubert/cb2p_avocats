import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auctions',
  standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
      CommonModule,
      RouterModule,
    ],
  templateUrl: './auctions.component.html',
  styleUrl: './auctions.component.scss'
})
export class AuctionsComponent {

}
