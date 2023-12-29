<template>
  <div style="border: 1px solid #ccc">
    <div class="richText">
      <Toolbar
        class="tool-bar"
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="data.toolbarConfig"
        mode="default"
      />
      <Editor
        style="height: 100px; overflow-y: hidden"
        v-model="data.valueHtml"
        :defaultConfig="data.editorConfig"
        mode="default"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
      />
    </div>
  </div>
</template>
<script setup>
//script标签中引入
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {reactive,
  shallowRef,
  onMounted,
  onBeforeUnmount,
  watchEffect,
  defineEmits} from "vue";

onMounted(() => {
  watchEffect(() => {
    if (props.value) {
      data.valueHtml = props.value || ''
    } else {
      data.valueHtml = ''
    }
  })
})

onBeforeUnmount(() => {
  // 组件销毁时，也及时销毁编辑器
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const emit = defineEmits(['update:value'])

const props = defineProps({
  toolbarConfig: { type: Object },
  editorConfig: { type: Object },
  value: { type: String }
})

const toolbarConfig = {
  toolbarKeys: [
    'fontSize',
    'lineHeight',
    '|',
    'bold',
    'italic',
    'underline',
    'color',
    '|',
    '|',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    '|',
    'indent',
    'delIndent',
    'mySelect1' //自己扩展的下拉框，不过要注意一定要注册后才能写入
  ]
}

const data = reactive({
  toolbarConfig: props.toolbarConfig || {
    toolbarKeys: [
      'headerSelect',
      'blockquote',
      '|',
      'bold',
      'underline',
      'italic',
      {
        key: 'group-more-style',
        title: '更多',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
        menuKeys: ['through', 'code', 'sup', 'sub']
      },
      'color',
      'bgColor',
      '|',
      'fontSize',
      {
        key: 'group-justify',
        title: '对齐',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
        menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify']
      },
      'todo',
      'fontFamily',
      {
        key: 'group-indent',
        title: '缩进',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
        menuKeys: ['indent', 'delIndent']
      },
      '|',
      'emotion',
      'insertLink',
      'uploadImage',
      'insertTable',
      'codeBlock',
      'divider',
      'clearStyle',
      '|',
      'undo',
      'redo'
    ]
    // 工具栏排除的工具项配置
    //excludeKeys: ['todo']
    // 工具栏所有可用配置：'bold','underline','italic','through','code','clearStyle','headerSelect','header1','header2',
    // 'header3','color','bgColor','insertLink','editLink','unLink','viewLink','insertImage','deleteImage','editImage',
    // 'viewImageLink','imageWidth30','imageWidth50','imageWidth100','blockquote','emotion','fontSize','fontFamily',
    // 'indent','delIndent','justifyLeft','justifyRight','justifyCenter','lineHeight','redo','undo','divider','codeBlock',
    // 'bulletedList','numberedList','insertTable','deleteTable','insertTableRow','deleteTableRow','insertTableCol',
    // 'deleteTableCol','tableHeader','tableFullWidth','insertVideo','deleteVideo','uploadImage','codeSelectLang'
  },
  editorConfig: props.editorConfig || {
    MENU_CONF: {},
    placeholder: '请输入'
  },
  templateContent: '',
  valueHtml: props.value
})

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
  data.templateContent = editor.getHtml()
  emit('update:value', data.valueHtml)
}
const handleDestroyed = (editor) => {
  // console.log('destroyed', editor)
}
const handleFocus = (editor) => {
  // console.log('focus', editor)
}
const handleBlur = (editor) => {
  // console.log('blur', editor)
}

</script>
<style scoped>
</style>

