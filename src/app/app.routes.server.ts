import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  {
    path: 'employees',
    renderMode: RenderMode.Client 
  },
  {
    path: 'languages',
    renderMode: RenderMode.Client
  },
  {
    path: 'certificates',
    renderMode: RenderMode.Client
  },
 
  {
    path: '**',
    renderMode: RenderMode.Prerender //
  }
];