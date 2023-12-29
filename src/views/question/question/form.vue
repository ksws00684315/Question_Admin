<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useUserStoreHook } from "@/store/modules/user";
import {AnswersDTO} from "@/api/question/question";
import {useRenderIcon} from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";

import { defineComponent, defineAsyncComponent } from 'vue';
import {http} from "@/utils/http";

const WangEditor = defineAsyncComponent(() => import('@/components/Editor/Editor.vue'));

// 注册自定义组件

/** TODO 有其他方式  来换掉这个props 父子组件传值吗？ */
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    questionId: undefined,
    questionName: "",
    id:undefined,
    quType:undefined,
    state:undefined,
    content:"",
    remark:"",
    analysis:"",
    difficulty:undefined,
    answerList:[],
    year:undefined
  }),
  subjectOptions: ()=> []
});

const questionData = ref(props.formInline);

const answerData = ref([]);


const addRow = () => {
  answerData.value.push({ content: '', isRight: false ,showDesc: '是否答案'});
};

const subjectOptions = ref(props.subjectOptions);

const formRuleRef = ref();

function getFormRuleRef() {
  return formRuleRef.value;
}

const removeRow = (row) => {
  const index = answerData.value.indexOf(row);
  if (index !== -1) {
    answerData.value.splice(index, 1);
  }
};

const isShowAnswerOption = ref(false);

const handleQuTypeChange = (value) => {
  if(value == 4 || value ==5) {
    isShowAnswerOption.value = false;
    answerData.value = [];
  } else {
    isShowAnswerOption.value = true;
    answerData.value = [{ id:undefined,seq: 'A',content: '', isRight: false ,showDesc: '是否答案'}
      ,{ id:undefined,seq: 'B',content: '', isRight: false ,showDesc: '是否答案'}];
  }

}

const isQuTypeChangeable = computed(() => {
  if(!questionData.value.id) {
    return false;
  } else {
    return true;
  }
});


onMounted(() => {
  const answerList = questionData.value.answerList;
  answerList.forEach((answer,index) => {
    const seq = String.fromCharCode(65 + index);
    answerData.value.push({ id:answer.id,seq:seq,content: answer.content, isRight: answer.isRight,showDesc: '是否答案' });
  });
  if(!questionData.value.id) {
    isShowAnswerOption.value = false;
  } else {
    const quType = questionData.value.quType;
    if(quType ===4 || quType === 5) {
      isShowAnswerOption.value = false;
    } else {
      isShowAnswerOption.value = true;
    }
  }
})

const addRowDisable = computed(() => {
  const currentAnswerLength = answerData.value.length; // 获取当前添加行的索引
  const quType = questionData.value.quType;
  if(quType === 1 && currentAnswerLength === 2) {
    //判断题最多只有两个选项
    return  true;
  }
  return false;
});

const isRightCheckChange = (row) => {
  const quType = questionData.value.quType;
  if(quType === 1 || quType === 2) {
    //判断题和单选题最多只有两个选项
    answerData.value.forEach((item) => {
      if (item !== row) {
        item.isRight = false;
      }
    });
  }

};


const getAlphabet = (index) => {
  return String.fromCharCode(65 + index);
};

defineExpose({ getFormRuleRef,answerData });


</script>

<template>
  <el-form
    ref="formRuleRef"
    :model="questionData"
    :rules="formRules"
    label-width="82px"
  >

    <el-form-item label="所属科目" prop="subjectTitle">
      <el-select
        v-model="questionData.subjectId"
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

    <el-form-item label="年份" prop="year">
      <el-input-number :min="1979" :max="2099" v-model="questionData.year" />
    </el-form-item>

    <el-form-item label="题目类型" prop="quType">
      <el-select
        v-model="questionData.quType"
        placeholder="请选择题目类型"
        clearable
        class="!w-[180px]"
        @change="handleQuTypeChange"
        :disabled="isQuTypeChangeable"
      >
        <el-option
          v-for="dict in useUserStoreHook().dictionaryMap['question.type']"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="难度" prop="difficulty">
      <el-select
        v-model="questionData.difficulty"
        placeholder="请选择难度"
        clearable
        class="!w-[180px]"
      >
        <el-option
          v-for="dict in useUserStoreHook().dictionaryMap['question.difficulty']"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="状态" prop="state">
      <el-select
        v-model="questionData.state"
        placeholder="请选择状态"
        clearable
        class="!w-[180px]"
      >
        <el-option
          v-for="dict in useUserStoreHook().dictionaryMap['common.status']"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="题目简介" prop="remark">
      <el-input
        v-model="questionData.remark"
        clearable
        placeholder="请输入题目简介"
        rows="3"
        type="textarea"
      />
    </el-form-item>

<!--    <el-form-item label="题目内容" prop="content">-->
<!--      <div style="border: 1px solid #ccc; margin-top: 10px">-->
<!--        <Toolbar style="border-bottom: 1px solid #ccc"-->
<!--                 :default-config="toolbarConfig"-->
<!--                 :mode="mode"-->
<!--                 :editor="editorRefContent" />-->
<!--        <Editor v-model="questionData.content"-->
<!--                :default-config="editorConfig"-->
<!--                :mode="mode"-->
<!--                @onCreated="handleContentCreated" />-->
<!--      </div>-->
<!--    </el-form-item>-->

    <el-form-item label="题目内容" prop="content">
      <WangEditor
        v-model:value="questionData.content"
      />
    </el-form-item>

    <el-form-item v-show="isShowAnswerOption" label="题目选项">
      <el-table
        :data="answerData"
        :show-header="false"
        border
        style="width: 100%">
        <el-table-column
          label="序号"
          min-width="20"
          >
          <template #default="{ $index }">
            {{ getAlphabet($index) }}
          </template>
        </el-table-column>
        <el-table-column
          type="selection" min-width="40">
          <template #default="{ row }">
            <div>
              <el-checkbox v-model="row.isRight" @change="isRightCheckChange(row)"></el-checkbox>
              <span>{{ row.showDesc }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="内容" min-width="200">
          <template #default="scope">
            <WangEditor
              v-model:value="scope.row.content"
            />
          </template>
        </el-table-column>
        <el-table-column
          fixed = "right"
          label="操作">
          <template #default="{ row }">
            <el-popconfirm
              :title="`删除选项数据不可恢复，请确认`"
              @confirm="removeRow(row)"
            >
              <template #reference>
            <el-button
              class="reset-margin"
              link
              type="danger"
              :icon="useRenderIcon(Delete)"
              >删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="addRow" :disabled="addRowDisable">增加选项</el-button>
    </el-form-item>

<!--    <el-form-item label="文本解析" prop="analysis">-->
<!--      <div style="border: 1px solid #ccc; margin-top: 10px">-->
<!--        <Toolbar style="border-bottom: 1px solid #ccc"-->
<!--                 ::default-config="toolbarConfig"-->
<!--                 :mode="mode"-->
<!--                 :editor="editorRefAnalysis" />-->
<!--        <Editor v-model="questionData.analysis"-->
<!--                :default-config="editorConfig"-->
<!--                :mode="mode"-->
<!--                @onCreated="handleContentAnalysis" />-->
<!--      </div>-->
<!--    </el-form-item>-->

    <el-form-item label="文本解析" prop="analysis">
      <WangEditor
        v-model:value="questionData.analysis"
      />
    </el-form-item>

  </el-form>
</template>

