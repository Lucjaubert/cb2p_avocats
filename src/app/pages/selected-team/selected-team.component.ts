import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewChecked
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
  @ViewChild('memberPhoto', { static: false }) memberPhoto!: ElementRef;

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
    this.loadDataFromRoute();
  }

  loadDataFromRoute(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    if (!rawId) return;

    const id = +rawId;

    this.wpService.getTeamData().subscribe((data: any) => {
      const item = Array.isArray(data) && data.length > 0 ? data[0] : data;
      if (!item) return;

      this.teamData = item;
      this.setDisplayedMember(id);
      this.buildOtherMembers(id);
    });
  }

  setDisplayedMember(id: number): void {
    if (!this.teamData) return;

    const isLawyer = id <= 6;
    let nameKey = '', photoKey = '', presentationKey = '', functionKey = '', emailKey = '';

    if (isLawyer) {
      nameKey = `lawyer_name_${id}`;
      photoKey = `lawyer_image_${id}`;
      presentationKey = `lawyer_name_${id}_presentation`;
      functionKey = `lawyer_${id}_function`;
      emailKey = `lawyer_${id}_email`;
    } else {
      const assistantIndex = id - 6;
      nameKey = `assistant_name_${assistantIndex}`;
      photoKey = `assistant_image_${assistantIndex}`;
      presentationKey = `assistant_name_${assistantIndex}_presentation`;
      functionKey = `assistant_${assistantIndex}_function`;
      emailKey = `assistant_${assistantIndex}_email`;
    }

    this.displayedMember = {
      isLawyer,
      name: this.teamData[nameKey] || 'Inconnu',
      photo: this.teamData[photoKey] || 'assets/images/placeholder.png',
      email: this.teamData[emailKey]?.trim() || 'contact@cabinet.com',
      functionHtml: this.teamData[functionKey] || '',
      presentationHtml: this.teamData[presentationKey] || ''
    };

    this.animationExecuted = false;
  }

  buildOtherMembers(currentId: number): void {
    if (!this.teamData) return;
    this.otherMembers = [];

    for (let i = 1; i <= 6; i++) {
      if (i === currentId) continue;
      const photo = this.teamData[`lawyer_image_${i}`];
      const nameHtml = this.teamData[`lawyer_name_function_${i}`];
      if (photo && nameHtml) {
        this.otherMembers.push({ id: i, photo, nameFuncHtml: nameHtml });
      }
    }

    for (let a = 1; a <= 3; a++) {
      const assistantId = 6 + a;
      if (assistantId === currentId) continue;
      const photo = this.teamData[`assistant_image_${a}`];
      const name = this.teamData[`assistant_name_${a}`];
      const func = this.teamData[`assistant_name_${a}_function`] || '';
      const nameFuncHtml = `<p>${name}</p>${func}`;
      if (photo && name) {
        this.otherMembers.push({ id: assistantId, photo, nameFuncHtml });
      }
    }
  }

  ngAfterViewInit(): void {
    // Quand la liste des cartes change (après chargement des données), on lance l'animation au scroll
    this.thirdCards.changes.subscribe(() => {
      this.animateThirdSection();
    });
    // Au cas où les cartes seraient déjà là
    if (this.thirdCards.length) {
      this.animateThirdSection();
    }
  }

  ngAfterViewChecked(): void {
    if (this.displayedMember && !this.animationExecuted) {
      if (this.leftSideElements.length > 0 && this.memberPhoto) {
        const elementsToAnimate = this.leftSideElements.toArray().map(el => el.nativeElement);
        const photoElement = this.memberPhoto.nativeElement;

        gsap.set(photoElement, { opacity: 0, x: 50 });

        gsap.from(elementsToAnimate, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(photoElement, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power2.out'
            });
          }
        });

        this.animationExecuted = true;
      }
    }
  }

  private animateThirdSection(): void {
    if (!this.thirdSection || !this.thirdTitle || !this.thirdLine || !this.thirdCards.length) {
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.thirdSection.nativeElement,
        start: 'top 80%',
        once: true
      }
    });

    // Titre
    tl.from(this.thirdTitle.nativeElement, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Ligne
    gsap.set(this.thirdLine.nativeElement, { scaleX: 0, transformOrigin: 'left' });
    tl.to(this.thirdLine.nativeElement, {
      scaleX: 1,
      duration: 1,
      ease: 'power2.out'
    }, '+=0.3');

    // Cartes
    this.thirdCards.forEach((card, i) => {
      tl.from(card.nativeElement, {
        opacity: 0,
        rotateY: 90,
        transformOrigin: 'center',
        duration: 0.6,
        ease: 'power2.out'
      }, i === 0 ? '+=0.3' : '-=0.4');
    });

    // S'assurer que ScrollTrigger recalcule si besoin
    ScrollTrigger.refresh();
  }

  goToTeam(): void {
    this.router.navigate(['/equipe']);
  }

  goToSelectedMember(id: number): void {
    this.router.navigate(['/membre-equipe', id]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadDataFromRoute();
    });
  }
}
