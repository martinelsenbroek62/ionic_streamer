import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OTPPage } from './otp.page';

describe('OTPPage', () => {
  let component: OTPPage;
  let fixture: ComponentFixture<OTPPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OTPPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OTPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
