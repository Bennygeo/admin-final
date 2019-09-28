import { Directive, HostListener, AfterContentInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[ScrollToTop]'
})
export class ScrollToTopDirective implements AfterContentInit, OnChanges {



  constructor() { }

  @HostListener('focus')
  public onClick() {
    window.setTimeout(() => {
      console.log("Directive callout");
      if (window && window.pageYOffset)
        window.scroll(0, 0);
    }, 1000);
  }

  ngAfterContentInit(): void {
    console.log("Directive callout");
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log("Directive callout");

  }
}
