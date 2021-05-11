import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-appeal-representative-accordion',
  templateUrl: './appeal-representative-accordion.component.html',
  styleUrls: ['./appeal-representative-accordion.component.scss']
})
export class AppealRepresentativeAccordionComponent implements OnInit {

  @Input() representativeFormData: any;
  // representativeDataList: any[] = []
  userSearchTitle: string = "sample Data";
  panelOpenState: boolean = false;
  @Input() nameSuffix: any;
  @Input() relationshipToAppellant: any;
  @Input() verificationSource: any;
  @Input() phoneType: any;
  relationShip: String = "";
  @Output() updateRepresentativeEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(){
    if(this.representativeFormData.length && this.relationshipToAppellant.length){
      this.representativeFormData.forEach( data => {
        this.relationshipToAppellant.forEach( relation => {
          if(data.appellantRelationship === relation.code){
            this.relationShip = relation.value;
          }
        })
      })
    }
  }

  saveRepresentaviveData(element){
    this.panelOpenState = !this.panelOpenState
    this.representativeFormData.forEach( data =>{
          if(element.index === data.index){
               data = element;
          }
    })
    this.updateRepresentativeEmitter.emit(this.representativeFormData);
  }

  cancel(){
    this.panelOpenState = !this.panelOpenState;
  }


  delete(element){
    const newArray = [];
    this.representativeFormData.forEach( data => {
     if(  element.index !== data.index){
        newArray.push(data)
     } 
    })
    this.representativeFormData = newArray;
    this.updateRepresentativeEmitter.emit(this.representativeFormData);
  }
  
}
