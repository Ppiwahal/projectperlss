import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RightnavComponent } from '../rightnav.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RightNavTaskService } from '../services/rightnav.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-notes-popup',
  templateUrl: './add-notes-popup.component.html',
  styleUrls: ['./add-notes-popup.component.scss']
})
export class AddNotesPopupComponent implements OnInit, OnDestroy {

  notesData: any[] = [];
  noteTypeValues: any[] = [];
  addNoteForm: FormGroup;
  showAddNotes = false;
  isValid = false;
  subscriptions$: any[] = [];
  customValidation = customValidation;
  isShowNotes = false;
  notePattern = "/^[a-z0-9]+$";
  @Input() data: any;
  @Output() closeDialogEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              private rightNavTaskService: RightNavTaskService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadNoteTypes();
  }

  closeDialog() {
    this.closeDialogEvent.emit();
  }

  saveNotes() {
    if (this.addNoteForm.valid) {
      const payload = {
        aplId: this.data.aplId ? this.data.aplId : '',
        paeId: this.data.paeId ? this.data.paeId : '',
        refId: this.data.refId ? this.data.refId : '',
        notesTypeCd: this.addNoteForm.value.noteType,
        notesComments: this.addNoteForm.value.noteDescription
      };
      const saveNoteSubscriptions$ = this.rightNavTaskService.saveNotes(payload).subscribe(res => {
        const succesNote = res.successMsgDescription;
        this.toastr.success(succesNote);
        this.onInit();
        this.showAddNotes = false;
      });
      this.subscriptions$.push(saveNoteSubscriptions$);
    }
  }

  onInit(): void {
    let input = '';
    if (this.data.aplId) {
      if (input === '') {
        input = 'aplId=' + this.data.aplId;
      }
    }
    if (this.data.paeId) {
      if (input === '') {
        input = 'paeId=' + this.data.paeId;
      } else {
        input = '&paeId=' + this.data.paeId;
      }
    }
    if (this.data.refId) {
      if (input === '') {
        input = 'refId=' + this.data.refId;
      } else {
        input = '&refId=' + this.data.refId;
      }
    }
    const getNotesSubscriptions$ = this.rightNavTaskService.getNotes(input).subscribe(response => {
      if (response.length > 0) {
        response.forEach(data => {
          this.noteTypeValues.forEach(element => {
            if (element.code === data.notesTypeCd) {
              data.displayNote = element.value;
            }
          });
          data.showCard = false;
        });
        this.isShowNotes = true;
        this.notesData = response.reverse();
      }
    }, error => {
      this.toastr.error("Internal Server Error!");
    });
    this.subscriptions$.push(getNotesSubscriptions$);
    this.addNoteForm = this.formBuilder.group({
      noteType: ['', Validators.required],
      noteDescription: ['', [Validators.required,
                            Validators.maxLength(2000),
                            Validators.pattern('^[A-Za-z0-9 ]+$'),]]
    });
  }

  contactCardOver(docs) {
    docs.showCard = true;
  }

  contactCardLeave(docs) {
    docs.showCard = false;
  }

  loadNoteTypes() {
    const input = 'NOTES_TYPE';
    const loadNoteSubscriptions$ = this.rightNavTaskService.getNotesType(input).subscribe(res => {
      this.noteTypeValues = res;
      this.onInit();
    }, error => {
      this.toastr.error("Internal Server Error!");
    });
    this.subscriptions$.push(loadNoteSubscriptions$);
  }

  showCommentSection() {
    this.showAddNotes = true;
  }

  hideCommentSection() {
    this.showAddNotes = false;
    this.addNoteForm.reset();
  }

  get noteType() {
    return this.addNoteForm.get('noteType');
  }

  get noteDescription() {
    return this.addNoteForm.get('noteDescription');
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
