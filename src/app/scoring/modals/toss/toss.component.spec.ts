import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TossComponent } from './toss.component';

describe('TossComponent', () => {
  let component: TossComponent;
  let fixture: ComponentFixture<TossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TossComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
