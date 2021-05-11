import { PaeContactInformationDetails  } from './PaeContactInformationDetails';

export class PaeContactInformation{
  constructor(
    public reqPageId: string,
    public paeId: string,
    public request: Array<PaeContactInformationDetails>
  ) { }
}
