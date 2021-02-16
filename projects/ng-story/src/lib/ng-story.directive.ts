import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[libNgStory]'
})
export class NgStoryDirective {

    @Input() bgColor = 'blue';
    @Output() clicked = new EventEmitter<any>();

    constructor() { }

    @HostBinding('style.background-color') public bg = 'white';
    @HostBinding('style.color') public font = 'black';

    @HostListener('click', ['$event'])
    onClick() {
        this.bg = this.bg === 'white' ? this.bgColor : 'white';
        this.font = this.font === 'white' ? 'black' : 'white';
        this.clicked.emit('Clicked!');
    }


}
