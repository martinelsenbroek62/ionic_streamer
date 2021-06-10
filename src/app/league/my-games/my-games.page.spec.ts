import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyGamesPage } from './my-games.page';

describe('MyGamesPage', () => {
  let component: MyGamesPage;
  let fixture: ComponentFixture<MyGamesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGamesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyGamesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
