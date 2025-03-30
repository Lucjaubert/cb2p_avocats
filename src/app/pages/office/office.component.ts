import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-office',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss'],
})
export class OfficeComponent implements OnInit, AfterViewInit {
  officeData: any;
  skillList: Array<{ title: string; slug: string }> = [];

  // Références communes pour sections 1,2,3,5,6
  @ViewChildren('sectionTitle') sectionTitles!: QueryList<ElementRef>;
  @ViewChildren('sectionSubtitle') sectionSubtitles!: QueryList<ElementRef>;
  @ViewChildren('sectionLine') sectionLines!: QueryList<ElementRef>;
  @ViewChildren('sectionScrollIndicator') sectionScrolls!: QueryList<ElementRef>;
  @ViewChild('mainTitle', { static: false }) mainTitle!: ElementRef;

  // Références uniques pour la section 4
  @ViewChild('section4', { static: false }) section4!: ElementRef;
  @ViewChild('line4a', { static: false }) line4a!: ElementRef;
  @ViewChild('line4b', { static: false }) line4b!: ElementRef;
  @ViewChild('line4c', { static: false }) line4c!: ElementRef;
  @ViewChild('title4a', { static: false }) title4a!: ElementRef;
  @ViewChild('title4b', { static: false }) title4b!: ElementRef;
  @ViewChild('title4c', { static: false }) title4c!: ElementRef;
  @ViewChild('subtitle4a', { static: false }) subtitle4a!: ElementRef;
  @ViewChild('subtitle4b', { static: false }) subtitle4b!: ElementRef;
  @ViewChild('subtitle4c', { static: false }) subtitle4c!: ElementRef;
  @ViewChild('scrollIndicator4', { static: false }) scrollIndicator4!: ElementRef;

  // SECTION 5
  @ViewChild('section5', { static: false }) section5!: ElementRef;
  @ViewChild('title5', { static: false }) title5!: ElementRef;
  @ViewChild('subtitle5', { static: false }) subtitle5!: ElementRef;
  @ViewChild('line5', { static: false }) line5!: ElementRef;
  @ViewChild('scrollIndicator5', { static: false }) scrollIndicator5!: ElementRef;
  @ViewChildren('skillParagraph') skillParagraphs!: QueryList<ElementRef>;

