import { EventEmitter, Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RightnavToggleService {

    public rightnavFlag: any;
    public rightnavData: any;
    public categoryCd: any;
    public programCd: any;
    public appealSelectUploadFlag: any;
    public emitToRightNavComp$: BehaviorSubject<string> = new BehaviorSubject(null);

    public eventEmmiterDocumentModal = new EventEmitter();
    private appealOnsiteDocData = new BehaviorSubject(null);

    setRightnavFlag(rightnavFlag) {
        this.rightnavFlag = rightnavFlag;
    }

    getRightNavCompObs(): Observable<string> {
      return this.emitToRightNavComp$.asObservable();
    }

    getRightnavFlag() {
        return this.rightnavFlag;
    }

    setRightNavCategoryCode(categoryCd){
      this.categoryCd = categoryCd;
    }

    getRightNavCategoryCode(){
      return this.categoryCd;
    }

    setRightNavProgramCode(programCd){
      this.programCd = programCd;
    }

    getRightNavProgramCode(){
      return this.programCd;
    }

    setRightnavData(rightnavData) {
        this.rightnavData = rightnavData;
    }

    getRightnavData() {
        return this.rightnavData;
    }
    onDynamicFormSubmit(action) {
        this.eventEmmiterDocumentModal.emit(action);
    }

    setAppealSelectUploadFlag(appealSelectUploadFlag) {
        this.appealSelectUploadFlag = appealSelectUploadFlag;
    }

    getAppealSelectUploadFlag() {
        return this.appealSelectUploadFlag;
    }

    currentAppealOnsiteDocData(): Observable<string>{
        return this.appealOnsiteDocData.asObservable();
    }

    setAppealOnsiteassessmentDocData(appealOnsiteassessmentDocData){
        this.appealOnsiteDocData.next(appealOnsiteassessmentDocData);
    }
}

