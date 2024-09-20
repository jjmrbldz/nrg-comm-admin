<template>
    <div class="formgrid grid">
        <div class="field">
            <span>{{ $store.getters['languageStore/translate']('selectstatusLang') }}</span>
            <StatusSelect class="mt-2" v-model="params.b_status" />
        </div>
        <div class="field ml-2" v-if="false">
            <span>{{$store.getters['languageStore/translate']('sizeLang')}}</span>
            <Dropdown @change="handleSizeChange" v-model="params.filter_tb_size" :options="sizeOptions" optionLabel="label" optionValue="value" placeholder="Select size" checkmark :highlightOnSelect="false" class="w-full mt-2"/>
        </div>
        <div class="field ml-2" v-if="false">
            <span>{{$store.getters['languageStore/translate']('positionLang')}}</span>
            <Dropdown @change="handleTypeChange" v-model="params.filter_tb_type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Select position" checkmark :highlightOnSelect="false" class="w-full mt-2"/>
        </div>
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`imagePreviewLang`)">
            <template #body="{ data, key }">{{ key }}
                <Image :src="`${this.mediaPath}${JSON.parse(data.b_image)[0]}`" alt="Image" imageStyle="width: unset; max-height: 34px;" preview />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`titleLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.b_title }}</span>
            </template>
        </Column>
        <Column v-if="false" :header="this.$store.getters['languageStore/translate'](`positionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.banner_type }}</span>
            </template>
        </Column>
        <Column v-if="false" :header="this.$store.getters['languageStore/translate'](`sizeLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="uppercase">{{ `${data.banner_size}` }}</span> 
                <span class="text-color-secondary">{{ ` (${data.banne_dimension ?  data.banne_dimension : '- × -'})` }}</span> 
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px"> 
            <template #body="{ data }">
                <span>{{ $GF.getDateTime(data.b_reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`statusLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <StatusTag :status="data.b_status" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <UpdateItemButton :updateProps="{itemID: data.id, getAPI: 'getBanner', getParams: 'id', modalHeader: 'Add/Edit Banner', icon: 'mdi mdi-pen', modalType: 'AddEditBanner', callback: () => getList(), totalItems:totalitems}" />
                <DeleteItemButton class="ml-2" :updateProps="{
                        params: {
                            // tb_img  : data.banner_image,
                            id      : data.id,
                        },
                        api: 'deleteBanner',
                        icon: 'mdi mdi-trash-can', 
                        callback: () => getList(), 
                    }" 
                />
            </template>
        </Column>
        <template #empty> <div class="text-center text-danger"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
    <Paginator
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        :rows="parseInt(params.limit)"
        :totalRecords="totalitems"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        @page="handlePagination"
        >
    </Paginator>
</template>
<script>
import { api } from '@/axios/api';
export default {
    data(){
        return{
            mediaPath   : import.meta.env.VITE_MEDIA_PATH,
            list        : [],
            params: {
                // filter_tb_title     : '',
                b_status    : '',
                orderby     : 'desc',
                // filter_tb_type      : '',
                // filter_tb_size      : '',
                page         : 1,
                limit        : 10,
            },
            totalitems:0,
            loading:false,
            status:'',
            sizeOptions:[
                { label: 'All', value: ''},
                { label: 'Small', value: 'xs'},
                { label: 'Medium', value: 'md'},
                { label: 'Large', value: 'lg'},
            ],
            typeOptions:[
                { label: 'All', value: ''},
                { label: 'Top', value: 'top'},
                { label: 'Bottom', value: 'bottom'},
                { label: 'Left', value: 'left'},
                { label: 'Right', value: 'right'},
            ],
        }
    },
    mounted(){
        this.getList()
    },
    watch:{
        '$route.query.addModal'(data){
            if(data == "false"){
                this.getList()
            }
        },
        'params.b_status'(data){
            this.getList()
        }   
    },
    methods:{
        handleSizeChange(){
            this.getList()
        },
        handleTypeChange(){
            this.getList()
        },
        handlePagination(data) {
            this.params.page = `${data.page+1}`
            this.params.limit = `${data.rows}`
            this.getList()
        },
        async getList() {
            this.loading = true
            try {

                const reqParams = {
                    ...this.params,
                    page    : String(this.params.page),
                    limit    : String(this.params.limit),
                }
                const res       = await api.bannerList(reqParams)
                const code      = parseInt(res.data.code);
                const msg       = res.data.message;
                this.totalitems = res.data.totalitems
                if(code !== 1) {
                    this.list = res.data.data
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                    this.list = []
                }
            } catch (error) {
                console.error(error)
                this.list = []
                throw error
            } finally {
                this.loading = false
                this.$store.dispatch('listStore/setUploadProgress', null)
            }
        },
    },
}
</script>