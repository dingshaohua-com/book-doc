# 封装一个弹窗
## 子弹窗组件
```html title="some-modal.vue"
<template>
  <el-dialog v-model="dialogShow" align-center destroy-on-close width="500" title="提示">
    <span>我是弹窗内容</span>
    <template #footer> 我是底部 </template>
  </el-dialog>
</template>
<script name="SomeModal" setup lang="ts">
const props = defineProps(["visible"]);
const emit = defineEmits(["update:visible"]);
const dialogShow = computed({ 
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});
</script>
```

这里可以看到，el-dialog的v-model值为我们的一个计算属性，而非直接是副组件的传入的值（理论上绝不允许`v-model="props.visible"`），因为根据vue数据流的规范，子组件不能修改父组件传入的状态。

## 父组件使用
```html title="some-modal.vue"
<template>
 <div  @click="openSomeModal()">测试</div>
 <some-modal v-model:visible="someModalVisible" />
</template>

<script setup lang="ts" name="MyApp">
import SomeModal from "@/components/some-modal.vue";

const someModalVisible = ref(false);
const openSomeModal = () => {
  someModalVisible.value = true;
};
</script>
```


## vue2和vue3
上述代码的核心点在于，通过给子组件使用v-model来传递参数，这是vue3的写法，等价于此前vue2的`.sync`（已经被vue3 废弃）
```html title="app.vue"
 <some-modal :visible.sync="someModalVisible" />
```

也就是说vue3的v-model是做了进一步的升级，具体可以查看文档。