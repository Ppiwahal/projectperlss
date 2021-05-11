import { PaeRecertificationVO } from './PaeRecertificationVO';
import { PaeVO } from './PaeVO';
import { PaeSubmissionVO } from './PaeSubmissionVO';
import { PaeSisubmissionVO } from './PaeSisSubmissionVO';

export class PaeReviewSubmit{
    constructor(
        public currTaskMasterId: number,
        public paeRecertificationVO: PaeRecertificationVO,
        public paeSisubmissionVO: PaeSisubmissionVO,
        public paeSubmissionVO: PaeSubmissionVO,
        public paeVO: PaeVO,
        public taskId: number,
        public reqPageId: string,
    ) { }
  }
