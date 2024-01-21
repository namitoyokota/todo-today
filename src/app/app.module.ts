import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonoButtonModule, MonoInputModule, MonoSpinnerModule } from 'ngx-monochrome';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, BrowserAnimationsModule, MonoButtonModule, MonoInputModule, MonoSpinnerModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
