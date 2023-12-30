import { http } from "@/utils/http";
import {QuestionDTO, QuestionQuery} from "@/api/question/question";
/**
 * PaperDTO
 */
export interface PaperDTO {
  // 试卷id
  id: number;
  // 试卷名称
  name?: String;
  // 状态
  state?: number;
  // 年份
  year?: number;
  // 总分
  totalScore?: number;
  // 及格分数
  passingScore?: number;
  // 组卷类型
  createType?: number;
  // 难度
  difficulty?: number;
  // 排序
  sort?: number;
  // 描述
  description?: String;
  // 科目id
  subjectId?: number;
  // 科目名称
  subjectTitle?: String;
  // 更新时间
  updateTime?: Date;
  // 答题时长
  answerTime?:number;
}

export interface QuestionGroupDTO {
  // 题目组id
  id?: number;
  // 题目名称
  name?: String;
  // 状态
  state: number;
  // 总分
  totalScore?: number;
  // 难度
  difficulty?: number;
  // 排序
  sort?: number;
  // 更新时间
  updateTime?: Date;
  // 试卷id
  paperId?: number;
  // 描述
  description?: string;
  // 关联试题信息
  questionDTOList?: QuestionDTO[];
}

export interface PaperQuery extends BaseQuery {
  id: number;
  name?: String;
  state?: number;
  subjectId?:number;
}

/**
 * AddPaperCommand
 */
export interface PaperRequest {
  id: number;
  name?: String;
  state?: number;
  year?:number;
  totalScore?: number;
  passingScore?:number;
  createType?;number;
  difficulty?:number;
  sort?:number;
  description?:String;
  subjectId?:number;
  subjectTitle?:String;
  updateTime?:Date,
  questionGroupDTOList?:QuestionGroupDTO[]
}

/**
 * AddQuestionGroupCommand
 */
export interface QuestionGroupRequest {
  //题目组Id
  id?:number;
  //题目组名称
  name?:String
  //状态
  state: number;
  //总分
  totalScore?: number;
  //难度
  difficulty?:number;
  //排序
  sort?:number;
  //更新时间
  updateTime?: Date;
  //试卷id
  paperId?: number;
  //描述
  description?: String;
  //题目数量
  questionNums?: String;
  //关联题目信息
  questionIds?:[];
}

//题组详情对象
export interface QuestionGroupDetailRequest {
  //题组ID
  groupIds:number;
  details:QuestionGroupDetail[]
}

export interface QuestionGroupDetail {
  //题目id
  questionId?:number;
  //题目排序
  sort?:number
}

/** 获取试卷列表 */
export const getPaperListApi = (params?: PaperQuery) => {
  return http.request<ResponseData<PageDTO<PaperDTO>>>(
    "get",
    "/question/paper",
    {
      params
    });
};

/** 新增试卷 */
export const addPaperApi = (data) => {
  console.log(data);
  return http.request<ResponseData<void>>("post", "/question/paper", {
    data
  });
};

/** 试卷详情
 * 该方法不会查询关联的题目组
 * */
export const getPaperInfoApi = (PaperId: string) => {
  return http.request<ResponseData<PaperDTO>>("get", `/question/paper/${PaperId}`);
};

/** 更新试卷 */
export const updatePaperApi = (PaperId: string, data: PaperRequest) => {
  return http.request<ResponseData<void>>("put", `/question/paper/${PaperId}`, {
    data
  });
};

/** 删除试卷 */
export const deletePaperApi = (PaperId: string) => {
  return http.request<ResponseData<void>>("delete", `/question/paper/${PaperId}`);
};

/** 已创建试卷的情况下，新增题目组 */
export const addQuestionGroupApi = (data) => {
  console.log(data);
  return http.request<ResponseData<void>>("post", "/question/paper/questionGroup", {
    data
  });
};

/** 单个题目组关联题目 **/
export const editQuestionGroupDetailApi = (data) => {
  console.log(data);
  return http.request<ResponseData<void>>("put", "/question/paper/questionGroup/detail", {
    data
  });
};

/** 仅修改题目组信息 **/
export const editQuestionGroupApi = (data) => {
  console.log(data);
  return http.request<ResponseData<void>>("put", "/question/paper/questionGroup", {
    data
  });
};

/** 根据试卷id，获取题目组列表（不会关联查询题目组下面题目信息） */
export const getQuestionGroupByPaperIdListApi = (params?: PaperQuery) => {
  return http.request<ResponseData<QuestionGroupDTO[]>>(
    "get",
    "/question/paper/questionGroup",
    {
      params
    });
};

/** 根据试卷id，获取题目组列表（关联查询题目组下面题目信息） */
export const getQuestionGroupDetailByPaperIdListApi = (params?: PaperQuery) => {
  return http.request<ResponseData<QuestionGroupDTO[]>>(
    "get",
    "/question/paper/questionGroup/detail",
    {
      params
    });
};

/** 题组添加题目与排序 **/
export const addQuestionGroupDetailApi = (params?:QuestionGroupDetailRequest) => {
  return http.request<ResponseData<void>>("post", "/question/paper/questionGroup/detail/add", {
    params
  });
};

/** 题组移除题目 **/
export const removeQuestionGroupDetailApi = (params?:QuestionGroupDetailRequest) => {
  return http.request<ResponseData<void>>("post", "/question/paper/questionGroup/detail/remove", {
    params
  });
};

/** 修改移除题目排序 **/
export const updateQuestionGroupDetailApi = (params?:QuestionGroupDetailRequest) => {
  return http.request<ResponseData<void>>("post", "/question/paper/questionGroup/detail/update", {
    params
  });
};
