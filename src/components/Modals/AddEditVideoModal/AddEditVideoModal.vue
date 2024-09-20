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
            <FileUpload :multiple="false" accept="image/*" :maxFileSize="4300000" style="height: 100%;" @select="customChooseCallBack2" @remove="clearThumbUpload" @clear="clearThumbUpload">
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
        <div class="field col" v-if="!updateData">
            <label>Upload Video</label>
            <FileUpload accept="video/mp4" :maxFileSize="1073741824" style="height: 100%;" @select="customChooseCallBack" @remove="clearVidUpload" @clear="clearVidUpload" @progress="() => {return getUploadProgress}">
                <template #header="{ chooseCallback, clearCallback, files }">
                    <div class="flex flex-wrap align-items-center flex-1 gap-2">
                        <Button @click="chooseCallback()" icon="pi pi-images" label="Choose file"/>
                    </div>
                </template>
                <template #content="{files, uploadedFiles, removeUploadedFileCallback, removeFileCallback}">
                    <div v-if="files.length > 0" v-for="(file, index) of files" :key="file.name + file.type + file.size" class="p-fileupload-file" data-pc-section="file">
                        <!-- <img role="presentation" class="p-fileupload-file-thumbnail" alt="[SHANA]test_1-100mb.mp4" width="50" data-pc-section="thumbnail"> -->
                        <div class="p-fileupload-file-details" data-pc-section="details">
                            <div class="p-fileupload-file-name" data-pc-section="filename">{{file.name}}</div>
                            <span class="p-fileupload-file-size" data-pc-section="filesize">{{formatSize(file.size)}}</span>
                            <Badge v-if="getUploadProgress === null || getUploadProgress > 0" value="Pending" severity="warning" />
                            <Badge v-if="getUploadProgress === 0 || getUploadProgress === 100" value="Completed" severity="success" />
                        </div>
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
import Tag from 'primevue/tag';
import { mapGetters } from 'vuex';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            loading         : false,
            vidDuration     : null,
            updateData      : this.dialogRef.data ? this.dialogRef.data.formData : null,
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
            currentChunk: 0,
            finalFilename: '',
            chunkSize: 1024 * 1024,
            uploadProgress: 0,
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
        formatSize(bytes) {
            const k = 1024;
            const dm = 3;
            const sizes = this.$primevue.config.locale.fileSizeTypes;

            if (bytes === 0) {
                return `0 ${sizes[0]}`;
            }

            const i = Math.floor(Math.log(bytes) / Math.log(k));
            const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

            return `${formattedSize} ${sizes[i]}`;
        },
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
                formData.append('tp_video'        , this.finalFilename);
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

                // if (!this.updateData) {
                //     if(this.files2.length > 1) {
                //         for(var file of this.files2) {
                //             formData.append('files', file)
                //         }
                //     } else {
                //         formData.append('files', this.files2)
                //     }
                // }

                if(this.files2.length > 1) {
                    for(var file of this.files2) {
                        formData.append('files', file)
                    }
                } else {
                    formData.append('files', this.files2)
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
            this.$store.dispatch('listStore/setUploadProgress', null);
        },
        customChooseCallBack(event) {
            this.files = event.files[0];
            
            console.log(event);
            console.log(this.files);

            const fileSize = this.files.size;
            const chunks = Math.ceil(fileSize / this.chunkSize);
            const currentDate = new Date();
            const fileName = "video_"+currentDate.getTime() + "." + this.getFileExtension(this.files.name)
            
            this.uploadChunk(this.files, fileSize, chunks, fileName);
            // this.getMediaDuration(this.files)
        },
        uploadChunk(file, fileSize, totalChunks, fileName) {
            console.log('File:', file, 'Size:', fileSize, 'Chunk:', totalChunks, 'Name:', fileName);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${import.meta.env.VITE_UPLOAD_API_URL}`, true);

            const start = this.currentChunk * this.chunkSize;
            const end = Math.min(start + this.chunkSize, fileSize);

            const chunk = file.slice(start, end);

            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('X-File-Name', fileName);
            xhr.setRequestHeader('X-File-Size', fileSize);
            xhr.setRequestHeader('X-File-Chunk', this.currentChunk);
            xhr.setRequestHeader('X-Total-Chunks', totalChunks);

            xhr.onload = (data) => {
                console.log(data);
                this.currentChunk++;
                if (this.currentChunk < totalChunks) {
                    this.loading = true
                    this.$store.dispatch('listStore/setUploadProgress', parseInt(((this.currentChunk / totalChunks) * 100).toFixed(2)));
                    // this.uploadProgress = parseInt(((this.currentChunk / totalChunks) * 100).toFixed(2))
                    // $('#percent').html(`${((this.currentChunk / totalChunks) * 100).toFixed(2)}%`);
                    console.log(this.currentChunk);
                    this.uploadChunk(file, fileSize, totalChunks, fileName);
                } else {
                    this.loading = false
                    this.$store.dispatch('listStore/setUploadProgress', 0);
                    // this.uploadProgress = 0
                    // $('#percent').html(`100%`);
                    this.finalFilename = fileName;
                    console.log('File upload complete');
                }
            };

            xhr.send(chunk);
        },
        customChooseCallBack2(event) { 
            this.files2 = event.files[0];
            console.log(this.files2);
        },
        getFileExtension(filename) {
            return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2); // Extract file extension
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