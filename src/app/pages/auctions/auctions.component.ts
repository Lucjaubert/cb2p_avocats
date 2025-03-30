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

  // Références pour la section HERO
  @ViewChild('firstSection') firstSection!: ElementRef;
  @ViewChild('mainTitle') mainTitle!: ElementRef;
  @ViewChild('subtitle') subtitleElement!: ElementRef;
  @ViewChild('scrollIndicatorFirst') scrollIndicatorFirst!: ElementRef;

  // Références pour la section list-section
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
    // Nous attendons que les données soient chargées
  }

  ngAfterViewChecked(): void {
    if (this.auctionsData.items.length > 0 && !this.animationExecuted) {
      console.log('ngAfterViewChecked -> lancement des animations');

      // ---------- SECTION 1 : HERO ----------
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
          .fromTo(this.scrollIndicatorFirst.nativeElement,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            ">+0.5"
          );
      }

      // ---------- SECTION 2 : Pour chaque enchère ----------
      this.auctionItems.forEach((auctionItemRef) => {
        const auctionItem = auctionItemRef.nativeElement;
        const textEls = this.auctionTextElements
          .toArray()
          .filter(elRef => elRef.nativeElement.closest('.auction-item') === auctionItem)
          .map(elRef => elRef.nativeElement);

        const imageContainer = this.auctionImages
          .toArray()
          .find(imgRef => imgRef.nativeElement.closest('.auction-item') === auctionItem)
          ?.nativeElement || null;

        const indicatorEl = this.scrollIndicators
          .toArray()
          .find(indRef => indRef.nativeElement.closest('.auction-item') === auctionItem)
          ?.nativeElement || null;

        if (imageContainer) {
          const imgEl = imageContainer.querySelector('img');
          if (imgEl) {
            gsap.set(imgEl, { opacity: 0, x: 50 });
          }
        }
        if (indicatorEl) {
          gsap.set(indicatorEl, { opacity: 0, y: 20 });
        }

        const tlAuction = gsap.timeline({
          scrollTrigger: {
            trigger: auctionItem,
            start: 'top bottom'
          }
        });
        tlAuction.from(textEls, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out'
        });
        if (imageContainer) {
          const imgEl = imageContainer.querySelector('img');
          if (imgEl) {
            tlAuction.to(imgEl, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power2.out'
            }, '+=0.1');
          }
        }
        if (indicatorEl) {
          tlAuction.to(indicatorEl, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          }, '+=0.1');
        }
      });

      this.animationExecuted = true;
    }
  }

  scrollToSection(sectionId: string): void {
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
