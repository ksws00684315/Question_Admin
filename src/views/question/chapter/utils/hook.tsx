import dayjs from "dayjs";
import editForm from "../form.vue";
import {
  ChapterDTO,
  addChapterApi,
  deleteChapterApi,
  getChapterListApi,
  updateChapterApi,
  ChapterQuery
} from "@/api/question/chapter";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import {CommonUtils} from "@/utils/common";
import { message } from "@/utils/message";
import {AddChapterRequest} from "@/views/question/chapter/utils/types";
import {useUserStoreHook} from "@/store/modules/user";
import {getTextbookListApi} from "@/api/question/textbook"
import { useRouter } from 'vue-router';

export function chapterHook() {

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

  const searchFormParams = reactive<ChapterQuery>({
    chapterTitle: undefined,
    difficulty:undefined,
    orderColumn: defaultSort.prop,
    orderDirection: defaultSort.order,
    textbookId: undefined
  });

  const formRef = ref();

  const pageLoading = ref(true);
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();

  const textbookOptions = ref([]);

  const router = useRouter();

  const statusMap = useUserStoreHook().dictionaryMap["common.status"];
  const difficultyMap = useUserStoreHook().dictionaryMap["chapter.difficulty"];

  const columns: TableColumnList = [
    {
      label: "章节id",
      prop: "id",
      width: 100,
      align: "center",
    },
    {
      label: "章节名称",
      prop: "chapterTitle",
      width: 160
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 160
    },
    {
      label: "描述",
      prop: "desc",
      minWidth: 160
    },
    {
      label: "难度",
      prop: "difficulty",
      minWidth: 120,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={difficultyMap[row.difficulty].cssTag}
          effect="plain"
        >
          {difficultyMap[row.difficulty].label}
        </el-tag>
      )
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

    await getChapterList();
  }

  async function getChapterList(sort: Sort = defaultSort) {
    if (sort != null) {
      CommonUtils.fillSortParams(searchFormParams, sort);
    }
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    pageLoading.value = true;
    const { data } = await getChapterListApi(
      toRaw(searchFormParams)
    ).finally(() => {
      pageLoading.value = false;
    });

    dataList.value = data.rows;
    pagination.total = data.total;
  }

  async function handleAdd(row, done) {
    await addChapterApi(row).then(() => {
      message(`您新增了章节:${row.chapterTitle}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function handleUpdate(row, done) {
    await updateChapterApi(row.id, row).then(() => {
      message(`您更新了章节${row.chapterTitle}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function openDialog(title = "新增", row?: ChapterDTO) {
    addDialog({
      title: `${title}章节`,
      props: {
        formInline: {
          chapterTitle: row?.chapterTitle ?? "",
          textbookId: searchFormParams.textbookId ?? "",
          sort: row?.sort ?? "",
          desc: row?.desc ?? "",
          difficulty: row?.difficulty ?? "",
          parentId: row?.parentId ?? "",
          state: row?.state ?? ""
        },
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const formRuleRef = formRef.value.getFormRuleRef();

        const curData = options.props.formInline as AddChapterRequest;

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
    await deleteChapterApi(row.id).then(() => {
      message(`您删除了章节${row.chapterTitle}`, { type: "success" });
      // 刷新列表
      onSearch();
    });
  }

  onMounted(async () => {

    const textbookResponse = await getTextbookListApi({});
    textbookOptions.value = textbookResponse.data.rows;

    let textbookId = router.currentRoute.value.query.textbookId;
    if(textbookId != undefined) {
      searchFormParams.textbookId = Number(textbookId);
    } else {
      searchFormParams.textbookId = textbookOptions.value[0].id;
    }
    await getChapterList();

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
    getChapterList,
    pageLoading,
    pagination,
    textbookOptions
  };
}
