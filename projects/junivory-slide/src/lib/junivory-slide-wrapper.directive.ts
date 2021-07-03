import {
    AfterContentInit,
    ContentChildren,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { JunivorySlide } from './junivory-slide.directive';

export interface SlideWrapperConfig {
    direction?: 'vertical' | 'horizontal', // Paging direction
    scroll?: 'on' | 'off', // Whether use scroll event
    touchThreshold?: number; // 0 to 1
    debounce?: number, // Debounce time in ms
    order?: number[], // Custom paging order
}

@Directive({
    selector: '[junivorySlideWrapper]',
    exportAs:'slideWrapper'
})
export class JunivorySlideWrapper extends JunivorySlide implements AfterContentInit, OnDestroy, OnInit {
    @Input() config: SlideWrapperConfig = {};
    @ContentChildren(JunivorySlide, {read: ElementRef}) slides?: QueryList<ElementRef<HTMLElement>>;

    defaultConfig: any = {
        direction: 'vertical',
        scroll: 'on',
        debounce: 500,
        touchThreshold: 0.1,
        order: undefined
    };

    @HostBinding('style.width') public wrapperWidth = '100%';

    private selected = 0;
    private debouncing: any;
    private nextSlide?: HTMLElement;
    private scrollTimer: any;
    private slidesChangeSubscription?: Subscription;
    private io: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > this.defaultConfig.touchThreshold) {
                this.nextSlide = entry.target as HTMLElement;
            }
        })
    }, {threshold: [this.defaultConfig.touchThreshold]});;

    get slidesArray(): Array<ElementRef<HTMLElement>> {
        if (!this.slides) {
            return []
        }
        return this.slides?.toArray();
    }

    constructor(private renderer: Renderer2) {
        super();
    }

    ngOnInit() {
        Object.assign(this.defaultConfig, this.config);
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
        this.goToPage(index);
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
        const slideIndex = this.slidesArray.findIndex(slide => slide.nativeElement === this.nextSlide);
        if (this.defaultConfig.order) {
            this.selected = this.defaultConfig.order.findIndex((index: number) => index === slideIndex);
        } else {
            this.selected = slideIndex;
        }
        this.nextSlide.scrollIntoView({behavior: 'smooth'});
    }

    private currentPage() {
        const index = this.defaultConfig.order ? this.defaultConfig.order[this.selected] : this.selected;
        this.slidesArray[index].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private goToPage(index: number) {
        if (!this.slidesArray[index]) {
            return;
        }
        this.selected = index;
        this.slidesArray[index].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private nextPage() {
        if (this.selected + 1 >= this.slidesArray.length) {
            return;
        }
        this.selected += 1;
        const nextIndex = this.defaultConfig.order ? this.defaultConfig.order[this.selected] : this.selected;
        this.slidesArray[nextIndex].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private prevPage() {
        if (this.selected === 0) {
            return;
        }
        this.selected -= 1;
        const prevIndex = this.defaultConfig.order ? this.defaultConfig.order[this.selected] : this.selected;
        this.slidesArray[prevIndex].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private debounceTime(): boolean {
        if (this.debouncing) {
            return true;
        } else {
            const debounceTime = this.defaultConfig.debounce || 500;
            this.debouncing = setTimeout(() => {
                this.debouncing = undefined;
            }, debounceTime)
            return false;
        }
    }

}
