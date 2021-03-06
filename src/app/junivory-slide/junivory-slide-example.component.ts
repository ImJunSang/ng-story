import { Component, ViewChild } from '@angular/core';
import { JunivorySlideWrapper, SlideWrapperConfig } from 'junivory-slide';

@Component({
    selector: 'app-junivory-slide-example',
    templateUrl: './junivory-slide-example.component.html',
    styleUrls: ['./junivory-slide-example.component.css']
})
export class JunivorySlideExampleComponent {
    title = 'story';
    listFront = ['pink', 'skyblue'];
    listEnd = ['white', 'green'];
    listHorizontal = ['yellow', 'purple', 'orange']

    config: SlideWrapperConfig = {
        touch: true
    }

    configHorizontal: SlideWrapperConfig = {
        direction: 'horizontal',
        order: [0, 1, 2, 1, 0]
    }

    @ViewChild('Wrapper') wrapper?: JunivorySlideWrapper;
    @ViewChild('WrapperHorizontal') wrapperHorizontal?: JunivorySlideWrapper;

    constructor() {

    }

    goToPage(index: number) {
        this.wrapper?.goTo(index);
    }

    nextPage() {
        this.wrapper?.goNext();
    }

    prevPage() {
        this.wrapper?.goPrev();
    }

    nextPageHorizontal() {
        if (!this.wrapperHorizontal?.goNext()) {
            this.wrapper?.goNext();
        };
    }

    prevPageHorizontal() {
        if (!this.wrapperHorizontal?.goPrev()) {
            this.wrapper?.goPrev();
        };
    }

}
