<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useUserStoreHook } from "@/store/modules/user";

/** TODO 有其他方式  来换掉这个props 父子组件传值吗？ */
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    textbookName: "",
    categoryId: undefined,
    subjectId: undefined,
    examId:undefined,
    year: undefined,
    state:undefined
  }),
  examOptions: () => [],
  subjectOptions: () => [],
  categoryOptions: () => [],
});

const textbookData = ref(props.formInline);
const examOptions = ref(props.examOptions);
const subjectOptions = ref(props.subjectOptions);
const categoryOptions = ref(props.categoryOptions);

const formRuleRef = ref();

function getFormRuleRef() {
  return formRuleRef.value;
}

defineExpose({ getFormRuleRef });
</script>

<template>
  <el-form
    ref="formRuleRef"
    :model="textbookData"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="教材标题" prop="textbookName">
      <el-input
        v-model="textbookData.textbookName"
        clearable
        placeholder="请输入教材标题"
      />
    </el-form-item>

    <el-form-item label="所属大类" prop="categoryId">
      <el-select
        v-model="textbookData.categoryId"
        placeholder="请选择大类"
        clearable
        class="!w-[180px]"
      >
        <el-option
          v-for="item in categoryOptions"
          :key="item.id"
          :label="item.categoryName"
          :value="item.id"
          :disabled="item.state == 0"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="科目" prop="subjectId">
      <el-select
        v-model="textbookData.subjectId"
        placeholder="请选择科目"
        clearable
        class="!w-[180px]"
      >
        <el-option
          v-for="item in subjectOptions"
          :key="item.id"
          :label="item.subjectTitle"
          :value="item.id"
          :disabled="item.state == 0"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="教材年份" prop="year">
      <el-input
        v-model="textbookData.year"
        clearable
        placeholder="请输入教材年份"
      />
    </el-form-item>

    <el-form-item label="状态" prop="state">
      <el-select
        v-model="textbookData.state"
        placeholder="请选择状态"
        clearable
        class="!w-[180px]"
      >
        <el-option
          v-for="dict in useUserStoreHook().dictionaryList['common.status']"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

  </el-form>
</template>
