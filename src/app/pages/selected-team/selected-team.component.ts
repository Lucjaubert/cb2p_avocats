import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-selected-team',
  standalone: true,
  templateUrl: './selected-team.component.html',
  styleUrls: ['./selected-team.component.scss'],
  imports: [CommonModule]
})
export class SelectedTeamComponent implements OnInit, AfterViewInit, AfterViewChecked {
  /* ---------- Données affichées ---------- */
  displayedMember: {
    isLawyer: boolean;
    name?: string;
    photo?: string;
    email?: string;
    functionHtml?: string;
    presentationHtml?: string;
  } | null = null;

  teamData: any = null;
  otherMembers: Array<{ id: number; photo: string; nameFuncHtml: string }> = [];

  /* ---------- Références de template ---------- */
  @ViewChildren('teamLink, memberName, memberFunction, memberPresentation, mailLink')
  leftSideElements!: QueryList<ElementRef>;
  @ViewChild('memberPhoto')            memberPhoto!: ElementRef;

  @ViewChild('thirdSection')           thirdSection!: ElementRef;
  @ViewChild('thirdTitle')             thirdTitle!: ElementRef;
  @ViewChild('thirdLine')              thirdLine!: ElementRef;
  @ViewChildren('thirdCard')           thirdCards!: QueryList<ElementRef>;

  animationExecuted = false;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordpressService,
    private router: Router
  ) {}

  /* ------------------------------------------------------------------ */
  /* 1.  Initialise et réagit aux changements de paramètre :id          */
  /* ------------------------------------------------------------------ */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rawId = params.get('id');
      if (!rawId) { return; }
      const id = +rawId;

      if (!this.teamData) {
        /*‑ charge la data WP une seule fois */
        this.wpService.getTeamData().subscribe(data => {
          const item = Array.isArray(data) && data.length ? data[0] : data;
          if (!item) { return; }
          this.teamData = item;
          this.updateMember(id);
        });
      } else {
        this.updateMember(id);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2.  Met à jour le membre affiché + liste des autres + remonte page */
  /* ------------------------------------------------------------------ */
  private updateMember(id: number): void {
    this.setDisplayedMember(id);
    this.buildOtherMembers(id);
    /* remonte en haut */
    window.scrollTo({ top: 0, behavior: 'smooth' });
    /* relance l’animation d’entrée */
    this.animationExecuted = false;
  }

  /* ---------- Construit le portrait principal ---------- */
  private setDisplayedMember(id: number): void {
    if (!this.teamData) { return; }

    const isLawyer = id <= 6;
    const index    = isLawyer ? id : id - 6;

    const key = (k: string) =>
      isLawyer ? `lawyer_${k}_${index}` : `assistant_${k}_${index}`;

    this.displayedMember = {
      isLawyer,
      name:             this.teamData[key('name')]             || 'Inconnu',
      photo:            this.teamData[key('image')]            || 'assets/images/placeholder.png',
      email: (this.teamData[key('email')] || '').trim()        || 'contact@cabinet.com',
      functionHtml:     this.teamData[key('function')]         || '',
      presentationHtml: this.teamData[key('name') + '_presentation'] || ''
    };
  }

  /* ---------- Construit le carrousel des autres membres ---------- */
  private buildOtherMembers(currentId: number): void {
    if (!this.teamData) { return; }
    this.otherMembers = [];

    /* avocats (1‑6) */
    for (let i = 1; i <= 6; i++) {
      if (i === currentId) { continue; }
      const photo = this.teamData[`lawyer_image_${i}`];
      const html  = this.teamData[`lawyer_name_function_${i}`];
      if (photo && html) { this.otherMembers.push({ id: i, photo, nameFuncHtml: html }); }
    }

    /* assistants (7‑9) */
    for (let a = 1; a <= 3; a++) {
      const id = 6 + a;
      if (id === currentId) { continue; }
      const photo = this.teamData[`assistant_image_${a}`];
      const name  = this.teamData[`assistant_name_${a}`];
      if (photo && name) {
        const func = this.teamData[`assistant_name_${a}_function`] || '';
        this.otherMembers.push({ id, photo, nameFuncHtml: `<p>${name}</p>${func}` });
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* 3.  Animations GSAP                                                */
  /* ------------------------------------------------------------------ */
  ngAfterViewInit(): void {
    /* animate section 3 quand les cartes sont prêtes */
    this.thirdCards.changes.subscribe(() => this.animateThirdSection());
    if (this.thirdCards.length) { this.animateThirdSection(); }
  }

  ngAfterViewChecked(): void {
    if (this.displayedMember && !this.animationExecuted &&
        this.leftSideElements?.length && this.memberPhoto) {

      const els = this.leftSideElements.toArray().map(el => el.nativeElement);
      const photo = this.memberPhoto.nativeElement;

      gsap.set(photo, { opacity: 0, x: 50 });
      gsap.from(els, {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.2, ease: 'power2.out',
        onComplete: () => {
          gsap.to(photo, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' });
        }
      });

      this.animationExecuted = true;
    }
  }

  private animateThirdSection(): void {
    if (!this.thirdSection || !this.thirdTitle || !this.thirdLine || !this.thirdCards.length) { return; }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: this.thirdSection.nativeElement, start: 'top 80%', once: true }
    });

    tl.from(this.thirdTitle.nativeElement, { opacity: 0, y: 50, duration: .5, ease: 'power2.out' });

    gsap.set(this.thirdLine.nativeElement, { scaleX: 0, transformOrigin: 'left' });
    tl.to(this.thirdLine.nativeElement, { scaleX: 1, duration: 1, ease: 'power2.out' }, '+=0.3');

    this.thirdCards.forEach((card, i) => {
      tl.from(card.nativeElement, {
        opacity: 0, rotateY: 90, duration: .6, ease: 'power2.out',
        transformOrigin: 'center'
      }, i === 0 ? '+=0.3' : '-=0.4');
    });

    ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------------------ */
  /* 4.  Navigation                                                     */
  /* ------------------------------------------------------------------ */
  goToTeam(): void {
    this.router.navigate(['/equipe']);
  }

  goToSelectedMember(id: number): void {
    /* garde l’URL synchro, le scroll & update seront gérés par paramMap */
    this.router.navigate(['/membre-equipe', id]);
  }
}
