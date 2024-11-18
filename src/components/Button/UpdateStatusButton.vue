<template>
    <Button :icon="this.updateProps.icon" :severity="this.updateProps.severity" @click="handleUpdate($event)" />
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
    methods: {
        handleUpdate(event) {
            this.$confirm.require({
                target: event.currentTarget,
                message: this.$store.getters['languageStore/translate']('Are you sure you want to proceed?'),
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-primary p-button-sm',
                rejectLabel: this.$store.getters['languageStore/translate']('No'),
                acceptLabel: this.$store.getters['languageStore/translate']('Yes'),
                accept: () => {
                    this.updateItem()
                },
                reject: () => {
                    this.$toast.add({ severity: 'warning', summary: 'Cancelled', detail: 'Process incomplete', life: 3000 });
                }
            });
        },
        async updateItem() {
            console.log(this.updateProps);

            try {
                const res   = await api[`${this.updateProps.updateAPI}`](this.updateProps.reqParams)
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