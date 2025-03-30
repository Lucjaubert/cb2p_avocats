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
    name: string;
    photo: string;
    email?: string;
    functionHtml?: string;
    presentationHtml?: string;
  } | null = null;

  @ViewChildren('teamLink, memberName, memberFunction, memberPresentation, mailLink') leftSideElements!: QueryList<ElementRef>;
  @ViewChild('memberPhoto', { static: false }) memberPhoto!: ElementRef;

  animationExecuted = false;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    if (!rawId) {
      return;
    }

    const id = +rawId;
    this.wpService.getTeamData().subscribe((data: any) => {
      const item = Array.isArray(data) && data.length > 0 ? data[0] : data;
      if (!item) {
        return;
      }

      const isLawyer = (id <= 6);

      let nameKey = '';
      let photoKey = '';
      let presentationKey = '';
      let functionKey = '';
      let emailKey = '';

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

      const nameVal = item[nameKey] || 'Inconnu';
      const photoVal = item[photoKey] || 'assets/images/placeholder.png';
      const funcVal = item[functionKey] || '';
      const presentationVal = item[presentationKey] || '';
      const emailVal = item[emailKey] && item[emailKey].trim() !== '' ? item[emailKey] : 'contact@cabinet.com';

      this.displayedMember = {
        isLawyer,
        name: nameVal,
        photo: photoVal,
        email: emailVal,
        functionHtml: funcVal,
        presentationHtml: presentationVal
      };
    });
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
  }

  ngAfterViewChecked(): void {
    if (this.displayedMember && !this.animationExecuted) {
      console.log('ngAfterViewChecked called');
      console.log('leftSideElements:', this.leftSideElements);
      console.log('memberPhoto:', this.memberPhoto);

      if (this.leftSideElements.length > 0 && this.memberPhoto) {
        const elementsToAnimate = this.leftSideElements.toArray().map(el => el.nativeElement);
        const photoElement = this.memberPhoto.nativeElement;
        gsap.set(photoElement, { opacity: 0, x: 50 });

        console.log('Elements to animate (ngAfterViewChecked):', elementsToAnimate);
        gsap.from(elementsToAnimate, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            console.log('Left side elements animation complete (ngAfterViewChecked)');
            gsap.to(photoElement, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power2.out',
              onComplete: () => {
                console.log('Member photo animation complete (ngAfterViewChecked)');
              }
            });
          }
        });
        this.animationExecuted = true;
      } else {
        console.log('Animation elements not found in ngAfterViewChecked.');
      }
    }
  }

  goToTeam(): void {
    this.router.navigate(['/equipe']);
  }
}
