<template>
    <ProgressBar v-if="getUploadProgress" class="custom-progress" :value="getUploadProgress"></ProgressBar>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
        <InputText v-model="params.p_title" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field" v-if="false">
        <label>{{ $store.getters['languageStore/translate']('URL') }}</label>
        <InputText v-model="params.tp_link" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <template v-if="updateData">
        <div class="field" v-if="false">
            <label>{{ $store.getters['languageStore/translate']('currentOrderLang') }}</label>
            <InputText type="name" v-model="params.p_order_old" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" disabled />
        </div>    
        <div class="field">
            <label>{{ $store.getters['languageStore/translate']('sortLang') }}</label>
            <Dropdown class="w-full" v-model="params.p_order" :options="sortOptions" optionLabel="code" optionValue="code" />
        </div>    
        <div class="field">
            <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
            <StatusSelect v-model="params.p_status" :hide-all="true" />
        </div>    
    </template>
    <div class="formgrid grid">
        <div class="field col">
            <label>Upload Thumbnail</label>
            <FileUpload name="files" :multiple="false" accept="image/*" :url="uploadURL" :maxFileSize="4300000" style="height: 100%;" @upload="onUpload($event, false)">
                <template #empty>
                    <p>Drag and drop files to here to upload.</p>
                </template>
            </FileUpload>
        </div>
    </div>
    <Button class="mt-3" label="Save" @click="submit('data')" :loading="loading" />
</template>

<script>
import { api } from '@/axios/api';
import { UPLOAD_API_URL } from '@/axios/upload';
import { mapGetters } from 'vuex';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            uploadURL: UPLOAD_API_URL,
            loading         : false,
            updateData      : this.dialogRef.data ? this.dialogRef.data.formData : null,
            params: {
                // user_login_id   : this.$store.state.userStore.user_id,
                // user_login_token: this.$store.state.userStore.token,
                p_title        : '',
                p_image        : '',
                // tp_link         : '',
                tp_partner_id     : this.$store.state.userStore.id,
            },
            files:  [],
        }
    },
    computed: {
        ...mapGetters('listStore', ['getUploadProgress']),
        sortOptions(){
            let result = []
            let i
            for(i=1;i<=this.dialogRef.data.totalItems;i++){
                result.push({name:i,code:i})
            }
    
            return result
        }
    },
    mounted() {
        console.log(this.updateData);
        if(this.updateData) {
            this.params.id          = this.updateData.id
            this.params.p_title    = this.updateData.p_title
            // this.params.tp_link  = this.updateData.tp_link
            this.params.p_status   = String(this.updateData.p_status)
            this.params.p_order     = this.updateData.p_order
            // this.params.p_order_old = this.updateData.p_order
            // this.params.tp_image_old= this.updateData.tp_img
        }
    },
    methods: {
        async submit(e) {
            this.loading    = true
            let res         = []
            try {

                var formData = new FormData()

                // formData.append('user_login_id'   , this.params.user_login_id)
                // formData.append('user_login_token', this.params.user_login_token)
                formData.append('p_title'        , this.params.p_title)
                // formData.append('tp_link'      , this.params.tp_link)
                formData.append('tp_partner_id'     , this.params.tp_partner_id)
                formData.append('p_image'     , this.params.p_image)

                // if(this.files.length > 1) {
                //     for(var file of this.files) {
                //         formData.append('files', file)
                //     }
                // } else {
                //     formData.append('files', this.files)
                // }

                
                if (this.updateData) {
                    formData.append('id'            , this.params.id)
                    formData.append('p_status'     , this.params.p_status)
                    formData.append('p_order'       , this.params.p_order)
                    // formData.append('p_order_old'   , this.params.p_order_old)
                    // formData.append('tp_image_old'  , this.params.tp_image_old)
                    
                    res   = await api.updatePopup(formData)
                } else {
                    res   = await api.addPopup(formData)
                }
                for (var pair of formData.entries()) {
                    console.log(pair[0] + ', ' + pair[1]);
                }
                
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.dialogRef.close(e);
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                }
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.loading = false
                this.$store.dispatch('listStore/setUploadProgress', null);
            }
        },
        clearThumbUpload() {
            this.files = [];
        },
        customChooseCallBack(event) {
            this.files = event.files[0];
            
            console.log(event);
            console.log(this.files);

            this.getMediaDuration(this.files)
        },
        customChooseCallBack2(event) {
            this.files = event.files[0];
            console.log(this.files);
        },
        onUpload(event, multiple) {
            const { response } = event.xhr
            if(response) {
                this.params.p_image = JSON.parse(response).filenames
                console.log(JSON.parse(response).filenames)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.custom-progress {
    position: absolute;
    height: 6px;
    width: 100%;
    top: 0px;
    left: 0;
    border-radius: 0;
}
</style>