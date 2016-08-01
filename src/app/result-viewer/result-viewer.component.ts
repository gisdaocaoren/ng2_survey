import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SurveyService} from "../survey.service";
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'app-result-viewer',
  templateUrl: 'result-viewer.component.html',
  styleUrls: ['result-viewer.component.css']
})
export class ResultViewerComponent implements OnInit {
  sub:any;
  isLoading = false;
  progress: Observable<any>;
  constructor(private route:ActivatedRoute,
              private surveyService:SurveyService) { }
  questions = [];
  attachments = [];
  ngOnInit() {
    this.progress = this.surveyService.progress$;
    this.sub = this.route.params.subscribe(params =>{
    if(params['id'] != undefined){
        let id = params['id'];
        this.isLoading = true;
        //获取features
        this.surveyService.getFeatuesBySurveyId(id)
        .subscribe(response => {
          var features = response.json().features;
          this.questions = features.map(data => data.attributes);
          this.fetchFeaturesAttachments(this.questions);
        })
      }
    });
  }

  //获取featues的附件
  fetchFeaturesAttachments(features){
    this.surveyService.fetchFeaturesAttachments(features)
    .then(res => {
    this.isLoading = false;this.attachments = res});
  }
}
