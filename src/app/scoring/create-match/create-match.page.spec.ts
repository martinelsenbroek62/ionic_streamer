import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateMatchPage } from './create-match.page';

describe('CreateMatchPage', () => {
  let component: CreateMatchPage;
  let fixture: ComponentFixture<CreateMatchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMatchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
