import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationItemLinkComponent } from './navigation-item-link.component';

describe('NavigationItemLinkComponent', () => {
  let component: NavigationItemLinkComponent;
  let fixture: ComponentFixture<NavigationItemLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationItemLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationItemLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
