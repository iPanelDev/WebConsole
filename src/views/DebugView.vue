<script setup lang="ts">
import CardBox from '@/components/CardBox.vue';
import Console from '@/components/Console.vue';
import CardBoxModal from '@/components/CardBoxModal.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import { mdiBug, mdiConnection } from '@mdi/js';
import { reactive, ref } from 'vue';
import FormControl from '@/components/FormControl.vue';
import BaseButton from '@/components/BaseButton.vue';
import { connectDebugWs, datas } from '@/service/debug';

const modals = reactive({
    shown: false,
    pwd: null,
});
</script>

<template>
    <SectionMain>
        <SectionTitleLineWithButton :icon="mdiBug" title="调试日志" main>
            <BaseButton
                :icon="mdiConnection"
                color="lightDark"
                @click="() => (modals.shown = true)"
            />
        </SectionTitleLineWithButton>

        <CardBoxModal
            title="连接密码"
            v-model="modals.shown"
            button-label="确认"
            @confirm="() => connectDebugWs(modals.pwd)"
        >
            <FormControl
                v-model="modals.pwd"
                name="password"
                type="password"
                autocomplete="none"
            />
        </CardBoxModal>
        <CardBox has-component-layout class="overflow-hidden mb-5">
            <Console :datas="datas" />
        </CardBox>
    </SectionMain>
</template>
