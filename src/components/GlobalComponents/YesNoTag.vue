<template>
    <Tag v-if="value" severity="success" :value="$store.getters['languageStore/translate']('Yes')"></Tag>
    <Tag v-else severity="danger" :value="$store.getters['languageStore/translate']('No')"></Tag>
</template>

<script>
export default {
    props: {
        value: Number
    },
}
</script>