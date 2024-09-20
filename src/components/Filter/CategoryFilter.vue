<template>
    <div class="formgrid grid">
        <div class="field col-4">
            <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
            <StatusSelect v-model="status" />
        </div>
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('nameLang') }}</label>
            <InputText type="search" v-model="searchValue" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="handleEmit()" />
        </div>
    </div>
</template>

<script>
import StatusSelect from '../GlobalComponents/StatusSelect.vue';

export default {
    props:{
        modelValue: Object,
    },
    data() {
        return {
            status      : '',
            disabled    : true,
            searchBy    : null,
            searchValue : null,
        };
    },
    watch: {
        status: {
            handler(newValue, oldValue) {
                this.modelValue.c_status = newValue
            }
        },
        searchValue: {
            handler(newValue, oldValue) {
                if(!newValue) {
                    this.modelValue.c_title = ''
                }
            }
        },
    },
    mounted() {
        console.log(this.modelValue)
    },
    methods: {
        handleEmit() {
            this.modelValue.c_title = this.searchValue
            this.$emit('update:modelValue', this.modelValue);
        }
    }
};
</script>