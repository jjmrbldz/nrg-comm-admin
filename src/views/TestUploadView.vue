<template>
    <ProgressBar v-if="getUploadProgress" class="custom-progress" :value="getUploadProgress"></ProgressBar>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
        <InputText v-model="params.tp_title" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('descriptionLang') }}</label>
        <InputText v-model="params.tp_content" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('mainCategoryLang') }}</label>
        <CategorySelect v-model="mainCategories" returnValue="id" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('subcategoryLang') }}</label>
        <SubCategorySelect v-model="subCategories" return-value="subcat_id" :main-cat-ids="mainCategories" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Tags') }}</label>
        <TagSelect v-model="tags" returnValue="id" />
    </div>
    <div class="field" v-if="updateData">
        <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
        <StatusSelect v-model="params.tp_status" :hide-all="true" />
    </div>
    <div class="formgrid grid">
        <div class="field col">
            <label>Upload Thumbnail</label>
            <FileUpload :multiple="false" accept="image/*" :maxFileSize="3145728" style="height: 100%;" @select="customChooseCallBack2" @remove="clearThumbUpload" @clear="clearThumbUpload">
                <template #header="{ chooseCallback, clearCallback, files }">
                    <div class="flex flex-wrap align-items-center flex-1 gap-2">
                            <Button @click="chooseCallback()" icon="pi pi-images" label="Choose file"/>
                            <Button @click="clearCallback()" icon="pi pi-times" label="Remove" severity="danger" :disabled="!files || files.length === 0"/>
                    </div>
                </template>
                <template #empty>
                    <p>Drag and drop files to here to upload.</p>
                </template>
            </FileUpload>
        </div>
        <div class="field col">
            <label>Upload Video</label>
            <div v-if="this.files.length > 0" class="" style="max-width: 150px; max-height: 80px;">
                <video-player :options="{
                    autoplay: false,
                    controls: true,
                    poster: `${this.files2}`,
                    sources: [
                        {
                            src:`${this.files}`,
                            type: 'video/mp4'
                        }
                    ]
                }" />
            </div>
            <FileUpload accept="video/*" :maxFileSize="1073741824" style="height: 100%;" @select="customChooseCallBack" @remove="clearVidUpload" @clear="clearVidUpload">
                <template #header="{ chooseCallback, clearCallback, files }">
                    <div class="flex flex-wrap align-items-center flex-1 gap-2">
                            <Button @click="chooseCallback()" icon="pi pi-images" label="Choose file"/>
                            <Button @click="clearCallback()" icon="pi pi-times" label="Remove" severity="danger" :disabled="!files || files.length === 0"/>
                    </div>
                </template>
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
import { mapGetters } from 'vuex';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            loading         : false,
            vidDuration     : null,
            updateData      : this.dialogRef ? this.dialogRef.data.formData : null,
            formData: new FormData(),
            mainCategories  : [],
            tags            : [],
            subCategories   : [],
            subCatlist      : [],
            params: {
                user_login_id   : this.$store.state.userStore.user_id,
                user_login_token: this.$store.state.userStore.token,
                tp_title        : '',
                tp_content      : '',
                tp_admin_id     : this.$store.state.userStore.id,
                categories      : '',
                tags            : '',
                subcategories   : '',
            },
            files:  [],
            files2:  [],
        }
    },
    computed: {
        ...mapGetters('listStore', ['getUploadProgress'])
    },
    watch: {
        mainCategories: {
            handler(newVal, oldVal) {
                console.log(newVal);
            }
        },
    },
    mounted() {
        this.getSubcatList();
        console.log(this.updateData);
        if(this.updateData) {
            this.params.id              = this.updateData.vid_id
            this.params.tp_title        = this.updateData.vid_title
            this.params.tp_content      = this.updateData.vid_content
            this.params.tp_status       = String(this.updateData.vid_status)
            this.params.old_thumbnail   = `${this.updateData.vid_img}`
            this.params.old_video       = `${this.updateData.vid_video}`

            this.params.old_duration    = this.updateData.vid_duration

            this.mainCategories         = this.$GF.convertToArray(this.updateData.vid_category_id, true)
            if(this.mainCategories) {
                this.subCategories          = this.$GF.convertToArray(this.updateData.vid_sub_category_id, true);
            }
            this.tags                   = this.$GF.convertToArray(this.updateData.vid_tags_id, true)
        }
    },
    methods: {
        async submit(e) {
            this.loading    = true
            let res         = []
            try {

                var formData = new FormData()

                formData.append('user_login_id'   , this.params.user_login_id)
                formData.append('user_login_token', this.params.user_login_token)
                formData.append('tp_title'        , this.params.tp_title)
                formData.append('tp_content'      , this.params.tp_content)
                formData.append('tp_admin_id'     , this.params.tp_admin_id)
                formData.append('categories'      , [this.mainCategories])
                formData.append('tags'              , [this.tags])

                let allSubCat = this.subCatlist
                let newSCatArr= [];
                allSubCat.forEach((subcat) => {
                    this.subCategories.forEach(selectedSubCat => {
                        if(selectedSubCat === subcat.subcat_id) {
                            newSCatArr.push(subcat)
                        }
                    })
                })

                
                this.mainCategories.forEach((mainCatItem,mkey) => {
                    let subCatFData = [];
                    newSCatArr.forEach((subCatItem, sKey) => {
                        if(mainCatItem === subCatItem.cat_id) {
                            subCatFData.push(subCatItem.subcat_id)
                        }
                    })
                    formData.append(`subcategories[${mkey}]`, subCatFData);
                    console.log(subCatFData);
                })

                if(this.files2.length > 1) {
                    for(var file of this.files2) {
                        formData.append('files', file)
                    }
                } else {
                    formData.append('files', this.files2)
                }

                if(this.files.length > 1) {
                    for(var file of this.files) {
                        formData.append('files2', file)
                    }
                } else {
                    formData.append('files2', this.files)
                }

                // if(this.vidDuration) {
                //     formData.append('tp_duration', this.vidDuration ? this.vidDuration : '--:--:--')
                // } else {
                //     formData.append('tp_duration', this.params.old_duration ? this.params.old_duration : '--:--:--')
                // }
                
                
                if (this.updateData) {
                    formData.append('old_tp_duration'  , this.params.old_duration ? this.params.old_duration : '--:--:--')
                    formData.append('id'            , this.params.id)
                    formData.append('tp_status'     , this.params.tp_status)
                    formData.append('old_thumbnail' , this.params.old_thumbnail)
                    formData.append('old_video'     , this.params.old_video)
                    
                    res   = await api.updateVideo(formData)
                } else {
                    res   = await api.uploadVideo(formData)
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
            this.files2 = [];
        },
        clearVidUpload() {
            this.files = [];
            this.vidDuration = ''
        },
        customChooseCallBack(event) {
            this.files = event.files[0];
            
            console.log(event);
            console.log(this.files);

            // this.getMediaDuration(this.files)
        },
        customChooseCallBack2(event) {
            this.files2 = event.files[0];
            console.log(this.files2);
        },
        getMediaDuration(file) {
            this.loading = true
            const reader = new FileReader();
            reader.onload = () => {
                const video = document.createElement('video');
                video.src = reader.result;
                video.addEventListener('loadedmetadata', () => {
                    let dur = video.duration
                    console.log(dur);
                    this.vidDuration = `${this.$GF.formatDuration(Math.round(video.duration))}`;
                    console.log(this.vidDuration);
                    this.loading = false
                });
            };
            reader.readAsDataURL(file);
        },
        async getSubcatList() {
            this.loading = true
            try {
                let reqParams = {
                    filter_cat_id       : [],
                    c_title     : '',
                    filter_subcat_name  : '',
                    filter_subcat_status: '',
                    page         : 1,
                    limit        : 999
                }
                const res   = await api.getSubCategoryList(reqParams)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    // this.list = res.data.data
                    this.subCatlist = res.data.data;
                    console.log('Sub Cat List', this.subCatlist);
                    // console.log('Grouped', grouped);
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                    this.subCatlist = []
                }
                
            } catch (error) {
                console.error(error)
                this.subCatlist = []
                throw error
            } finally {
                this.loading = false;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.custom-progress {
    position: absolute;
    height: 12px;
    width: 100%;
    top: 0px;
    left: 0;
    border-radius: 0;
}
</style>