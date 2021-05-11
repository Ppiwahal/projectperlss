import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SlotMgmtEnrollmentTargetsConfirmPopupComponent } from '../slot-mgmt-enrollment-targets-confirm-popup/slot-mgmt-enrollment-targets-confirm-popup.component';
import { SlotManagmentService } from './../services/slot-managment.service';
import { ToastrService } from 'ngx-toastr';
import * as customValidation from '../../_shared/constants/validation.constants';



@Component({
  selector: 'app-slot-manage-enrollment-targets',
  templateUrl: './slot-manage-enrollment-targets.component.html',
  styleUrls: ['./slot-manage-enrollment-targets.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SlotManageEnrollmentTargetsComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private _Activatedroute: ActivatedRoute, private fb: FormBuilder, private matDialog: MatDialog, private slotManagmentService: SlotManagmentService, private toastr: ToastrService
  ) { }
  subscriptions$: any[] = [];
  paramId;
  action_level;
  slotManageEnrollment: FormGroup;
  programType: any = [];
  moveSlots: any = [];
  moveSlotCapacitytolist: any = [];
  displayProgramType: boolean = false;
  displayMoveSlots: boolean = false;
  displayEnrollmentTargets: boolean = false;
  displayMoveSlotsNote: boolean = false;
  displayTable: boolean = false;
  selectedName: string = '';
  moveSlotsToSelectedName: string = '';
  displayedColumns: string[] = ['sltAction', 'prevEnrTarget', 'curEnrTarget', 'movedProgramTypeCd', 'updatedDt', 'updatedUser'];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  data = [];
  customValidation = customValidation;
  actionToBePerformedList: any = [];
  enrollmentTargets: any;
  moveSlotsFromEnrollmentTargets: any;
  moveSlotsToEnrollmentTargets: any;
  ngOnInit() {
    this.slotManageEnrollment = this.fb.group({
      moveSlotCapacityto: ['', Validators.required],
      actionMoveSlots: [''],
      actionProgramType: [''],
      actionToBePerformed: [''],
      updatedEnrollmentTarget: ['', Validators.required],
      moveSlotsFrom: ['', Validators.required]
    });
    const routeSub$ = this._Activatedroute.paramMap.subscribe(params => {
      this.paramId = params.get('id');

    });
    this.subscriptions$.push(routeSub$);
    const slotAction$ = this.slotManagmentService.getStaticDataValue('SLOT_CAPACITY_ACTION').subscribe(res => {
      this.actionToBePerformedList = res;
      if (this.paramId.toUpperCase() === 'CHOICES 2') {
        this.actionToBePerformedList.splice(1, 1);
      }
    });
    this.subscriptions$.push(slotAction$);


  }
  getNameByCode(code: string, entity: string) {
    if (entity === 'action' && code) {
      const result = this.actionToBePerformedList.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }

  }
  actionToBePerformedChangeAction() {
    if (this.slotManageEnrollment.controls.actionToBePerformed.value === 'ARS' &&
      this.paramId.toUpperCase() === 'ECF CHOICES') {
      this.programType = this.slotManagmentService.getEnrollmentSlotType('programTypeECF');
      this.displayProgramType = true;
      this.displayMoveSlots = false;
    } else if (this.slotManageEnrollment.controls.actionToBePerformed.value === 'MS' &&
      this.paramId.toUpperCase() === 'ECF CHOICES') {
      this.displayProgramType = false;
      this.displayMoveSlots = true;
      this.moveSlots = this.slotManagmentService.getEnrollmentSlotType('moveSlotsECF');
      this.moveSlotCapacitytolist = [];
    } else if (this.slotManageEnrollment.controls.actionToBePerformed.value === 'MS' &&
      this.paramId.toUpperCase() === 'KATIE BECKETT') {
      this.displayProgramType = false;
      this.displayMoveSlots = true;
      this.moveSlots = this.slotManagmentService.getEnrollmentSlotType('moveSlotsKT');

    } else if (this.slotManageEnrollment.controls.actionToBePerformed.value === 'ARS' &&
      this.paramId.toUpperCase() === 'KATIE BECKETT') {
      this.programType = this.slotManagmentService.getEnrollmentSlotType('programTypeKT');
      this.displayProgramType = true;
      this.displayMoveSlots = false;
    } else {
      this.programType = this.slotManagmentService.getEnrollmentSlotType('programTypeChoices');
      this.displayProgramType = true;
      this.displayMoveSlots = false;
    }
    this.displayMoveSlotsNote = false;
  }
  moveSlotCapacitytoChange() {
    const ms = this.moveSlotCapacitytolist.filter(a => a === this.slotManageEnrollment.controls.moveSlotCapacityto.value)
    this.moveSlotsToSelectedName = ms[0].value;

    const ENR_GROUP = this.slotManageEnrollment.controls.moveSlotCapacityto.value.ENR_GROUP;
    let code;

    if (ENR_GROUP === 'KBA' || ENR_GROUP === 'KBB') { code = null } else {
      code = this.slotManageEnrollment.controls.moveSlotCapacityto.value.code;
    }
    const slotInfo$ = this.slotManagmentService.getSlotInformation(ENR_GROUP, code).subscribe(res => {
      this.moveSlotsToEnrollmentTargets = res;
    });
    this.subscriptions$.push(slotInfo$);
  }
  programTypeSelection() {
    if (this.slotManageEnrollment.controls.actionProgramType.value) {
      this.displayEnrollmentTargets = true;
      this.selectedProgramTypeName();
      const ENR_GROUP = this.slotManageEnrollment.controls.actionProgramType.value.ENR_GROUP;
      let code;

      if (ENR_GROUP === 'KBA' || ENR_GROUP === 'KBB') {
        code = "";
      } else {
        code = this.slotManageEnrollment.controls.actionProgramType.value.code;
      }
      const slotInfoCode$ = this.slotManagmentService.getSlotInformation(ENR_GROUP, code).subscribe(res => {
        this.enrollmentTargets = res;
      });
      this.getSlotCapacityHistory()
      this.subscriptions$.push(slotInfoCode$);
    }
  }
  selectedProgramTypeName() {
    const pt = this.programType.filter(a => a === this.slotManageEnrollment.controls.actionProgramType.value)
    this.selectedName = pt[0].value;
  }
  selectedMoveSlotName() {
    const ms = this.moveSlots.filter(a => a === this.slotManageEnrollment.controls.actionMoveSlots.value)
    this.selectedName = ms[0].value;
  }
  getSlotCapacityHistory() {
    const actionToBePerformedValue = this.slotManageEnrollment.controls.actionToBePerformed.value;
    let ENR_GROUP;
    let code;
    if (this.slotManageEnrollment.controls.actionMoveSlots.value) {
      ENR_GROUP = this.slotManageEnrollment.controls.actionMoveSlots.value.ENR_GROUP;
      code = this.slotManageEnrollment.controls.actionMoveSlots.value.code;
    } else {
      code = this.slotManageEnrollment.controls.actionProgramType.value.code;
      ENR_GROUP = this.slotManageEnrollment.controls.actionProgramType.value.ENR_GROUP;

    }
    const slotHistory$ = this.slotManagmentService.slotCapacityHistory(actionToBePerformedValue, ENR_GROUP, code).subscribe(res => {
      const result = res.sort(function (a, b) {
        return Number(new Date(b.updatedDt)) - Number(new Date(a.updatedDt));
      });
      this.dataSource = new MatTableDataSource(result);
      this.displayTable = true;
    });
    this.subscriptions$.push(slotHistory$);

  }
  moveSlotsSelection() {
    const actionMoveSlotsselectedItem = this.slotManageEnrollment.controls.actionMoveSlots.value
    if (actionMoveSlotsselectedItem) {
      this.displayMoveSlotsNote = true;
      this.selectedMoveSlotName();
      const moveSltCapacityTo = this.slotManagmentService.getEnrollmentSlotType('moveSlotCapacityto');

      if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC4' || actionMoveSlotsselectedItem.ENR_GROUP === 'EC5') {
        let removeValFromIndex = [];
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC4' && actionMoveSlotsselectedItem.code === 'RC') {
          removeValFromIndex = [0, 9, 10, 11, 12];
        }
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC4' && actionMoveSlotsselectedItem.code === 'PG') {
          removeValFromIndex = [1, 9, 10, 11, 12];
        }
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC4' && actionMoveSlotsselectedItem.code === 'AC') {
          removeValFromIndex = [2, 9, 10, 11, 12];
        }
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC5' && actionMoveSlotsselectedItem.code === 'RC') {
          removeValFromIndex = [3, 9, 10, 11, 12];
        }
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC5' && actionMoveSlotsselectedItem.code === 'PG') {
          removeValFromIndex = [4, 9, 10, 11, 12];
        }
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC5' && actionMoveSlotsselectedItem.code === 'AC') {
          removeValFromIndex = [5, 9, 10, 11, 12];
        }
        // const removeValFromIndex = [];
        const indexSet = new Set(removeValFromIndex);
        const arrayWithValuesRemoved = moveSltCapacityTo.filter((value, i) => !indexSet.has(i));
        const MSCTO = arrayWithValuesRemoved;
        this.moveSlotCapacitytolist = MSCTO;

      } else if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC6') {
        let removeValFromIndex = [];
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC6' && actionMoveSlotsselectedItem.code === 'RC') {
          removeValFromIndex = [6,11, 12];
        }
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC6' && actionMoveSlotsselectedItem.code === 'PG') {
          removeValFromIndex = [7,11, 12];
        }
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC6' && actionMoveSlotsselectedItem.code === 'AC') {
          removeValFromIndex = [8,11, 12];
        }
        //const removeValFromIndex = [11, 12];
        const indexSet = new Set(removeValFromIndex);
        const arrayWithValuesRemoved = moveSltCapacityTo.filter((value, i) => !indexSet.has(i));
        const MSCTO = arrayWithValuesRemoved;
        this.moveSlotCapacitytolist = MSCTO;
      } else if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC7' || actionMoveSlotsselectedItem.ENR_GROUP === 'EC8') {
        let removeValFromIndex = [];
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC7' && actionMoveSlotsselectedItem.code === 'RC') {
          removeValFromIndex = [0, 1, 2, 3, 4, 5,9, 11, 12];
        }
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC8' && actionMoveSlotsselectedItem.code === 'RC') {
          removeValFromIndex = [0, 1, 2, 3, 4, 5,10, 11, 12];
        }
        //const removeValFromIndex = [0, 1, 2, 3, 4, 5, 11, 12];
        const indexSet = new Set(removeValFromIndex);
        const arrayWithValuesRemoved = moveSltCapacityTo.filter((value, i) => !indexSet.has(i));
        const MSCTO = arrayWithValuesRemoved;
        this.moveSlotCapacitytolist = MSCTO;
      } else if (actionMoveSlotsselectedItem.ENR_GROUP === 'KBA' || actionMoveSlotsselectedItem.ENR_GROUP === 'KBB') {
        let removeValFromIndex = [];
        if (actionMoveSlotsselectedItem.ENR_GROUP === 'KBA') {
          removeValFromIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        } if (actionMoveSlotsselectedItem.ENR_GROUP === 'KBB') {
          removeValFromIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
        }

        const indexSet = new Set(removeValFromIndex);
        const arrayWithValuesRemoved = moveSltCapacityTo.filter((value, i) => !indexSet.has(i));
        const MSCTO = arrayWithValuesRemoved;
        this.moveSlotCapacitytolist = MSCTO;
      }
      const ENR_GROUP = this.slotManageEnrollment.controls.actionMoveSlots.value.ENR_GROUP;
      let code;

      if (ENR_GROUP === 'KBA' || ENR_GROUP === 'KBB') {
        code = "";
      } else {
        code = this.slotManageEnrollment.controls.actionMoveSlots.value.code;
      }
      const slotInfo$ = this.slotManagmentService.getSlotInformation(ENR_GROUP, code).subscribe(res => {
        this.moveSlotsFromEnrollmentTargets = res;
      });

      this.getSlotCapacityHistory()
      this.subscriptions$.push(slotInfo$);
    }

  }
  onUpdate(mode: string) {
    let selectedmoveslots = [];
    let selectedmoveslotsTo = [];
    let selectedproramtypes = [];
    if (mode === 'MS') {
      let moveForward = false;
      if (this.displayMoveSlotsNote) {
        const moveSlotsFrom = this.slotManageEnrollment.controls.moveSlotsFrom.value;
        const moveSlotCapacityto = this.slotManageEnrollment.controls.moveSlotCapacityto.value;
        const actionMoveSlotsselectedItem = this.slotManageEnrollment.controls.actionMoveSlots.value

        if (moveSlotsFrom && moveSlotCapacityto) {
          if (actionMoveSlotsselectedItem.ENR_GROUP === 'EC6' && (moveSlotCapacityto.ENR_GROUP === 'EC7' || moveSlotCapacityto.ENR_GROUP === 'EC8') && moveSlotsFrom % 1.5 != 0) {
            this.toastr.warning('This move is restricted. Slots must be in intervals of 1.5 during a move from ECF CHOICES 6 to ECF CHOICES 7 or 8.');

          } else if (actionMoveSlotsselectedItem.ENR_GROUP != 'EC6' && moveSlotCapacityto.ENR_GROUP != 'EC7' && moveSlotCapacityto.ENR_GROUP != 'EC8' && moveSlotsFrom != parseInt(moveSlotsFrom, 10)) {
            this.toastr.warning('This move is restricted. Slots moves for the select programs must be whole numbers.');


          }
          else {
            moveForward = true;
          }
        } else {
          this.toastr.warning('please fill move slot details');
        }
      } if (moveForward) {


        selectedmoveslots = this.moveSlots.filter(
          ms => ms === this.slotManageEnrollment.controls.actionMoveSlots.value);
        selectedmoveslotsTo = this.moveSlotCapacitytolist.filter(
          ms => ms === this.slotManageEnrollment.controls.moveSlotCapacityto.value);

        this.slotManagmentService.moveSlot(this.moveSlotsFromEnrollmentTargets.total,
          this.moveSlotsFromEnrollmentTargets.filledAndHeld, this.moveSlotsFromEnrollmentTargets.available, this.moveSlotsToEnrollmentTargets.total,
          this.moveSlotsToEnrollmentTargets.filledAndHeld, this.moveSlotsToEnrollmentTargets.available,
          this.slotManageEnrollment.controls.moveSlotsFrom.value).subscribe(res => {
            if (res.errorCode != null) {
              this.toastr.warning(res.errorCode.description);
              ;
            }
            else {
              const programtypedata = {
                "selectedprogramtype": null,
                "enrolltargetvalue": null,
                "reserveCapacity": null,
              };

              const moveslotsdata = {
                "selectedslottype": selectedmoveslots ? selectedmoveslots : null,
                "selectedslotTotype": selectedmoveslotsTo ? selectedmoveslotsTo : null,
                "moveSlotsFrom": this.slotManageEnrollment.controls.moveSlotsFrom.value,
                "reserveCapacity": this.moveSlotsFromEnrollmentTargets.total,
                "slotToReserveCapacity": this.moveSlotsToEnrollmentTargets.total,
              };
              const dialogConfig = new MatDialogConfig();
              dialogConfig.minWidth = '700px';
              dialogConfig.height = '500px';
              dialogConfig.panelClass = 'dialog-container';
              dialogConfig.data = {
                "actionToBePerformed": this.slotManageEnrollment.controls.actionToBePerformed.value,
                "programtype": programtypedata,
                "moveslot": moveslotsdata
              }
              this.matDialog.open(SlotMgmtEnrollmentTargetsConfirmPopupComponent, dialogConfig);
            }
          });
      }
    } else {
      selectedproramtypes = this.programType.filter(
        pt => pt === this.slotManageEnrollment.controls.actionProgramType.value);

      this.slotManagmentService.addOrRemoveSlot(this.enrollmentTargets.total,
        this.enrollmentTargets.filledAndHeld, this.enrollmentTargets.available,
        this.slotManageEnrollment.controls.updatedEnrollmentTarget.value).subscribe(res => {
          if (res.errorCode != null) {
            this.toastr.warning(res.errorCode.description);
            ;
          }
          else {
            const programtypedata = {
              "selectedprogramtype": selectedproramtypes ? selectedproramtypes : null,
              "enrolltargetvalue": this.slotManageEnrollment.controls.updatedEnrollmentTarget.value,
              "reserveCapacity": this.enrollmentTargets.total,
            };
            const moveslotsdata = {
              "selectedslottype": null,
              "selectedslotTotype": null,
              "moveSlotsFrom": null,
              "reserveCapacity": null,
              "slotToReserveCapacity": null,
            };
            const dialogConfig = new MatDialogConfig();
            dialogConfig.minWidth = '700px';
            dialogConfig.height = '450px';
            dialogConfig.panelClass = 'dialog-container';
            dialogConfig.data = {
              "actionToBePerformed": this.slotManageEnrollment.controls.actionToBePerformed.value,
              "programtype": programtypedata,
              "moveslot": moveslotsdata
            }
            this.matDialog.open(SlotMgmtEnrollmentTargetsConfirmPopupComponent, dialogConfig);

          }
        });
    }
  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }
}
