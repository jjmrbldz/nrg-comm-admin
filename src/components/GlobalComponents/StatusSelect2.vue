<template>
    <Dropdown v-model="statusValue" :options="statusOptions" showClear optionLabel="label" optionValue="value" placeholder="Select status" checkmark :highlightOnSelect="false" class="w-full"/>
</template>

<script>
export default {
    props: {
        modelValue: String,
    },
    data() {
        return {
            statusOptions: [
                { label: this.$store.getters['languageStore/translate']('All'), value: ''},
                { label: this.$store.getters['languageStore/translate']('Waiting'), value: '0'},
                { label: this.$store.getters['languageStore/translate']('Approved'), value: '1'},
                { label: this.$store.getters['languageStore/translate']('Rejected'), value: '2'},
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
    methods: {
        customClear(clearCallback) {
            clearCallback();
            this.statusValue = '';
        },
    },
}
</script>