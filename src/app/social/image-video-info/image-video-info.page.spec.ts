import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImageVideoInfoPage } from './image-video-info.page';

describe('ImageVideoInfoPage', () => {
  let component: ImageVideoInfoPage;
  let fixture: ComponentFixture<ImageVideoInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageVideoInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageVideoInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
