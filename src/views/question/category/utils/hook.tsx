import dayjs from "dayjs";
import editForm from "../form.vue";
import {
  CategoryDTO,
  addCategoryApi,
  deleteCategoryApi,
  getCategoryListApi,
  updateCategoryApi,
  CategoryQuery
} from "@/api/question/category";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox, Sort } from "element-plus";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import {CommonUtils} from "@/utils/common";
import { message } from "@/utils/message";
import {AddCategoryRequest} from "@/views/question/category/utils/types";
import {useUserStoreHook} from "@/store/modules/user";


export function categoryHook() {

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

  const searchFormParams = reactive<CategoryQuery>({
    level: undefined,
    categoryName: undefined,
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
      label: "类目id",
      prop: "id",
      width: 100,
      align: "center",
    },
    {
      label: "类目名称",
      prop: "categoryName",
      width: 240,
      align: "left"
    },
    {
      label: "类目层级",
      prop: "level",
      width: 100,
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

    await getCategoryList();
  }

  async function getCategoryList(sort: Sort = defaultSort) {
    if (sort != null) {
      CommonUtils.fillSortParams(searchFormParams, sort);
    }
    CommonUtils.fillPaginationParams(searchFormParams, pagination);

    pageLoading.value = true;
    const { data } = await getCategoryListApi(
      toRaw(searchFormParams)
    ).finally(() => {
      pageLoading.value = false;
    });

    dataList.value = data.rows;
    pagination.total = data.total;
  }

  async function handleAdd(row, done) {
    await addCategoryApi(row).then(() => {
      message(`您新增了类目:${row.categoryName}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function handleUpdate(row, done) {
    await updateCategoryApi(row.id, row).then(() => {
      message(`您更新了类目${row.categoryName}`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      onSearch();
    });
  }

  async function openDialog(title = "新增", row?: CategoryDTO) {
    addDialog({
      title: `${title}类目`,
      props: {
        formInline: {
          categoryName: row?.categoryName ?? "",
          level: row?.level ?? "",
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

        const curData = options.props.formInline as AddCategoryRequest;

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
    await deleteCategoryApi(row.id).then(() => {
      message(`您删除了类目${row.categoryTitle}`, { type: "success" });
      // 刷新列表
      onSearch();
    });
  }

  onMounted(() => {
    getCategoryList();
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
    getCategoryList
  };
}
