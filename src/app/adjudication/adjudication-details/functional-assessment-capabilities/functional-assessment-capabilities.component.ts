import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  functionalmeasure: string;
  submitterresponse: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {functionalmeasure:'Transfer', submitterresponse: 'Usually Not'},
  {functionalmeasure: 'Mobility by Ambulation or WheelChair', submitterresponse: 'Never'},
  {functionalmeasure: 'Eating / Feeding', submitterresponse: 'Never'},
  {functionalmeasure: 'Toileting and Toileting Hygiene', submitterresponse: 'Always'},
  {functionalmeasure: 'Bathing', submitterresponse: 'Usually'},
  {functionalmeasure: 'Vision', submitterresponse: 'Usually Not'},
  {functionalmeasure: 'Expressive Communication', submitterresponse: 'Never'},
  {functionalmeasure: 'Receptive Communication', submitterresponse: 'Usually Not'},
  {functionalmeasure: 'Orientation', submitterresponse: 'Usually Not'},
  {functionalmeasure: 'Prescription Medication, Ability To Self-Administer', submitterresponse: 'Usually Not'},
  {functionalmeasure: 'Behavior', submitterresponse: 'Never'},
];

@Component({
  selector: 'app-functional-assessment-capabilities',
  templateUrl: './functional-assessment-capabilities.component.html',
  styleUrls: ['./functional-assessment-capabilities.component.scss']
})
export class FunctionalAssessmentCapabilitiesComponent implements OnInit {
  displayedColumns: string[] = ['functionalmeasure', 'submitterresponse'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
