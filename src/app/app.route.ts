/**
 * Created by Administrator on 2016/7/27.
 */
import {provideRouter,RouterConfig} from '@angular/router'
import {EditorComponent} from './editor/editor.component'
import {ViewerComponent} from './viewer/viewer.component'
import {ResultViewerComponent} from './result-viewer/result-viewer.component'

const routes:RouterConfig=[
  {
    path:'',
    redirectTo:'/editor',
    pathMatch:'full'
  },
  {
    path:'editor',
    component:EditorComponent
  },
  {
    path:'viewer',
    component:ViewerComponent
  },
  {
    path:'resultViewer/:id',
    component:ResultViewerComponent
  }
];

export const appRouterProvider = [
  provideRouter(routes)
];
