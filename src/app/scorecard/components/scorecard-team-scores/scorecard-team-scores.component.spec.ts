import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScorecardTeamScoresComponent } from './scorecard-team-scores.component';

describe('ScorecardTeamScoresComponent', () => {
  let component: ScorecardTeamScoresComponent;
  let fixture: ComponentFixture<ScorecardTeamScoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorecardTeamScoresComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScorecardTeamScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
