import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { EnvService } from '../../../_shared/utility/env.service';
import { PaeCommonService } from '../pae/pae-common/pae-common.service';
import {ReinstateMember} from '../../../_shared/model/change-management/reinStateMember';
import { WithdrawEnrollment } from 'src/app/_shared/model/change-management/withdrawEnrollment';
import {DisEnrollment} from '../../../_shared/model/change-management/disEnrollment';
import {AddServiceDischargeTransition} from '../../../_shared/model/change-management/addServiceDischargeTransition';
import {OverrideEnrollment} from '../../../_shared/model/change-management/overrideEnrollment';
import { Applicant } from '../../../_shared/model/Applicant';
import { HospiceEffectiveDate } from '../../../_shared/model/change-management/hospiceEffectiveDt';
import {ReassessmentDetails} from '../../../_shared/model/change-management/reassessmentDetails';
import {AddOrUpdateMedicaidOnlyPayerDate} from '../../../_shared/model/change-management/addOrUpdateMedicaid';
import {SubmitCostCapException} from '../../../_shared/model/change-management/submitCostCap';
import {DdIdController} from '../../../_shared/model/change-management/dd-Id-Controller';
import { LevelOfNeeds } from 'src/app/_shared/model/change-management/levelOfNeeds';
import { EnrollmentFilter } from 'src/app/_shared/model/EnrollmentFilter';
@Injectable({
  providedIn: 'root'
})
export class ChangeManagementService {
  public displayPae$$ = new BehaviorSubject<any>(null);
  serverApiUrl: any;
  fieldMaps: any = {};
  clearFormIndex = 0;
  clearFormTracker = new Subject<number>();
  personData = new Subject<any>();
  personId = new Subject<any>();
  public data: any = {

    costCapException: [
      { code: 'VOL', desc: 'Initiate Transition' },
      { code: 'INV', desc: 'Submit Another Exception' }
    ],

    referralStatus: [
    {code: 'PS', value:'Pending Submission', activateSW:'Y'},
    {code: 'NW', value:'New', activateSW:'Y'},
    {code: 'IN', value:'Intake', activateSW:'Y'},
    {code: 'RR', value:'Request for Reassignment', activateSW:'Y'},
    {code: 'NR', value:'Nurse Review', activateSW:'Y'},
    {code: 'IA', value:'IARC Review', activateSW:'Y'},
    {code: 'IR', value:'Information Requested', activateSW:'Y'},
    {code: 'SA', value:'Pending Slot Assignment', activateSW:'Y'},
    {code: 'RL', value:'On Referral List', activateSW:'Y'},
    {code: 'PE', value:'Pending PAE', activateSW:'Y'},
    {code: 'TP', value:'TP Denied', activateSW:'Y'},
    {code: 'CP', value:'Complete', activateSW:'Y'},
    {code: 'EN', value:'Ended', activateSW:'Y'},
    {code: 'UC', value:'Unable to Contact', activateSW:'Y'},
    {code: 'IE', value:'Intake Ended by Applicant Request', activateSW:'Y'},
    {code: 'RE', value:'To be Removed from Referral List', activateSW:'Y'},
    {code: 'CL', value:'Closed', activateSW:'Y'},
    {code: 'EN', value:'Ended', activateSW:'Y'},
    {code: 'IT', value:'Ended - Initiate Transition', activateSW:'Y'}],

    paeStatus: [
      { code: 'PS', value: 'Pending Submission', activateSW: 'Y' },
      { code: 'AD', value: 'Pending Adjudication', activateSW: 'Y' },
      { code: 'AP', value: 'Approved', activateSW: 'Y' },
      { code: 'AA', value: 'Approved At Risk', activateSW: 'Y' },
      { code: 'DN', value: 'Denied', activateSW: 'Y' },
      { code: 'CL', value: 'Closed', activateSW: 'Y' },
      { code: 'WI', value: 'Withdrawn', activateSW: 'Y' },
      { code: 'IN', value: 'Inactive', activateSW: 'Y' }
    ],

    levelOfCare: [
      { code: 'NF', value: 'NF LOC' },
      { code: 'RK', value: 'At Risk' }
    ],

    enrollmentGroup: [
      { code: 'CG1', value: 'CHOICES Group 1' },
      { code: 'CG2', value: 'CHOICES Group 2' },
      { code: 'CG3', value: 'CHOICES Group 3' },
      { code: 'EC4', value: 'ECF CHOICES Group 4' },
      { code: 'EC5', value: 'ECF CHOICES Group 5' },
      { code: 'EC6', value: 'ECF CHOICES Group 6' },
      { code: 'EC7', value: 'ECF CHOICES Group 7' },
      { code: 'EC8', value: 'ECF CHOICES Group 8' },
      { code: 'PACE', value: 'PACE' },
      { code: 'ICF', value: 'ICF/IID' },
      { code: 'CAC', value: 'CAC' },
      { code: 'KBA', value: 'Katie Beckett Part A' },
      { code: 'KBB', value: 'Katie Beckett Part B' },
      { code: 'SED', value: 'Self-Determination Waiver' },
      { code: 'STW', value: 'Statewide Waiver' },
      { code: 'ECF', value: 'ECF CHOICES' }
    ],

    appealStatus: [
      { code: 'NW', desc: 'New' },
      { code: 'IP', desc: 'Filing in Progress' },
      { code: 'AR', desc: 'Appeal Review' },
      { code: 'NR', desc: 'ANR Review' },
      { code: 'CR', desc: 'Clinical Review' },
      { code: 'TB', desc: 'To be set for Hearing' },
      { code: 'CR', desc: 'Pending Case Referral Packet' },
      { code: 'NOH', desc: 'Waiting on NOH' },
      { code: 'PH', desc: 'Pending Hearing' },
      { code: 'WO', desc: 'Waiting on Order' },
      { code: 'IO', desc: 'Implement the Order' },
      { code: 'PF', desc: 'PFR/PFA Requested' },
      { code: 'CD', desc: 'Closed' }
    ],

    stateList: [
      { code: 'TN ', value: 'Tennessee', activateSW: 'Y' },
      { code: 'AL ', value: 'Alabama', activateSW: 'Y' },
      { code: 'AK ', value: 'Alaska', activateSW: 'Y' },
      { code: 'AZ ', value: 'Arizona', activateSW: 'Y' },
      { code: 'AR ', value: 'Arkansas', activateSW: 'Y' },
      { code: 'CA ', value: 'California', activateSW: 'Y' },
      { code: 'CO ', value: 'Colorado', activateSW: 'Y' },
      { code: 'CT ', value: 'Connecticut', activateSW: 'Y' },
      { code: 'DE ', value: 'Delaware', activateSW: 'Y' },
      { code: 'DC', value: 'District of Columbia', activateSW: 'Y' },
      { code: 'FL ', value: 'Florida', activateSW: 'Y' },
      { code: 'GA', value: 'Georgia', activateSW: 'Y' },
      { code: 'HI ', value: 'Hawaii', activateSW: 'Y' },
      { code: 'ID ', value: 'Idaho', activateSW: 'Y' },
      { code: 'IL ', value: 'Illinois', activateSW: 'Y' },
      { code: 'IN ', value: 'Indiana', activateSW: 'Y' },
      { code: 'IA ', value: 'Iowa', activateSW: 'Y' },
      { code: 'KS ', value: 'Kansas', activateSW: 'Y' },
      { code: 'KY ', value: 'Kentucky', activateSW: 'Y' },
      { code: 'LA ', value: 'Louisiana', activateSW: 'Y' },
      { code: 'ME ', value: 'Maine', activateSW: 'Y' },
      { code: 'MD ', value: 'Maryland', activateSW: 'Y' },
      { code: 'MA ', value: 'Massachusetts', activateSW: 'Y' },
      { code: 'MI ', value: 'Michigan', activateSW: 'Y' },
      { code: 'MN ', value: 'Minnesota', activateSW: 'Y' },
      { code: 'MS ', value: 'Mississippi', activateSW: 'Y' },
      { code: 'MO ', value: 'Missouri', activateSW: 'Y' },
      { code: 'MT ', value: 'Montana', activateSW: 'Y' },
      { code: 'NE ', value: 'Nebraska', activateSW: 'Y' },
      { code: 'NV ', value: 'Nevada', activateSW: 'Y' },
      { code: 'NH ', value: 'New Hampshire', activateSW: 'Y' },
      { code: 'NJ ', value: 'New Jersey', activateSW: 'Y' },
      { code: 'NM ', value: 'New Mexico', activateSW: 'Y' },
      { code: 'NY ', value: 'New York', activateSW: 'Y' },
      { code: 'NC ', value: 'North Carolina', activateSW: 'Y' },
      { code: 'ND ', value: 'North Dakota', activateSW: 'Y' },
      { code: 'OH ', value: 'Ohio', activateSW: 'Y' },
      { code: 'OK ', value: 'Oklahoma', activateSW: 'Y' },
      { code: 'OR ', value: 'Oregon', activateSW: 'Y' },
      { code: 'PA ', value: 'Pennsylvania', activateSW: 'Y' },
      { code: 'RI ', value: 'Rhode Island', activateSW: 'Y' },
      { code: 'SC ', value: 'South Carolina', activateSW: 'Y' },
      { code: 'SD ', value: 'South Dakota', activateSW: 'Y' },
      { code: 'TX ', value: 'Texas', activateSW: 'Y' },
      { code: 'UT ', value: 'Utah', activateSW: 'Y' },
      { code: 'VT ', value: 'Vermont', activateSW: 'Y' },
      { code: 'VA ', value: 'Virginia', activateSW: 'Y' },
      { code: 'WA ', value: 'Washington', activateSW: 'Y' },
      { code: 'WV ', value: 'West Virginia', activateSW: 'Y' },
      { code: 'WI ', value: 'Wisconsin', activateSW: 'Y' },
      { code: 'WY ', value: 'Wyoming', activateSW: 'Y' },
      { code: 'AS', value: 'American Samoa', activateSW: 'Y' },
      { code: 'FM', value: 'Federated States Of Micronesia', activateSW: 'Y' },
      { code: 'GU', value: 'Guam', activateSW: 'Y' },
      { code: 'MH', value: 'Marshall Islands', activateSW: 'Y' },
      { code: 'NI', value: 'North Mariana Islands', activateSW: 'Y' },
      { code: 'PR', value: 'Puerto Rico', activateSW: 'Y' },
      { code: 'PW', value: 'Palau', activateSW: 'Y' },
      { code: 'VI', value: 'Virgin Islands', activateSW: 'Y' },
    ],

    county: [{ code: '001', value: 'Anderson' },
    { code: '002', value: 'Bedford' },
    { code: '003', value: 'Benton' },
    { code: '004', value: 'Bledsoe' },
    { code: '005', value: 'Blount' },
    { code: '006', value: 'Bradley' },
    { code: '007', value: 'Campbell' },
    { code: '008', value: 'Cannon' },
    { code: '009', value: 'Carroll' },
    { code: '010', value: 'Carter' },
    { code: '011', value: 'Cheatham' },
    { code: '012', value: 'Chester' },
    { code: '013', value: 'Claiborne' },
    { code: '014', value: 'Clay' },
    { code: '015', value: 'Cocke' },
    { code: '016', value: 'Coffee' },
    { code: '017', value: 'Crockett' },
    { code: '018', value: 'Cumberland' },
    { code: '019', value: 'Davidson' },
    { code: '020', value: 'Decatur' },
    { code: '021', value: 'DeKalb' },
    { code: '022', value: 'Dickson' },
    { code: '023', value: 'Dyer' },
    { code: '024', value: 'Fayette' },
    { code: '025', value: 'Fentress' },
    { code: '026', value: 'Franklin' },
    { code: '027', value: 'Gibson' },
    { code: '028', value: 'Giles' },
    { code: '029', value: 'Grainger' },
    { code: '030', value: 'Greene' },
    { code: '031', value: 'Grundy' },
    { code: '032', value: 'Hamblen' },
    { code: '033', value: 'Hamilton' },
    { code: '034', value: 'Hancock' },
    { code: '035', value: 'Hardeman' },
    { code: '036', value: 'Hardin' },
    { code: '037', value: 'Hawkins' },
    { code: '038', value: 'Haywood' },
    { code: '039', value: 'Henderson' },
    { code: '040', value: 'Henry' },
    { code: '041', value: 'Hickman' },
    { code: '042', value: 'Houston' },
    { code: '043', value: 'Humphreys' },
    { code: '044', value: 'Jackson' },
    { code: '045', value: 'Jefferson' },
    { code: '046', value: 'Johnson' },
    { code: '047', value: 'Knox' },
    { code: '048', value: 'Lake' },
    { code: '049', value: 'Lauderdale' },
    { code: '050', value: 'Lawrence' },
    { code: '051', value: 'Lewis' },
    { code: '052', value: 'Lincoln' },
    { code: '053', value: 'Loudon' },
    { code: '054', value: 'Macon' },
    { code: '055', value: 'Madison' },
    { code: '056', value: 'Marion' },
    { code: '057', value: 'Marshall' },
    { code: '058', value: 'Maury' },
    { code: '059', value: 'Meigs' },
    { code: '060', value: 'Monroe' },
    { code: '061', value: 'Montgomery' },
    { code: '062', value: 'Moore' },
    { code: '063', value: 'Morgan' },
    { code: '064', value: 'McMinn' },
    { code: '065', value: 'McNairy' },
    { code: '066', value: 'Obion' },
    { code: '067', value: 'Overton' },
    { code: '068', value: 'Perry' },
    { code: '069', value: 'Pickett' },
    { code: '070', value: 'Polk' },
    { code: '071', value: 'Putnam' },
    { code: '072', value: 'Rhea' },
    { code: '073', value: 'Roane' },
    { code: '074', value: 'Robertson' },
    { code: '075', value: 'Rutherford' },
    { code: '076', value: 'Scott' },
    { code: '077', value: 'Sequatchie' },
    { code: '078', value: 'Sevier' },
    { code: '079', value: 'Shelby' },
    { code: '080', value: 'Smith' },
    { code: '081', value: 'Stewart' },
    { code: '082', value: 'Sullivan' },
    { code: '083', value: 'Sumner' },
    { code: '084', value: 'Tipton' },
    { code: '085', value: 'Trousdale' },
    { code: '086', value: 'Unicoi' },
    { code: '087', value: 'Union' },
    { code: '088', value: 'Van Buren' },
    { code: '089', value: 'Warren' },
    { code: '090', value: 'Washington' },
    { code: '091', value: 'Wayne' },
    { code: '092', value: 'Weakley' },
    { code: '093', value: 'White' },
    { code: '094', value: 'Williamson' },
    { code: '095', value: 'Wilson' },
    { code: '999', value: 'Out of State' }],
    entity: [
      {
        type: 'AAAD',
        code: 'FTAD',
        desc: 'First Tennessee AAAD',
        counties: [
          '010',
          '030',
          '034',
          '037',
          '046',
          '082',
          '086',
          '090'
        ],
        info: 'Area Agency on Aging and Disability'
      },
      {
        type: 'AAAD',
        code: 'ETAD',
        desc: 'East Tennessee AAAD',
        counties: [
          '001',
          '005',
          '007',
          '013',
          '015',
          '029',
          '032',
          '045',
          '047',
          '053',
          '060',
          '063',
          '073',
          '076',
          '078',
          '087'
        ],
        info: 'Area Agency on Aging and Disability'
      },
      {
        type: 'AAAD',
        code: 'STAD',
        desc: 'Southeast Tennessee AAAD',
        counties: [
          '004',
          '006',
          '031',
          '033',
          '056',
          '064',
          '059',
          '070',
          '072',
          '077'
        ],
        info: 'Area Agency on Aging and Disability'
      },
      {
        type: 'AAAD',
        code: 'UCAD',
        desc: 'Upper 018 AAAD',
        counties: [
          '008',
          '014',
          '018',
          '021',
          '025',
          '044',
          '054',
          '067',
          '069',
          '071',
          '080',
          '088',
          '089',
          '093'
        ],
        info: 'Area Agency on Aging and Disability'
      },
      {
        type: 'AAAD',
        code: 'GNAD',
        desc: 'Greater Nashville AAAD',
        counties: [
          '011',
          '019',
          '022',
          '042',
          '043',
          '061',
          '074',
          '075',
          '081',
          '083',
          '085',
          '094',
          '095'
        ],
        info: 'Area Agency on Aging and Disability'
      },
      {
        type: 'AAAD',
        code: 'SCAD',
        desc: 'South Central TN AAAD',
        counties: [
          '002',
          '016',
          '026',
          '028',
          '041',
          '050',
          '051',
          '052',
          '057',
          '058',
          '062',
          '068',
          '091'
        ],
        info: 'Area Agency on Aging and Disability'
      },
      {
        type: 'AAAD',
        code: 'NWAD',
        desc: 'Northwest AAAD',
        counties: [
          '003',
          '009',
          '017',
          '023',
          '027',
          '040',
          '048',
          '066',
          '092'
        ],
        info: 'Area Agency on Aging and Disability'
      },
      {
        type: 'AAAD',
        code: 'SWAD',
        desc: 'Southwest AAAD',
        counties: [
          '012',
          '020',
          '035',
          '036',
          '038',
          '039',
          '065',
          '055'
        ],
        info: 'Area Agency on Aging and Disability'
      },
      {
        type: 'AAAD',
        code: 'MSAD',
        desc: 'Aging Commission of the Mid-South AAAD',
        counties: [
          '024',
          '049',
          '084'
        ],
        cities: [
          'Memphis',
          'Shelby'
        ],
        info: 'Area Agency on Aging and Disability'
      },
      {
        type: 'Contractor',
        code: 'ASCA',
        desc: 'scend',
        counties: null,
        info: 'Ascend Users'
      },
      {
        type: 'ICF/IID',
        code: 'TBD-A',
        desc: 'TBD-A',
        counties: null,
        info: 'The Intermediate Care Facilities for Individuals with an Intellectual Disability'
      },
      {
        type: 'MCO',
        code: 'AMG',
        desc: 'Amerigroup',
        counties: null,
        info: 'Managed Care Organization - Amerigroup'
      },
      {
        type: 'MCO',
        code: 'BLU',
        desc: 'BlueCare',
        counties: null,
        info: 'Managed Care Organization - BlueCare'
      },
      {
        type: 'MCO',
        code: 'UHC',
        desc: 'UnitedHealthcare',
        counties: null,
        info: 'Managed Care Organization - UnitedHealthcare'
      },
      {
        type: 'Nursing Facilities and Hospitals',
        code: 'TBD-B',
        desc: 'TBD-B',
        counties: null,
        info: 'Nursing Facilities and Hospitals'
      },
      {
        type: 'PACE',
        code: 'ABT',
        desc: 'Alexian Brothers of Tennessee',
        counties: null,
        info: 'Programs of All-Inclusive Care for the Elderly'
      },
      {
        type: 'Sister State Agencies',
        code: 'DIDD',
        desc: 'DIDD',
        counties: null,
        info: 'Department of Intellectual and Developmental Disabilities'
      },
      {
        type: 'Sister State Agencies',
        code: 'DMHS',
        desc: 'DMHSAS',
        counties: null,
        info: 'Department of Mental Health and Substance Abuse Services'
      },
      {
        type: 'TennCare',
        code: 'LTSS',
        desc: 'LTSS',
        counties: null,
        info: 'Long-term services and supports'
      },
      {
        type: 'TennCare',
        code: 'TRO',
        desc: 'TennCare - Read Only',
        counties: null,
        info: 'Other TennCare Users'
      },
      {
        type: 'TennCare',
        code: 'MSVC',
        desc: 'Member Services',
        counties: null,
        info: 'TennCare Member Services'
      },
      {
        type: 'TennCare',
        code: 'OGC',
        desc: 'OGC',
        counties: null,
        info: 'Office of General Counsel'
      }
    ],
    disenrollmentReason: [
      { code: 'MDE', desc: 'Member Deceased', program: 'All', voluntary: false },
      { code: 'HOS', desc: 'Election of Hospice Services in a NF', program: 'CHOICES Group 1', voluntary: false },
      { code: 'NFD', desc: 'NF discharge (Group 1 only)', program: 'CHOICES Group 1', voluntary: false },
      { code: 'DEN', desc: 'Denied PAE and no longer meets LOC (NF LOC or At Risk)', program: 'All', voluntary: false },
      { code: 'COS', desc: 'Cannot safely meet needs within Cost Neutrality/Expenditure Cap, refusal of alternative services, including NF or ICF/IID as applicable', program: 'All HCBS Programs', voluntary: false },
      { code: 'SAF', desc: 'Cannot safely meet needs (HCBS only)', program: 'All HCBS Programs', voluntary: false },
      { code: 'NTC', desc: 'Member is not receiving TennCare reimbursed Long Term Services and Supports', program: '!KB', voluntary: false },
      { code: 'NON', desc: 'Non-payment of patient liability and member cannot transfer to another MCO', program: '!KB', voluntary: false },
      { code: 'STA', desc: 'Moved out of State', program: 'All', voluntary: false },
      { code: 'DCS', desc: 'DCS Custody', program: 'ECF CHOICES Group 4, 7', voluntary: false },
      { code: 'COT', desc: 'Cost exceeds Institution', program: 'KB', voluntary: false },
      { code: 'LNK', desc: 'Link', program: 'All', voluntary: false },
      { code: 'NOS', desc: 'I don’t want/ need long-term care anymore.', program: '!KB', voluntary: true },
      { code: 'PAY', desc: 'I don’t want to pay part of the cost of my long- term care (called patient liability)', program: 'KB', voluntary: true },
      { code: 'HOM', desc: 'I don’t want my home or things I own (my estate) to be used to pay TennCare back for my long-term care after my death. Services I may have to pay back include nursing home care and home care (or HCBS). It’s called “estate recovery,” and it’s part of federal law.', program: 'All, excludes 4, 7, KB', voluntary: true },
      { code: 'HNF', desc: 'I don’t want home and community-based (HCB)  services. I want care in a NF or ICF/ IID.', program: 'All HCBS Programs', voluntary: true },
      { code: 'MED', desc: '[insert child’s name] doesn’t want/ need Medicaid, including Katie Beckett Part A services.', program: 'KB', voluntary: true },
      { code: 'PRE', desc: 'I don’t want to pay premiums for {name} to be in Katie Beckett Part A.', program: 'KB', voluntary: true },
      { code: 'DRT', desc: 'Disenrolled due to transition', program: 'All', voluntary: true },
      { code: 'OTH', desc: 'Other', program: 'All', voluntary: true }
    ],

    disenrollmentType: [
      { code: 'VOL', desc: 'Voluntary Disenrollment' },
      { code: 'INV', desc: 'Involuntary Disenrollment' }
    ],

    refType: [
      { code: 'KN', desc: 'Katie Beckett' },
      { code: 'ECF', desc: 'ECF' },
      { code: 'OT', desc: 'Other' }
    ],

    enrollmentStatus: [
      { code: 'NEE', value: 'New' },
      { code: 'PRO', value: 'In Progress' },
      { code: 'MOP', value: 'Pending MOPD' },
      { code: 'PDD', value: 'Pending Discharge Date' },
      { code: 'PFE', value: 'Pending Financial Eligibility' },
      { code: 'PTD', value: 'Pending Transition Date' },
      { code: 'SSI', value: 'Pending SSI Resolution' },
      { code: 'ENR', value: 'Enrolled' },
      { code: 'DEN', value: 'Denied' },
      { code: 'WNF', value: 'Withdrawn by NF' },
      { code: 'WMC', value: 'Withdrawn by MCO/AAAD' },
      { code: 'ERS', value: 'Enrolled in Reserve Slot' },
      { code: 'RWL', value: 'Referred to Waiting List' },
      { code: 'DIS', value: 'Disenrolled' },
      { code: '', value: '---' }
    ],

    documentType: [
      { code: 'OSD', desc: 'Other Supporting Documents' },
      { code: 'DEF', desc: 'Disenrollment Form' }
    ]
  };

