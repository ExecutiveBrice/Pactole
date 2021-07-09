import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from "../app-routing.module";
import { FormsModule } from "@angular/forms";
import { OrderByPipe } from "../sort.pipe";
import { MyFilterPipe } from "../filter.pipe";
import { NumberPipe } from "../number.pipe";
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService, IAService, TransmissionService, ConfigService, } from "../services";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent, TableComponent, DetailComponent ,AccueilComponent, UtilisateurComponent, ConfirmComponent, RegisterComponent, LoginComponent, ModalContent, ErrorComponent } from "../pages";
import { NgDragDropModule } from 'ng-drag-drop';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ToastrModule } from 'ngx-toastr';
import { httpInterceptorProviders } from '../../auth/auth-interceptor';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  imports: [
    ChartsModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ImageCropperModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgDragDropModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  exports: [
    AppRoutingModule
  ],
  providers: [
    IAService,
    MessageService,
    TransmissionService,
    ConfigService,
    httpInterceptorProviders
  ],
  declarations: [
    DashboardComponent,
    TableComponent,
    AccueilComponent,
    DetailComponent,
    UtilisateurComponent,
    ConfirmComponent,
    RegisterComponent,
    LoginComponent,
    ErrorComponent,
    ModalContent,
    OrderByPipe,
    MyFilterPipe,
    NumberPipe
  ]
})
export class CoreModule { }
