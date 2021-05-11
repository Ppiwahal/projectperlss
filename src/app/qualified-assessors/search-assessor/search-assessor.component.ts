import { Component,  DoCheck,  ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QualifiedAssessorService } from '../service/qualified-assessor.service';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-search-assessor',
  templateUrl: './search-assessor.component.html',
  styleUrls: ['./search-assessor.component.scss']
})
export class SearchAssessorComponent implements OnInit, OnDestroy, DoCheck {

  assessorDataArray: any = [];
  elasticSearchData: any[] = [];
  subscriptions$: any[] = [];
  assessorSearchForm: FormGroup;
  @Output() assessorSearchCallback: EventEmitter<any> = new EventEmitter<any>();
  @Input() entityData: any;
  @Input() programData: any;
  @Input() credentialData: any;
  assessorSearchOptions: any[] = [];
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  @Output() openAddAssessor: EventEmitter<any> = new EventEmitter<any>();
  assessorId: any;
  isError = false;
  input = '';
  isAddAcessor = false;
  searchButton :boolean = false;
  constructor(private formBuilder: FormBuilder, private qualifiedAssessorService: QualifiedAssessorService) { }

  ngOnInit(): void {
    this.assessorSearchForm = this.formBuilder.group({
      assessorSearch: [''],
      entity: ['']
    });
    this.getAllPersonDetails();
  }

  ngDoCheck() {
    if (this.entityData.length > 0) {
      this.isAddAcessor = true;
    }
  }

  get f() {
    return  this.assessorSearchForm.controls;
   }
  

  search(){
    this.isError = false;
    if (this.input === '' || !this.input) {
      if (this.assessorSearchForm.value.entity === '') {
        this.isError = true;
      }
    }
    if ( (this.assessorId !== undefined && this.assessorSearchForm.value.assessorSearch.trim() !== '')
                              || this.assessorSearchForm.value.entity !== ''){
      let param = '';
      if (this.assessorId !== undefined && this.assessorSearchForm.value.assessorSearch.trim() !== ''){
          param += 'assessorId=' + this.assessorId + '&';
      }
      if (this.assessorSearchForm.value.entity !== ''){
          param += 'entityId=' + this.assessorSearchForm.value.entity + '&';
      }
      const newQueryParam = param.slice(0, -1);
      this.assessorSearchCallback.emit(newQueryParam);
      } else {
        this.isError = true;
      }
  }

  openAddAssessorPopup(){
    const data = {
      entityData:this.entityData,
      programData:this.programData,
      credentialData:this.credentialData
    };
    this.openAddAssessor.emit(data);
  }

  getAllPersonDetails() {
    fromEvent(this.applicantNameInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
       const assessorEsSearchSubscription$ = this.qualifiedAssessorService.getAssesserElasticSearch(text).subscribe((res) => {
        this.assessorSearchOptions = [];
        if (res && res.length > 0) {
          res.forEach( data => {
            this.assessorSearchOptions.push({
              assessorId: data.assessor_id,
              prsnDetail: data,
              prsnDetailTxt: 'Name:' +
              data.first_name + ' ' +
              data.last_name +
              ', Assessor Code: ' + data.assessor_id +
              ', Program Code: ' + data.prog_cd
            });
          });
        } else {
          this.assessorSearchOptions = ['No Records Found'];
        }
      }, (err) => {
        this.assessorSearchOptions = ['No Records Found'];
        console.log('error', err);
      });
       this.subscriptions$.push(assessorEsSearchSubscription$);
    });

  }


  handleSelection(option){
    this.assessorId = option.assessorId;
    this.assessorSearchForm.controls.assessorSearch.setValue(option.prsnDetailTxt);
    if(this.assessorId){
    this.searchButton = true;
    }
}

onEntityChange(event){
  if(event.value){
 
  this.searchButton = true;
  }
  
}

  ngOnDestroy(){
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
