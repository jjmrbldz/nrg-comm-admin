<template>
    <Button severity="danger" :icon="this.updateProps.icon" @click="confirmDelete($event)" />
</template>

<script>
import { api } from '@/axios/api';

export default {
    props: {
        updateProps: Object,
        /*
        {
            itemID      : // String,
            getAPI      : // String,
            modalHeader : // String,
            icon        : // String,
            modalType   : // String,
            callback    : // function()
        }
        */
    },
    data() {
        return {
            params: {
                user_login_id   : this.$store.state.userStore.user_id,
                user_login_token: this.$store.state.userStore.token,
            }
        }
    },
    methods: {
        confirmDelete(event) {
            this.params = Object.assign(this.params, this.updateProps.params)
            console.log(this.updateProps);
            this.$confirm.require({
                target: event.currentTarget,
                message: this.$store.getters['languageStore/translate']('Do you want to delete this item?'),
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-danger p-button-sm',
                rejectLabel: this.$store.getters['languageStore/translate']('Cancel'),
                acceptLabel: this.$store.getters['languageStore/translate']('Delete'),
                accept: () => {
                    this.deleteItem()
                },
                // reject: () => {
                //     this.$toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                // }
            });
        },
        async deleteItem() {
            console.log(this.updateProps);
            try {
               
                const res   = await api[`${this.updateProps.api}`](this.updateProps.params)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;

                if(code !== 1) {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.updateProps.callback()
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                }

            } catch(error) {
                console.error(error)
                throw error
            }
        },
    }
}
</script>