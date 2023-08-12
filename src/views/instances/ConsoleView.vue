<script setup lang="ts">
import LayoutOfInstance from "@/layouts/LayoutOfInstance.vue";

import SectionMain from "@/components/SectionMain.vue";
import { mdiTelevisionGuide, mdiConsole } from "@mdi/js";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
</script>
<template>
    <LayoutOfInstance>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiConsole"
                title="控制台"
                main
            />
        </SectionMain>
    </LayoutOfInstance>
</template>
