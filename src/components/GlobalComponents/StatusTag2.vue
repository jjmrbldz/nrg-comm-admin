<template>
    <Tag v-if="status === 0" severity="warning" :value="$store.getters['languageStore/translate']('Waiting')"></Tag>
    <Tag v-else-if="status === 1" severity="success" :value="$store.getters['languageStore/translate']('Approved')"></Tag>
    <Tag v-else-if="status === 2" severity="danger" :value="$store.getters['languageStore/translate']('Rejected')"></Tag>
</template>

<script>
export default {
    props: {
        status: Number
    },
}
</script>