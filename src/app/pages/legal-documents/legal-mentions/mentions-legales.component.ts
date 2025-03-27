import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-mentions-legales',
  templateUrl: './mentions-legales.component.html',
  styleUrls: ['./mentions-legales.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MentionsLegalesComponent implements OnInit {
  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Mentions légales - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Consultez nos mentions légales sur le site de CB2P Avocats.'
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
