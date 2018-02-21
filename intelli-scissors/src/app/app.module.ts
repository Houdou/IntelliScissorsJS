import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { IsDrawingComponent } from './is-drawing/is-drawing.component';
import { IsControlComponent } from './is-control/is-control.component';


import { ImageUploadModule } from "angular2-image-upload";

@NgModule({
  declarations: [
    AppComponent,
    IsDrawingComponent,
    IsControlComponent
  ],
  imports: [
    BrowserModule,
    ImageUploadModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
