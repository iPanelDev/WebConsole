<script setup lang="ts">
import BaseLevel from "@/components/BaseLevel.vue";
import CardBox from "@/components/CardBox.vue";
import { useServiceStore } from "@/service/store";
import { formatTimespanString } from "@/utils/strings";
import { computed } from "vue";

const serviceStore = useServiceStore();

const account = computed(() => serviceStore.userName ?? "未登录");
const lastLogin = computed(() =>
    formatTimespanString(
        (Date.now() - new Date(serviceStore.currentUser.lastLoginTime).getTime()) / 1000
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
                    <b>{{
                        (serviceStore.currentUser?.ipAddresses || [])[0] ||
                        "未知地址"
                    }}</b>
                    登录
                </p>
            </div>
        </BaseLevel>
    </CardBox>
</template>
