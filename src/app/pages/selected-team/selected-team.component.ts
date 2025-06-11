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

  @ViewChildren('teamLink, memberName, memberFunction, memberPresentation, mailLink')
  leftSideElements!: QueryList<ElementRef>;
  @ViewChild('memberPhoto') memberPhoto!: ElementRef;

  @ViewChild('thirdSection') thirdSection!: ElementRef;
  @ViewChild('thirdTitle') thirdTitle!: ElementRef;
  @ViewChild('thirdLine') thirdLine!: ElementRef;
  @ViewChildren('thirdCard') thirdCards!: QueryList<ElementRef>;

  animationExecuted = false;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rawId = params.get('id');
      if (!rawId) return;
      const id = +rawId;

      if (!this.teamData) {
        this.wpService.getTeamData().subscribe(data => {
          const item = Array.isArray(data) && data.length ? data[0] : data;
          if (!item) return;
          this.teamData = item;
          this.updateMember(id);
        });
      } else {
        this.updateMember(id);
      }
    });
  }

  private updateMember(id: number): void {
    this.setDisplayedMember(id);
    this.buildOtherMembers(id);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.animationExecuted = false;
  }

  private setDisplayedMember(id: number): void {
    if (!this.teamData) return;

    const isLawyer = id <= 6;
    const index = isLawyer ? id : id - 6;
    const prefix = isLawyer ? 'lawyer' : 'assistant';

    const key = (k: string) => `${prefix}_${k}_${index}`;
    const presKey = isLawyer ? `lawyer_name_${index}_presentation` : undefined;

    this.displayedMember = {
      isLawyer,
      name: this.teamData[key('name')] || 'Inconnu',
      photo: this.teamData[key('image')] || 'assets/images/placeholder.png',
      email: (this.teamData[`${prefix}_${index}_email`] || '').trim() || 'contact@cb2p-avocats.fr',
      functionHtml: this.teamData[key('function')] || '',
      presentationHtml: presKey ? this.teamData[presKey] || '' : ''
    };
  }

  private buildOtherMembers(currentId: number): void {
    if (!this.teamData) return;
    this.otherMembers = [];

    for (let i = 1; i <= 6; i++) {
      if (i === currentId) continue;
      const photo = this.teamData[`lawyer_image_${i}`];
      const html = this.teamData[`lawyer_name_function_${i}`];
      if (photo && html) {
        this.otherMembers.push({ id: i, photo, nameFuncHtml: html });
      }
    }

    for (let a = 1; a <= 3; a++) {
      const id = 6 + a;
      if (id === currentId) continue;
      const photo = this.teamData[`assistant_image_${a}`];
      const name = this.teamData[`assistant_name_${a}`];
      if (photo && name) {
        const func = this.teamData[`assistant_name_${a}_function`] || '';
        this.otherMembers.push({ id, photo, nameFuncHtml: `<p>${name}</p>${func}` });
      }
    }
  }

  ngAfterViewInit(): void {
    this.thirdCards.changes.subscribe(() => this.animateThirdSection());
    if (this.thirdCards.length) this.animateThirdSection();
  }

  ngAfterViewChecked(): void {
    if (
      this.displayedMember &&
      !this.animationExecuted &&
      this.leftSideElements?.length &&
      this.memberPhoto
    ) {
      const els = this.leftSideElements.toArray().map(el => el.nativeElement);
      const photo = this.memberPhoto.nativeElement;

      gsap.set(photo, { opacity: 0, x: 50 });
      gsap.from(els, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(photo, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' });
        }
      });

      this.animationExecuted = true;
    }
  }

  private animateThirdSection(): void {
    if (!this.thirdSection || !this.thirdTitle || !this.thirdLine || !this.thirdCards.length) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: this.thirdSection.nativeElement, start: 'top 80%', once: true }
    });

    tl.from(this.thirdTitle.nativeElement, { opacity: 0, y: 50, duration: 0.5, ease: 'power2.out' });

    gsap.set(this.thirdLine.nativeElement, { scaleX: 0, transformOrigin: 'left' });
    tl.to(this.thirdLine.nativeElement, { scaleX: 1, duration: 1, ease: 'power2.out' }, '+=0.3');

    this.thirdCards.forEach((card, i) => {
      tl.from(
        card.nativeElement,
        {
          opacity: 0,
          rotateY: 90,
          duration: 0.6,
          ease: 'power2.out',
          transformOrigin: 'center'
        },
        i === 0 ? '+=0.3' : '-=0.4'
      );
    });

    ScrollTrigger.refresh();
  }

  goToTeam(): void {
    this.router.navigate(['/equipe']);
  }

  goToSelectedMember(id: number): void {
    this.router.navigate(['/membre-equipe', id]);
  }
}
