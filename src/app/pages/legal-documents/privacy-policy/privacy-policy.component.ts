import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Centre de confidentialité - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez nos pages DPO, politiques de cookies, mentions légales, etc.'
    });
  }

  openConsentPopup(): void {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new Event('cmplz_open_settings'));
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
