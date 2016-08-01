import { Injectable } from '@angular/core';
import {QuestionSetting} from "./question-setting";

@Injectable()
export class QuestionEditService{
  id:number = 0;
  constructor() {
  }
  getQuestions(){
    if(localStorage.getItem('QuestionSetting') === null || localStorage.getItem('QuestionSetting') === 'undefined'){
      console.log('还没有问题');
      var datas = [
        {
          id:1,
          type:'image',
          text:'说明',
          minLen:10,
          maxLen:100
        },{
          id:2,
          type:'text',
          text:'说明',
          minLen:10,
          maxLen:100
        },{
          id:3,
          type:'image',
          text:'说明',
          minLen:10,
          maxLen:100
        },{
          id:4,
          type:'image',
          text:'说明',
          minLen:10,
          maxLen:100
        }
      ];

      localStorage.setItem('QuestionSetting',JSON.stringify(datas));
    }
    var questions:QuestionSetting[] =JSON.parse(localStorage.getItem('QuestionSetting'));
    this.id = questions.length;
    return questions;
  }

  //添加问题
  addQuestion(newQuestion){
    newQuestion.id = this.getNewId();
    var questions:QuestionSetting[]  =JSON.parse(localStorage.getItem('QuestionSetting'));
    questions.push(newQuestion);
    localStorage.setItem('QuestionSetting',JSON.stringify(questions));
  }

  delete(id){
    var questions:QuestionSetting[] =JSON.parse(localStorage.getItem('QuestionSetting'));
    for(var i=0;i<questions.length;i++){
      if(questions[i].id == id){
        questions.splice(i,1);
      }
    }
    localStorage.setItem('QuestionSetting',JSON.stringify(questions));
  }

  //修改问题
  updateQuestion(newQuestion){
    var questions:QuestionSetting[] =JSON.parse(localStorage.getItem('QuestionSetting'));
    for(var i=0;i<questions.length;i++){
      if(questions[i].id == newQuestion.id){
        // newQuestion.id = id;
        questions[i] = newQuestion;
      }
    }
    localStorage.setItem('QuestionSetting',JSON.stringify(questions));
  }


  private getNewId(){
    var questions:QuestionSetting[] =JSON.parse(localStorage.getItem('QuestionSetting'));
    var max = 0;
    for(var i=0;i<questions.length;i++){
      if(parseInt(questions[i].id)>max){
        max = parseInt(questions[i].id);
      }
    }
    var newId = this.id>max?this.id:max;
    newId++;
    return newId;
  }

}
