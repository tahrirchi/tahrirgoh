import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ISentence} from "../models/ISentence";
import {BehaviorSubject, EMPTY, firstValueFrom, map, Observable, Subject, tap} from "rxjs";
import {AnnotationService} from "./annotation.service";
import {environment} from "../../environments/environment";
import {Annotation} from "../models/IAnnotation";
import {camelize} from "../utils/utils";

export interface Dataset {
  sentences: string[]
}

function compareArraysOfObjects<T>(array1: T[], array2: T[]) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    const obj1 = array1[i];
    const obj2 = array2[i];

    // Assuming the objects have the same properties
    for (const key in obj1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }

  return true;
}

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  // @ts-ignore
  sentence$ = new BehaviorSubject<ISentence>(null);
  // currentSentence$ = new Subject<ISentence>()
  // currentSentenceIdx: number = 0;

  page: number = 1;

  constructor(private http: HttpClient, private annotationService: AnnotationService) {
  }

  fetchSentences(): Observable<ISentence> {
    const params = new HttpParams().set("page", this.page)
    return this.http.get<ISentence>(`${environment.api}/sentence`,
      {
        params
      }).pipe(
      map(sentence => camelize(sentence)),
      tap((sentence) => {
        this.sentence$.next(sentence)
        // this.currentSentence$.next(this.sentences$.value[this.currentSentenceIdx]);
      })
    );
  }

// {
//   "sentence_id": 0,
//   "annotated_by": "string",
//   "annotations": [
//     {
//       "from_index": 0,
//       "to_index": 0,
//       "new_value": "string",
//       "old_value": "string"
//     }
//   ]
// }

  saveSentence(sentence: ISentence) {
    return this.http.put(`${environment.api}/sentence`,
      {
        sentence_id: sentence.id,
        annotations: this.annotationService.currentSentenceAnnotations$.value.map(annotation => ({
          from_index: annotation.fromIndex,
          to_index: annotation.toIndex,
          new_value: annotation.newValue,
          old_value: annotation.oldValue,
          error_type: annotation.errorType
        }))
      })
  }

  // getNextSentence() {
  //   this.updateSentence(this.currentSentenceIdx);
  //   if (this.currentSentenceIdx < this.sentence$.value.length - 1) {
  //     this.currentSentenceIdx++;
  //     this.currentSentence$.next(this.sentence$.value[this.currentSentenceIdx]);
  //   } else {
  //     this.page++;
  //     this.fetchSentences().subscribe(() => {
  //       console.log("Successfully fetched sentences...")
  //     });
  //     this.currentSentenceIdx = 0;
  //   }
  // }

  // getPreviousSentence() {
  //   this.updateSentence(this.currentSentenceIdx);
  //   if (this.currentSentenceIdx > 0) {
  //     this.currentSentenceIdx--;
  //     this.currentSentence$.next(this.sentence$.value[this.currentSentenceIdx]);
  //   }
  // }

  saveAnnotations(idx: number) {
    // Save sentence and update
    const currentSentence = this.sentence$.value;
    this.sentence$.next({
      ...currentSentence,
      annotations: this.annotationService.currentSentenceAnnotations$.value
    });
  }

  // setSentence(idx: number) {
  //   this.updateSentence(this.currentSentenceIdx);
  //   this.currentSentenceIdx = idx;
  //   this.currentSentence$.next(this.sentence$.value[this.currentSentenceIdx]);
  // }

  setSentenceAsReviewed() {
    const currentSentence = {
      ...this.sentence$.value,
      reviewed: true
    }
    this.sentence$.next(currentSentence);
    const params = new HttpParams().set("sentence_id", this.sentence$.value.id)
    return firstValueFrom(this.http.post(`${environment.api}/sentence/reviewed`, {}, {params}));
  }

  updateSentence() {
    this.setSentenceAsReviewed().then(r => console.log(r));

    // Save sentence and update
    const currentSentenceAnnotations = this.sentence$.value.annotations ?? [];


    const currentSentence = {
      ...this.sentence$.value,
      annotations: this.annotationService.currentSentenceAnnotations$.value
    }

    this.sentence$.next(currentSentence);

    this.saveSentence(currentSentence).subscribe(res => {
      console.log(res)
    })

    // // If there's any change in annotations, we need to update it
    // if (!compareArraysOfObjects<Annotation>(currentSentenceAnnotations, this.annotationService.currentSentenceAnnotations$.value)) {
    //   this.saveSentence(this.sentence$.value[idx]).subscribe(res => {
    //     console.log(res)
    //   })
    // }
  }

  setCurrentSentenceAsReviewed() {
    this.updateSentence()
    this.fetchSentences().subscribe(() => {
      console.log("Successfully fetched next sentence...")
    });
    // this.setSentenceAsReviewed(this.currentSentenceIdx).then(r => console.log(r));
  }
}
