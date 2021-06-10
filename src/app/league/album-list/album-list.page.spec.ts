import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlbumListPage } from './album-list.page';

describe('AlbumListPage', () => {
  let component: AlbumListPage;
  let fixture: ComponentFixture<AlbumListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
