import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScoringPage } from './scoring.page';

describe('ScoringPage', () => {
  let component: ScoringPage;
  let fixture: ComponentFixture<ScoringPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoringPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScoringPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
