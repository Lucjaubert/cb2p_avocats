import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';

@Component({
  selector: 'app-office',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss'],
})
export class OfficeComponent implements OnInit {
  officeData: any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Le Cabinet - CB2P Avocats');
    this.metaService.updateTag({ name: 'description', content: 'Découvrez notre cabinet, nos valeurs et notre expertise juridique.' });

    this.wpService.getOfficeData().subscribe((data) => {
      this.officeData = data;
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
