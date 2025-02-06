import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class HomepageComponent implements OnInit {
  homepageData: any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService
  ) {}

  ngOnInit(): void {
    this.wpService.getHomepageData().subscribe((data) => {
      this.homepageData = data;
    });
  }
}
