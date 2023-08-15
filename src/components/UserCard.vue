<script setup lang="ts">
import BaseLevel from "@/components/BaseLevel.vue";
import CardBox from "@/components/CardBox.vue";
import PillTag from "@/components/PillTag.vue";
import { useServiceStore } from "@/service/store";
import { formatTimespanString } from "@/utils/strings";
import { mdiCheckDecagram } from "@mdi/js";
import { computed } from "vue";

const serviceStore = useServiceStore();

const account = computed(() => serviceStore.account ?? "未登录");
const currentAddress = computed(() => serviceStore.currentAddress);
const lastLogin = computed(() =>
    formatTimespanString(
        (Date.now() - serviceStore.lastLogin?.getTime()) / 1000
    )
);
</script>

<template>
    <CardBox>
        <BaseLevel type="justify-around lg:justify-center">
            <div class="space-y-3 text-center md:text-left lg:mx-12">
                <h1 class="text-2xl">
                    你好，
                    <b> {{ account }} </b>！
                </h1>
                <p>
                    上次于 <b>{{ lastLogin }}</b> 前从
                    <b>{{ currentAddress }}</b> 登录
                </p>
                <div class="flex justify-center md:block">
                    <PillTag
                        label="Verified"
                        color="info"
                        :icon="mdiCheckDecagram"
                    />
                </div>
            </div>
        </BaseLevel>
    </CardBox>
</template>
