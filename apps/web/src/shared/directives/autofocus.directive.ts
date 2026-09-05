import { AfterViewInit, Directive, ElementRef, inject } from "@angular/core";

@Directive({
  selector: "[sfAutofocus]",
  standalone: true
})
export class AutofocusDirective implements AfterViewInit {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  ngAfterViewInit(): void {
    queueMicrotask(() => this.elementRef.nativeElement.focus());
  }
}
