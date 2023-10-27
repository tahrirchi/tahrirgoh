import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Annotation} from "../models/IAnnotation";

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  currentSentenceAnnotations$ = new BehaviorSubject<Annotation[]>([]);

  constructor() { }

  setAnnotations(annotations: Annotation[]) {
    // TODO: Save previous one
    this.currentSentenceAnnotations$.next(annotations);
  }

  addAnnotation(annotation: Annotation) {
    const currentAnnotations = this.currentSentenceAnnotations$.value;

    if (!currentAnnotations.find(a => a.fromIndex === annotation.fromIndex && a.toIndex === annotation.toIndex)) {
      this.currentSentenceAnnotations$.next([...currentAnnotations, annotation]);
    }
  }

  deleteAnnotation(annotation: Annotation) {
    const currentAnnotations = this.currentSentenceAnnotations$.value;

    const deleted = currentAnnotations.filter(a => a.fromIndex !== annotation.fromIndex);

    this.currentSentenceAnnotations$.next(deleted);
  }

  // saveAnnotations(value: ISentence) {
  //
  //   this.resetAnnotations();
  // }
  //
  // resetAnnotations() {
  //   this.currentSentenceAnnotations$.next([]);
  // }
}
