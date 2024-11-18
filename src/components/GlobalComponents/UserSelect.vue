<template>
    <Dropdown v-model="statusValue" filter :options="list" optionLabel="tu_user_id" :optionValue="`${returnValue}`" placeholder="Select user" checkmark showClear :highlightOnSelect="false" class="w-full" />
</template>

<script>
import { api } from '@/axios/api';

export default {
    props: ['modelValue', 'returnValue'],
    data() {
        return {
            loading : false,
            list    : [],
            params: {
                tu_user_id  : '',
                tu_status   : '',
                orderby     : 'desc',
                page        : "1",
                limit       : "99999"
            }
        }
    },
    computed: {
        statusValue: {
            get(value) {
                console.log('Category Select: ', this.modelValue);
                if(!this.modelValue) {
                    return ''
                } else {
                    return this.modelValue
                }
            },
            set(value) {
                this.$emit('update:modelValue', value);
            },
        },
    },
    mounted() {
        console.log(this.modelValue, this.returnValue);
        this.getList();
    },
    methods: {
        customClear(clearCallback) {
            clearCallback();
            this.statusValue = '';
        },
        async getList() {
            this.loading = true
            try {
                
                const res   = await api.userList(this.params)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.list = res.data.data
                    // this.totalRecords = res.data.totalitems
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                    this.list = []
                }
                
            } catch (error) {
                console.error(error)
                this.list = []
                throw error
            } finally {
                this.loading = false
            }
        },
    }
}
</script>