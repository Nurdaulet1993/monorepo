import { Directive, ElementRef, HostListener, inject, Input, numberAttribute, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ui-scroll]',
  standalone: true,
  host: {
    class: 'flex overflow-x-auto scroll-smooth'
  },
  exportAs: 'uiScroll'
})
export class ScrollDirective {
  @Input({ transform: numberAttribute, alias: 'ui-scroll' }) size: number = 250;
  element = inject(ElementRef);
  isDown =  false;
  startX = 0;
  scrollLeftValue = 0;
  private renderer = inject(Renderer2)

  scrollLeft() {
    this.element.nativeElement.scrollLeft += this.size;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDown = true;
    this.startX = event.pageX - (<HTMLDivElement>this.element.nativeElement).offsetLeft;
    this.scrollLeftValue = this.element.nativeElement.scrollLeft;
    this.renderer.removeClass(this.element.nativeElement, 'scroll-smooth');
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.isDown = false;
    this.renderer.addClass(this.element.nativeElement, 'scroll-smooth');
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDown = false;
    this.renderer.addClass(this.element.nativeElement, 'scroll-smooth');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return;
    event.preventDefault();
    const x = event.pageX - (<HTMLDivElement>this.element.nativeElement).offsetLeft;
    const walk = (x - this.startX);
    (<HTMLDivElement>this.element.nativeElement).scrollLeft = this.scrollLeftValue - walk;
  }
}
