import { AfterContentInit, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, QueryList, Renderer2 } from '@angular/core';
import { JunivorySlideDirective } from './junivory-slide.directive';

@Directive({
    selector: '[junivorySlideWrapper]'
})
export class JunivorySlideWrapperDirective implements AfterContentInit {
    @Input() debounce = 500;
    @ContentChildren(JunivorySlideDirective, {read: ElementRef}) slides?: QueryList<ElementRef<HTMLElement>>;

    @HostBinding('style.width') public wrapperWidth = '100%';

    private selected = 0;
    private debouncing: any;

    private touchStart?: number;

    get slidesArray(): Array<ElementRef<HTMLElement>> {
        if (!this.slides) {
            return []
        }
        return this.slides?.toArray();
    }

    constructor(private renderer: Renderer2, private elementRef: ElementRef<HTMLElement>) { }


    ngAfterContentInit() {
        this.slides?.forEach(slide => {
            this.renderer.setStyle(slide.nativeElement, 'width', '100%');
            this.renderer.setStyle(slide.nativeElement, 'height', '100vh');
        })
    }

    @HostListener('mousewheel', ['$event'])
    onWheel(e: WheelEvent): void {
        e.preventDefault();
        if (this.debounceTime()) {
            return;
        }
        if (e.deltaY > 0) {
            this.nextPage();
        } else if (e.deltaY < 0) {
            this.prevPage();
        }
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(e: TouchEvent) {
        this.touchStart = e.changedTouches[0].clientY;
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(e: TouchEvent) {
        e.preventDefault();
        if (this.debounceTime() || !this.touchStart) {
            return;
        }
        if (e.changedTouches[0].clientY < this.touchStart) {
            this.touchStart = undefined;
            this.nextPage();
        } else if (e.changedTouches[0].clientY > this.touchStart) {
            this.touchStart = undefined;
            this.prevPage();
        }
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(e: TouchEvent) {
        e.preventDefault();
    }

    @HostListener('touchcancel', ['$event'])
    onTouchCancel(e: TouchEvent) {
        e.preventDefault();
    }

    private nextPage() {
        if (!this.slidesArray[this.selected + 1]) {
            return;
        }
        this.selected += 1;
        this.slidesArray[this.selected].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private prevPage() {
        if (this.selected === 0) {
            return;
        }
        this.selected -= 1;
        this.slidesArray[this.selected].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private debounceTime(): boolean {
        if (this.debouncing) {
            return true;
        } else {
            this.debouncing = setTimeout(() => {
                this.debouncing = undefined;
            }, this.debounce)
            return false;
        }
    }

}
