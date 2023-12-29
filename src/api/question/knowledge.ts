import { http } from "@/utils/http";
/**
 * SubjectDTO
 */
export interface KnowledgeDTO {
  subjectId: number;
  knowledgeName?: string;
  updateTime?: Date;
  id?: number;
  subjectTitle?:string;
  examId?: number;
  state?:number;
  examTitle?:string;
  title?: String;
  content?;String;
  remark?:String;
}



export interface KnowledgeQuery extends BaseQuery {
  knowledgeTitle?: String,
  state?:number,
  subjectId?:number;
}

/**
 * AddKnowledgeCommand
 */
export interface KnowledgeRequest {
  id?: number;
  knowledgeName: String,
  state:number,
  examId:number;
}


/** 获取知识点列表 */
export const getKnowledgeListApi = (params?: KnowledgeQuery) => {
  return http.request<ResponseData<PageDTO<KnowledgeDTO>>>(
    "get",
    "/question/knowledge",
    {
      params
    });
};

/** 新增知识点 */
export const addKnowledgeApi = (data: KnowledgeRequest) => {
  console.log(data);
  return http.request<ResponseData<void>>("post", "/question/knowledge", {
    data
  });
};

/** 知识点详情 */
export const getKnowledgeInfoApi = (KnowledgeId: string) => {
  return http.request<ResponseData<KnowledgeDTO>>("get", `/question/knowledge/${KnowledgeId}`);
};

/** 修改知识点 */
export const updateKnowledgeApi = (KnowledgeId: string, data: KnowledgeRequest) => {
  return http.request<ResponseData<void>>("put", `/question/knowledge/${KnowledgeId}`, {
    data
  });
};

/** 删除知识点 */
export const deleteKnowledgeApi = (KnowledgeId: string) => {
  return http.request<ResponseData<void>>("delete", `/question/knowledge/${KnowledgeId}`);
};
