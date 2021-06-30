import { NgModule } from '@angular/core';
import { JunivorySlideWrapper } from './junivory-slide-wrapper.directive';
import { JunivorySlide } from './junivory-slide.directive';


@NgModule({
  declarations: [
    JunivorySlideWrapper,
    JunivorySlide
  ],
  imports: [
  ],
  exports: [
    JunivorySlideWrapper,
    JunivorySlide
  ]
})
export class JunivorySlideModule { }
