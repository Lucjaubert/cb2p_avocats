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
  skillsList: Array<{ title: string; slug: string; icon?: string }> = [];

  @ViewChild('section1')           section1!: ElementRef<HTMLElement>;
  @ViewChild('mainTitle')          mainTitle!: ElementRef<HTMLElement>;
  @ViewChild('subtitle1')          subtitle1?: ElementRef<HTMLElement>;
  @ViewChild('scrollIndicator1')   scrollIndicator1?: ElementRef<HTMLElement>;

  @ViewChild('section2')           section2!: ElementRef<HTMLElement>;
  @ViewChild('title2')             title2!: ElementRef<HTMLElement>;
  @ViewChildren('skillBox')        skillBoxes!: QueryList<ElementRef<HTMLElement>>;

  /* calques pour le fondu */
  @ViewChild('bgA', { static: true }) bgA!: ElementRef<HTMLImageElement>;
  @ViewChild('bgB', { static: true }) bgB!: ElementRef<HTMLImageElement>;

  private bgImages = [
    '/assets/img/skills/int-4.webp',
    '/assets/img/skills/int-5.webp',
    '/assets/img/skills/office-wall-2.webp'
  ];
  private current = 0;
  private activeLayer = 0;
  private readonly delay = 7000; // ms

  constructor(
    private titleSrv : Title,
    private metaSrv  : Meta,
    private wp       : WordpressService,
    private router   : Router
  ) {}

  ngOnInit(): void {
    this.titleSrv.setTitle('Compétences - CB2P Avocats');
    this.metaSrv.updateTag({ name: 'description', content: 'Découvrez nos domaines de compétences.' });

    this.wp.getSkillsData().subscribe(data => {
      if (!data?.acf) return;
      this.skillsData = data.acf;
      this.skillsList = Object.keys(this.skillsData)
        .filter(k => k.startsWith('box_'))
        .map((k, i) => ({
          title: this.skillsData[k],
          slug : this.generateSlug(this.skillsData[k]),
          icon : this.skillsData[`icon_${i + 1}`] ?? null
        }));
    });
  }

  ngAfterViewInit(): void {
    this.initHeroFade();
    this.initSectionAnimations();
  }

  /* ---------- fondu d’arrière‑plan ---------- */
  private initHeroFade(): void {
    const [a, b] = [this.bgA.nativeElement, this.bgB.nativeElement];
    a.src = this.bgImages[0];
    a.style.opacity = '1';

    setInterval(() => {
      this.current = (this.current + 1) % this.bgImages.length;

      const show = this.activeLayer ? a : b;
      const hide = this.activeLayer ? b : a;

      show.src = this.bgImages[this.current];
      show.style.opacity = '0';

      requestAnimationFrame(() => {
        show.style.opacity = '1';
        hide.style.opacity = '0';
        this.activeLayer = 1 - this.activeLayer;
      });
    }, this.delay);
  }

  /* ---------- animations GSAP ---------- */
  private initSectionAnimations(): void {

    gsap.timeline({
      scrollTrigger: { trigger: this.section1.nativeElement, start: 'top 80%', once: true }
    })
    .from(this.mainTitle.nativeElement, { opacity: 0, y: 50, duration: 1.2, ease: 'power2.out' })
    .from(this.subtitle1?.nativeElement || {}, { opacity: 0, y: 40, duration: 0.8, ease: 'power2.out' }, '-=0.6')
    .from(this.scrollIndicator1?.nativeElement || {}, { opacity: 0, y: 10, duration: 0.3 }, '-=0.4');

    const tl2 = gsap.timeline({
      scrollTrigger: { trigger: this.section2.nativeElement, start: 'top 80%', once: true }
    });

    tl2.from(this.title2.nativeElement, { opacity: 0, y: 50, duration: 1.2, ease: 'power2.out' })
       .from(this.skillBoxes.toArray().map(e => e.nativeElement),
             { opacity: 0, y: 30, duration: 0.8, stagger: 0.2, ease: 'power2.out' }, '-=0.6');
  }

  private generateSlug(t: string): string {
    return t.toLowerCase().replace(/\s+/g, '-');
  }

  goToSelectedSkill(slug: string): void {
    this.router.navigate(['/competence-selectionnee', encodeURIComponent(slug)]);
  }

  scrollToSection(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
