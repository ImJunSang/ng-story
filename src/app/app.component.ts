import { Component, ViewChild } from '@angular/core';
import { JunivorySlideWrapper, SlideWrapperConfig } from 'junivory-slide';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'story';
    testList = ['pink', 'skyblue', 'yellow', 'white', 'green'];

    config: SlideWrapperConfig = {
        order: [0, 3, 2, 1, 4]
    }

    @ViewChild('Wrapper') wrapper?: JunivorySlideWrapper;

    constructor() {

    }

    addPage() {
        this.testList.push('red');
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

}
