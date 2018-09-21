import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ContentComponent } from './content/content.component';
import { EncryptDecryptComponent } from './encrypt/encrypt.component';
import { DecryptComponent } from './decrypt/decrypt.component';


const routes: Routes = [
  {path: 'content', component: ContentComponent},
  {path: 'encrypt', component: EncryptDecryptComponent},
  {path: 'decrypt', component: DecryptComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouters {}
