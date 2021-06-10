import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contestsfilter',
  pure:false,
})
export class ContestsfilterPipe implements PipeTransform {

    transform(items: any[], title: string): any {
      if (!items || !title) {
          return items;
      }
      // filter items array, items which match and return true will be
      // kept, false will be filtered out
      return items.filter(item => item.title.indexOf(title) !== -1);
  }

}
