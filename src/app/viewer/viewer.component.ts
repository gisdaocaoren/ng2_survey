import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {QuestionSetting} from "../question-setting";
import {QuestionEditService} from "../question-edit.service";
import {SurveyService} from "../survey.service";
import { Observable } from 'rxjs/Observable';
import {TypeNamePipe} from '../type.pipe';

@Component({
  moduleId: module.id,
  selector: 'app-viewer',
  templateUrl: 'viewer.component.html',
  styleUrls: ['viewer.component.css'],
  providers:[QuestionEditService],
	pipes : [TypeNamePipe]
})
export class ViewerComponent implements OnInit {
  questions:QuestionSetting[];
  progress: Observable<any>;    //loading的进度说明
  curSurvey;  //当前编辑状态的问卷
  isLoading = false;
  constructor(private questionSettingService:QuestionEditService,
              private router:Router,
              private surveyService:SurveyService) {
              }

  ngOnInit() {
    this.progress = this.surveyService.progress$;
    //this.surveyService.initProgress();
    this.questions = this.questionSettingService.getQuestions();
    console.log(this.questions);
    this.curSurvey = [];
    for(var i = 0;i<this.questions.length;i++){
      var qes = this.questions[i];
      this.curSurvey.push({
        questionId:qes.id,
        type:qes.type,
        question:qes.question,
        text:'',
        images:[],
        files:[],
        isDelete:false
      });
    }
  }

  //批量选择图片后的处理
  fileSelectHandler(event,index){
    var files = event.target.files || event.dataTransfer.files;
    if(files.length>this.questions[index].maxLen){
      alert('您最多只能上传' + this.questions[index].maxLen + '张图片,请重新选择');
      return;
    }
    this.curSurvey[index].files = this.curSurvey[index].files.concat(this.filter(files));
    if(this.curSurvey[index].files.length<1){
      return;
    }
    // this.curSurvey[index].files = files;
    for(var i=0;i<this.filter(files).length;i++){
      let file = event.target.files[i];
      let fileReader = new FileReader();
      fileReader.onload = e => {
        this.curSurvey[index].images.push(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  }

   //重新上传单个图片
  fileUpdateHandler(event,index,imgIdx){
    var files = event.target.files || event.dataTransfer.files;
    this.curSurvey[index].files.splice(imgIdx,1,files[0]); 
    let file = files[0];
    let fileReader = new FileReader();
    fileReader.onload = e => {
      this.curSurvey[index].images.splice(imgIdx,1,fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }

  delteImage(index,imgIdx){
    this.curSurvey[index].images.splice(imgIdx,1);
    this.curSurvey[index].files.splice(imgIdx,1);
  }

  //提交保存问卷
  submitSurvey(){
    // this.surveyService.saveSurvey(this.curSurvey).subscribe(json => console.log(json));
      this.isLoading = true;
      this.surveyService.saveSurvey(this.curSurvey)
      .then(data => {
        this.isLoading = false;
        console.log(data);
        if(data['resultId'] == '0'){
          let link=['/resultViewer',data['userSurveyId']];
          this.router.navigate(link);

        }
      });
  }

  //图片过滤
  private filter(files) {
    var arrFiles = [];
		for (var i = 0, file; file = files[i]; i++) {
			if (file.type.indexOf("image") == 0) {
				if (file.size >= 5242880) {
					alert('您这张"'+ file.name +'"图片过大，应小于5M');
				} else {
					arrFiles.push(file);
				}
			} else {
				alert('文件"' + file.name + '"不是图片。');
			}
		}
		return arrFiles;
	}
}