  public personData$ = this.personData.asObservable();
  public personId$ = this.personId.asObservable();

  constructor(private http: HttpClient,
              private envService: EnvService,
              private paeCommonService: PaeCommonService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

    getPersonDetails(searchText, entityId): Observable<any[]> {
    let paramss =  new HttpParams();
    paramss = paramss.append('searchText', searchText);
    paramss = paramss.append('entityId', entityId);
    return this.http.get<any[]>(`${this.serverApiUrl.API_URL}/api/es-user/personSearch`, {params: paramss});
  }

  public sendPersonData(personData: any) {
    this.personData.next(personData);
  }
  public sendPersonId(personId: any) {
    this.personId.next(personId);
  }

  public clearForm() {
    this.clearFormIndex++;
    this.clearFormTracker.next(this.clearFormIndex);
  }

  async getPaeSearchResults(personId: string) {
    return await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/changeManagement/paeSearchResults',
      { observe: 'response', params: { personId } }).toPromise();
  }

  async getRevisePaeSearchResults(personId: string) {
    return await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/changeManagement/revisePae/getSearchResults',
      { observe: 'response', params: { personId } }).toPromise();
  }

  async getAddServicedatePaeSearchResults(prsnId: string) {
    return await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/changeManagement/addServiceDischargeTransition/getSearchResults',
      { observe: 'response', params: { prsnId } }).toPromise();
  }

  getaddServiceDischargeTransition(personId): any {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/changeManagement/addOrUpdateMedicaidOnlyPayerDate/getSearchResults/${personId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  async getreinstateMember(personId: string) {
    return await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/changeManagement/reinstateMember/getPAEDetails',
      { observe: 'response', params: { personId } }).toPromise();
  }

  lookupField(fieldSetting: any, datarow: any, returnOriginalValueIfNotFound: boolean = false): string {
    const value = datarow[fieldSetting.field];
    if (fieldSetting.lookup) {
      return this.getLookupValue(fieldSetting.lookup, value);
    } else {
      switch (fieldSetting.format || 'default') {
        case 'date':
          const date = new Date(value);
          return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

        case 'default':
          return this.addDashes(value);
      }

    }
  }


  savePaeDisenrollment(paeId: string, groupcode: string) {
    // let dataItem = this.personData[paeId];
    // dataItem.program  = groupValue;
  }

  // will be async method
  savePaeManageEntityAssociation(paeId: string, groupCode: string) {
    // let dataItem = this.getPerson(paeId);
    // dataItem.entity = groupCode;
  }

  // will be async method
  savePaeHospiceDate(paeId: string, dateCode: string, comments: string) {
    // let dataItem = this.getPerson(paeId);
    // dataItem.comment = comments;
    // dataItem.effectiveDate = dateCode;
  }

  saveCostCapException(paeId: string, action: string, amount: string, effectiveDate: string, exceptionReason: string) {
    // let dataItem = this.getPerson(paeId);
    // dataItem.costCapAction = action;
    // dataItem.costCapAmount = amount;
    // dataItem.costExceptionEffectiveDate = effectiveDate;
    // dataItem.costCapExceptionReason = exceptionReason;
  }

  addDashes(x: string) {
    return !x || x === '' ? '\u2508' : x.split(' ').join('\u00a0');
  }

  public getLookupValue(lookup: Array<string>, value: string, returnOriginalValueIfNotFound = false): string {

    let table = this.data[lookup[0]];
    if (!table) {
      return 'bad lookup:' + lookup[0];
    }
    const mapName = lookup.join('_');
    if (!this.fieldMaps[mapName]) {
      const map = {};
      table.forEach(item => {
        map[item.code] = item[lookup[1]];
      });
      this.fieldMaps[mapName] = map;
    }
    if (!value) {
      this.addDashes(value);
    }
    const newValue = this.fieldMaps[mapName][value];
    if (!newValue) {
      return returnOriginalValueIfNotFound ? value : mapName + ' map error: ' + value;
    }
    return this.addDashes(newValue);
  }

  async saveReinstateMember(reinstateMember: ReinstateMember): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/changeManagement/reinstateMember/saveChmRqst`,
    reinstateMember, { observe: 'response' }).toPromise();
  }

  async saveWithdrawnEnrRqst(withdrawEnrollment: WithdrawEnrollment): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/changeManagement/withdrawnEnrRqst/submit`,
    withdrawEnrollment, { observe: 'response' }).toPromise();
  }

  getStaticDataValue(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=CHM_TYPE`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async saveDisenrollment(disEnrollment: DisEnrollment): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/changeManagement/disenrollment/updateDisenrollment`,
    disEnrollment, { observe: 'response' }).toPromise();
  }

  async saveaddServiceDischargeTransition(addServiceDischargeTransition: AddServiceDischargeTransition): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/changeManagement/addServiceDischargeTransition/submit`,
    addServiceDischargeTransition, { observe: 'response' }).toPromise();
  }

  async saveOverrideEnrollment(overrideEnrollment: OverrideEnrollment): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/changeManagement/overrideEnrollment/saveOverrideEnr`,
    overrideEnrollment, { observe: 'response' }).toPromise();
  }
  postSearchPerson(applicant: Applicant): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/referral/searchPerson`, applicant);
  }
  getUserDetails(personId: string, recordId: any, recordType: any): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.ADMIN_API_URL}/admin/personMatch?personId=${personId}&recordId=${recordId}&recordType=${recordType}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  submitDemoInfo(personDetails: any): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/changeManagement/updateDemographicInfoService/submit`, personDetails);
  }
  async getReferralDetails(prsnId: string) {
    return await this.http.get<Observable<any>>(this.serverApiUrl.API_URL + '/changeManagement/cmpltRefIntake/getRefDetails',
      { observe: 'response', params: { prsnId } }).toPromise();
  }
  submitReferral(personDetails: any): Observable<any[]> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/changeManagement/cmpltRefIntake/saveComments`, personDetails);
  }
  getCmUpdateAddressRecord(prsnId: string) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/changeManagement/updateAddressOnFile/getCmUpdateAddressRecord?personId=${prsnId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getPersonRecordResults(personId: string) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/changeManagement/updateAddressOnFile/getCmUpdateAddressRecord?personId=${personId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async saveupdateHospiceEffDt(hospiceEffectiveDate: HospiceEffectiveDate): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/changeManagement/updateHospiceEffDt`,
    hospiceEffectiveDate, { observe: 'response' }).toPromise();
  }


 async SaveReassessmentDetails(reassessmentDetails: ReassessmentDetails): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/reassessment/saveReassessmentDetails`,
    reassessmentDetails, { observe: 'response' }).toPromise();
  }

  async SaveAddOrUpdateMedicaid(addOrUpdateMedicaidOnlyPayerDate: AddOrUpdateMedicaidOnlyPayerDate): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/changeManagement/addOrUpdateMedicaidOnlyPayerDate/mopdSubmit`,
    addOrUpdateMedicaidOnlyPayerDate, { observe: 'response' }).toPromise();
  }

  async SaveSubmitCostCapException(submitCostCapException: SubmitCostCapException): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/changeManagement/submitCostCapException/updateChm`,
    submitCostCapException, { observe: 'response' }).toPromise();
  }

  async SaveDdIdController(ddIdController: DdIdController): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/pae/savePAEComment`,
    ddIdController, { observe: 'response' }).toPromise();
  }
  updateAddressOnFile(addressDetails: any): Observable<any> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/changeManagement/updateAddressOnFile/submit`, addressDetails);
  }

  getEntityAssociation(prsnId: string) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/changeManagement/entityAssociation/getEntityAssociation?personId=${prsnId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  entityAssociationSubmit(entityDetails: any): Observable<any> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/changeManagement/entityAssociation/submit`, entityDetails);
  }

  updateFaciltyTransfer(facilityDetails: any): Observable<any> {
    return this.http.post<any[]>(this.serverApiUrl.API_URL + `/changeManagement/facilityTransfer/updateFaciltyTransfer`, facilityDetails);
  }
  getChmFaciltyTransfer(prsnId: string) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/changeManagement/facilityTransfer/getChmFaciltyTransfer?personId=${prsnId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getPaeLivingArrangement(paeId: string) {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/pae/getPaeLivingArrangement?paeId=${paeId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getStaticDataValues(): Observable<any> {
    return this.http.get<any>(`${this.serverApiUrl.API_URL}/api/staticData/getStaticDataValue?dataNameKey=FACILITY_NAME`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async SaveLevelofneed(levelOfNeeds: LevelOfNeeds): Promise<HttpResponse<any>> {
    return await this.http.post<any>(this.serverApiUrl.API_URL + `/changeManagement/levelofneed/submitCmLevelOfNeedRecord`,
    levelOfNeeds, { observe: 'response' }).toPromise();
  }

  getUserProfilesPhaseID(): Observable<any[]>{
    return this.http.get<any[]>(this.serverApiUrl.API_URL + `/api/phasedrollout/getCurrentPhaseAndPrograms`);
  }

  getEntityAssociate(): Observable<any>{
    return this.http.get<Observable<any>>(this.serverApiUrl.API_URL + `/changeManagement/entityAssociation/getEntities`);
  }
}
