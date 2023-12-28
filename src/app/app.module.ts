import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NyButtonModule, NyExpandModule, NyInputModule, NyLabelModule, NyMenuModule, NySpinnerModule } from '@namitoyokota/ng-components';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, NyButtonModule, NyInputModule, NyMenuModule, NyLabelModule, NySpinnerModule, NyExpandModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
