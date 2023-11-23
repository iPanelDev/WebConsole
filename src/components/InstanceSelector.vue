<script setup lang="ts">
import { computed } from "vue";
import FormCheckRadioVue from "./FormCheckRadio.vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
    modelValue: {
        type: Object,
        require: true,
    },
    disabled: Boolean,
});

const computedValue = computed({
    get: () => props.modelValue as Record<string, [boolean, string?]>,
    set: (value) => {
        emit("update:modelValue", value);
    },
});
</script>

<template>
    <div v-if="disabled" class="text-gray-500 text-sm mb-3">
        当前用户等级无法设置可使用的实例
    </div>
    <div
        v-for="(item, key) in computedValue"
        v-else-if="Object.keys(computedValue).length > 0"
        class="pl-3"
    >
        <FormCheckRadioVue :name="key" v-model="item[0]" :input-value="item[0]">
            <div class="flex">
                <pre>{{ key }}</pre>
                <span class="ml-3">{{ item[1] || "" }}</span>
            </div>
        </FormCheckRadioVue>
    </div>
    <div class="text-gray-500 text-sm mb-3" v-else>貌似没有在线的实例:(</div>
</template>
