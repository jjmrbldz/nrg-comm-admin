<template>
    <Tag v-if="status === 0" severity="warning" :value="$store.getters['languageStore/translate']('Inactive')"></Tag>
    <Tag v-else="status === 1" severity="success" :value="$store.getters['languageStore/translate']('Active')"></Tag>
</template>

<script>
export default {
    props: {
        status: Number
    }
}
</script>