import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaeCommonService {
   assignedUser: any;
  assignedEntity: any;
  taskStatus: any;
  taskQueue: any;
  programCd: any;
  ChmType: any;
  dueDate: any;


  constructor() { }

  programName: any;
  age = 21;
  paeId: any;
  paeStatus: any;
  livingArrangement: any;
  county :any;
  personId: any;
  programSelectId: Array<string>;
  paeMenuItems: Array<string>;
  gotoDetails = false;
  menuId: string;
  taskId: number;
  rowElement: any;
  continueMenu = false;
  continueMenuList: any;
  nextPageId: any;
  userId: string;
  adjId: any;
  applicantName: any;
  entityId: any;
  module: any;
  hideSearchForPerson: boolean = false;
  isCertiUploded = false;
  reqICAP: boolean = false;
  paeSubmitted: boolean = false;
  fromChngMgmt = false;
  adjudicationStatusCd: any ;
 
  public getAdjudicationStatusCd(): string {
    return this.adjudicationStatusCd;
  }

  public setAdjudicationStatusCd(adjudicationStatusCd) {
    this.adjudicationStatusCd = adjudicationStatusCd;
  }
  public getMenuId(): string {
    return this.menuId;
  }

  public setRowElement(rowElement) {
    this.rowElement = rowElement;
  }

  public getRowElement() {
    return this.rowElement;
  }

  // public getCanLeave() {
  //   return this.leavePage;
  // }
  // public setCanLeave(value) {
  //   this.leavePage = value;
  // }

  public setModule(module) {
    this.module = module;
  }
  public getModule() {
    return this.module;
  }
  public setFromChngMgmt(value) {
    this.fromChngMgmt = value;
  }
  public getFromChngMgmt() {
    return this.fromChngMgmt;
  }

  public setMenuId(id: string) {
    this.menuId = id;
  }

  setContinueDisplayMenu(continueMenu: Array<string>) {
    this.continueMenuList = continueMenu;
  }

  getContinueDisplayMenu() {
    return this.continueMenuList;
  }

  setProgramSelectChild(programSelect: Array<string>) {
    this.programSelectId = programSelect;
  }

  getProgramSelectChild(): Array<string> {
    return this.programSelectId;
  }

  setPaeDisplayMenu(paeMenuItems: Array<string>) {
    this.paeMenuItems = paeMenuItems;
  }

  getPaeDisplayMenu(): Array<string> {
    return this.paeMenuItems;
  }

  getGoToDetails() {
    return this.gotoDetails;
  }

  setGoToDetails(gotoDetails) {
    this.gotoDetails = gotoDetails;
  }

  getProgramName() {
    return this.programName;
  }

  setProgramName(programName) {
    this.programName = programName;
  }
  
  getProgramCd() {
    return this.programCd;
  }

  setProgramCd(programCd: any) {
    this.programCd = programCd;
  }

  setPersonId(personId) {
    this.personId = personId;
  }

  getPersonId() {
    return this.personId;
  }
  setAge(age) {
    this.age = age;
  }

  getAge() {
    return this.age;
  }

  getPaeId() {
    return this.paeId;
  }
  setPaeId(paeID) {
    this.paeId = paeID;
  }

  getAdjId() {
    return this.adjId;
  }
  setAdjId(adjId) {
    this.adjId = adjId;
  }

  getLivingArrangement() {
    return this.livingArrangement;
  }
  setLivingArrangement(livingArrangement) {
    this.livingArrangement = livingArrangement;
  }

  setCounty(county) {
    this.county = county;
  }

  setContinueMenu(setMenuItem) {
    this.continueMenu = setMenuItem;
  }

  setNextPageIdContinue(nextPageId) {
    this.nextPageId = nextPageId;
  }

  getNextPageIdContinue() {
    return this.nextPageId;
  }

  getContinueMenu() {
    return this.continueMenu;
  }
  getCounty() {
    return this.county;
  }

  getTaskId() {
    return this.taskId;
  }
  setTaskId(taskId) {
    this.taskId = taskId;
  }
  setEntityId(entityId) {
    this.entityId = entityId;
  }

  getEntityId() {
    return this.entityId;
  }
  getAssignedUser() {
    return this.assignedUser;
  }

  setAssignedUser(assignedUser) {
    this.assignedUser = assignedUser;
  }
  setTaskStatus(taskStatus) {
    this.taskStatus = taskStatus;
  }
  getTaskStatus() {
    return this.taskStatus;
  }
  setPaeStatus(paeStatus) {
    this.paeStatus = paeStatus;
  }
  getPaeStatus() {
    return this.paeStatus;
  }

  setTaskQueue(taskQueue) {
    this.taskQueue = taskQueue;
  }
  getTaskQueue() {
    return this.taskQueue;
  }

  setUserId(userId) {
    this.userId = userId;
  }
  getUserId() {
    return this.userId;
  }

  setApplicantName(applicantName) {
    this.applicantName = applicantName;
  }
  getApplicantName() {
    return this.applicantName;
  }

  setHideSearchForPerson(setValue) {
    this.hideSearchForPerson = setValue;
  }

  getHideSearchForPerson() {
    return this.hideSearchForPerson;
  }

  setisCertUploaded(setValue)
  {
    this.isCertiUploded = setValue;
  }

  getisCertUploded()
  {
    return this.isCertiUploded;
  }

  setReqIcap(value){
    this.reqICAP = value;
  }

  getReqIcap(){
    return this.reqICAP;
  }

  getChmType(){
    return this.ChmType;
  }

  setChmTypeCd(typeCd){
    this.ChmType = typeCd;
  }

  getDueDate(){
    return this.dueDate;
  }

  setDueDate(dueDt){
    this.dueDate = dueDt;
  }

  getPaeSubmitted(){
    return this.paeSubmitted;
  }

  setPaeSubmitted(status){
    this.paeSubmitted = status;
  }

}
