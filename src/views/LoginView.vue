<script setup lang="ts">
import LoginCardBox from '@/components/LoginCardBox.vue';
import SectionFullScreen from '@/components/SectionFullScreen.vue';
import LayoutGuest from '@/layouts/LayoutGuest.vue';
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen bg="blue">
            <LoginCardBox />
        </SectionFullScreen>
    </LayoutGuest>
</template>
