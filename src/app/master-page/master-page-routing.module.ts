import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';


const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      {
        path: 'feature1',
        loadChildren: () => import('../pages/feature1/feature1.module').then(m => m.Feature1Module)
      },
      {
        path: 'feature2',
        loadChildren: () => import('../pages/feature2/feature2.module').then(m => m.Feature2Module)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterPageRoutingModule { }
