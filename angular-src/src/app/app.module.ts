import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';

import { AuthGuard } from './guards/auth.guard';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/delete-blog/delete-blog.component';
import {NgxPaginationModule} from 'ngx-pagination';



const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'blog', component: BlogComponent , canActivate:[AuthGuard]},
  {path:'edit-blog/:id', component: EditBlogComponent , canActivate:[AuthGuard]},
  {path:'delete-blog/:id', component: DeleteBlogComponent , canActivate:[AuthGuard]},
  
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    BlogComponent,
    EditBlogComponent,
    DeleteBlogComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,NgxPaginationModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot()
  ],
  providers: [ValidateService,AuthService,BlogService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }