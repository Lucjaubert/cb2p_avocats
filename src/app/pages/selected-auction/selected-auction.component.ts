import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-selected-auction',
  templateUrl: './selected-auction.component.html',
  styleUrls: ['./selected-auction.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SelectedAuctionComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  data: any = {};
  safeText: SafeHtml = '';
  safeInfo: SafeHtml = '';

  // SECTION 1 : HERO
  @ViewChild('firstSection') firstSection!: ElementRef;
  @ViewChild('mainTitle') mainTitle!: ElementRef;
  @ViewChild('subtitle') subtitleElement!: ElementRef;
  @ViewChild('scrollIndicatorFirst') scrollIndicatorFirst!: ElementRef;

  // SECTION 2 : DESCRIPTION
  @ViewChild('descriptionSection') descriptionSection!: ElementRef;
  @ViewChild('descText') descText!: ElementRef;
  @ViewChild('descImage') descImage!: ElementRef;
  @ViewChild('descScrollIndicator') descScrollIndicator!: ElementRef;

  // SECTION 3 : INFOS
  @ViewChild('infosSection') infosSection!: ElementRef;
  @ViewChild('infosText') infosText!: ElementRef;
  @ViewChild('infosImages') infosImages!: ElementRef;
  @ViewChild('infosScrollIndicator') infosScrollIndicator!: ElementRef;

  // SECTION 4 : PHOTOS
  @ViewChild('photosSection') photosSection!: ElementRef;
  @ViewChild('photosRow') photosRow!: ElementRef;
  @ViewChild('photosScrollIndicator') photosScrollIndicator!: ElementRef;

  // SECTION 5 : DOCUMENTS
  @ViewChild('documentsSection') documentsSection!: ElementRef;

  animationExecuted = false;

  constructor(
    private route: ActivatedRoute,
    private wordpressService: WordpressService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const index = parseInt(this.route.snapshot.paramMap.get('id') || '1', 10);

    this.wordpressService.getAuctionDetailsByIndex(index).subscribe((detail) => {
      this.data = detail;

      // On nettoie le HTML en retirant les styles inline
      this.safeText = this.sanitizer.bypassSecurityTrustHtml(
        (detail.text || '').replace(/style="[^"]*"/g, '')
      );
      this.safeInfo = this.sanitizer.bypassSecurityTrustHtml(
        (detail.info || '').replace(/style="[^"]*"/g, '')
      );
    });
  }

  ngAfterViewInit(): void {
    // On ne fait rien de particulier ici, car on va animer tout
    // dans ngAfterViewChecked, quand data est chargé
  }

  ngAfterViewChecked(): void {
    // On attend que data soit chargé ET on ne refait pas l'anim si déjà exécuté
    if (this.data && Object.keys(this.data).length > 0 && !this.animationExecuted) {
      console.log('[SelectedAuction] -> Lancement des animations GSAP');

      // ---------- SECTION 1 : HERO ----------
      if (
        this.firstSection &&
        this.mainTitle &&
        this.subtitleElement &&
        this.scrollIndicatorFirst
      ) {
        // On masque le scrollIndicator avant l'animation
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
          // On place le scrollIndicator après le sous-titre
          .fromTo(
            this.scrollIndicatorFirst.nativeElement,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            '>+0.3'
          );
      }

      // ---------- SECTION 2 : DESCRIPTION ----------
      if (
        this.descriptionSection &&
        this.descText &&
        this.descImage &&
        this.descScrollIndicator
      ) {
        gsap.set(this.descScrollIndicator.nativeElement, { opacity: 0, y: 20 });

        const imgEl = this.descImage.nativeElement.querySelector('img');
        if (imgEl) {
          gsap.set(imgEl, { opacity: 0, x: 50 });
        }

        const tlDesc = gsap.timeline({
          scrollTrigger: {
            trigger: this.descriptionSection.nativeElement,
            start: 'top bottom'
          }
        });

        tlDesc
          .from(this.descText.nativeElement, {
            opacity: 0,
            x: -40,
            duration: 0.7,
            ease: 'power2.out'
          })
          .to(imgEl, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power2.out'
          }, '+=0.1')
          .to(this.descScrollIndicator.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          }, '+=0.2');
      }

      // ---------- SECTION 3 : INFOS ----------
      if (
        this.infosSection &&
        this.infosText &&
        this.infosImages &&
        this.infosScrollIndicator
      ) {
        gsap.set(this.infosScrollIndicator.nativeElement, { opacity: 0, y: 20 });

        const tlInfos = gsap.timeline({
          scrollTrigger: {
            trigger: this.infosSection.nativeElement,
            start: 'top bottom'
          }
        });

        tlInfos
          .from(this.infosText.nativeElement, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power2.out'
          })
          .from(
            this.infosImages.nativeElement.querySelectorAll('img'),
            {
              opacity: 0,
              scale: 0.85,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out'
            },
            '+=0.2'
          )
          .to(this.infosScrollIndicator.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
          }, '+=0.3');
      }

      // ---------- SECTION 4 : PHOTOS ----------
      if (this.photosSection && this.photosRow && this.photosScrollIndicator) {
        gsap.set(this.photosScrollIndicator.nativeElement, { opacity: 0, y: 20 });

        const tlPhotos = gsap.timeline({
          scrollTrigger: {
            trigger: this.photosSection.nativeElement,
            start: 'top bottom'
          }
        });

        tlPhotos
          .from(
            this.photosRow.nativeElement.querySelectorAll('img'),
            {
              opacity: 0,
              scale: 0.85,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out'
            }
          )
          .to(this.photosScrollIndicator.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
          }, '+=0.2');
      }

      // ---------- SECTION 5 : DOCUMENTS ----------
      if (this.documentsSection) {
        const tlDocs = gsap.timeline({
          scrollTrigger: {
            trigger: this.documentsSection.nativeElement,
            start: 'top bottom'
          }
        });

        tlDocs.from(this.documentsSection.nativeElement, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }

      // Empêche la ré-exécution
      this.animationExecuted = true;
    }
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
