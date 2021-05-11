import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { SlotManagmentService } from '../services/slot-managment.service';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-choices2-popup',
    templateUrl: './choices2-popup.component.html',
    styleUrls: ['./choices2-popup.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ]
})
export class Choices2PopupComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
    displayedColumns = [
        'firstName',
        'paeId',
        'paeSubDt',
        'paeEffDt',
        'dtAddedtoList',
    ];
    dataSource: MatTableDataSource<any>;
    expandedElement;
    referralSearch: FormGroup;
    comments: any[] = [];
    subscriptions$: any[] = [];
    constructor(public dialogRef: MatDialogRef<Choices2PopupComponent>, private fb: FormBuilder, private router: Router, private slotManagmentService: SlotManagmentService, private toastr: ToastrService,
    ) { }
    ngOnInit(): void {
     this.getChoice2WaitingList();
    }
    private getChoice2WaitingList() {
        const choicesList$ = this.slotManagmentService.getChoice2WaitingList().subscribe(res => {
            if (res) {
                this.dataSource = new MatTableDataSource(res);
                this.dataSource.paginator = this.paginator;
            }
        });
        this.subscriptions$.push(choicesList$);
    }
    close() {
        this.dialogRef.close();
    }
    ngOnDestroy() {
        if (this.subscriptions$ && this.subscriptions$.length > 0) {
            this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
        }
    }
}
