import {
    AfterContentInit,
    ContentChildren,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    QueryList,
    Renderer2 } from '@angular/core';
import { JunivorySlideDirective } from './junivory-slide.directive';

@Directive({
    selector: '[junivorySlideWrapper]'
})
export class JunivorySlideWrapperDirective implements AfterContentInit, OnDestroy {
    @Input() debounce = 500;
    @ContentChildren(JunivorySlideDirective, {read: ElementRef}) slides?: QueryList<ElementRef<HTMLElement>>;

    @HostBinding('style.width') public wrapperWidth = '100%';

    private selected = 0;
    private debouncing: any;
    private nextSlide?: HTMLElement;
    private scrollTimer: any;
    private io: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                this.nextSlide = entry.target as HTMLElement;
            }
        })
    }, {threshold: [0.5]});;

    get slidesArray(): Array<ElementRef<HTMLElement>> {
        if (!this.slides) {
            return []
        }
        return this.slides?.toArray();
    }

    constructor(private renderer: Renderer2) { }

    ngOnDestroy() {
        this.io.disconnect();
    }

    ngAfterContentInit() {
        this.slides?.forEach(slide => {
            this.renderer.setStyle(slide.nativeElement, 'width', '100%');
            this.renderer.setStyle(slide.nativeElement, 'height', '100vh');
            this.io.observe(slide.nativeElement);
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

    @HostListener('window:scroll', ['$event'])
    onScroll(e: Event): void {
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer)
        }
        this.scrollTimer = setTimeout(() => {
            this.onScrollEnd();
        }, 50);
    }

    onScrollEnd(): void {
        if (!this.nextSlide) {
            return;
        }
        this.nextSlide.scrollIntoView({behavior: 'smooth'});
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
