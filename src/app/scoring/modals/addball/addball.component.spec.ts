import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddballComponent } from './addball.component';

describe('AddballComponent', () => {
  let component: AddballComponent;
  let fixture: ComponentFixture<AddballComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddballComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
