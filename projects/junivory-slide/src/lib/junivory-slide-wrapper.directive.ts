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
    scroll?: boolean, // Whether use scroll event
    touch?: boolean, // Whether use touch event
    touchThreshold?: number; // 0 to 1
    debounce?: number, // Debounce time in ms
    order?: number[], // Custom paging order
}

interface SlideWrapperConfigDefault {
    direction: 'vertical' | 'horizontal', // Paging direction
    scroll: boolean, // Whether use scroll event
    touch: boolean, // Whether use touch event
    touchThreshold: number; // 0 to 1
    debounce: number, // Debounce time in ms
    order: number[], // Custom paging order
}

@Directive({
    selector: '[junivorySlideWrapper]',
    exportAs:'slideWrapper',
    providers: [{provide: JunivorySlide, useExisting: JunivorySlideWrapper}]
})
export class JunivorySlideWrapper extends JunivorySlide implements AfterContentInit, OnDestroy, OnInit {
    @Input() config: SlideWrapperConfig = {};
    @ContentChildren(JunivorySlide, {read: ElementRef}) slides?: QueryList<ElementRef<HTMLElement>>;

    defaultConfig: SlideWrapperConfigDefault = {
        direction: 'vertical',
        scroll: true,
        touch: false,
        debounce: 500,
        touchThreshold: 0.1,
        order: []
    };

    @HostBinding('style.width') public width = '100vw';
    @HostBinding('style.display') public display = 'block';
    @HostBinding('style.overflow-x') public overflowX = 'hidden';
    @HostBinding('style.overflow-y') public overflowY = 'auto';

    private selected = 0; // Current index for config.order
    private debouncing: any;
    private resizeTimer: any;
    private scrollTimer: any;
    private slidesChangeSubscription?: Subscription;
    private nextSlide?: HTMLElement;
    private io?: IntersectionObserver;

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
        if (this.defaultConfig.touch) {
            this.io = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > this.defaultConfig.touchThreshold) {
                        this.nextSlide = entry.target as HTMLElement;
                    }
                })
            }, {threshold: [this.defaultConfig.touchThreshold]});;
        }
    }

    ngOnDestroy() {
        if (this.io) {
            this.io.disconnect();
        }
        if (this.slidesChangeSubscription) {
            this.slidesChangeSubscription.unsubscribe();
        }
    }

    ngAfterContentInit() {
        // View direction
        if (this.defaultConfig.direction === 'horizontal') {
            this.width = `${100 * this.slidesArray.length}vw`
            this.display = 'flex';
            this.overflowX = 'hidden';
            this.overflowY = 'auto';
        }
        // Default slide order
        if (!this.defaultConfig.order.length) {
            this.defaultConfig.order = [...Array(this.slidesArray.length).keys()];
        }
        // subscribe slides elements' changes
        this.slides?.forEach(slide => {
            this.renderer.setStyle(slide.nativeElement, 'width', '100vw');
            this.renderer.setStyle(slide.nativeElement, 'height', '100vh');
            this.io?.observe(slide.nativeElement);
        })
        this.slidesChangeSubscription = this.slides?.changes.pipe(delay(0)).subscribe(() => {
            this.slides?.forEach(slide => {
                this.renderer.setStyle(slide.nativeElement, 'width', '100vw');
                this.renderer.setStyle(slide.nativeElement, 'height', '100vh');
                this.io?.observe(slide.nativeElement);
            })
        })
    }

    goTo(index: number) {
        return this.goToPage(index);
    }

    goNext() {
        return this.nextPage();
    }

    goPrev() {
        return this.prevPage();
    }

    @HostListener('window:resize', ['$event'])
    _onResize(e: Event): void {
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer)
        }
        this.resizeTimer = setTimeout(() => {
            this.moveToSelected();
            clearTimeout(this.resizeTimer)
        }, 50);
    }

    @HostListener('mousewheel', ['$event'])
    _onWheel(e: WheelEvent): void {
        e.preventDefault();
        if (!this.defaultConfig.scroll) {
            return;
        }
        if (this.debounceTime()) {
            e.stopPropagation();
            return;
        }
        let changed = false;
        if (e.deltaY > 0) {
            changed = this.nextPage();
        } else if (e.deltaY < 0) {
            changed = this.prevPage();
        }
        if (changed) {
            e.stopPropagation();
        }
    }

    /* TODO. Only for touch event. Mobile detection needed. */
    @HostListener('window:scroll', ['$event'])
    _onScroll(e: Event): void {
        if (!this.defaultConfig.touch) {
            return;
        }
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer)
        }
        this.scrollTimer = setTimeout(() => {
            this._onScrollEnd();
            clearTimeout(this.scrollTimer)
        }, 50);
    }

    _onScrollEnd(): void { // 
        if (!this.nextSlide) {
            return;
        }
        const orderIndex = this.slidesArray.findIndex(slide => slide.nativeElement === this.nextSlide);
        const slideIndex = this.defaultConfig.order.findIndex((index: number) => index === orderIndex);
        this.selected = slideIndex;
        this.nextSlide.scrollIntoView({behavior: 'smooth'});
    }

    private moveToSelected() {
        const index = this.defaultConfig.order[this.selected];
        this.slidesArray[index].nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    private goToPage(orderIndex: number) {
        if (!this.defaultConfig.order[orderIndex]) {
            return false;
        }
        this.selected = orderIndex;
        this.moveToSelected();
        return true;
    }

    private nextPage() {
        if (this.selected + 1 >= this.defaultConfig.order.length) {
            return false;
        }
        this.selected += 1;
        this.moveToSelected();
        return true;
    }

    private prevPage() {
        if (this.selected <= 0) {
            return false;
        }
        this.selected -= 1;
        this.moveToSelected();
        return true;
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
