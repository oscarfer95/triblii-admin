import {AngularFireModule} from '@angular/fire/compat';
import {getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService} from '@angular/fire/analytics';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SsRouterModule} from './router/ss-router.module';
import {environment} from '../environments/environment';
import {SsLoaderComponent} from './modules/ss-shared/components/ss-loader/ss-loader.component';

@NgModule({
  declarations: [
    AppComponent,
    SsLoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ToastModule,
    SsRouterModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
