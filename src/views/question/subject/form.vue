<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useUserStoreHook } from "@/store/modules/user";

/** TODO 有其他方式  来换掉这个props 父子组件传值吗？ */
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    subjectTitle: "",
    state:1,
    examId:undefined
  }),
  examOptions: () => []
});


const subjectData = ref(props.formInline);

const examOptions = ref(props.examOptions)

const formRuleRef = ref();

function getFormRuleRef() {
  return formRuleRef.value;
}

defineExpose({ getFormRuleRef });
</script>

<template>
  <el-form
    ref="formRuleRef"
    :model="subjectData"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="科目标题" prop="subjectTitle">
      <el-input
        v-model="subjectData.subjectTitle"
        clearable
        placeholder="请输入科目标题"
      />
    </el-form-item>

    <el-form-item label="状态" prop="state">
      <el-select
        v-model="subjectData.state"
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

    <el-form-item label="考试" prop="examId">
      <el-select
        v-model="subjectData.examId"
        placeholder="请选择考试"
        clearable
        class="!w-[180px]"
      >
        <el-option
          v-for="item in examOptions"
          :key="item.id"
          :label="item.examTitle"
          :value="item.id"
          :disabled="item.state == 0"
        />
      </el-select>
    </el-form-item>

  </el-form>
</template>
