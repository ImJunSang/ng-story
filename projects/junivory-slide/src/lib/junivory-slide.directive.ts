import { AfterContentInit, Directive, Renderer2, TemplateRef } from '@angular/core';

@Directive({
    selector: '[junivorySlide]'
})
export class JunivorySlideDirective implements AfterContentInit {

    constructor(private renderer: Renderer2) { }

    ngAfterContentInit() {
    }

}
