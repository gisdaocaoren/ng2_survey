import { Component, OnInit } from '@angular/core';
import {QuestionSetting} from "../question-setting";
import {QuestionEditService} from "../question-edit.service";
import {Router} from '@angular/router';
import {TypeNamePipe} from '../type.pipe';

@Component({
  moduleId: module.id,
  selector: 'app-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css'] ,
	pipes : [TypeNamePipe]
})
export class EditorComponent implements OnInit {

  questions:QuestionSetting[];
  editingQuestion:QuestionSetting;    //当前编辑的问题
  isEditing:boolean = false;
  isAdding:boolean = false;
  addingQuestion:QuestionSetting;    //当前添加的问题
  constructor(private questionSettingService:QuestionEditService,private router:Router) {}

  ngOnInit() {
    this.questions = this.questionSettingService.getQuestions();
    console.log(this.questions);
  }
  // activeEdit(question){
  //   this.editingQuestion = question;
  //   this.isEditing = true;
  // }
  delete(question){
    for(var i=0;i<this.questions.length;i++){
      if(this.questions[i].id == question.id){
        this.questions.splice(i,1);
      }
    }
    this.questionSettingService.delete(question.id);
  }
  cancelEdit(){
    this.editingQuestion = null;
    this.isEditing = false;
  }

  update(question){
    for(var i=0;i<this.questions.length;i++){
      if(this.questions[i].id == question.id){
        this.questions[i] = question;
      }
    }
    this.questionSettingService.updateQuestion(question);
    this.editingQuestion = null;
    this.isEditing = false;
  }

  setEditType(editType,type){ 
    var operaTarget = this.editingQuestion;
    if(editType == 'add'){
      operaTarget = this.addingQuestion;
    }
    operaTarget.type = type;
    operaTarget.imageType = type=='image'?true:false;
    operaTarget.textType = type=='image'?false:true;
  }

  active(type,question){
    if(type == 'add'){
      this.isAdding = true;
      this.isEditing = false;
      this.addingQuestion = new QuestionSetting();
    }else if(type == 'edit'){
      this.editingQuestion = question;
      this.isEditing = true;
      this.isAdding = false;
    }
  }

  cancelAdd(){
    this.isAdding = false;
    this.addingQuestion = new QuestionSetting();
  }

  add(question){
    this.questionSettingService.addQuestion(question);
    this.questions = this.questionSettingService.getQuestions();
    this.cancelAdd();
  }

  gotoPage(){
    let link=['/viewer'];
    this.router.navigate(link);
  }
}
