<template>
    <div class="light-button">
        <slot></slot>
    </div>
</template>


<style>
header .light-button {
    --size: 29px;
    height: var(--size);
}

.light-button {
    border: 1px solid var(--border-color);
    padding: 3px 10px;
    border-radius: 10px;
    background: none;
    align-items: center;
    justify-content: center;
    display: flex;
}

.light-button:hover {
    border: 1px solid var(--border-color-darker);
    background: var(--fill-color-light);
}

div.header-svg-container.light-button {
    width: var(--size);
}

@media screen and (max-width: 768px) {
    header .light-button {
        padding: 2px 7px;
        --size: 27px
    }

}
</style>