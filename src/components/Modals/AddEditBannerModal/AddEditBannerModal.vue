<template>
    <div class="field">
        <label for="firstname1">{{$store.getters['languageStore/translate'](`titleLang`)}}</label>
        <InputText v-model="params.b_title" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field" v-if="false">
        <label for="firstname1">{{$store.getters['languageStore/translate'](`positionLang`)}}</label>
        <Dropdown v-model="params.tb_type" :options="posOptions" optionLabel="name" optionValue="code" class="text-base text-color  border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="disabled" />
    </div>
    <div class="field" v-if="false">
        <label for="firstname1">{{$store.getters['languageStore/translate'](`sizeLang`)}}</label>
        <Dropdown v-model="params.tb_size" :options="sizeOptions" optionLabel="name" optionValue="code" class="text-base text-color  border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="disabled" />
    </div>
    <div class="field" v-if="false">
        <label for="firstname1">Link</label>
        <InputText v-model="params.tb_link" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field" v-if="formData">
        <label for="firstname1">{{$store.getters['languageStore/translate'](`statusLang`)}}</label>
        <StatusSelect v-model="params.b_status" :hide-all="true" />
    </div>
    <div class="field" v-if="formData">
        <label for="firstname1">{{$store.getters['languageStore/translate'](`sortLang`)}}</label>
        <Dropdown v-model="params.b_order" :options="sortOptions" optionLabel="name" optionValue="code" class="text-base text-color  border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field"> 
        <label>Upload Banner</label>
        <FileUpload name="files" :multiple="false" accept="image/*" :url="uploadURL" :maxFileSize="4300000" style="height: 100%;" @upload="onUpload($event, false)">
            <template #empty>
                <p>Drag and drop files to here to upload.</p>
            </template>
        </FileUpload>
    </div>
    <Button class="mt-3" label="Save" @click="submit" :loading="loading" />
</template>

<script>
import { api } from '@/axios/api';
import { UPLOAD_API_URL } from '@/axios/upload';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            uploadURL: UPLOAD_API_URL,
            loading : false,
            formData: this.dialogRef.data ? this.dialogRef.data.formData : null,
            id      : this.dialogRef.data ? this.dialogRef.data.id : null,
            update  : this.dialogRef.data ? this.dialogRef.data.update : false,
            totalItems: this.dialogRef.data ? this.dialogRef.data.totalItems : false,
            bannerDimension: null,
            files:  [],
            selectedPosition:null,
            posOptions: [
                { name: 'Top', code: 'top' },
                { name: 'Bottom', code: 'bottom' },
                { name: 'Left', code: 'left' },
                { name: 'Right', code: 'right' },
            ],
            selectedSize:null,
            sizeOptions: [
                { name: 'Small', code: 'xs' },
                { name: 'Medium', code: 'md' },
                { name: 'Large', code: 'lg' },
            ],
            statusOptions: [
                { name: 'Active', code: 1 },
                { name: 'Inactive', code: 0},
            ],
            params:{
                user_login_id:this.$store.state.userStore.user_id,
                user_login_token:this.$store.state.userStore.token,
                b_title:"",
                // tb_type:null,
                // tb_size:null,
                tp_partner_id:this.$store.state.userStore.id,
                // tb_link:"",
                b_status:"",
                b_order:"",
                b_image:"",
                // b_order_old:"",
                // id:"",
            },
            disabled: false,
        }
    },
    computed:{
        sortOptions(){
            let result = []
            let i
            for(i=1;i<=this.totalItems;i++){
                result.push({name:i,code:i})
            }

            return result
        }
    },
    mounted() {
        console.log('Update Data', this.dialogRef)
        if(this.formData){
            this.disabled = true
            this.params.b_title = this.formData.b_title
            // this.params.tb_type = this.formData.tb_type
            // this.params.tb_link = this.formData.tb_link
            // this.params.tb_size = this.formData.tb_size
            this.params.b_status = String(this.formData.b_status)
            this.params.b_order = this.totalItems
            // this.params.tb_dimension = this.formData.tb_dimension
            // this.params.totalitems = this.formData.totalitems
        }
    },
    methods: {
        async submit(e) {
            this.params.tp_partner_id = `${this.params.tp_partner_id}`
            this.params.b_status = `${this.params.b_status}`
            this.params.b_order = `${this.params.b_order}`
            console.log(this.bannerDimension);
            let formData = new FormData();
            // formData.append('user_login_id', this.params.user_login_id);
            // formData.append('user_login_token', this.params.user_login_token);
            formData.append('b_title', this.params.b_title);
            formData.append('b_image', this.params.b_image);
            // formData.append('tb_type', this.params.tb_type);
            // formData.append('tb_size', this.params.tb_size);
            formData.append('tp_partner_id', `${this.params.tp_partner_id}`);
            // formData.append('tb_link', `${this.params.tb_link}`);
            // formData.append('banner_dimension', this.bannerDimension ? this.bannerDimension : this.params.tb_dimension);
            if(this.formData){
                formData.append('b_order', `${this.params.b_order}`);
                // formData.append('b_order_old', `${this.formData.b_order}`);
                formData.append('b_status', `${this.params.b_status}`);
                formData.append('id', `${this.formData.id}`);
                // formData.append('tb_image_old', `${this.formData.tb_img}`);
            }

            // formData.append('files', this.files);

            try{
                const res = this.formData ? await api.updateBanner(formData) : await api.addBanner(formData)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1){
                    this.$router.push({path:"/banner", query:{addModal:false}})
                }
                this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
            }catch(err){
                console.log(err)
            }
            this.dialogRef.close(e);
        },
        customChooseCallBack(event) {
            this.files = event.files[0];

            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    this.bannerDimension = `${img.width} × ${img.height}`
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(this.files);
        },
        clearMediaUpload() {
            this.files = [];
            this.bannerDimension = null
        },
        onUpload(event, multiple) {
            const { response } = event.xhr
            if(response) {
                this.params.b_image = JSON.parse(response).filenames
                console.log(JSON.parse(response).filenames)
            }
        }
    }
}
</script>