import { PaeFallHistoryVOList } from './PaeFallHistoryVOList';

export class PaeFallHistory {
  constructor(
      public fallHistoryCount: number,
      public paeId: string,
      public paeSafetyDeterFallHistDetailsVOList: PaeFallHistoryVOList [],
      public reqPageId: string
    ) {  }
}
