import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiveStreamingListPage } from './live-streaming-list.page';

describe('LiveStreamingListPage', () => {
  let component: LiveStreamingListPage;
  let fixture: ComponentFixture<LiveStreamingListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveStreamingListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveStreamingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
