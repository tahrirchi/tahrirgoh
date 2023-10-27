import {Component} from '@angular/core';
import {DatasetService} from "../shared/dataset.service";
import {AnnotationService} from "../shared/annotation.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(
    public datasetService: DatasetService,
    public annotationService: AnnotationService) {

    this.datasetService.fetchSentences().subscribe(sentences => {
      console.log("Successfully fetched sentences...")
    })
  }
}
