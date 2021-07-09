import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'coursenumber',
  pure: false
})
export class NumberPipe implements PipeTransform {
  transform(input: number): any {
    if (Number(input) === input && input % 1 === 0) {
      return input | 0;
    } else {
      return (input | 0) + 1;
    }


  }



}

