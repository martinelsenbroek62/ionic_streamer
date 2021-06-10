import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BallByBallInningsComponent } from './ball-by-ball-innings.component';

describe('BallByBallInningsComponent', () => {
  let component: BallByBallInningsComponent;
  let fixture: ComponentFixture<BallByBallInningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallByBallInningsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BallByBallInningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
