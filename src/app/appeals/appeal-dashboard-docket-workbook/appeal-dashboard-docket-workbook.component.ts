import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { EnvService } from 'src/app/_shared/utility/env.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-appeal-dashboard-docket-workbook',
  templateUrl: './appeal-dashboard-docket-workbook.component.html',
  styleUrls: ['./appeal-dashboard-docket-workbook.component.scss']
})
export class AppealDashboardDocketWorkbookComponent implements OnInit {

  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  serverApiUrl: any;

  constructor(private envService: EnvService, private http: HttpClient) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  ngOnInit() { }

  download() {
    this.downloadExcel().subscribe(response => {
      const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'AppealDocketWorkbook');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }

  downloadExcel() {
    const url = `${this.serverApiUrl.API_URL}/appeal/downloadExcel`;
    return this.http.get(url, { responseType:'arraybuffer' }).pipe(map(response => {
      return response;
    }));
  }

}
