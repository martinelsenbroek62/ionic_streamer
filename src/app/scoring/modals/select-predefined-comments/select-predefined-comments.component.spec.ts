import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectPredefinedCommentsComponent } from './select-predefined-comments.component';

describe('SelectPredefinedCommentsComponent', () => {
  let component: SelectPredefinedCommentsComponent;
  let fixture: ComponentFixture<SelectPredefinedCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPredefinedCommentsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPredefinedCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
