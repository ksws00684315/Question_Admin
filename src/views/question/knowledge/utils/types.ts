import {ExamDTO} from "@/api/question/exam";
import {SubjectDTO} from "@/api/question/subject";

interface AddKnowledgeRequest {
  id?: number;
  knowledgeTitle?:string;
  subjectId?: number;
  state?:number;
  content?:string;
  remark?:string;
  title?:string;
}

interface FormProps {
  formInline: AddKnowledgeRequest;
  examOptions: ExamDTO[];
  subjectOptions:SubjectDTO[];
}

export type { AddKnowledgeRequest, FormProps };
