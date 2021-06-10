import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoballsComponent } from './noballs.component';

describe('NoballsComponent', () => {
  let component: NoballsComponent;
  let fixture: ComponentFixture<NoballsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoballsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoballsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
