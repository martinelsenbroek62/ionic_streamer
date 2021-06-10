import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlogListPage } from './blog-list.page';

describe('BlogListPage', () => {
  let component: BlogListPage;
  let fixture: ComponentFixture<BlogListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
