import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewsBlogDetailPage } from './news-blog-detail.page';

describe('NewsBlogDetailPage', () => {
  let component: NewsBlogDetailPage;
  let fixture: ComponentFixture<NewsBlogDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsBlogDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsBlogDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
