<template>
    <Panel toggleable>
        <template #header>
            <div class="flex align-items-center gap-2">
                <Avatar icon="pi pi-user" size="large" shape="circle" />
                <div class="">
                    <div class="font-bold">{{ formData.title }}</div>
                    <div class="p-text-secondary">{{ formData.p_author }}</div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex flex-column">
                <div v-html="formData.content">
                </div>
                <div class="my-2 flex flex-wrap gap-1">
                    <Image v-for="item in JSON.parse(formData.media)" :src="`${this.mediaPath}${item}`" alt="Image" imageStyle="width: unset; max-height: 34px;" preview />
                </div>
                <div class="flex align-items-center justify-content-between mt-3">
                    <div class="flex gap-2">
                        <div class="flex">
                            <i class="mdi mdi-eye mr-1 text-color-secondary"></i>
                            <span>{{ formData.view_count }}</span>
                        </div>
                        <div class="flex">
                            <i class="mdi mdi-thumb-up mr-1 text-blue-500"></i>
                            <span>{{ formData.like_count }}</span>
                        </div>
                        <div class="flex">
                            <i class="mdi mdi-thumb-down mr-1 text-red-500"></i>
                            <span>{{ formData.dislike_count ? formData.dislike_count : '0' }}</span>
                        </div>
                    </div>
                    <div class="p-text-secondary">{{ $GF.getDateTime(formData.reg_datetime) }}</div>
                </div>
            </div>
            <Divider />
            <div class="">
                <div class="font-bold">{{ $store.getters['languageStore/translate']('Comments') }}</div>
                <CommentSection v-if="comments" :comments="comments" />
                <div v-else class="text-center">There are no comments on this post.</div>
            </div>
        </template>
        <template #icons>
            <!-- <button class="p-panel-header-icon p-link mr-2" @click="toggle">
                <span class="pi pi-cog"></span>
            </button> -->
            <!-- <Menu ref="menu" id="config_menu" :model="items" popup /> -->
        </template>
        <p class="m-0">
            {{ formData.inq_content }}
        </p>
    </Panel>

    <!-- <div class="field">
        <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
        <InputText v-model="formdata.tm_content" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>   -->
    <div v-if="false" class="field mt-3">
        <label>{{ $store.getters['languageStore/translate']('contentLang') }}</label>
        <Editor v-model="params.inq_reply" editorStyle="height: 220px" />
    </div>  
    <Button v-if="false" class="mt-3 w-full" :label="$store.getters['languageStore/translate']('submitLang')" @click="submit('data')" />
   
</template>

<script>
import { api } from '@/axios/api';
import StatusSelect from '@/components/GlobalComponents/StatusSelect.vue';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            mediaPath: import.meta.env.VITE_MEDIA_PATH,
            comments    : this.dialogRef.data ? this.dialogRef.data.comments : null,
            formData    : this.dialogRef.data ? this.dialogRef.data.formData : null,
            params: {
                id              : '',
                inq_reply        : '',
            },
        }
    },
    mounted() {
        console.log(this.formData);
        if(this.formData) {
            this.params.id              = this.formData.id
        }
    },
    methods: {
        async submit(e) {
            try {
                console.log(this.params);
                if(this.params.inq_reply && this.params.id) {
                    const res = await api.replyInquiry(this.params)

                    const code  = parseInt(res.data.code);
                    const msg   = res.data.message;
                    console.log(res, code, msg);
                    if(code !== 1) {
                        this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                        this.dialogRef.close(e);
                    } else {
                        this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    }
                } else {
                    this.$GF.customToast(1, this.$store.getters['languageStore/translate'](`Please complete all fields`))
                }
            } catch (error) {
                console.error(error)
                throw error
            }
        },
    },
    components: {
        StatusSelect,
    }
}
</script>