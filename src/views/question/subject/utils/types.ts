import {ExamDTO} from "@/api/question/exam";

interface AddSubjectRequest {
  id?: number;
  subjectTitle?:string;
  examId?: number;
  state?:number;
}

interface FormProps {
  formInline: AddSubjectRequest;
  examOptions: ExamDTO[];
}

export type { AddSubjectRequest, FormProps };
