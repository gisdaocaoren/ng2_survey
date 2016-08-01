import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import {Observable} from 'rxjs/observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SurveyService {
  private featureServiceUrl = 'http://services.arcgis.com/AegVO92BkdKrxZ0V/arcgis/rest/services/survey/FeatureServer/0';
  private _progress$: Subject<any>;
  constructor(private http:Http) {
    this._progress$ = <Subject<any>>new Subject();
  }

  get progress$() {
    return this._progress$.asObservable();
  }

  //弃用
  initProgress(){
    var id = 1;
    this._progress$.next(1);
          var self =this;
          setInterval(function(){
            id++;
            self._progress$.next(id);
          },2000);
  }

  //获取某个用户提交的questions
  getFeatuesBySurveyId(userSurveyId):Observable<any>{
    var url = this.featureServiceUrl + '/query?';
    url += "where=userSurveyId ='" + userSurveyId + "'";
    url += "&outFields=*";
    url += "&returnGeometry=false";
    url += "&f=json";
    return this.http.get(url);
  }

 //获取features的所有附件
  fetchFeaturesAttachments(features){
    this._progress$.next('正在获取图片信息');
    var promiseList = [];
    for(var i=0;i<features.length;i++){
      var feature = features[i];
      var self = this;
      var url = this.featureServiceUrl + '/'  + feature['FID']  +  '/attachments';
      var promise = new Promise(function(resolve, reject){
        self.http.get(url+'?f=json')
        .subscribe(res => {
          var selfUrl = res.url.substr(0,res.url.indexOf('?f=json'));
          resolve(res.json()['attachmentInfos']
          .map(item =>item['imageUrl'] = selfUrl+'/' + item['id']));
        },error => reject(Error(error)));
      });
      promiseList.push(promise);
    }
    return Promise.all(promiseList);
  }

  private handleError(error:any) {
    console.error('出错啦', error);
    return Promise.reject(error.message || error);
  }

  generateSurveyId():string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


//构建create Feature的请求参数
  private buildAddRequestData(list) {
    var addJson = [];
    var defaultGeometryJson = {"x": 11887486, "y": 3331564, "spatialReference": {"wkid": 102100, "latestWkid": 3857}};
    for (var i = 0; i < list.length; i++) {
      addJson.push({
        geometry: defaultGeometryJson,
        attributes: list[i]
      })
    }
    return addJson;
    // [{"geometry":{"x":0,"y":0,"spatialReference":{"wkid":102100,"latestWkid":3857}},"attributes":{"userSurveyId":null,"questionId":null,"type":null,"text":null,"isDelete":null,"x":null,"y":null}},
  }

  curSurvey = [];
  //将调查问卷的内容保存到feature service
  saveSurvey(survey) {
    this._progress$.next('正在创建要素');
    this.curSurvey = survey;
    var id = this.generateSurveyId();
    var userSurvey = [];
    for (var i = 0; i < survey.length; i++) {
      var s = survey[i];
      s['userSurveyId'] = id;
      userSurvey.push(s);
    }
    var addJson = this.buildAddRequestData(userSurvey);
    // let headers = new Headers({
    //   'Content-Type': 'application/json'
    // });
    var formData = new FormData();
    formData.append("adds", JSON.stringify(addJson));
    formData.append("f", 'json');
    var restData = {};
    var self = this;
    var pormise = new Promise(function(resolve, reject){
        restData['userSurveyId'] = id;
        self.http
        .post(self.featureServiceUrl + '/applyEdits', formData)
        .subscribe(res => {
          self._progress$.next('要素创建成功');
          restData['featureIds'] = res.json().addResults;
          // resolve(restData);
          self.uploadImages(res.json().addResults).then(function(response){
              restData['images']  = response;
              restData['resultId']  = '0';
              resolve(restData);
            },function(error){
              reject(Error('上传文件发生错误！'));
            });
          },error => reject(Error(error)));
      });
    return pormise;
  }

  //上传图片至FeatureService
  uploadImages(features) {
    this._progress$.next('开始上传文件');
    var promiseList = [];
    var uploadSuccessLength = 0;
    for (var i = 0; i < this.curSurvey.length; i++) {
      var files = this.curSurvey[i].files;
      for (var j = 0; j < files.length; j++) {
        var self = this;
        var promise = new Promise(function(resolve, reject){
          // 上传单张图片
          var url = self.featureServiceUrl + '/' + features[i].objectId + '/addAttachment';
          var file = files[j];
          var xhr = new XMLHttpRequest();
          var formData = new FormData();
          formData.append("uploads[]", file, file.name);

          if (xhr.upload) {
            // 上传中
            xhr.upload.addEventListener("progress", function (e) {
              var percent = (e['loaded'] / e['total'] * 100).toFixed(2) + '%';
              self._progress$.next('正在上传文件' + file.name + '已完成' + percent);
              console.log(e['loaded']  + e['total']);
            }, false);

            // 文件上传成功或是失败
            xhr.onreadystatechange = function (e) {
              if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                  resolve(JSON.parse(xhr.responseText)['addAttachmentResult']);
                  console.log(xhr.responseText);
                  self._progress$.next( file.name + '上传成功');
                } else {
                  reject(Error('错误' + xhr.responseText));
                  console.log('错误' + xhr.responseText);
                  // self.onFailure(file, xhr.responseText);
                }
              }
            };

            // 开始上传
            xhr.open("POST",url, true);
            // xhr.setRequestHeader("X_FILENAME", file.name);
            // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
            formData.append('f', 'json');
            xhr.send(formData);
          } 
        });
        promiseList.push(promise);
      }
    }
    return Promise.all(promiseList);
  }
}
