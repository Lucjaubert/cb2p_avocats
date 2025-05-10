import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { forkJoin } from 'rxjs';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomepageComponent implements OnInit, AfterViewInit {
  homepageData: any;
  officeData: any;
  lawyersList: Array<{ photo: string; name: string; function: string }> = [];

  @ViewChild('logo')               logo!: ElementRef;
  @ViewChild('separator')          separator!: ElementRef;
  @ViewChild('words')              words!: ElementRef;
  @ViewChild('sectionTitle')       sectionTitle!: ElementRef;

  @ViewChild('section4')           section4!: ElementRef;
  @ViewChild('line4a')             line4a!: ElementRef;
  @ViewChild('line4b')             line4b!: ElementRef;
  @ViewChild('line4c')             line4c!: ElementRef;
  @ViewChild('title4a')            title4a!: ElementRef;
  @ViewChild('title4b')            title4b!: ElementRef;
  @ViewChild('title4c')            title4c!: ElementRef;
  @ViewChild('subtitle4a')         subtitle4a!: ElementRef;
  @ViewChild('subtitle4b')         subtitle4b!: ElementRef;
  @ViewChild('subtitle4c')         subtitle4c!: ElementRef;

  @ViewChild('title2')             title2!: ElementRef;
  @ViewChild('subtitle2')          subtitle2!: ElementRef;
  @ViewChild('arrowRight')         arrowRight!: ElementRef;
  @ViewChild('scrollIndicator2')   scrollIndicator2?: ElementRef;

  @ViewChild('thirdSection')       thirdSection!: ElementRef;
  @ViewChild('title3')             title3!: ElementRef;
  @ViewChildren('portrait')        portraits!: QueryList<ElementRef>;
  @ViewChild('teamCallToAction')   teamCallToAction!: ElementRef;

  @ViewChild('section6')           section6!: ElementRef;
  @ViewChild('title6')             title6!: ElementRef;

  constructor(
    private titleSrv: Title,
    private metaSrv: Meta,
    private wp: WordpressService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.titleSrv.setTitle('Accueil - CB2P Avocats');
    this.metaSrv.updateTag({ name: 'description', content: 'Avocats, contentieux, conseils à Bordeaux' });

    forkJoin({
      homepage: this.wp.getHomepageData(),
      office  : this.wp.getOfficeData(),
    }).subscribe(({ homepage, office }) => {
      this.homepageData = homepage;
      this.officeData   = office;

      for (let i = 1; i <= 6; i++) {
        const img = homepage?.[`image_${i}`];
        if (img) {
          this.lawyersList.push({
            photo    : img,
            name     : office?.acf?.[`lawyer_name_${i}`]     ?? '',
            function : office?.acf?.[`lawyer_${i}_function`] ?? '',
          });
        }
      }

      this.cdr.detectChanges();

      this.initSecondSection();
      this.initThirdSection();
      this.initFourthSection();
      this.initSixthSection();

      ScrollTrigger.refresh();
    });
  }

  ngAfterViewInit(): void {
    this.initFirstSection();

    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => ScrollTrigger.refresh());
    }
  }

  private initFirstSection(): void {
    gsap.timeline({
      scrollTrigger: { trigger: this.logo.nativeElement, start: 'top 80%', once: true },
    })
    .from(this.logo.nativeElement,        { opacity: 0, y: -50, duration: 1 })
    .to(this.separator.nativeElement,     { scaleY: 1, transformOrigin: 'top', duration: 1.5 }, '-=0.4')
    .from(this.words.nativeElement.children, { opacity: 0, y: 20, duration: 2.5, stagger: 0.7 }, '-=0.2')
    .from(this.sectionTitle.nativeElement,  { opacity: 0, y: 20, duration: 1 });
  }

  private initSecondSection(): void {
    if (!this.title2) return;

    const tl2 = gsap.timeline({
      scrollTrigger: { trigger: this.title2.nativeElement, start: 'top 80%', once: true },
    });

    tl2.from(this.title2.nativeElement, { opacity: 0, y: 30, duration: 1 })
       .from([this.subtitle2.nativeElement, this.arrowRight.nativeElement],
             { opacity: 0, y: 20, duration: 0.6, stagger: 0.2 }, '-=0.4');

    if (this.scrollIndicator2) {
      tl2.from(this.scrollIndicator2.nativeElement, { opacity: 0, y: 10, duration: 0.3 }, '+=0.3');
    }
  }

  private initThirdSection(): void {
    const cards = this.portraits.toArray().map(p => p.nativeElement);
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, rotateY: 90, transformOrigin: 'center' });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: this.thirdSection.nativeElement, start: 'top 80%', once: true }
    });

    tl.from(this.title3.nativeElement, { opacity: 0, y: 50, duration: 0.5, ease: 'power2.out' }, '+=0.3');

    cards.forEach((el, i) => {
      tl.to(el, {
        opacity: 1,
        rotateY: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, i === 0 ? '+=0.3' : '-=0.4');
    });

    tl.from(this.teamCallToAction.nativeElement, { opacity: 0, y: 20, duration: 1, ease: 'power2.out' }, '>');
  }


  private initFourthSection(): void {
    if (!this.section4) return;

    const lines = [this.line4a.nativeElement, this.line4b.nativeElement, this.line4c.nativeElement];
    gsap.set(lines, { scaleX: 0, transformOrigin: 'left center' });

    gsap.timeline({
      scrollTrigger: { trigger: this.section4.nativeElement, start: 'top 80%', once: true },
    })
    .to(lines, { scaleX: 1, duration: 0.7, stagger: 0.2, ease: 'power2.out' })
    .from([this.title4a.nativeElement, this.title4b.nativeElement, this.title4c.nativeElement],
          { opacity: 0, y: 40, duration: 0.5, stagger: 0.2 }, '+=0.3')
    .from([this.subtitle4a.nativeElement, this.subtitle4b.nativeElement, this.subtitle4c.nativeElement],
          { opacity: 0, y: 20, duration: 0.5, stagger: 0.2 }, '+=0.3');
  }

  private initSixthSection(): void {
    if (!this.section6) return;

    gsap.timeline({
      scrollTrigger: { trigger: this.section6.nativeElement, start: 'top 80%', once: true },
    })
    .from(this.section6.nativeElement, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: 'power2.out',
    })
    .from(this.title6.nativeElement, {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.6');
  }

  goToTeam(): void   { this.router.navigate(['/equipe']); }
  goToSkills(): void { this.router.navigate(['/competences']); }
}
