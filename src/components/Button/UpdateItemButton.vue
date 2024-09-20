<template>
    <Button :icon="this.updateProps.icon" @click="updateItem()" />
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
        async updateItem() {
            console.log(this.updateProps);
            let params = {};
            try {
                if(typeof this.updateProps.getParams === 'string') {
                    params[`${this.updateProps.getParams}`] = this.updateProps.itemID
                } else {
                    params = this.updateProps.getParams
                }
                console.log(params);
                const res   = await api[`${this.updateProps.getAPI}`](params)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;

                if(code !== 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.$dialog.open(this.$modalComponent[`${this.updateProps.modalType}`], {
                        props: {
                            header: this.$store.getters['languageStore/translate'](`${this.updateProps.modalHeader}`),
                            style: {
                                width: this.updateProps.width ? this.updateProps.width : '30vw',
                                overflow: 'hidden'
                            },
                            breakpoints: {
                                // '960px': '75vw',
                                // '640px': '90vw'
                            },
                            modal: true,
                        },
                        data: {
                            formData: res.data.data,
                            comments: res.data.comments ? res.data.comments : [],
                            totalItems: this.updateProps.totalItems
                        },
                        onClose: (options) => {
                            console.log(options);
                            this.updateProps.callback()
                            // this.getList()
                        }
                    });
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