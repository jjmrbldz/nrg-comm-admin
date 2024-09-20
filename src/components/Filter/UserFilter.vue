<template>
    <div class="formgrid grid">
        <div class="field col-1">
            <label>{{ $store.getters['languageStore/translate']('searchByLang') }}</label>
            <Dropdown v-model="searchBy" :options="searchByOptions" optionLabel="label" optionValue="value" placeholder="Search by" checkmark :highlightOnSelect="false" class="w-full" @change="handleSearchBy()" />
        </div>
        <div class="field col-2">
            <label>&nbsp;</label>
            <InputText type="search" v-model="searchValue" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="disabled" @keyup.enter="handleEmit()" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="handleEmit()" />
        </div>
    </div>
</template>

<script>
export default {
    props:{
        modelValue: Object,
    },
    data() {
        return {
            disabled    : true,
            searchBy    : null,
            searchValue : null,
            searchByOptions: [
                { label: 'User ID', value: 'filter_user_id' },
                { label: 'Name', value: 'filter_user_name' },
                { label: 'Nickname', value: 'filter_user_nickname' },
            ],
        };
    },
    watch: {
        searchValue: {
            handler(newValue, oldValue) {
                if(!newValue) {
                    this.$store.dispatch('listStore/setAdminListParams', [this.searchBy, newValue])
                    // this.modelValue[`${this.searchBy}`] = newValue
                }
            }
        }
    },
    mounted() {
        console.log(this.modelValue)
    },
    methods: {
        handleSearchBy() {
            this.disabled       = false;
            this.searchValue    = '';
            this.$store.dispatch('listStore/setAdminListParams', [this.searchBy, this.searchValue])
        },
        handleEmit() {
            this.$store.dispatch('listStore/setAdminListParams', [this.searchBy, this.searchValue])
            // this.modelValue[`${this.searchBy}`] = this.searchValue
            // this.$emit('update:modelValue', this.modelValue);
        }
    }
};
</script>