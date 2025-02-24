<template>
    <Button :icon="icon" @click="open()" />
</template>

<script>

export default {
    props: [
        "icon",
        "items",
        "username"
    ],
    mounted() {
        console.log(this.userID)
    },
    methods: {
        open() {
            this.$dialog.open(this.$modalComponent.ViewBingoCards, {
                props: {
                    header: this.username,
                    style: {
                        width: '750px',
                        overflow: 'hidden'
                    },
                    modal: true,
                },
                data: {
                    items: this.items,
                },
                onClose: (options) => {
                    
                }
            });
        },
    }
}
</script>