import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScorecardPage } from './scorecard.page';

describe('ScorecardPage', () => {
  let component: ScorecardPage;
  let fixture: ComponentFixture<ScorecardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorecardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScorecardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
