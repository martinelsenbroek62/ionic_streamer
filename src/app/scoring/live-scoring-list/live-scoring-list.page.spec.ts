import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiveScoringListPage } from './live-scoring-list.page';

describe('LiveScoringListPage', () => {
  let component: LiveScoringListPage;
  let fixture: ComponentFixture<LiveScoringListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveScoringListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveScoringListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
