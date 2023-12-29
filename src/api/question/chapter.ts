import { http } from "@/utils/http";
/**
 * ChapterDTO
 */
export interface ChapterDTO {
  updateTime?: Date;
  id?: number;
  chapterTitle?:string;
  textbookId?: number;
  sort?:number;
  desc?:string;
  difficulty?:number;
  parentId?:number;
  state?:number;
}

export interface ChapterQuery extends BaseQuery {
  chapterTitle?: String;
  difficulty?: number;
  state?:number;
  textbookId?: number;
}

/**
 * AddChapterCommand
 */
export interface ChapterRequest {
  id?: number;
  chapterTitle?:string;
  textbookId?: number;
  sort?:number;
  desc?:string;
  difficulty?:number;
}


/** 获取科目列表 */
export const getChapterListApi = (params?: ChapterQuery) => {
  return http.request<ResponseData<PageDTO<ChapterDTO>>>(
    "get",
    "/question/chapter",
    {
      params
    });
};

/** 新增科目 */
export const addChapterApi = (data: ChapterRequest) => {
  console.log(data);
  return http.request<ResponseData<void>>("post", "/question/chapter", {
    data
  });
};

/** 科目详情 */
export const getChapterInfoApi = (ChapterId: string) => {
  return http.request<ResponseData<ChapterDTO>>("get", `/question/chapter/${ChapterId}`);
};

/** 修改科目 */
export const updateChapterApi = (ChapterId: string, data: ChapterRequest) => {
  return http.request<ResponseData<void>>("put", `/question/chapter/${ChapterId}`, {
    data
  });
};

/** 删除科目 */
export const deleteChapterApi = (ChapterId: string) => {
  return http.request<ResponseData<void>>("delete", `/question/chapter/${ChapterId}`);
};
