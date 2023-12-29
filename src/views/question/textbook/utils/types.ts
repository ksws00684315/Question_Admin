import {CategoryDTO} from "@/api/question/category";
import {SubjectDTO} from "@/api/question/subject";
import {ExamDTO} from "@/api/question/exam";

interface AddTextbookRequest {
  id?: number;
  textbookName?: string;
  categoryId?: number;
  subjectId?: number;
  examId?:number;
  year?: string;
  state?:number;
}

interface FormProps {
  formInline: AddTextbookRequest;
  examOptions:ExamDTO[];
  subjectOptions:SubjectDTO[];
  categoryOptions:CategoryDTO[]
}

export type { AddTextbookRequest, FormProps };
