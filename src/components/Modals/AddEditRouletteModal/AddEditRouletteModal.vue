<template>
    <ProgressBar v-if="getUploadProgress" class="custom-progress" :value="getUploadProgress"></ProgressBar>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
        <InputText v-model="params.tr_name" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Level') }}</label>
        <InputNumber v-model="params.tr_level" :use-grouping="false" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
        <Dropdown v-model="params.tr_status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" checkmark :highlightOnSelect="false" class="w-full"/>
    </div>
    <p>{{ $store.getters['languageStore/translate']('Roulette Content') }}</p>
    <Panel class="mb-4" v-for="(item, index) in params.tr_content">
        <div class="formgrid grid">
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('Name') }}</label>
                <InputText type="name" v-model="item.trc_display_name" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </div>
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
                <Dropdown v-model="item.trc_status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" checkmark :highlightOnSelect="false" class="w-full"/>
            </div>
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('Type') }}</label>
                <div class="formgroup-inline">
                    <div class="field-radiobutton">
                        <RadioButton v-model="item.trc_type" inputId="type1" name="type" value="Points" />
                        <label for="type1" class="ml-2">{{ $store.getters['languageStore/translate']('Points') }}</label>
                    </div>
                    <div class="field-radiobutton">
                        <RadioButton v-model="item.trc_type" inputId="type2" name="type" value="Level" />
                        <label for="type2" class="ml-2">{{ $store.getters['languageStore/translate']('Level') }}</label>
                    </div>
                    <div class="field-radiobutton">
                        <RadioButton v-model="item.trc_type" inputId="type2" name="type" value="Coupon" />
                        <label for="type2" class="ml-2">{{ $store.getters['languageStore/translate']('Coupon') }}</label>
                    </div>
                </div>
            </div>
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('Amount') }}</label>
                <InputNumber v-model="item.trc_amount" :use-grouping="true" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="99999999999" class="w-full" />
            </div>
            
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('Chance') }}</label>
                <InputNumber v-model="item.trc_chance" :use-grouping="false" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" suffix="%" />
            </div>
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('Days Valid') }}</label>
                <InputNumber v-model="item.trc_validity_days" :use-grouping="true" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" class="w-full" />
            </div>
            <div class="field col-12">
                <label>Upload Thumbnail</label>
                <FileUpload name="files" :multiple="false" accept="image/*" :url="uploadURL"  style="height: 100%;" @upload="onUpload($event, false, index)">
                    <template #empty>
                        <p>Drag and drop files to here to upload.</p>
                    </template>
                </FileUpload>
            </div>
        </div>
        <Button v-if="index > 4" class="my-3 ml-auto" severity="danger" label="Remove" @click="handleContentAddRemove('remove', index)" />
    </Panel>
    <div class="flex">
        <Button class="my-3 ml-auto" severity="success" label="Add More" @click="handleContentAddRemove('add', undefined)" />
    </div>
    <Divider />
    <Button class="mt-3 w-full" label="Save" @click="submit('data')" :loading="loading" />
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
                user_id   : this.$store.state.userStore.id,
                // user_login_token: this.$store.state.userStore.token,
                tr_name     : '',
                tr_level    : 1,
                tr_status   : 1,
                tr_content  : [
                    {
                        trc_display_name: '',
                        trc_img_src     : '',
                        trc_type        : 'Points',
                        trc_amount      : 0,
                        trc_chance      : 1,
                        trc_validity_days: 0,
                        trc_status      : 1,
                    },
                    {
                        trc_display_name: '',
                        trc_img_src     : '',
                        trc_type        : 'Points',
                        trc_amount      : 0,
                        trc_chance      : 1,
                        trc_validity_days: 0,
                        trc_status      : 1,
                    },
                    {
                        trc_display_name: '',
                        trc_img_src     : '',
                        trc_type        : 'Points',
                        trc_amount      : 0,
                        trc_chance      : 1,
                        trc_validity_days: 0,
                        trc_status      : 1,
                    },
                    {
                        trc_display_name: '',
                        trc_img_src     : '',
                        trc_type        : 'Points',
                        trc_amount      : 0,
                        trc_chance      : 1,
                        trc_validity_days: 0,
                        trc_status      : 1,
                    },
                    {
                        trc_display_name: '',
                        trc_img_src     : '',
                        trc_type        : 'Points',
                        trc_amount      : 0,
                        trc_chance      : 1,
                        trc_validity_days: 0,
                        trc_status      : 1,
                    },
                ],
            },
            files:  [],
            statusOptions: [
                { label: this.$store.getters['languageStore/translate']('Inactive'), value: 0},
                { label: this.$store.getters['languageStore/translate']('Active'), value: 1},
            ]
        }
    },
    computed: {
        ...mapGetters('listStore', ['getUploadProgress']),
    },
    mounted() {
        if(this.updateData) {
            console.log(this.updateData.roulette_content)
            const rouletteContent = JSON.parse(this.updateData.roulette_content);
            console.log(rouletteContent)
            this.params.id          = this.updateData.id
            this.params.tr_name     = this.updateData.tr_name
            this.params.tr_level   = this.updateData.tr_level
            this.params.tr_status   = this.updateData.tr_status
            this.params.tr_content  = rouletteContent.map(item => {
                return {
                    ...item,
                    trc_chance: item.trc_chance * 100
                }
            })
            // console.log('Roulette Content Data',JSON.parse(roulette_content));
        }
    },
    methods: {
        handleContentAddRemove(type, index) {
            if (type === 'add') {
                this.params.tr_content.push({
                    id: this.updateData ? null : undefined,
                    trc_display_name: '',
                    trc_img_src     : '',
                    trc_type        : 'Points',
                    trc_amount      : 0,
                    trc_chance      : 1,
                    trc_validity_days: 0,
                    trc_status      : 1,
                    trc_new         : this.updateData ? 1 : undefined,
                })
            } else {
                if (index && index > 4) {
                    this.params.tr_content.splice(index, 1);
                }
            }
        },
        async submit(e) {
            this.loading    = true
            let res         = [];

            try {

                const reqBody = {
                    ...this.params,
                    tr_content: this.params.tr_content.map(item => {
                        return {
                            ...item,
                            tr_id: undefined,
                            trc_new: this.updateData ? (item.trc_new ? item.trc_new : 0) : undefined,
                            trc_chance: item.trc_chance / 100
                        }
                    })
                }
                console.log(reqBody);

                if (this.updateData) {
                    res   = await api.updateRoulette(reqBody)
                } else {
                    res   = await api.createRoulette(reqBody)
                }

                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code === 0) {
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
        onUpload(event, multiple, index) {
            const { response } = event.xhr
            if(response) {
                this.params.tr_content[index].trc_img_src = JSON.parse(response).filenames;
                // this.params.p_image = JSON.parse(response).filenames
                // console.log(JSON.parse(response).filenames)
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