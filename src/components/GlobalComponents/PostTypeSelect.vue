<template>
    <Dropdown v-model="postTypeVal" :options="postTypeOptions" showClear optionLabel="label" optionValue="value" placeholder="Select type" checkmark :highlightOnSelect="false" class="w-full"/>
</template>

<script>
export default {
    props: {
        modelValue: String,
    },
    data() {
        return {
            postTypeOptions: [
                { label: this.$store.getters['languageStore/translate']('All'), value: ''},
                { label: this.$store.getters['languageStore/translate']('Change'), value: 'change'},
                { label: this.$store.getters['languageStore/translate']('Trade'), value: 'trade'},
            ]
        }
    },
    computed: {
        postTypeVal: {
            get(value) {
                if(!this.modelValue) {
                    return ''
                } else {
                    return this.modelValue
                }
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
            this.postTypeVal = '';
        },
    },
}
</script>