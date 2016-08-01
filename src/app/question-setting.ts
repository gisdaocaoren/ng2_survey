/**
 * Created by Administrator on 2016/7/26.
 * 问题设置
 */
export class QuestionSetting{
  id:string;
  type:string = 'image';
  imageType:boolean = true;
  textType:boolean = false;
  question:string;
  text:string;
  minLen:number;
  maxLen:number;
}
