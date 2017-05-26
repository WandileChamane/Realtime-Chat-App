/**
 * Created by opaluwa john on 5/27/2017.
 */

import { Pipe, PipeTransform } from '@angular/core';
//import {isUndefined} from "util";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(users: any, term: any): any {
   // check if term is undefined
    if(term === undefined) return users;
    // return updated ninjas array
    return users.filter(function (user) {
      return user.username.toLowerCase().includes(term.toLowerCase());
    })

  }
}
