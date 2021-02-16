import { NgModule } from '@angular/core';
import { NgStoryComponent } from './ng-story.component';
import { NgStoryDirective } from './ng-story.directive';



@NgModule({
  declarations: [NgStoryComponent, NgStoryDirective],
  imports: [
  ],
  exports: [NgStoryComponent, NgStoryDirective]
})
export class NgStoryModule { }
