import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocalStoragePage } from './local-storage.page';

describe('LocalStoragePage', () => {
  let component: LocalStoragePage;
  let fixture: ComponentFixture<LocalStoragePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalStoragePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocalStoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
