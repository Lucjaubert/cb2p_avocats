import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
})
export class HomepageComponent implements OnInit, AfterViewInit {
  homepageData: any;

  @ViewChild('logo') logo!: ElementRef;
  @ViewChild('separator') separator!: ElementRef;
  @ViewChild('words') words!: ElementRef;
  @ViewChild('title1') title1!: ElementRef;
  @ViewChild('scrollIndicator') scrollIndicator!: ElementRef;

  @ViewChild('title2') title2!: ElementRef;
  @ViewChild('subtitle2') subtitle2!: ElementRef;
  @ViewChild('arrowRight') arrowRight!: ElementRef;
  @ViewChild('scrollIndicator2') scrollIndicator2!: ElementRef;

  @ViewChild('title3') title3!: ElementRef;
  @ViewChildren('portrait') portraits!: QueryList<ElementRef>;
  @ViewChild('teamCallToAction') teamCallToAction!: ElementRef;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Accueil - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Avocats, contentieux, conseils à Bordeaux',
    });

    this.wpService.getHomepageData().subscribe((data) => {
      this.homepageData = data;
    });
  }

  ngAfterViewInit(): void {
    const tl1 = gsap.timeline();

    tl1
      .from(this.logo.nativeElement, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power2.out',
      })
      .to(this.separator.nativeElement, {
        scaleY: 1,
        duration: 1.5,
        transformOrigin: 'top',
        ease: 'power2.out',
      }, '-=0.4')
      .from(this.words.nativeElement.children, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
      }, '-=0.2')
      .from(this.title1.nativeElement, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
      }, '+=0.3')
      .from(this.scrollIndicator.nativeElement, {
        opacity: 0,
        y: 10,
        duration: 1,
        ease: 'power2.out',
      }, '+=0.3');

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: this.title2.nativeElement,
        start: 'top 80%',
        once: true,
      },
    });

    tl2
      .from(this.title2.nativeElement, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
      })
      .from([this.subtitle2.nativeElement, this.arrowRight.nativeElement], {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4')
      .from(this.scrollIndicator2.nativeElement, {
        opacity: 0,
        y: 10,
        duration: 1,
        ease: 'power2.out',
      }, '+=0.3');

    // ✅ Lorsque les portraits sont rendus (via *ngIf), déclencher l’animation
    this.portraits.changes.subscribe((list: QueryList<ElementRef>) => {
      if (list.length > 0) {
        const tl3 = gsap.timeline({
          scrollTrigger: {
            trigger: this.title3.nativeElement,
            start: 'top 80%',
            once: true,
          },
        });

        tl3.from(this.title3.nativeElement, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power2.out',
        });

        list.forEach((portrait, i) => {
          tl3.from(portrait.nativeElement, {
            opacity: 0,
            rotateY: 90,
            transformOrigin: 'center',
            duration: 0.6,
            ease: 'power2.out',
          }, `-=${i === 0 ? 0 : 0.4}`);
        });

        tl3.from(this.teamCallToAction.nativeElement, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: 'power2.out',
        }, '+=0.3');
      }
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToTeam(): void {
    this.router.navigate(['/equipe']);
  }

  goToSkills(): void {
    this.router.navigate(['/competences']);
  }
}
