<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import { mdiClose } from "@mdi/js";
import { computed } from "vue";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    button: {
        type: String,
        default: "info",
    },
    buttonLabel: {
        type: String,
        default: "Done",
    },
    hasCancel: Boolean,
    modelValue: {
        type: [String, Number, Boolean],
        default: null,
    },
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const trigger = (mode) => {
    value.value = false;
    emit(mode);
};

const confirm = () => trigger("confirm");

const cancel = () => trigger("cancel");

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && value.value) {
        cancel();
    }
});
</script>

<template>
    <OverlayLayer v-show="value" @overlay-click="cancel">
        <CardBox
            v-show="value"
            class="shadow-lg w-11/12 md:w-3/5 lg:w-2/5 xl:w-5/12 z-50 flex overflow-y-hidden"
            is-modal
        >
            <CardBoxComponentTitle :title="title">
                <BaseButton
                    v-if="hasCancel"
                    :icon="mdiClose"
                    color="whiteDark"
                    small
                    rounded-full
                    @click.prevent="cancel"
                />
            </CardBoxComponentTitle>

            <div class="overflow-y-auto max-h-modal space-y-3 p-1" id="slot">
                <slot />
            </div>

            <template #footer>
                <BaseButtons>
                    <BaseButton
                        :label="buttonLabel"
                        :color="button"
                        @click="confirm"
                    />
                    <BaseButton
                        v-if="hasCancel"
                        label="取消"
                        :color="button"
                        outline
                        @click="cancel"
                    />
                </BaseButtons>
            </template>
        </CardBox>
    </OverlayLayer>
</template>

<style scoped>
div#slot::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

div#slot::-webkit-scrollbar-track {
    @apply bg-gray-50;
}

div#slot::-webkit-scrollbar-thumb {
    @apply bg-gray-400 rounded;
}

div#slot::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500;
}

.dark div#slot::-webkit-scrollbar-track {
    @apply bg-slate-900/70;
}

.dark div#slot::-webkit-scrollbar-thumb {
    @apply bg-slate-600;
}

.dark div#slot::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-500;
}

.dark div#slot {
    color-scheme: dark;
    scrollbar-color: rgb(71, 85, 105) rgb(30, 41, 59);
}
</style>
