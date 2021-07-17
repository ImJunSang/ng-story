import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JunivorySlideExampleComponent } from './junivory-slide/junivory-slide-example.component';

const routes: Routes = [
  {
    path: 'junivory-slide',
    component: JunivorySlideExampleComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
