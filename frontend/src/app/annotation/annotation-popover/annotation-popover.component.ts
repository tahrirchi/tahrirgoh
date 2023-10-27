import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {AnnotationService} from "../../shared/annotation.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {AbstractControl, ValidatorFn} from '@angular/forms';

export function notEqualValidator(field1: string, field2: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const formGroup = control as FormGroup;
    const value1 = formGroup.get(field1)?.value;
    const value2 = formGroup.get(field2)?.value;

    if (value1 !== value2) {
      return null; // Fields are not equal, validation passes
    } else {
      return {notEqual: true}; // Fields are equal, validation fails
    }
  };
}

@Component({
  selector: 'app-annotation-popover',
  templateUrl: './annotation-popover.component.html',
  styleUrls: ['./annotation-popover.component.scss']
})
export class AnnotationPopoverComponent implements OnInit {
  @Input() oldText: string | undefined
  @Input() newText: string | undefined
  @Input() errorType: string | undefined;
  @Input() offset: number | undefined;

  @Output() close = new EventEmitter();

  public form: FormGroup;

  options: string[] = [
    'S/Spelling',
    'S/Context',
    'S/Dialect',
    'S/LowerUpper',
    'Punctuation',
    'G/Case',
    'G/Possessive',
    'G/Hyphen',
    'G/Merge',
    'G/Split',
    'G/VerbVoice',
    'G/VerbTense',
    'G/UngrammaticalStructure',
    'G/Converb',
    'G/Adposition',
    'G/Particle',
    'G/Other',
    'F/Clarity',
    'F/Calque',
    'F/Style',
    'F/Paronym',
    'F/Pleonasm',
    'F/Collocation',
    'F/Other'
  ];
  filteredOptions: Observable<string[]> | undefined;

  constructor(private annotationService: AnnotationService, private elementRef: ElementRef) {
    this.form = new FormGroup({
      oldText: new FormControl({value: this.oldText, disabled: true}, []),
      newText: new FormControl(this.newText, []),
      errorType: new FormControl('', [Validators.required]),
    }, { validators: notEqualValidator('oldText', 'newText') });
  }

  ngOnInit() {
    this.filteredOptions = this.form.get("errorType")!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.annotationService.addAnnotation(
      {
        fromIndex: this.offset!,
        toIndex: this.offset! + this.oldText!.length,
        newValue: this.newText!,
        oldValue: this.oldText!,
        errorType: this.errorType!
      }
    );

    this.close.emit();
  }
}
