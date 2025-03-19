import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selected-auction',
  templateUrl: './selected-auction.component.html',
  styleUrls: ['./selected-auction.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SelectedAuctionComponent implements OnInit {
  data: any = {};
  safeText: SafeHtml = '';
  safeInfo: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private wordpressService: WordpressService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const index = parseInt(this.route.snapshot.paramMap.get('id') || '1', 10);

    this.wordpressService.getAuctionDetailsByIndex(index).subscribe(detail => {
      this.data = detail;
      this.safeText = this.sanitizer.bypassSecurityTrustHtml(detail.text || '');
      this.safeInfo = this.sanitizer.bypassSecurityTrustHtml(detail.info || '');
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
