import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {QuestionEditService} from "./question-edit.service";
import {EditorComponent} from "./editor/editor.component";
import {SurveyService} from "./survey.service";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives:[ROUTER_DIRECTIVES],
  providers:[QuestionEditService,SurveyService]
})
export class AppComponent {
  title = 'app works!'; 
}
