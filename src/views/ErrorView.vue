<script setup lang="ts">
import SectionFullScreen from '@/components/SectionFullScreen.vue';
import CardBox from '@/components/CardBox.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import LayoutGuest from '@/layouts/LayoutGuest.vue';

const props = defineProps({
    message: {
        type: [String, Object, Number, Error],
    },
});
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen v-slot="{ cardClass }" bg="pinkRed">
            <CardBox :class="cardClass">
                <div class="space-y-3">
                    <h1 class="text-2xl">噢不</h1>
                    <p>发生了一点错误</p>
                    <br />

                    {{ props.message }}
                </div>

                <template #footer>
                    <BaseButtons>
                        <BaseButton
                            label="返回"
                            color="danger"
                            @click="$router.back()"
                        />
                    </BaseButtons>
                </template>
            </CardBox>
        </SectionFullScreen>
    </LayoutGuest>
</template>
