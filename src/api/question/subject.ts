import { http } from "@/utils/http";
/**
 * SubjectDTO
 */
export interface SubjectDTO {
  updateTime?: Date;
  id?: number;
  subjectTitle?:string;
  examId?: number;
  state?:number;
  examTitle?:string;
}



export interface SubjectQuery extends BaseQuery {
  subjectTitle?: String,
  state?:number,
  examId?:number;
}

/**
 * AddSubjectCommand
 */
export interface SubjectRequest {
  id?: number;
  subjectName: String,
  state:number,
  examId:number;
}


/** 获取科目列表 */
export const getSubjectListApi = (params?: SubjectQuery) => {
  return http.request<ResponseData<PageDTO<SubjectDTO>>>(
    "get",
    "/question/subject",
    {
      params
    });
};

/** 新增科目 */
export const addSubjectApi = (data: SubjectRequest) => {
  console.log(data);
  return http.request<ResponseData<void>>("post", "/question/subject", {
    data
  });
};

/** 科目详情 */
export const getSubjectInfoApi = (SubjectId: string) => {
  return http.request<ResponseData<SubjectDTO>>("get", `/question/subject/${SubjectId}`);
};

/** 修改科目 */
export const updateSubjectApi = (SubjectId: string, data: SubjectRequest) => {
  return http.request<ResponseData<void>>("put", `/question/subject/${SubjectId}`, {
    data
  });
};

/** 删除科目 */
export const deleteSubjectApi = (SubjectId: string) => {
  return http.request<ResponseData<void>>("delete", `/question/subject/${SubjectId}`);
};
