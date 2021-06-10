import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FriendsListPage } from './friends-list.page';

describe('FriendsListPage', () => {
  let component: FriendsListPage;
  let fixture: ComponentFixture<FriendsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
