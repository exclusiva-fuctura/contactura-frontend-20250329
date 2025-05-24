import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { padLeft } from '../functions/pad-left.function';

@Directive({
  selector: '[telefone]'
})
export class TelefoneDirective {

  public nativeElement: HTMLInputElement;

  constructor(
    public model: NgControl,
    public elementRef: ElementRef) {
    this.nativeElement = elementRef.nativeElement;
  }

  @HostListener('input', ['input', 'true'])
  onInputChange(event: any, updateModel: boolean): void {
    let viewValue = '';
    let modelValue = '';

    if (this.nativeElement.value) {
      viewValue = this.nativeElement.value;
    }
    if (this.model.value) {
      
      if (updateModel) {
        // only number
        modelValue = (+viewValue.replace(/[^0-9]/g, '')).toString().substring(0, 11);
      }

      if (modelValue) {
        if (modelValue.length < 11) {
          modelValue = padLeft(modelValue,10,'0').replace(/(\d{2})(\d{4})(\d{4})/g,"(\$1) \$2-\$3");
        } else {
          modelValue = padLeft(modelValue,11,'0').replace(/(\d{2})(\d{5})(\d{4})/g,"(\$1) \$2-\$3");
        }
      }
      this.nativeElement.value = modelValue;
    }
  }

}