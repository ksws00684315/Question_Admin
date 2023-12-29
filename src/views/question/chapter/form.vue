<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useUserStoreHook } from "@/store/modules/user";

/** TODO 有其他方式  来换掉这个props 父子组件传值吗？ */
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    textbookId: undefined,
    chapterTitle:  "",
    sort: undefined,
    desc: "",
    difficulty: undefined,
    state:undefined
  }),
});

const chapterData = ref(props.formInline);

const formRuleRef = ref();

function getFormRuleRef() {
  return formRuleRef.value;
}

defineExpose({ getFormRuleRef });
</script>

<template>
  <el-form
    ref="formRuleRef"
    :model="chapterData"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="章节名称" prop="chapterTitle">
      <el-input
        v-model="chapterData.chapterTitle"
        clearable
        placeholder="请输入章节名称"
      />
    </el-form-item>

    <el-form-item style="display: none" label="教材id" prop="textbookId">
      <el-input
        v-model="chapterData.textbookId"
        readonly="true"
      />
    </el-form-item>

    <el-form-item label="描述" prop="desc">
      <el-input
        v-model="chapterData.desc"
        placeholder="请输入描述"
        clearable
        class="!w-[180px]"
      >
      </el-input>
    </el-form-item>

    <el-form-item label="排序" prop="level">
      <el-input-number :min="1" :max="10" v-model="chapterData.sort" />
    </el-form-item>

    <el-form-item label="难度" prop="difficulty">
      <el-select
        v-model="chapterData.difficulty"
        placeholder="请选择难度"
        clearable
        class="!w-[180px]"
      >
        <el-option
          v-for="dict in useUserStoreHook().dictionaryMap['chapter.difficulty']"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="状态" prop="state">
      <el-select
        v-model="chapterData.state"
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
