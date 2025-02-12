import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosAuctionComponent } from './infos-auction.component';

describe('InfosAuctionComponent', () => {
  let component: InfosAuctionComponent;
  let fixture: ComponentFixture<InfosAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosAuctionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
