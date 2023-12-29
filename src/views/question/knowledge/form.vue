<script setup lang="ts">
import {ref, reactive, onBeforeUnmount, shallowRef, onMounted, nextTick} from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useUserStoreHook } from "@/store/modules/user";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor} from "@/components/Editor/Editor.vue"

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

/** TODO 有其他方式  来换掉这个props 父子组件传值吗？ */
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    subjectTitle: "",
    state:1,
    examId:undefined,
    remark:"",
    content:"",
    title:undefined,
  }),
  examOptions: () => [],
  subjectOptions: ()=> []
});

const knowledgeData = ref(props.formInline);

const examOptions = ref(props.examOptions);
const subjectOptions = ref(props.subjectOptions);


const formRuleRef = ref();

function getFormRuleRef() {
  return formRuleRef.value;
}

defineExpose({ getFormRuleRef });


//富文本编辑器

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  nextTick(() => {
    editorRef.value = editor
  })
}

const toolbarConfig = ref({});
const editorConfig = ref({
  placeholder: '请输入内容...',
  readOnly: false,  // 只读
})
const mode = 'default';


</script>

<template>
  <el-form
    ref="formRuleRef"
    :model="knowledgeData"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="所属科目" prop="subjectTitle">
      <el-select
        v-model="knowledgeData.subjectId"
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

    <el-form-item label="知识点名称" prop="title">
      <el-input
        v-model="knowledgeData.title"
        clearable
        placeholder="请输入知识点名称"
      />
    </el-form-item>

    <el-form-item label="状态" prop="state">
      <el-select
        v-model="knowledgeData.state"
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

    <el-form-item label="知识点备注" prop="remark">
      <el-input
        v-model="knowledgeData.remark"
        clearable
        placeholder="请输入知识点名称"
        rows="6"
        type="textarea"
      />
    </el-form-item>

    <el-form-item label="知识点描述" prop="knowledge.content">
      <div style="border: 1px solid #ccc; margin-top: 10px">
        <Toolbar style="border-bottom: 1px solid #ccc"
                 ::default-config="toolbarConfig"
                 :mode="mode"
                 :editor="editorRef" />
        <Editor v-model="knowledgeData.content"
                :default-config="editorConfig"
                :mode="mode"
                @onCreated="handleCreated" />
      </div>
    </el-form-item>


  </el-form>
</template>
