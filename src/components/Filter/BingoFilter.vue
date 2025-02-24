<template>
    <div class="formgrid grid">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('User ID') }}</label>
            <InputText type="search" v-model="username" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="disabled" @keyup.enter="handleEmit()" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('Status') }}</label>
            <BingoStatusSelect v-model="status" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
</template>

<script>
import BingoStatusSelect from '../GlobalComponents/BingoStatusSelect.vue';

export default {
    props:[
        'modelValue',
        'getList'
    ],
    data() {
        return {
            username    : null,
            status      : null,
            timeout     : null
        };
    },
    watch: {
        username: {
            handler(newValue, oldValue) {
                clearTimeout(this.timeout)

                this.timeout = setTimeout(() => {
                    this.$emit('update:modelValue', {...this.modelValue, username: this.username});
                }, 1000)
            }
        },
        status: {
            handler(newValue, oldValue) {
                this.$emit('update:modelValue', {...this.modelValue, status: this.status});
            }
        },
    },
    mounted() {
        console.log(this.modelValue)
    },
    components: {
        BingoStatusSelect
    }
};
</script>