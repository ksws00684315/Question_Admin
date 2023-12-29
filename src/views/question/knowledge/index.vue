<script setup lang="ts">
import { ref } from "vue";
import { knowledgeHook } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import {useUserStoreHook} from "@/store/modules/user";

defineOptions({
  name: "Subject"
});

const commonStatusList =
  useUserStoreHook().dictionaryList["common.status"];

const formRef = ref();
const tableRef = ref();
const {
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
} = knowledgeHook();
</script>

<template>
  <div class="main">
    <!-- 搜索栏 -->
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchFormParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="名称：" prop="subjectTitle">
        <el-input
          v-model="searchFormParams.knowledgeTitle"
          placeholder="请输入知识点名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="状态：" prop="state">
        <el-select
          v-model="searchFormParams.state"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="dict in commonStatusList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="科目" prop="subjectId">
        <el-select
          v-model="searchFormParams.subjectId"
          placeholder="请选择科目"
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="item in subjectOptions"
            :key="item.id"
            :label="item.subjectTitle"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="pageLoading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button
          :icon="useRenderIcon(Refresh)"
          @click="resetForm(searchFormRef, tableRef)"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- table bar 包裹  table -->
    <PureTableBar title="知识点列表" :columns="columns" @refresh="onSearch">
      <!-- 表格操作栏 -->
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          添加知识点
        </el-button>
        <!--
        <el-button
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="handleBulkDelete(tableRef)"
        >
          批量删除
        </el-button>
        -->
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <!-- TODO sort-change 有其他好的处理方式吗？ -->
        <pure-table
          border
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="pageLoading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :default-sort="defaultSort"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="getKnowledgeList"
          @page-current-change="getKnowledgeList"
          @sort-change="getKnowledgeList"
          @selection-change="
            rows => (multipleSelection = rows.map(item => item.noticeId))
          "
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog('编辑', row)"
            >
              修改
            </el-button>
            <el-popconfirm
              :title="`是否确认删除编号为${row.id}的这条数据`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
:deep(.el-form-item) {
  margin-bottom: 12px;
}
}
</style>
