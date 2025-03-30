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
  selector: 'app-skills',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, AfterViewInit {
  skillsData: any;
  skillsList: Array<{ title: string; slug: string }> = [];

  @ViewChild('section1', { static: false }) section1!: ElementRef;
  @ViewChild('mainTitle', { static: false }) mainTitle!: ElementRef;
  @ViewChild('subtitle1', { static: false }) subtitle1!: ElementRef;
  @ViewChild('scrollIndicator1', { static: false }) scrollIndicator1!: ElementRef;

  @ViewChild('section2', { static: false }) section2!: ElementRef;
  @ViewChild('title2',   { static: false }) title2!: ElementRef;
  @ViewChildren('skillBox') skillBoxes!: QueryList<ElementRef>;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private wpService: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Compétences - CB2P Avocats');
    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez nos domaines de compétences.'
    });

    this.wpService.getSkillsData().subscribe((data) => {
      if (data && data.acf) {
        this.skillsData = data.acf;
        this.skillsList = Object.keys(this.skillsData)
          .filter(key => key.startsWith('box_'))
          .map(key => {
            const boxTitle = this.skillsData[key];
            return {
              title: boxTitle,
              slug: this.generateSlug(boxTitle)
            };
          });
      }
    });
  }

  ngAfterViewInit(): void {
    const tlSection1 = gsap.timeline({
      scrollTrigger: {
        trigger: this.section1.nativeElement,
        start: 'top 80%',
        once: true
      }
    });
    tlSection1.from(this.mainTitle.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power2.out'
    });
    if (this.subtitle1?.nativeElement?.textContent?.trim()) {
      tlSection1.from(this.subtitle1.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out'
      });
      tlSection1.to(this.subtitle1.nativeElement, { duration: 1, opacity: 1 }, '+=0');
    }
    if (this.scrollIndicator1?.nativeElement) {
      tlSection1.from(this.scrollIndicator1.nativeElement, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: 'power2.out'
      }, '+=0.3');
    }


    const tlSection2 = gsap.timeline({
      scrollTrigger: {
        trigger: this.section2.nativeElement,
        start: 'top 80%',
        once: true
      }
    });

    if (this.title2?.nativeElement) {
      tlSection2.from(this.title2.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: 'power2.out'
      });
    }

    if (this.skillBoxes && this.skillBoxes.length > 0) {
      tlSection2.from(
        this.skillBoxes.toArray().map(el => el.nativeElement),
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.2
        },
        '+=0.3'
      );
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  goToSelectedSkill(slug: string): void {
    const encodedSlug = encodeURIComponent(slug);
    this.router.navigate(['/competence-selectionnee', encodedSlug]);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
