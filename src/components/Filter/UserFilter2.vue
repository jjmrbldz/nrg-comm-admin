<template>
    <div class="formgrid grid">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('User ID') }}</label>
            <InputText type="search" v-model="tu_user_id" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="disabled" @keyup.enter="handleEmit()" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('Status') }}</label>
            <StatusSelect v-model="tp_status" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
</template>

<script>
export default {
    props:[
        'modelValue',
        'getList'
    ],
    data() {
        return {
            tu_user_id  : null,
            tp_status   : null,
            timeout     : null
        };
    },
    watch: {
        tu_user_id: {
            handler(newValue, oldValue) {
                clearTimeout(this.timeout)

                this.timeout = setTimeout(() => {
                    this.$emit('update:modelValue', {...this.modelValue, tu_user_id: this.tu_user_id});
                }, 1000)
            }
        },
        tp_status: {
            handler(newValue, oldValue) {
                this.$emit('update:modelValue', {...this.modelValue, tp_status: this.tp_status});
            }
        },
    },
    mounted() {
        console.log(this.modelValue)
    }
};
</script>