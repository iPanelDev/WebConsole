<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits(["checked"]);

const checked = ref(false);

watch(checked, (newVal) => {
    emit("checked", newVal);
});
</script>

<template>
    <label class="checkbox">
        <input v-model="checked" type="checkbox" />
        <span class="check" />
    </label>
</template>
