import { http } from "@/utils/http";
/**
 * SubjectDTO
 */
export interface QuestionDTO {
  subjectId: number;
  updateTime?: Date;
  id?: number;
  quType?:number;
  examId?: number;
  state?:number;
  content?;String;
  remark?:String;
  analysis?:String;
  difficulty?:number;
  year?:number;
  answersOptions?:AnswersDTO[]
}

export interface AnswersDTO {
  questionId: number;
  isRight?: boolean;
  updateTime?: Date;
  id?: number;
  seq?: string;
}

export interface QuestionQuery extends BaseQuery {
  questionTitle?: String,
  state?:number,
  subjectId?:number;
  quType?:number;
}

/**
 * AddQuestionCommand
 */
export interface QuestionRequest {
  id?: number;
  state:number,
  subjectId:number;
}


/** 获取题目列表 */
export const getQuestionListApi = (params?: QuestionQuery) => {
  return http.request<ResponseData<PageDTO<QuestionDTO>>>(
    "get",
    "/question/question",
    {
      params
    });
};

/** 新增题目 */
export const addQuestionApi = (data) => {
  console.log(data);
  return http.request<ResponseData<void>>("post", "/question/question", {
    data
  });
};

/** 题目详情 */
export const getQuestionInfoApi = (QuestionId: string) => {
  return http.request<ResponseData<QuestionDTO>>("get", `/question/question/${QuestionId}`);
};

/** 修改题目 */
export const updateQuestionApi = (QuestionId: string, data: QuestionRequest) => {
  return http.request<ResponseData<void>>("put", `/question/question/${QuestionId}`, {
    data
  });
};

/** 删除题目 */
export const deleteQuestionApi = (QuestionId: string) => {
  return http.request<ResponseData<void>>("delete", `/question/question/${QuestionId}`);
};

/** 题目详情 */
export const getQuestionAnswerListApi = (QuestionId: number) => {
  return http.request<ResponseData<AnswersDTO[]>>("get", `/question/question/answer/${QuestionId}`);
};