  // SECTION 6
  @ViewChild('section6', { static: false }) section6!: ElementRef;
  @ViewChild('title6', { static: false }) title6!: ElementRef;
  @ViewChild('subtitle6', { static: false }) subtitle6!: ElementRef;
  @ViewChild('line6', { static: false }) line6!: ElementRef;
  @ViewChild('scrollIndicator6', { static: false }) scrollIndicator6!: ElementRef;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Le Cabinet - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez notre cabinet, nos valeurs et notre expertise juridique.'
    });

    this.wpService.getOfficeData().subscribe(
      data => {
        this.officeData = data;
        this.buildSkillList();
      },
      error => {
        console.error('OfficeComponent - getOfficeData() error : ', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // SECTION 1
    if (this.mainTitle) {
      gsap.from(this.mainTitle.nativeElement, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power2.out'
      });
    }
    const titleEl1 = this.sectionTitles.toArray()[0];
    const subtitleEl1 = this.sectionSubtitles.toArray()[0];
    const lineEl1 = this.sectionLines.toArray()[0];
    const scrollEl1 = this.sectionScrolls.toArray()[0];

    const tlSection1 = gsap.timeline({
      scrollTrigger: {
        trigger: titleEl1.nativeElement,
        start: 'top 80%',
        once: true
      }
    });
    tlSection1.from(titleEl1.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power2.out'
    });
    if (subtitleEl1?.nativeElement?.textContent?.trim()) {
      tlSection1.from(subtitleEl1.nativeElement, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power2.out'
      }, '-=0.4');
    }
    if (lineEl1) {
      gsap.set(lineEl1.nativeElement, { scaleX: 0, transformOrigin: 'left' });
      tlSection1.to(lineEl1.nativeElement, {
        scaleX: 1,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.4');
    }
    if (scrollEl1) {
      tlSection1.from(scrollEl1.nativeElement, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: 'power2.out'
      }, '+=0.3');
    }

    // SECTION 2
    const titleEl2 = this.sectionTitles.toArray()[1];
    const subtitleEl2 = this.sectionSubtitles.toArray()[1];
    const lineEl2 = this.sectionLines.toArray()[1];
    const scrollEl2 = this.sectionScrolls.toArray()[1];

    const tlSection2 = gsap.timeline({
      scrollTrigger: {
        trigger: titleEl2.nativeElement,
        start: 'top 80%',
        once: true
      }
    });
    tlSection2.from(titleEl2.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    });
    if (lineEl2) {
      gsap.set(lineEl2.nativeElement, { scaleX: 0, transformOrigin: 'left' });
      tlSection2.to(lineEl2.nativeElement, {
        scaleX: 1,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.4');
    }
    if (scrollEl2) {
      tlSection2.from(scrollEl2.nativeElement, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: 'power2.out'
      }, '+=0.3');
    }

    // SECTION 3
    const titleEl3 = this.sectionTitles.toArray()[2];
    const subtitleEl3 = this.sectionSubtitles.toArray()[2];
    const lineEl3 = this.sectionLines.toArray()[2];
    const scrollEl3 = this.sectionScrolls.toArray()[2];

    const tlSection3 = gsap.timeline({
      scrollTrigger: {
        trigger: titleEl3.nativeElement,
        start: 'top 80%',
        once: true
      }
    });
    tlSection3.from(titleEl3.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    });
    if (lineEl3) {
      gsap.set(lineEl3.nativeElement, { scaleX: 0, transformOrigin: 'left' });
      tlSection3.to(lineEl3.nativeElement, {
        scaleX: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.4');
    }
    if (scrollEl3) {
      tlSection3.from(scrollEl3.nativeElement, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: 'power2.out'
      }, '+=0.3');
    }

    // SECTION 4 (animation distincte)
    const tlSection4 = gsap.timeline({
      scrollTrigger: {
        trigger: this.section4.nativeElement,
        start: 'top 80%',
        once: true
      }
    });
    tlSection4.to(
      [this.line4a.nativeElement, this.line4b.nativeElement, this.line4c.nativeElement],
      {
        scaleX: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.2
      }
    );

    tlSection4.from(
      [this.title4a.nativeElement, this.title4b.nativeElement, this.title4c.nativeElement],
      {
        opacity: 0,
        y: 40,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.2
      },
      '+=0.3'
    );
    tlSection4.from(
      [this.subtitle4a.nativeElement, this.subtitle4b.nativeElement, this.subtitle4c.nativeElement],
      {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.2
      },
      '+=0.3'
    );
    if (this.scrollIndicator4) {
      tlSection4.from(
        this.scrollIndicator4.nativeElement,
        {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: 'power2.out'
        },
        '+=0.3'
      );
    }

    const tlSection5 = gsap.timeline({
      scrollTrigger: {
        trigger: this.section5.nativeElement,
        start: 'top 80%',
        once: true
      }
    });

    tlSection5.from(this.title5.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.set(this.line5.nativeElement, { scaleX: 0, transformOrigin: 'left' });
    tlSection5.to(this.line5.nativeElement, {
      scaleX: 1,
      duration: 1,
      ease: 'power2.out'
    }, '+=0.3');

    tlSection5.from(
      this.skillParagraphs.toArray().map(el => el.nativeElement),
      {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.2
      },
      '+=0.3'
    );

    tlSection5.from(this.scrollIndicator5.nativeElement, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: 'power2.out'
    }, '+=0.3');


    // SECTION 6 (index 5)
    const titleEl6 = this.sectionTitles.toArray()[5];

    const tlSection6 = gsap.timeline({
      scrollTrigger: {
        trigger: this.section6.nativeElement,
        start: 'top 80%',
        once: true
      }
    });
    tlSection6.from(this.title6.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power2.out'
    });
  }

  private buildSkillList(): void {
    for (let i = 1; i <= 10; i++) {
      const skillName = this.officeData?.[`skill_${i}`];
      if (skillName) {
        const slug = this.generateSlug(skillName);
        this.skillList.push({ title: skillName, slug });
      }
    }
  }

  goToSelectedSkill(slug: string): void {
    const encodedSlug = encodeURIComponent(slug);
    this.router.navigate(['/competence-selectionnee', encodedSlug]);
  }

  private generateSlug(title: string): string {
    return title
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-')
      .replace(/-+$/g, '');
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
