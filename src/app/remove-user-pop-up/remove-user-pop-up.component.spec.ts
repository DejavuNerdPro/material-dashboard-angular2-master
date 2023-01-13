import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUserPopUpComponent } from './remove-user-pop-up.component';

describe('RemoveUserPopUpComponent', () => {
  let component: RemoveUserPopUpComponent;
  let fixture: ComponentFixture<RemoveUserPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveUserPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveUserPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
