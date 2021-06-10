import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartStreamingPage } from './start-streaming.page';

describe('StartStreamingPage', () => {
  let component: StartStreamingPage;
  let fixture: ComponentFixture<StartStreamingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartStreamingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartStreamingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
