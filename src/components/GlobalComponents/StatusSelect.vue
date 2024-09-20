<template>
    <Dropdown v-model="statusValue" :options="statusOptions" showClear optionLabel="label" optionValue="value" placeholder="Select status" checkmark :highlightOnSelect="false" class="w-full"/>
</template>

<script>
export default {
    props: {
        modelValue: String,
        hideAll: Boolean
    },
    data() {
        return {
            statusOptions: [
                { label: this.$store.getters['languageStore/translate']('allLang'), value: ''},
                { label: this.$store.getters['languageStore/translate']('Inactive'), value: '0'},
                { label: this.$store.getters['languageStore/translate']('Active'), value: '1'},
            ]
        }
    },
    computed: {
        statusValue: {
            get(value) {
                if(!this.modelValue) {
                    return ''
                } else {
                    return this.modelValue
                }
                // if(this.modelValue === null) {
                //     return ''
                // } else if(this.modelValue) {
                //     return this.modelValue
                // } else {
                //     return ''
                // }
            },
            set(value) {
                console.log(value)
                this.$emit('update:modelValue', value);
            },
        },
    },
    mounted() {
        if(this.hideAll) {
            this.statusOptions = [
                { label: this.$store.getters['languageStore/translate']('Inactive'), value: '0'},
                { label: this.$store.getters['languageStore/translate']('Active'), value: '1'},
            ]
        }
    },
    methods: {
        customClear(clearCallback) {
            clearCallback();
            this.statusValue = '';
        },
    },
}
</script>