import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], filter: Object, ignoreCase?: boolean, key?: string, key2?: string): any {


    if (!items || !filter) {
      return items;
    }

    if (key2) {
      let filt = filter as String
      return items.filter(item => {
        if (item[key][key2] != undefined) {
          if (ignoreCase) {
            return item[key][key2].toUpperCase().indexOf(filt.toUpperCase()) !== -1

          } else {
            return item[key][key2].indexOf(filter) !== -1
          }

        }
      }
      );
    } else if (key) {
      let filt = filter as String
      return items.filter(item => {
        if (item[key]!= undefined) {
          if (ignoreCase) {
            return item[key].toUpperCase().indexOf(filt.toUpperCase()) !== -1
          } else {
            return item[key].indexOf(filter) !== -1
          }
        }
      }
      );
    } else {
      let filt = filter as String
      return items.filter(item => {
        if (item!= undefined) {
          if (ignoreCase) {
            return item.toUpperCase().indexOf(filt.toUpperCase()) !== -1

          } else {
            return item.indexOf(filter) !== -1
          }
        }
      }
      )
    }

  }

}

