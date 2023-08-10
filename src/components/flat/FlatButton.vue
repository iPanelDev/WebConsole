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

button.flat-button.danger {
    --text-color-primary: var(--color-error-dark-2);
    --bg-color: var(--color-error-light-9);
    --fill-color-light: var(--color-danger-light-7);
    --fill-color-dark: var(--color-danger-light-5);
    --border-color: var(--color-danger-light-5);
    --border-color-hover: var(--color-danger-light-3);
    --text-color-disabled: var(--color-danger-light-5)
}
</style>