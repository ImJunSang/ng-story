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
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { JunivorySlide } from './junivory-slide.directive';

export interface SlideWrapperConfig {
    debounce: number, // Debounce time in ms
    direction: 'vertical' | 'horizontal', // Paging direction
    scroll: 'on' | 'off', // Whether use scroll event
    touchThreshold: number; // 0 to 1
    order?: number[], // Custom paging order
}

@Directive({
    selector: '[junivorySlideWrapper]',
    exportAs:'slideWrapper'
})
export class JunivorySlideWrapper implements AfterContentInit, OnDestroy {
    @Input() config: SlideWrapperConfig = {
        debounce: 500,
        direction: 'vertical',
        scroll: 'on',
        touchThreshold: 0.1
    };
    @ContentChildren(JunivorySlide, {read: ElementRef}) slides?: QueryList<ElementRef<HTMLElement>>;

    @HostBinding('style.width') public wrapperWidth = '100%';

    private selected = 0;
    private debouncing: any;
    private nextSlide?: HTMLElement;
    private scrollTimer: any;
    private slidesChangeSubscription?: Subscription;
    private io: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > this.config.touchThreshold) {
                this.nextSlide = entry.target as HTMLElement;
            }
        })
    }, {threshold: [this.config.touchThreshold]});;

    get slidesArray(): Array<ElementRef<HTMLElement>> {
        if (!this.slides) {
            return []
        }
        return this.slides?.toArray();
    }

    constructor(private renderer: Renderer2) {
    }

    ngOnDestroy() {
        this.io.disconnect();
        if (this.slidesChangeSubscription) {
            this.slidesChangeSubscription.unsubscribe();
        }
    }

    ngAfterContentInit() {
        this.slides?.forEach(slide => {
            this.renderer.setStyle(slide.nativeElement, 'width', '100%');
            this.renderer.setStyle(slide.nativeElement, 'height', '100vh');
            this.io.observe(slide.nativeElement);
        })
        this.slidesChangeSubscription = this.slides?.changes.pipe(delay(0)).subscribe(() => {
            this.slides?.forEach(slide => {
                this.renderer.setStyle(slide.nativeElement, 'width', '100%');
                this.renderer.setStyle(slide.nativeElement, 'height', '100vh');
                this.io.observe(slide.nativeElement);
            })
        })
    }

    goTo(index: number) {

    }

    goNext() {
        this.nextPage();
    }

    goPrev() {
        this.prevPage();
    }

    @HostListener('mousewheel', ['$event'])
    _onWheel(e: WheelEvent): void {
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

    @HostListener('window:resize', ['$event'])
    _onResize(e: Event): void {
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer)
        }
        this.scrollTimer = setTimeout(() => {
            this.currentPage();
        }, 50);
    }

    @HostListener('window:scroll', ['$event'])
    _onScroll(e: Event): void {
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer)
        }
        this.scrollTimer = setTimeout(() => {
            this._onScrollEnd();
        }, 50);
    }

    _onScrollEnd(): void {
        if (!this.nextSlide) {
            return;
        }
        this.nextSlide.scrollIntoView({behavior: 'smooth'});
    }

    private currentPage() {
        const index = this.config.order ? this.config.order[this.selected] : this.selected;
        this.slidesArray[index].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private nextPage() {
        if (this.selected + 1 >= this.slidesArray.length) {
            return;
        }
        this.selected += 1;
        const nextIndex = this.config.order ? this.config.order[this.selected] : this.selected;
        this.slidesArray[nextIndex].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private prevPage() {
        if (this.selected === 0) {
            return;
        }
        this.selected -= 1;
        const prevIndex = this.config.order ? this.config.order[this.selected] : this.selected;
        this.slidesArray[prevIndex].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private debounceTime(): boolean {
        if (this.debouncing) {
            return true;
        } else {
            this.debouncing = setTimeout(() => {
                this.debouncing = undefined;
            }, this.config.debounce)
            return false;
        }
    }

}
