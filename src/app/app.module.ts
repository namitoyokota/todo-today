import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NyButtonModule, NyExpandModule, NyInputModule, NyLabelModule, NyMenuModule, NySpinnerModule } from '@namitoyokota/ng-components';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NyButtonModule,
        NyInputModule,
        NyMenuModule,
        NyLabelModule,
        NySpinnerModule,
        NyExpandModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
