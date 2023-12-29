<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useUserStoreHook } from "@/store/modules/user";

/** TODO 有其他方式  来换掉这个props 父子组件传值吗？ */
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    categoryName: "",
    level:1,
    state:1
  })
});


const categoryData = ref(props.formInline);

const formRuleRef = ref();

function getFormRuleRef() {
  return formRuleRef.value;
}

defineExpose({ getFormRuleRef });
</script>

<template>
  <el-form
    ref="formRuleRef"
    :model="categoryData"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="类目名称" prop="categoryTitle">
      <el-input
        v-model="categoryData.categoryName"
        clearable
        placeholder="请输入类目标题"
      />
    </el-form-item>

    <el-form-item label="类目层级" prop="level">
      <el-input-number :min="1" :max="5" v-model="categoryData.level" />
    </el-form-item>

    <el-form-item label="状态" prop="state">
      <el-select
        v-model="categoryData.state"
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
