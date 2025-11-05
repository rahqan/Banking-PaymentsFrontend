import { Routes } from '@angular/router';
import { ClientComponent } from './components/client/client.component';

export const routes: Routes = [
    {
        path:'',
        component:ClientComponent
        // loadComponent: () => import('./components/client/client.component').then(m => m.ClientComponent)
    }
];
