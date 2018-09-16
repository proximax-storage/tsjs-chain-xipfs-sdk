import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContentDialogComponent } from './view-content-dialog.component';

describe('ViewContentDialogComponent', () => {
  let component: ViewContentDialogComponent;
  let fixture: ComponentFixture<ViewContentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
