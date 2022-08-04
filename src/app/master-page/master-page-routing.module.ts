import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'challenge01',
        loadChildren: () =>
          import('../pages/challenge01/challenge01.module').then(
            (m) => m.Challenge01Module
          ),
      },
      {
        path: 'challenge02',
        loadChildren: () =>
          import('../pages/challenge02/challenge02.module').then(
            (m) => m.Challenge02Module
          ),
      },
      {
        path: 'challenge03',
        loadChildren: () =>
          import('../pages/challenge03/challenge03.module').then(
            (m) => m.Challenge03Module
          ),
      },
      {
        path: '**',
        redirectTo: 'challenge01',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterPageRoutingModule {}
