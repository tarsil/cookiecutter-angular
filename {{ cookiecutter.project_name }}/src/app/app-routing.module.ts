import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


const routes: Routes = [
  { path: 'home', redirectTo: '/' },
  { path: 'login', redirectTo: '/' },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule, FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
