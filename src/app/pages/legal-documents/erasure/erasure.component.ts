import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var grecaptcha: any;

@Component({
  selector: 'app-dpo-contact',
  standalone: true,
  templateUrl: './erasure.component.html',
  styleUrls: ['./erasure.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ErasureComponent implements OnInit {

  formData = {
    name: '',
    phone: '',
    email: '',
    message: '',
    privacyAccepted: false
  };

  recaptchaToken: string | null = null;
  siteKey = '6Lf1GegqAAAAABOuGDe9DvE4sZFb-8ZDMXhstKXl';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRecaptchaScript();
    }
  }

  loadRecaptchaScript(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const existing = document.querySelector(
      `script[src="https://www.google.com/recaptcha/api.js?render=${this.siteKey}"]`
    );
    if (existing) {
      this.renderRecaptcha();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.renderRecaptcha();
    document.head.appendChild(script);
  }

  renderRecaptcha(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (typeof grecaptcha === 'undefined') {
      console.warn('⚠️ reCAPTCHA non encore chargé.');
      return;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'submit' })
        .then((token: string) => {
          this.recaptchaToken = token;
        });
    });
  }

  sendMessage(): void {
    if (!this.formData.privacyAccepted) {
      alert('Veuillez accepter la politique de confidentialité.');
      return;
    }

    if (typeof grecaptcha === 'undefined') {
      console.error('❌ reCAPTCHA indisponible, on envoie quand même pour test...');
      this.submitForm();
      return;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'submit' })
        .then((token: string) => {
          this.http.post('http://dev.cb2p-avocats.fr//wp-json/cb2p/v1/verify-recaptcha', { token })
            .subscribe((res: any) => {
              if (res.status === 'success' && res.score >= 0.5) {
                this.submitForm();
              } else {
                alert('Erreur : Suspicion de bot détecté !');
              }
            }, err => {
              console.error('❌ Erreur lors de la vérification reCAPTCHA :', err);
              alert('Une erreur est survenue (reCAPTCHA).');
            });
        });
    });
  }
  submitForm(): void {
    const postData = {
      name: this.formData.name,
      phone: this.formData.phone,
      email: this.formData.email,
      message: this.formData.message,
      recaptchaToken: this.recaptchaToken
    };

    this.http.post('https://dev.cb2p-avocats.fr//wp-json/cb2p/v1/send-message', postData)
      .subscribe(
        () => {
          alert('Votre message a bien été envoyé !');
          this.formData = {
            name: '',
            phone: '',
            email: '',
            message: '',
            privacyAccepted: false
          };
          this.recaptchaToken = null;
        },
        () => {
          alert('Une erreur s\'est produite lors de l\'envoi du message.');
        }
      );
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
