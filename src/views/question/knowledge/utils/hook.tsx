import dayjs from "dayjs";
import editForm from "../form.vue";
import {
  KnowledgeDTO,
  addKnowledgeApi,
  deleteKnowledgeApi,
  getKnowledgeListApi,
  updateKnowledgeApi,
  KnowledgeQuery
} from "@/api/question/knowledge";
import {getExamListApi} from "@/api/question/exam"
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import {CommonUtils} from "@/utils/common";
import { message } from "@/utils/message";
import {AddKnowledgeRequest} from "@/views/question/knowledge/utils/types";
import {useUserStoreHook} from "@/store/modules/user";
import {getSubjectListApi} from "@/api/question/subject";

export function knowledgeHook() {

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

  const searchFormParams = reactive<KnowledgeQuery>({
    knowledgeTitle: undefined,
    state:undefined,
    subjectId: undefined,
    orderColumn: defaultSort.prop,
    orderDirection: defaultSort.order
  });

  const formRef = ref();

  const pageLoading = ref(true);
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();
  const examOptions = ref([]);
  const subjectOptions = ref([]);

  const statusMap = useUserStoreHook().dictionaryMap["common.status"];

  const columns: TableColumnList = [
    {
      label: "知识点id",
      prop: "id",
      width: 100,
      align: "center",
    },
    {
      label: "所属考试",
      prop: "examTitle",
      width: 200,
      align: "center",
    },
    {
      label: "所属科目",
      prop: "subjectTitle",
      width: 200,
      align: "center",
    },
    {
      label: "科目id",
      prop: "subjectId",
      width: 100,
      hide: true
    },
    {
      label: "知识点名称",
      prop: "title",
      width: 200,
      align: "left"
    },
    {
      label: "状态",
      prop: "state",
      minWidth: 80,
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
      minWidth: 160,
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

    await getKnowledgeList();
  }

  async function getKnowledgeList(sort: Sort = defaultSort) {
    if (sort != null) {
      CommonUtils.fillSortParams(searchFormParams, sort);
    }
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    pageLoading.value = true;
    const { data } = await getKnowledgeListApi(
      toRaw(searchFormParams)
    ).finally(() => {
      pageLoading.value = false;
    });

    dataList.value = data.rows;
    pagination.total = data.total;
  }

  async function handleAdd(row, done) {
    await addKnowledgeApi(row).then(() => {
      message(`您新增了知识点:${row.title}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function handleUpdate(row, done) {
    await updateKnowledgeApi(row.id, row).then(() => {
      message(`您更新了知识点${row.title}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function openDialog(title = "新增", row?: KnowledgeDTO) {
    addDialog({
      title: `${title}知识点`,
      props: {
        formInline: {
          subjectTitle: row?.subjectTitle ?? "",
          id: row?.id ?? "",
          state: row?.state ?? "",
          subjectId: row?.subjectId ?? "",
          content: row?.content ?? "",
          remark: row?.remark ?? "",
          title: row?.title ?? ""
        },
        examOptions:examOptions,
        subjectOptions:subjectOptions
      },
      width: "80%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const formRuleRef = formRef.value.getFormRuleRef();

        const curData = options.props.formInline as AddKnowledgeRequest;

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
      },
    });
  }

  async function handleDelete(row) {
    await deleteKnowledgeApi(row.id).then(() => {
      message(`您删除了知识点${row.knowledgeTitle}`, { type: "success" });
      // 刷新列表
      onSearch();
    });
  }

  onMounted(async () => {
    await getKnowledgeList();
    const examResponse = await getExamListApi({});
    examOptions.value = examResponse.data.rows;

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
    getKnowledgeList,
    examOptions,
    subjectOptions,
    pageLoading,
    pagination
  };
}
