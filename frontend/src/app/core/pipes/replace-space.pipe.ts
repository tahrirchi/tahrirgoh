import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceSpace'
})
export class ReplaceSpacePipe implements PipeTransform {
  transform(value: string): string {
    const replacedValue = value.replace(/ /g, '<p class="text-gray-300">⎵</p>');
    return `<p class="text-tahrirchi-main-text">${replacedValue}</p>`;
  }
}
