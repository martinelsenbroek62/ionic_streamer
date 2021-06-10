import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaintabsPage } from './maintabs.page';

describe('MaintabsPage', () => {
  let component: MaintabsPage;
  let fixture: ComponentFixture<MaintabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintabsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
