<template>
    <div class="formgrid grid">
        <div class="field">
            <span>{{ $store.getters['languageStore/translate']('selectstatusLang') }}</span>
            <StatusSelect class="mt-2" v-model="params.p_status" />
        </div>
        <div class="field col-2" v-if="false">
            <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
            <InputText type="search" v-model="params.p_title" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="getList()" />
        </div>
        <div class="col"></div>
        <Button class="h-3rem my-auto bg-blue-500 text-white border-none outline-none" icon="pi pi-plus" :label="this.$store.getters['languageStore/translate']('New')" @click="newItem()" />
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`imagePreviewLang`)">
            <template #body="{ data, key }">{{ key }}
                <Image :src="`${this.mediaPath}${JSON.parse(data.p_image)[0]}`" alt="Image" imageStyle="width: unset; max-height: 34px;" preview />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`titleLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.p_title }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px"> 
            <template #body="{ data }">
                <span>{{ $GF.getDateTime(data.p_reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`statusLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <StatusTag :status="data.p_status" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <UpdateItemButton :updateProps="{itemID: data.id, getAPI: 'getPopup', getParams: 'id', modalHeader: 'Add/Edit Popup', icon: 'mdi mdi-pen', modalType: 'AddEditPopup', callback: () => getList(), totalItems:totalitems}" />
                <DeleteItemButton class="ml-2" :updateProps="{
                        params: {
                            id      : data.id,
                        },
                        api: 'deletePopup',
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
                // p_title     : '',
                p_status    : '',
                orderby    : 'desc',
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
        'params.filter_tb_status'(data){
            this.getList()
        }   
    },
    methods:{
        newItem(id) {
            this.$dialog.open(this.$modalComponent.AddEditPopup, {
                props: {
                    header: this.$store.getters['languageStore/translate']('Add/Edit Popup'),
                    style: {
                        width: '30vw'
                    },
                    modal: true
                },
                onClose: (options) => {
                    this.getList()
                },
            });
        },
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
                    limit   : String(this.params.limit),
                }
                const res       = await api.popupList(reqParams)
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