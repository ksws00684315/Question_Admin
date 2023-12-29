import {AnswersDTO} from "@/api/question/question";
import {SubjectDTO} from "@/api/question/subject";

interface AddQuestionRequest {
  subjectId?: number;
  questionName?: string;
  updateTime?: Date;
  id?: number;
  quType?:number;
  examId?: number;
  state?:number;
  content?:String;
  remark?:String;
  analysis?:String;
  difficulty?:number;
  year?:number;
  answerList?:[]
}

interface FormProps {
  formInline: AddQuestionRequest;
  subjectOptions:SubjectDTO[];
}

export type { AddQuestionRequest, FormProps };
