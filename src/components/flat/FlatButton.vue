<template>
    <button class="flat-button flat no-select">
        <slot></slot>
    </button>
</template>

<style>
button.flat-button {
    background: var(--bg-color);
    color: var(--text-color-primary);
    white-space: nowrap;
    padding: 10px;
}

button.flat-button:hover:not([disabled], [disabled=true]) {
    background: var(--fill-color-light);
    cursor: pointer;
}

button.flat-button:active:not([disabled], [disabled=true]) {
    background: var(--fill-color-dark);
}
</style>