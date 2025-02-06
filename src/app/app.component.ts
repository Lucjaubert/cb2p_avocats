import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordpressService } from './services/wordpress.service';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'cb2p_avocats';

  homepageData: any;
  officeData: any;
  skills: any[] = [];
  selectedLawyers: any[] = [];
  team: any[] = [];
  contactData: any;
  auctions: any[] = [];
  selectedAuction: any;

  constructor(private wordpressService: WordpressService) {}

  ngOnInit() {
    this.wordpressService.getHomepageData().subscribe(data => {
      this.homepageData = data;
    });

    this.wordpressService.getOfficeData().subscribe(data => {
      this.officeData = data;
    });

    this.wordpressService.getSkills().subscribe(data => {
      this.skills = data;
    });

    this.wordpressService.getSelectedLawyers().subscribe(data => {
      this.selectedLawyers = data;
    });

    this.wordpressService.getTeam().subscribe(data => {
      this.team = data;
    });

    this.wordpressService.getContactData().subscribe(data => {
      this.contactData = data;
    });

    this.wordpressService.getAuctions().subscribe(data => {
      this.auctions = data;
    });

    this.wordpressService.getSelectedAuction().subscribe(data => {
      this.selectedAuction = data;
    });
  }
}
