import dayjs from "dayjs";
import editForm from "../form.vue";
import {
  TextbookDTO,
  addTextbookApi,
  deleteTextbookApi,
  getTextbookListApi,
  updateTextbookApi,
  TextbookQuery
} from "@/api/question/textbook";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import {CommonUtils} from "@/utils/common";
import { message } from "@/utils/message";
import {getExamListApi} from "@/api/question/exam"
import {getSubjectListApi} from "@/api/question/subject"
import {getCategoryListApi} from "@/api/question/category"
import {AddTextbookRequest} from "@/views/question/textbook/utils/types";
import {useUserStoreHook} from "@/store/modules/user";
import { useRouter } from 'vue-router';

export function textbookHook() {

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

  const searchFormParams = reactive<TextbookQuery>({
    textbookName: undefined,
    year: undefined,
    subjectId:undefined,
    orderColumn: defaultSort.prop,
    orderDirection: defaultSort.order
  });

  const formRef = ref();

  const router = useRouter();

  const pageLoading = ref(true);
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();

  const subjectOptions = ref([]);
  const examOptions = ref([]);
  const categoryOptions = ref([]);

  const statusMap = useUserStoreHook().dictionaryMap["common.status"];

  const columns: TableColumnList = [
    {
      label: "教材id",
      prop: "id",
      width: 100,
      align: "center",
    },
    {
      label: "教材名称",
      prop: "textbookName",
      width: 160
    },
    {
      label: "所属大类",
      prop: "categoryName",
      minWidth: 160
    },
    {
      label: "所属考试",
      prop: "examTitle",
      minWidth: 160
    },
    {
      label: "所属科目",
      prop: "subjectTitle",
      minWidth: 160
    },
    {
      label: "年份",
      prop: "year",
      minWidth: 70
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

    getTextbookList();
  }

  async function getTextbookList(sort: Sort = defaultSort) {
    if (sort != null) {
      CommonUtils.fillSortParams(searchFormParams, sort);
    }
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    pageLoading.value = true;
    const { data } = await getTextbookListApi(
      toRaw(searchFormParams)
    ).finally(() => {
      pageLoading.value = false;
    });

    dataList.value = data.rows;
    pagination.total = data.total;
  }

  async function handleAdd(row, done) {
    await addTextbookApi(row).then(() => {
      message(`您新增了教材:${row.textbookName}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function handleUpdate(row, done) {
    await updateTextbookApi(row.id, row).then(() => {
      message(`您更新了教材${row.textbookName}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  function openChapterManager(row?:TextbookDTO) {
    const textbookId = row?.id;

    router.push({
      path: '/question/chapter/index', // 下一个页面的路径
      query: {
        textbookId: textbookId // 传递的参数
      }
    });
  }

  async function openDialog(title = "新增", row?: TextbookDTO) {
    addDialog({
      title: `${title}教材`,
      props: {
        formInline: {
          id: row?.id ?? "",
          textbookName: row?.textbookName ?? "",
          categoryId: row?.categoryId ?? "",
          subjectId: row?.subjectId ?? "",
          examId: row?.examId ?? "",
          year: row?.year ?? "",
          state: row?.state ?? ""
        },
        examOptions:examOptions,
        subjectOptions:subjectOptions,
        categoryOptions:categoryOptions
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const formRuleRef = formRef.value.getFormRuleRef();

        const curData = options.props.formInline as AddTextbookRequest;

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
    await deleteTextbookApi(row.id).then(() => {
      message(`您删除了教材${row.textbookName}`, { type: "success" });
      // 刷新列表
      onSearch();
    });
  }

  onMounted(async () => {
    await getTextbookList();

    const examResponse = await getExamListApi({});
    examOptions.value = examResponse.data.rows;

    const subjectResponse = await getSubjectListApi({});
    subjectOptions.value = subjectResponse.data.rows;

    const categoryResponse = await getCategoryListApi({});
    categoryOptions.value = categoryResponse.data.rows;

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
    getTextbookList,
    subjectOptions,
    examOptions,
    categoryOptions,
    pageLoading,
    openChapterManager,
    formRef
  };
}
