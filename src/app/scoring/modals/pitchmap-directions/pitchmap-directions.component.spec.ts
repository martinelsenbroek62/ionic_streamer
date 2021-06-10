import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PitchmapDirectionsComponent } from './pitchmap-directions.component';

describe('PitchmapDirectionsComponent', () => {
  let component: PitchmapDirectionsComponent;
  let fixture: ComponentFixture<PitchmapDirectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitchmapDirectionsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PitchmapDirectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
