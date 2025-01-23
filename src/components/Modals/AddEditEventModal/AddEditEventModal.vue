<template>
    <ProgressBar v-if="getUploadProgress" class="custom-progress" :value="getUploadProgress"></ProgressBar>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
        <InputText v-model="params.e_tittle" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('mainCategoryLang') }}</label>
        <CategorySelect v-model="params.e_category" returnValue="id" :single-select="false" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Content') }}</label>
        <Textarea v-model="params.e_content" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <template v-if="updateData">
        <div v-if="false" class="field">
            <label>{{ $store.getters['languageStore/translate']('currentOrderLang') }}</label>
            <InputText type="name" v-model="params.ta_sort_old" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" disabled />
        </div>    
        <div v-if="false" class="field">
            <label>{{ $store.getters['languageStore/translate']('newOrderLang') }}</label>
            <Dropdown class="w-full" v-model="params.ta_sort" :options="sortOptions" optionLabel="code" optionValue="code" />
        </div>    
        <div class="field">
            <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
            <StatusSelect v-model="params.e_status" />
        </div>    
    </template>
    <div class="formgrid grid">
        <div class="field col">
            <label>Upload Thumbnail</label>
            <FileUpload name="files" :multiple="false" accept="image/*" :url="uploadURL"  style="height: 100%;" @upload="onUpload($event, false)">
                <template #empty>
                    <p>Drag and drop files to here to upload.</p>
                </template>
            </FileUpload>
        </div>
        <div class="field col">
            <label>Upload Media</label>
            <FileUpload name="files" :multiple="true" accept="image/*" :url="uploadURL"  style="height: 100%;" @upload="onUpload($event, true)">
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
import uploadFile, { UPLOAD_API_URL } from '@/axios/upload';
import { mapGetters } from 'vuex';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            loading         : false,
            updateData      : this.dialogRef.data ? this.dialogRef.data.formData : null,
            params: {
                tp_partner_id   : this.$store.state.userStore.id,
                user_login_token: this.$store.state.userStore.token,
                e_tittle        : '',
                e_category      : null,
                e_content       : '',
                e_thumbnail     : '',
                e_media         : '',
            },
            uploadURL: UPLOAD_API_URL,
            thumbnail: [],
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
        console.log('Update Data', this.updateData);
        if(this.updateData) {
            
            this.params.id          = this.updateData.event_id
            this.params.e_tittle    = this.updateData.title
            this.params.e_content  = this.updateData.content
            this.params.e_status   = String(this.updateData.status)
            this.params.e_thumbnail  = this.updateData.thumbnail
            this.params.e_media  = this.updateData.media

            const exCat = JSON.parse(this.updateData.categories)
            console.log(exCat)
            this.params.e_category  = exCat.map(item => item.category_id)
            // this.params.ta_sort     = this.updateData.ta_sort
            // this.params.ta_sort_old = this.updateData.ta_sort
            // this.params.ta_image_old= this.updateData.ta_img
        }
    },
    methods: {
        async submit(e) {
            this.loading    = true
            let res         = []
            try {

                var formData = new FormData()

                formData.append('tp_partner_id' , this.params.tp_partner_id)
                formData.append('e_tittle'      , this.params.e_tittle)
                formData.append('e_category'    , this.params.e_category.join(','))
                formData.append('e_content'     , this.params.e_content)
                formData.append('e_thumbnail'   , this.params.e_thumbnail)
                formData.append('e_media'       , this.params.e_media)

                // if(this.files.length > 1) {
                //     for(var file of this.files) {
                //         formData.append('files', file)
                //     }
                // } else {
                //     formData.append('files', this.files)
                // }

                
                if (this.updateData) {
                    formData.append('id'            , this.params.id)
                    formData.append('e_status'     , this.params.e_status)
                    // formData.append('ta_sort'       , this.params.ta_sort)
                    // formData.append('ta_sort_old'   , this.params.ta_sort_old)
                    // formData.append('ta_image_old'  , this.params.ta_image_old)
                    
                    res   = await api.updateEvent(formData)
                } else {
                    res   = await api.addEvent(formData)
                }
                // for (var pair of formData.entries()) {
                //     console.log(pair[0] + ', ' + pair[1]);
                // }
                
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
        onUpload(event, multiple) {
            const { response } = event.xhr
            if(response) {
                if(!multiple) {
                    this.params.e_thumbnail = JSON.parse(response).filenames
                } else {
                    this.params.e_media = JSON.parse(response).filenames

                }
                console.log(response)
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