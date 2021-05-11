export interface ReferenceTable {
  code: string;
  description: string;
}

export class ReferenceTables{

  ADJUDICATION_DUE_RT: ReferenceTable[] = [
  {code: '1D', description: '1 Day'},
  {code: '2D', description: '2 Days'},
  {code: '3D', description: '3 Days'},
  {code: '4D', description: '4 Days'},
  {code: '5D', description: '5 Days'},
  {code: '6D', description: '6 Days'},
  {code: '7D', description: '7 Days'},
  {code: '8D', description: '8 Days'}
];

 ENROLLMENT_GROUP_RT : ReferenceTable[] = [
  {code: 'CG1', description: 'CHOICES Group 1'},
  {code: 'CG2', description: 'CHOICES Group 2'},
  {code: 'CG3', description: 'CHOICES Group 3'},
  {code: 'EC4', description: 'ECF CHOICES Group 4'},
  {code: 'EC5', description: 'ECF CHOICES Group 5'},
  {code: 'EC6', description: 'ECF CHOICES Group 6'},
  {code: 'EC7', description: 'ECF CHOICES Group 7'},
  {code: 'EC8', description: 'ECF CHOICES Group 8'},
  {code: 'PACE', description: 'PACE'},
  {code: 'ICF', description: 'ICF/IID'},
  {code: 'CAC', description: 'CAC'},
  {code: 'KBA', description: 'Katie Beckett Part A'},
  {code: 'KBB', description: 'Katie Beckett Part B'},
  {code: 'SED', description: 'Self-Determination Waiver'},
  {code: 'STW', description: 'Statewide Waiver'}
];


















}