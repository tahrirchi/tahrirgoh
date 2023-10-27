import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxTiptapModule} from "ngx-tiptap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from './header/header.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NgDragDropModule} from "ng-drag-drop";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AnnotationComponent} from './annotation/annotation.component';
import {AnnotationPopoverDirective} from './annotation/annotation-popover/annotation-popover.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AnnotationPopoverComponent} from './annotation/annotation-popover/annotation-popover.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginComponent} from './auth/login/login.component';
import {JwtInterceptor} from "./core/interceptors/jwt.interceptor";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReplaceSpacePipe} from "./core/pipes/replace-space.pipe";
import {TruncatePipe} from "./core/pipes/truncate.pipe";
import {AuthService} from "./auth/auth.service";
import {appInitializer} from "./core/app.initializer";
import {TokenInterceptor} from "./core/interceptors/token.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    AnnotationComponent,
    AnnotationPopoverDirective,
    AnnotationPopoverComponent,
    LoginComponent,
    ReplaceSpacePipe,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxTiptapModule,
    FormsModule,
    NgDragDropModule.forRoot(),
    DragDropModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
