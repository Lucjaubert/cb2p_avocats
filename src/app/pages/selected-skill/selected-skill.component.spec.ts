import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSkillComponent } from './selected-skill.component';

describe('SelectedSkillComponent', () => {
  let component: SelectedSkillComponent;
  let fixture: ComponentFixture<SelectedSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedSkillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
