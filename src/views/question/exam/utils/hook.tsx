import dayjs from "dayjs";
import editForm from "../form.vue";
import {
  ExamDTO,
  addExamApi,
  deleteExamApi,
  getExamListApi,
  updateExamApi,
  ExamQuery
} from "@/api/question/exam";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import {CommonUtils} from "@/utils/common";
import { message } from "@/utils/message";
import {AddExamRequest} from "@/views/question/exam/utils/types";
import {useUserStoreHook} from "@/store/modules/user";

export function examHook() {

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

  const searchFormParams = reactive<ExamQuery>({
    examTitle: undefined,
    state:undefined,
    orderColumn: defaultSort.prop,
    orderDirection: defaultSort.order
  });

  const formRef = ref();

  const pageLoading = ref(true);
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();

  const statusMap = useUserStoreHook().dictionaryMap["common.status"];

  const columns: TableColumnList = [
    {
      label: "考试id",
      prop: "id",
      width: 100,
      align: "center",
    },
    {
      label: "考试名称",
      prop: "examTitle",
      width: 240,
      align: "left"
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

    await getExamList();
  }

  async function getExamList(sort: Sort = defaultSort) {
    if (sort != null) {
      CommonUtils.fillSortParams(searchFormParams, sort);
    }
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    pageLoading.value = true;
    const { data } = await getExamListApi(
      toRaw(searchFormParams)
    ).finally(() => {
      pageLoading.value = false;
    });

    dataList.value = data.rows;
    pagination.total = data.total;
  }

  async function handleAdd(row, done) {
    await addExamApi(row).then(() => {
      message(`您新增了考试:${row.examTitle}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function handleUpdate(row, done) {
    await updateExamApi(row.id, row).then(() => {
      message(`您更新了考试${row.examTitle}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function openDialog(title = "新增", row?: ExamDTO) {
    addDialog({
      title: `${title}考试`,
      props: {
        formInline: {
          examTitle: row?.examTitle ?? "",
          id: row?.id ?? "",
          state: row?.state ?? "",
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const formRuleRef = formRef.value.getFormRuleRef();

        const curData = options.props.formInline as AddExamRequest;

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
    await deleteExamApi(row.id).then(() => {
      message(`您删除了考试${row.examTitle}`, { type: "success" });
      // 刷新列表
      onSearch();
    });
  }

  onMounted(() => {
    getExamList();
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
    getExamList
  };
}
