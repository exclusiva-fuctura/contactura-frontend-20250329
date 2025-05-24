import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class ConfirmaSenhaValidator {
  static senhasIguaisValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      const senha = control.parent.get('senha')?.value;
      const confirmarSenha = control.value;
      if (senha !== confirmarSenha) {
        return { senhasDiferentes: true };
      }
      return null;
    };
  }
}