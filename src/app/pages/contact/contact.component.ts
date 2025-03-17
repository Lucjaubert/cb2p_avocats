import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordpressService } from '../../services/wordpress.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http'; // ✅ Ajout pour envoyer le token au backend

declare var grecaptcha: any;

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ContactComponent implements OnInit {

  contactData: any = null;

  formData = {
    name: '',
    phone: '',
    email: '',
    message: '',
    privacyAccepted: false
  };

  recaptchaToken: string | null = null;
  siteKey = environment.recaptcha.siteKey;

  constructor(
    private wpService: WordpressService,
    private http: HttpClient, // ✅ Ajout pour appeler le backend
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRecaptchaScript();
    }

    this.wpService.getContactData().subscribe((data: any) => {
      this.contactData = data;
    });
  }

  loadRecaptchaScript(): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn("⚠️ Exécution côté serveur : reCAPTCHA ne sera pas chargé.");
      return;
    }

    if (document.querySelector(`script[src="https://www.google.com/recaptcha/api.js?render=${this.siteKey}"]`)) {
      this.renderRecaptcha();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("✅ reCAPTCHA v3 script chargé !");
      this.renderRecaptcha();
    };

    document.head.appendChild(script);
  }

  renderRecaptcha(): void {
    if (!isPlatformBrowser(this.platformId) || typeof grecaptcha === 'undefined') {
      console.error("❌ reCAPTCHA non chargé !");
      return;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'submit' }).then((token: string) => {
        this.recaptchaToken = token;
        console.log("✅ Token reCAPTCHA obtenu :", token);
      }).catch((error: any) => {
        console.error("❌ Erreur lors de l'exécution de reCAPTCHA :", error);
      });
    });
  }

  sendMessage(): void {
    if (!this.formData.privacyAccepted) {
      alert("Veuillez accepter la politique de confidentialité.");
      return;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute(environment.recaptcha.siteKey, { action: 'submit' }).then((token: string) => {
        this.http.post('https://ton-site.com/wp-json/cb2p/v1/verify-recaptcha', { token }).subscribe((res: any) => {
          if (res.status === "success" && res.score >= 0.5) {
            console.log("✅ Captcha validé, envoi du formulaire...");
            this.submitForm();
          } else {
            console.error("❌ Captcha rejeté, bot détecté !");
            alert("Erreur : Suspicion de bot détecté !");
          }
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

      this.http.post('https://ton-site.com/wp-json/cb2p/v1/send-message', postData).subscribe((res: any) => {
          console.log("✅ Message envoyé avec succès :", res);
          alert("Votre message a bien été envoyé !");

          this.formData = {
            name: '',
            phone: '',
            email: '',
            message: '',
            privacyAccepted: false
          };
          this.recaptchaToken = null;
      }, (error) => {
          console.error("❌ Erreur lors de l'envoi du message :", error);
          alert("Une erreur s'est produite lors de l'envoi du message.");
      });
  }
}
