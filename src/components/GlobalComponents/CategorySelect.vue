<template>
    <Dropdown v-if="singleSelect" v-model="statusValue" filter :options="list" optionLabel="c_title" :optionValue="`${returnValue}`" placeholder="Select category" checkmark showClear :highlightOnSelect="false" class="w-full" />
    <MultiSelect v-else  v-model="statusValue" filter display="chip" :options="list" optionLabel="c_title" :optionValue="`${returnValue}`" placeholder="Select category" checkmark showClear :highlightOnSelect="false" class="w-full" />
</template>

<script>
import { api } from '@/axios/api';

export default {
    props: ['modelValue', 'returnValue', 'singleSelect'],
    data() {
        return {
            loading : false,
            list    : [],
            params: {
                c_title     : '',
                c_status    : '',
                orderby     : 'desc',
                page        : 1,
                limit       : 999
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

                const reqParams = {
                    ...this.params,
                    page        : String(this.params.page),
                    limit       : String(this.params.limit)
                }
                
                const res   = await api.categoryList(reqParams)
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