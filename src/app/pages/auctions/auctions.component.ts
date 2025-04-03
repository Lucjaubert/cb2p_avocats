import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  AfterViewChecked,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  imports: [CommonModule, RouterModule]
})
export class AuctionsComponent implements OnInit, AfterViewInit, AfterViewChecked {

  auctionsData: {
    title: string;
    subtitle: string;
    items: AuctionItem[];
  } = {
    title: '',
    subtitle: '',
    items: []
  };

  @ViewChild('firstSection') firstSection!: ElementRef;
  @ViewChild('mainTitle') mainTitle!: ElementRef;
  @ViewChild('subtitle') subtitleElement!: ElementRef;
  @ViewChild('scrollIndicatorFirst') scrollIndicatorFirst!: ElementRef;

  @ViewChildren('auctionItem') auctionItems!: QueryList<ElementRef>;
  @ViewChildren('auctionTextElement') auctionTextElements!: QueryList<ElementRef>;
  @ViewChildren('auctionImage') auctionImages!: QueryList<ElementRef>;
  @ViewChildren('scrollIndicator') scrollIndicators!: QueryList<ElementRef>;

  animationExecuted = false;

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

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {
    if (this.auctionsData.items.length > 0 && !this.animationExecuted) {
      if (this.firstSection && this.mainTitle && this.subtitleElement && this.scrollIndicatorFirst) {
        gsap.set(this.scrollIndicatorFirst.nativeElement, { opacity: 0, y: 20 });
        const tlHero = gsap.timeline({
          scrollTrigger: {
            trigger: this.firstSection.nativeElement,
            start: 'top bottom'
          }
        });
        tlHero
          .from(this.mainTitle.nativeElement, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out'
          })
          .from(this.subtitleElement.nativeElement, {
            opacity: 0,
            y: 50,
            duration: 0.7,
            ease: 'power2.out'
          }, '-=0.5')
          .fromTo(
            this.scrollIndicatorFirst.nativeElement,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            '>+0.5'
          );
      }
      this.auctionItems.forEach((itemRef) => {
        const item = itemRef.nativeElement;
        const textCol = item.querySelector('.auction-text');
        const imgCol = item.querySelector('.auction-image');
        const textEls = [...textCol.querySelectorAll('h5, p, div, a')];
        const scrollEl = item.querySelector('.scroll-indicator');
        gsap.set(textEls, { opacity: 0, y: 30 });
        if (imgCol) {
          const imgTag = imgCol.querySelector('img');
          if (imgTag) {
            gsap.set(imgTag, { opacity: 0, x: 50 });
          }
        }
        if (scrollEl) {
          gsap.set(scrollEl, { opacity: 0, y: 20 });
        }
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top bottom'
          }
        });
        tl.to(textEls, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out'
        });
        if (imgCol) {
          const imgTag = imgCol.querySelector('img');
          if (imgTag) {
            tl.to(imgTag, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power2.out'
            }, '+=0.2');
          }
        }
        if (scrollEl) {
          tl.to(scrollEl, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          }, '+=0.2');
        }
      });
      this.animationExecuted = true;
    }
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToNextAuction(index: number): void {
    const nextId = `auction-${index + 1}`;
    const el = document.getElementById(nextId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
