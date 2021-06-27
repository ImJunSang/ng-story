import { NgModule } from '@angular/core';
import { JunivorySlideWrapperDirective } from './junivory-slide-wrapper.directive';
import { JunivorySlideDirective } from './junivory-slide.directive';



@NgModule({
  declarations: [
    JunivorySlideWrapperDirective,
    JunivorySlideDirective
  ],
  imports: [
  ],
  exports: [
    JunivorySlideWrapperDirective,
    JunivorySlideDirective
  ]
})
export class JunivorySlideModule { }
