import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import { AppealService } from '../services/appeal.service';

@Component({
    selector: 'app-appeal-dashboard-onsite-assessment',
    templateUrl: './appeal-dashboard-onsite-assessment.component.html',
    styleUrls: ['./appeal-dashboard-onsite-assessment.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ],
})

export class AppealDashboardOnsiteAssessmentComponent implements OnInit {
    displayedColumns = [
        'name',
        'aplId',
        'createdDt',
        'onsiteDueDt',
        'onsiteStatus',
    ];
    @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    onsiteAssessmentStatus = [];

    constructor(private appealService: AppealService) { }

    ngOnInit() {
        this.getOnsiteStatus();
    }

    getOnsiteStatus() {
        this.appealService.getStaticDataValue('ONSITE_STATUS').subscribe(response => {
            if (response.length > 0) {
                this.onsiteAssessmentStatus = response;
                this.onsiteassesments();
            }
        });
    }

    onsiteassesments() {
        this.appealService.onsiteassesments().subscribe(response => {
            const tableResponse = response;
            response.appealDashboardOnsiteAssesmentVOs.forEach(element => {
                this.onsiteAssessmentStatus.forEach(ele => {
                    if (element.onsiteStatusCd === ele.code) {
                        element.onsiteStatus = ele.value;
                    }
                });
            });
            this.dataSource = new MatTableDataSource(tableResponse.appealDashboardOnsiteAssesmentVOs);
            this.dataSource.paginator = this.paginator;
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
