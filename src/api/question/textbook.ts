import { http } from "@/utils/http";
/**
 * TextBookDTO
 */
export interface TextbookDTO {
  updateTime?: Date;
  id?: number;
  textbookName?: string;
  categoryName?: string;
  subjectName?: string;
  examName?:string;
  categoryId?: number;
  subjectId?: number;
  examId?:number;
  year?: string;
  state?: number;
}



export interface TextbookQuery extends BaseQuery {
  textbookName?: String,
  year?: string,
  subjectId?:number
}

/**
 * AddTextbookCommand
 */
export interface TextbookRequest {
  textbookName?: string;
  categoryId?: number;
  subjectId?: number;
  examId?:number;
  year?: number;
}


/** 获取教材列表 */
export const getTextbookListApi = (params?: TextbookQuery) => {
  return http.request<ResponseData<PageDTO<TextbookDTO>>>(
    "get",
    "/question/textbook",
    {
      params
    });
};

/** 新增教材 */
export const addTextbookApi = (data: TextbookRequest) => {
  console.log(data);
  return http.request<ResponseData<void>>("post", "/question/textbook", {
    data
  });
};

/** 教材详情 */
export const getTextbookInfoApi = (TextbookId: string) => {
  return http.request<ResponseData<TextbookDTO>>("get", `/question/textbook/${TextbookId}`);
};

/** 修改教材 */
export const updateTextbookApi = (TextbookId: string, data: TextbookRequest) => {
  return http.request<ResponseData<void>>("put", `/question/textbook/${TextbookId}`, {
    data
  });
};

/** 删除教材 */
export const deleteTextbookApi = (TextbookId: string) => {
  return http.request<ResponseData<void>>("delete", `/question/textbook/${TextbookId}`);
};
