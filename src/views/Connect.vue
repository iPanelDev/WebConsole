<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { connectTo, getReadyState, isConnected } from '@/service/ws'
import { isVerified } from '@/service/packetHandler'

import Header from '@/components/header/Header.vue'
import FlatButton from '@/components/flat/FlatButton.vue'
import FlatInput from '@/components/flat/FlatInput.vue'

const
    // @ts-ignore
    addr = ref(window.iPanelConfig?.webSocketAddress || localStorage.getItem('ipanel.connect.addr') || ''),
    account = ref(localStorage.getItem('ipanel.connect.account') || ''),
    password = ref(sessionStorage.getItem('ipanel.connect.password') || localStorage.getItem('ipanel.connect.password') || ''),
    addrEl = ref(),
    accountEl = ref(),
    passwordEl = ref(),
    // @ts-ignore
    hiddenWebSocketAddress = Boolean(window.iPanelConfig?.hiddenWebSocketAddress);

const connect = () => {
    connectTo(
        // @ts-ignore
        hiddenWebSocketAddress ? window?.iPanelConfig?.webSocketAddress : addr.value,
        account.value,
        password.value
    );

    localStorage.setItem('ipanel.connect.addr', addr.value);
    localStorage.setItem('ipanel.connect.account', account.value);

    // @ts-ignore
    switch (window?.iPanelConfig?.passwordSaver) {
        case 'localStorage':
            localStorage.setItem('ipanel.connect.password', addr.value);
            break;

        case 'sessionStorage':
            sessionStorage.setItem('ipanel.connect.password', addr.value);
            break;

        case undefined:
        case null:
            break;

        default:
            console.warn('`config.passwordSaver`值无效')
            break;
    }
};

onMounted(() => {
    addrEl.value?.el?.focus();
});

// @ts-ignore
const removeClass = ({ target }: InputEvent) => target?.classList?.remove('error');

</script>

<template>
    <Header />

    <div id="connect-container">
        <div id="connect-flex-container">
            <div id="connect-picture">
                <img src="@/assets/imgs/loginBg/skyland.png" alt="空岛背景">
            </div>
            <div id="connect-input-layout" class="no-select">
                <h1>Connect.</h1>
                <FlatInput type="text" placeholder="ws://" inputmode="url" v-model="addr" @input="removeClass"
                    autocomplete="off" ref="addrEl" @keyup.enter="accountEl.el.focus()" v-if="!hiddenWebSocketAddress">
                    地址
                </FlatInput>
                <FlatInput type="text" inputmode="text" v-model="account" @input="removeClass" autocomplete="username"
                    ref="accountEl" @keyup.enter="passwordEl.el.focus()">
                    账号
                </FlatInput>
                <FlatInput type="password" inputmode="text" v-model="password" @input="removeClass"
                    autocomplete="current-password" ref="passwordEl" @keyup.enter="connect">
                    密码
                </FlatInput>
                <FlatButton type="button" @click="connect" :disabled="isConnected()">
                    {{ getReadyState() < 2 ? isVerified ? '已连接' : '连接中' : '连接' }} </FlatButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
div#connect-container {
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
}

div#connect-picture {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column
}

div#connect-picture img {
    width: 350px;
    border-radius: 50%;
    border: 5px solid var(--color-primary-light-7);
}

div#connect-picture img:hover {
    border: 3px solid var(--color-primary-light-7);
}

div#connect-input-layout>div {
    margin: 10px 0;
}

div#connect-input-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 20px;
    height: 100%;
    flex-shrink: 0;
}

div#connect-flex-container {
    display: flex;
    justify-content: space-evenly;
    height: 100%;
}

.flat {
    max-width: 330px;
    min-width: 230px;
    width: 40vw;
}

@media screen and (max-width: 768px) {
    div#connect-picture {
        display: none;
    }

    .flat {
        max-width: none;
        width: 60vw;
    }
}
</style>