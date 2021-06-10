import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WidesComponent } from './wides.component';

describe('WidesComponent', () => {
  let component: WidesComponent;
  let fixture: ComponentFixture<WidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
