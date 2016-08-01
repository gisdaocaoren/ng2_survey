import { Pipe, PipeTransform } from '@angular/core'; 
@Pipe({name: 'typeName'})
export class TypeNamePipe implements PipeTransform {
  transform(input,args) {
    return input=='image'?'图片':'文字';
  }
}
