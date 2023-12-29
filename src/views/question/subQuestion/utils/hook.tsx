import dayjs from "dayjs";
import editForm from "../form.vue";
import {
  QuestionDTO,
  addQuestionApi,
  deleteQuestionApi,
  getQuestionListApi,
  updateQuestionApi,
  QuestionQuery, getQuestionAnswerListApi, AnswersDTO
} from "@/api/question/question";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import {CommonUtils} from "@/utils/common";
import { message } from "@/utils/message";
import {AddQuestionRequest} from "@/views/question/question/utils/types";
import {useUserStoreHook} from "@/store/modules/user";
import {getSubjectListApi} from "@/api/question/subject";

export function subQuestionHook() {

  const pagination: PaginationProps = {
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  };

  const defaultSort: Sort = {
    prop: "updateTime",
    order: "descending"
  };

  const searchFormParams = reactive<QuestionQuery>({
    questionTitle: undefined,
    state:undefined,
    orderColumn: defaultSort.prop,
    orderDirection: defaultSort.order,
    quType:5
  });

  const formRef = ref();

  const pageLoading = ref(true);
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();
  const subjectOptions = ref([]);

  const statusMap = useUserStoreHook().dictionaryMap["common.status"];

  const columns: TableColumnList = [
    {
      label: "题目id",
      prop: "id",
      width: 100,
      align: "center",
    },
    {
      label: "题目简介",
      prop: "remark",
      width: 200,
      align: "center"
    },
    {
      label: "所属考试",
      prop: "examTitle",
      width: 200,
      align: "center"
    },
    {
      label: "所属科目",
      prop: "examTitle",
      width: 200,
      align: "center"
    },
    {
      label: "状态",
      prop: "state",
      minWidth: 120,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={statusMap[row.state].cssTag}
          effect="plain"
        >
          {statusMap[row.state].label}
        </el-tag>
      )
    },
    {
      label: "更新时间",
      minWidth: 200,
      prop: "updateTime",
      formatter: ({ updateTime }) =>
        dayjs(updateTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    // 点击搜索的时候 需要重置分页
    pagination.currentPage = 1;

    await getQuestionList();
  }

  async function getQuestionList(sort: Sort = defaultSort) {
    if (sort != null) {
      CommonUtils.fillSortParams(searchFormParams, sort);
    }
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    pageLoading.value = true;
    const { data } = await getQuestionListApi(
      toRaw(searchFormParams)
    ).finally(() => {
      pageLoading.value = false;
    });

    dataList.value = data.rows;
    pagination.total = data.total;
  }

  async function handleAdd(row, done) {
    await addQuestionApi(row).then(() => {
      message(`您新增了题目:${row.remark}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function handleUpdate(row, done) {
    await updateQuestionApi(row.id, row).then(() => {
      message(`您更新了题目${row.remark}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function openDialog(title = "新增", row?: QuestionDTO) {

    const answerList = ref([]);

    if(row !== undefined) {
      const { data } = await getQuestionAnswerListApi(row.id);
      answerList.value = data;
    }

    addDialog({
      title: `${title}题目`,
      props: {
        formInline: {
          subjectId: row?.subjectId ?? "",
          id: row?.id ?? "",
          state: row?.state ?? "",
          quType: row?.quType ?? "",
          content: row?.content ?? "",
          remark: row?.remark ?? "",
          analysis: row?.analysis ?? "",
          difficulty: row?.difficulty ?? "",
          year: row?.year ?? "",
          answerList: answerList
        },
        subjectOptions:subjectOptions
      },
      width: "80%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const formRuleRef = formRef.value.getFormRuleRef();
        const answerData = formRef.value.answerData;

        const curData = options.props.formInline as AddQuestionRequest;

        curData.answerList = answerData;

        formRuleRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              handleAdd(curData, done);
            } else {
              curData.id = row.id;
              handleUpdate(curData, done);
            }
          }
        });
      }
    });
  }

  async function handleDelete(row) {
    await deleteQuestionApi(row.id).then(() => {
      message(`您删除了题目${row.remark}`, { type: "success" });
      // 刷新列表
      onSearch();
    });
  }

  onMounted(async () => {
    await getQuestionList();
    const subjectResponse = await getSubjectListApi({});
    subjectOptions.value = subjectResponse.data.rows;
  });

  return {
    searchFormParams,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    getQuestionList,
    pageLoading,
    subjectOptions
  };
}
