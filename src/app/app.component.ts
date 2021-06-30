import { Component, ViewChild } from '@angular/core';
import { JunivorySlideWrapper } from 'junivory-slide';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'story';
    testList = ['pink', 'skyblue', 'yellow', 'white', 'green'];

    @ViewChild('Wrapper') wrapper?: JunivorySlideWrapper;

    constructor() {

    }

    addPage() {
        this.testList.push('red');
    }

    nextPage() {
        this.wrapper?.goNext();
    }

    prevPage() {
        this.wrapper?.goPrev();
    }

}
