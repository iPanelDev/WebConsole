<template>
    <div class="header-button">
        <slot></slot>
    </div>
</template>


<style>
header .header-button {
    --size: 29px;
    height: var(--size);
}

.header-button {
    padding: 3px 10px;
    border-radius: 10px;
    background: none;
    align-items: center;
    justify-content: center;
    display: flex;
}

.header-button:hover {
    background: var(--fill-color-light);
}

div.header-svg-container.header-button {
    width: var(--size);
    padding: 0 !important;
}

@media screen and (max-width: 768px) {
    header .header-button {
        padding: 2px 7px;
        --size: 27px
    }
}
</style>