import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { JunivorySlideModule } from 'junivory-slide';
import { JunivorySlideExampleComponent } from './junivory-slide-example.component';

@NgModule({
  declarations: [
    JunivorySlideExampleComponent
  ],
  imports: [
    BrowserModule,
    JunivorySlideModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    NgbModule
  ],
})
export class JunivorySlideExampleModule { }
