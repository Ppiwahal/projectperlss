import { PaeContactInfoAddress } from './PaeContactInfoAddress';

export class PaeContactInformationDetails{
  constructor(
    public addressList: PaeContactInfoAddress[],
    public applicantCellPhNum: string,
    public contactSw: string,
    public appDsgnSw: string,
    public applicantEmailAddr: string,
    public firstName: string,
    public getLettersSw: string,
    public hasLegalRightsSw: string,
    public applicantHomePhNum: string,
    public id: string,
    public paeId: string,
    public appInterSw: string,
    public interprtLang: string,
    public lastName: string,
    public emailAddr: string,
    public cellPhNum: string,
    public homePhNum: string,
    public workPhNum: string,
    public mailSw: string,
    public midInitial: string,
    public prefLangLettersCd: string,
    public prefPhTypeCd: string,
    public prsnId: string,
    public reltshpCd: string,
    public suffix: string,
    public userTypeCd: string,
    public applicantWorkPhNum: string

  ) { }
}
