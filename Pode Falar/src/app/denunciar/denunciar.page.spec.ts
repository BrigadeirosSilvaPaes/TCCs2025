import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DenunciarPage } from './denunciar.page';

describe('DenunciarPage', () => {
  let component: DenunciarPage;
  let fixture: ComponentFixture<DenunciarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DenunciarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
