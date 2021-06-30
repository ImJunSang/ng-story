import { AfterContentInit, Directive, Renderer2 } from '@angular/core';

@Directive({
    selector: '[junivorySlide]'
})
export class JunivorySlide implements AfterContentInit {

    constructor(private renderer: Renderer2) { }

    ngAfterContentInit() {
    }

}
