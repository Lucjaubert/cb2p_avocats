import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-popup.component.html',
  styleUrls: ['./payment-popup.component.scss']
})
export class PaymentPopupComponent implements OnInit, OnDestroy {
  showText = true;
  hovered = false;
  timeElapsed = false;
  private vanishTimeout: any;
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.resetText();
      });

    this.resetText();
  }

  ngOnDestroy(): void {
    if (this.vanishTimeout) {
      clearTimeout(this.vanishTimeout);
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  resetText(): void {
    if (this.vanishTimeout) {
      clearTimeout(this.vanishTimeout);
    }
    this.showText = true;
    this.hovered = false;
    this.timeElapsed = false;

    this.vanishTimeout = setTimeout(() => {
      this.timeElapsed = true;
      if (!this.hovered) {
        this.showText = false;
      }
    }, 3000);
  }

  onMouseEnter(): void {
    this.hovered = true;
    this.showText = true;
  }

  onMouseLeave(): void {
    this.hovered = false;
    if (this.timeElapsed) {
      this.showText = false;
    }
  }

  goToPayment() {
    window.open('https://sogecommerce.societegenerale.eu/vads-site/CB2P_AVOCATS', '_blank');
  }
}
