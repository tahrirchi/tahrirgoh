import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {ISentence} from "../../models/ISentence";
import {DatasetService} from "../../shared/dataset.service";

@Injectable({
  providedIn: 'root'
})
export class SentencesResolver {
  constructor(private sentenceService: DatasetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISentence[]> {
    return this.sentenceService.fetchSentences();
  }
}
