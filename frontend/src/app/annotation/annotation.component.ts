import {Component, Input} from '@angular/core';
import {AnnotationService} from "../shared/annotation.service";
import {map} from "rxjs";
import {Annotation} from "../models/IAnnotation";
import {ISentence} from "../models/ISentence";

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent {
  private _sentence: ISentence | undefined;

  get sentence(): ISentence | undefined {
    return this._sentence;
  }

  @Input() set sentence(value: ISentence | undefined) {
    this._sentence = value;
    this.annotationService.setAnnotations(value?.annotations ?? []);
  }

  annotationForDisplay$ = this.annotationService.currentSentenceAnnotations$.asObservable().pipe(
    map(annotations => {
      return annotations.sort((a, b) => a.fromIndex - b.fromIndex)
    }),
    map<Annotation[], (Annotation | string)[]>((annotations) => {
      let offset = 0;
      const parts: (Annotation | string)[] = [];
      for (const annotation of annotations) {
        parts.push(this._sentence!.value.slice(offset, annotation.fromIndex));
        parts.push(annotation);
        offset = annotation.toIndex;
      }
      if (offset !== this._sentence!.value.length) {
        parts.push(this._sentence!.value.slice(offset));
      }
      return parts
    }),
    map(parts =>
      parts.filter(part =>
        part !== ""
      ).flatMap(
        // @ts-ignore
        part => {
          if (typeof part === "string") return part.match(/\S+|\s/g) as string[];
          else return part as Annotation
        })
    )
  )

  constructor(public annotationService: AnnotationService) {
  }

  deleteAnnotation(aPart: Annotation) {
    this.annotationService.deleteAnnotation(aPart);
  }
}
