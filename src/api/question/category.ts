import { http } from "@/utils/http";
/**
 * CategoryDTO
 */
export interface CategoryDTO {
  updateTime?: Date;
  id?: number;
  categoryName?:string;
  level?:number;
  state?:number;
}



export interface CategoryQuery extends BaseQuery {
  categoryName?: String,
  state?:number,
  level?:number;
}

/**
 * AddCategoryCommand
 */
export interface CategoryRequest {
  id?: number;
  categoryName?:string;
  state?:number;
  level?:number;
}


/** 获取类目列表 */
export const getCategoryListApi = (params?: CategoryQuery) => {
  return http.request<ResponseData<PageDTO<CategoryDTO>>>(
    "get",
    "/question/category",
    {
      params
    });
};

/** 新增类目 */
export const addCategoryApi = (data: CategoryRequest) => {
  console.log(data);
  return http.request<ResponseData<void>>("post", "/question/category", {
    data
  });
};

/** 类目详情 */
export const getCategoryInfoApi = (CategoryId: string) => {
  return http.request<ResponseData<CategoryDTO>>("get", `/question/category/${CategoryId}`);
};

/** 修改类目 */
export const updateCategoryApi = (CategoryId: string, data: CategoryRequest) => {
  return http.request<ResponseData<void>>("put", `/question/category/${CategoryId}`, {
    data
  });
};

/** 删除类目 */
export const deleteCategoryApi = (CategoryId: string) => {
  return http.request<ResponseData<void>>("delete", `/question/category/${CategoryId}`);
};
