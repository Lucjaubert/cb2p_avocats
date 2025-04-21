import {
  Component, OnInit, Inject, PLATFORM_ID, AfterViewChecked,
  ViewChildren, ElementRef, QueryList, ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import gsap from 'gsap';

import { WordpressService } from '../../services/wordpress.service';
import { environment }   from '../../../environments/environment';

declare const grecaptcha: any;

@Component({
  selector   : 'app-contact',
  standalone : true,
  templateUrl: './contact.component.html',
  styleUrls  : ['./contact.component.scss'],
  imports    : [CommonModule, FormsModule]
})
export class ContactComponent implements OnInit, AfterViewChecked {

  /* -------- données WordPress -------- */
  contactData: any = null;

  /* -------- modèle formulaire -------- */
  formData = {
    name: '', phone: '', email: '', message: '',
    privacyAccepted: false
  };

  /* -------- reCAPTCHA -------- */
  recaptchaToken: string | null = null;
  siteKey       = environment.recaptcha.siteKey;

  /* -------- UI -------- */
  isSuccess         = false;    // <-- manquait
  animationExecuted = false;

  @ViewChildren('contactLeftElement') contactLeftEls!: QueryList<ElementRef>;
  @ViewChild('contactForm', { static: false }) contactForm!: ElementRef;

  constructor(
    private wpService: WordpressService,
    private http     : HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /* ----------------- cycle de vie ----------------- */

  ngOnInit(): void {
    this.wpService.getContactData().subscribe(d => (this.contactData = d));
    if (isPlatformBrowser(this.platformId)) this.loadRecaptchaScript();
  }

  ngAfterViewChecked(): void {
    if (this.contactData && !this.animationExecuted) {
      const lefts = this.contactLeftEls.map(el => el.nativeElement);
      const form  = this.contactForm?.nativeElement;
      if (lefts.length && form) {
        gsap.set(form, { opacity: 0, x: 50 });
        gsap.from(lefts, {
          opacity: 0, y: 30, duration: .6, stagger: .2, ease: 'power2.out',
          onComplete: () => {                     // <- retourne void
            gsap.to(form, { opacity: 1, y: 0, duration: .5 });
          }
        });
        this.animationExecuted = true;
      }
    }
  }

  /* ----------------- reCAPTCHA ----------------- */

  private loadRecaptchaScript(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const exists = document.querySelector(
      `script[src="https://www.google.com/recaptcha/api.js?render=${this.siteKey}"]`
    );
    if (exists) { this.renderRecaptcha(); return; }

    const s = document.createElement('script');
    s.src   = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
    s.async = s.defer = true;
    s.onload = () => this.renderRecaptcha();
    document.head.appendChild(s);
  }

  private renderRecaptcha(): void {
    if (!isPlatformBrowser(this.platformId) || typeof grecaptcha === 'undefined') return;
    grecaptcha.ready(() =>
      grecaptcha.execute(this.siteKey, { action: 'submit' })
        .then((t: string) => (this.recaptchaToken = t))
        .catch((err: unknown) => console.error('reCAPTCHA error :', err)) // <- err typé
    );
  }

  /* ----------------- envoi du formulaire ----------------- */

  sendMessage(): void {
    if (!this.formData.privacyAccepted) {
      alert('Veuillez accepter la politique de confidentialité.');
      return;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'submit' })
        .then((token: string) => this.http
          .post('https://cb2p-avocats.fr/wp-json/cb2p/v1/verify-recaptcha', { token })
          .subscribe((r: any) => {
            (r.status === 'success' && r.score >= .5)
              ? this.submitForm()
              : alert('Erreur : Suspicion de bot détecté !');
          })
        );
    });
  }

  private submitForm(): void {
    const postData = { ...this.formData, recaptchaToken: this.recaptchaToken };

    this.http.post('https://cb2p-avocats.fr/wp-json/cb2p/v1/send-message', postData)
      .subscribe(
        () => {
          this.isSuccess = true;
          this.formData = { name:'', phone:'', email:'', message:'', privacyAccepted:false };
          this.recaptchaToken = null;
          setTimeout(() => (this.isSuccess = false), 4000);
        },
        () => alert('Une erreur s’est produite lors de l’envoi du message.')
      );
  }
}
