<template>
    <Dropdown v-if="singleSelect" v-model="statusValue" filter :options="list" optionLabel="sub_category"  optionGroupLabel="label" optionGroupChildren="items" :optionValue="`${returnValue}`" placeholder="Select category" checkmark showClear :highlightOnSelect="false" class="w-full" />
    <!-- <MultiSelect  v-model="statusValue" filter display="chip" :options="list" optionLabel="sub_category" :optionValue="`${returnValue}`" placeholder="Select category" checkmark showClear :highlightOnSelect="false" class="w-full" /> -->
    <MultiSelect v-else  v-model="statusValue" filter display="chip" :options="list" optionLabel="sub_category" :optionValue="`${returnValue ? returnValue : null}`" optionGroupLabel="label" optionGroupChildren="items" placeholder="Select category" checkmark showClear :highlightOnSelect="false" class="w-full" />
</template>

<script>
import { api } from '@/axios/api';

export default {
    props: ['modelValue', 'returnValue', 'mainCatIds', 'singleSelect'],
    data() {
        return {
            loading : false,
            list    : [],
            params: {
                filter_cat_id       : [],
                c_title     : '',
                filter_subcat_name  : '',
                filter_subcat_status: '',
                page         : 1,
                limit        : 999
            }
        }
    },
    watch: {
        mainCatIds: {
            handler(newVal, oldVal) {
                this.params.filter_cat_id = newVal
            }
        },
        params: {
            handler(newVal, oldVal) {
                if(newVal) {
                    this.getList()
                }
            },
            deep: true,
        }
    },
    computed: {
        statusValue: {
            get(value) {
                console.log('Subcategory Select: ', this.modelValue);
                if(!this.modelValue) {
                    return ''
                } else {
                    return this.modelValue
                }
            },
            set(value) {
                console.log('subCat values', value);
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
                const res   = await api.getSubCategoryList(this.params)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    // this.list = res.data.data
                    this.list = this.groupByCategory(res.data.data);
                    console.log(this.list);
                    // console.log('Grouped', grouped);
                } else {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
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
        groupByCategory(arr) {
            const grouped = {};
            
            arr.forEach(item => {
                const { cat_id, main_category, ...rest } = item;
                
                if (!grouped[cat_id]) {
                    grouped[cat_id] = {
                        id: cat_id,
                        label: main_category,
                        items: []
                    };
                }
                
                grouped[cat_id].items.push({ cat_id, main_category, ...rest });
            });
            
            return Object.values(grouped);
        }
    }
}
</script>