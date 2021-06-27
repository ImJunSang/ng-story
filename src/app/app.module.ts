import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { JunivorySlideModule } from 'junivory-slide';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JunivorySlideModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
