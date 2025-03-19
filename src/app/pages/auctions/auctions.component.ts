import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';

interface AuctionItem {
  id: number;
  title: string;
  price: string | null;
  description: string;
  image: string;
}

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class AuctionsComponent implements OnInit {
  auctionsData: {
    title: string;
    subtitle: string;
    items: AuctionItem[];
  } = {
    title: '',
    subtitle: '',
    items: []
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Ventes aux enchères - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Consultez toutes les ventes aux enchères menées par le cabinet CB2P.'
    });

    this.wpService.getAllAuctionsSummary().subscribe((data) => {
      this.auctionsData = data;
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToNextAuction(index: number): void {
    const nextId = `auction-${index + 1}`;
    const element = document.getElementById(nextId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
