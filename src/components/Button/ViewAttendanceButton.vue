<template>
    <Button :icon="icon" @click="open()" />
</template>

<script>

export default {
    props: [
        "icon",
        "username",
        "userID",
    ],
    mounted() {
        console.log(this.userID)
    },
    methods: {
        open() {
            this.$dialog.open(this.$modalComponent.ViewAttendance, {
                props: {
                    header: this.username,
                    style: {
                        width: '750px',
                        overflow: 'hidden'
                    },
                    modal: true,
                },
                data: {
                    userID: this.userID,
                },
                onClose: (options) => {
                    
                }
            });
        },
    }
}
</script>