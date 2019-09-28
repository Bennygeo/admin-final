import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { MatIconModule, MatFormFieldModule } from '@angular/material';
import { CommonsService } from './services/commons.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoAccessComponent } from './others/no-access/no-access.component';
import { PageNotFoundComponent } from './others/page-not-found/page-not-found.component';
import { ScrollToTopDirective } from './others/scroll-to-top.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NoAccessComponent,
    PageNotFoundComponent,
    ScrollToTopDirective
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule, MatIconModule,
    AngularFireModule.initializeApp(environment.firbase, 'angular-auth-firebase'),
    AngularFireDatabaseModule
  ],
  exports: [
    NoAccessComponent,
    PageNotFoundComponent
  ],
  entryComponents: [
  ],
  providers: [
    // AuthService,
    CommonsService,
    AngularFireDatabase,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
