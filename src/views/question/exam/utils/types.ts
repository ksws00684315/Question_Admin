interface AddExamRequest {
  id?: number;
  examTitle?: string;
  state?:number
}

interface FormProps {
  formInline: AddExamRequest;
}

export type { AddExamRequest, FormProps };
