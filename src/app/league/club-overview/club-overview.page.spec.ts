import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClubOverviewPage } from './club-overview.page';

describe('ClubOverviewPage', () => {
  let component: ClubOverviewPage;
  let fixture: ComponentFixture<ClubOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubOverviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClubOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
