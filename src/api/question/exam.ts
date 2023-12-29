import { http } from "@/utils/http";
/**
 * ExamDTO
 */
export interface ExamDTO {
  updateTime?: Date;
  id?: number;
  examTitle?:string;
  state?:number;
}



export interface ExamQuery extends BaseQuery {
  examTitle?: String,
  state?:number
}

/**
 * AddExamCommand
 */
export interface ExamRequest {
  id?: number;
  examTitle?:string;
  state?:number;
}


/** 获取考试列表 */
export const getExamListApi = (params?: ExamQuery) => {
  return http.request<ResponseData<PageDTO<ExamDTO>>>(
    "get",
    "/question/exam",
    {
      params
    });
};

/** 新增考试 */
export const addExamApi = (data: ExamRequest) => {
  console.log(data);
  return http.request<ResponseData<void>>("post", "/question/exam", {
    data
  });
};

/** 考试详情 */
export const getExamInfoApi = (ExamId: string) => {
  return http.request<ResponseData<ExamDTO>>("get", `/question/exam/${ExamId}`);
};

/** 修改考试 */
export const updateExamApi = (ExamId: string, data: ExamRequest) => {
  return http.request<ResponseData<void>>("put", `/question/exam/${ExamId}`, {
    data
  });
};

/** 删除考试 */
export const deleteExamApi = (ExamId: string) => {
  return http.request<ResponseData<void>>("delete", `/question/exam/${ExamId}`);
};
