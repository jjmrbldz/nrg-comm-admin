<template>
    <div class="grid p-2">
        <div class="formgrid grid">
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
                <StatusSelect v-model="params.status" />
            </div>
            <div class="field col-6">
                <label>{{ $store.getters['languageStore/translate']('nameLang') }}</label>
                <InputText type="search" v-model="params.name" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="getList()" />
            </div>
        </div>
        <div class="col"></div>
        <Button class="h-3rem my-auto bg-blue-500 text-white border-none outline-none" icon="pi pi-plus" :label="this.$store.getters['languageStore/translate']('New')" @click="newItem()" />
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`nameLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.name }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`statusLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <StatusTag :status="data.status" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateRegisteredLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <UpdateItemButton :updateProps="{itemID: data.id, getAPI: 'getAccredited', getParams: 'id', modalHeader: 'Add/Edit Accredited', icon: 'mdi mdi mdi-playlist-edit', modalType: 'AddEditAccredited', callback: () => getList(), totalItems: totalRecords}" />
                <DeleteItemButton class="ml-2" :updateProps="{
                        params: {
                            // tb_img  : data.banner_image,
                            id      : data.id,
                        },
                        api: 'deleteAccredited',
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
        :rows="params.limit"
        :totalRecords="totalRecords"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        @page="handlePagination"
        >
    </Paginator>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { api } from '@/axios/api';
import StatusTag from '../GlobalComponents/StatusTag.vue';
import CategoryFilter from '../Filter/CategoryFilter.vue'

export default {
    data() {
        return {
            totalRecords: 0,
            loading: false,
            list: [],
            params: {
                name     : '',
                status    : '',
                orderby     : 'desc',
                page        : 1,
                limit       : 10
            },
            interval: null,
        }
    },
    watch: {
        params: {
            handler(newValue, oldValue) {
                clearTimeout(this.interval)
                this.interval = setTimeout(() => {
                    this.getList();
                }, 1000)
            },
            deep: true,
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        handlePagination(data) {
            console.log(data);
            this.params.page     = data.page+1;
            this.params.limit    = data.rows;
            this.getList()
        },
        newItem(id) {
            this.$dialog.open(this.$modalComponent.AddEditAccredited, {
                props: {
                    header: this.$store.getters['languageStore/translate']('Add/Edit Accredited'),
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
        async getList() {
            this.loading = true
            try {

                const reqParams = {
                    ...this.params,
                    page        : String(this.params.page),
                    limit       : String(this.params.limit)
                }
                
                const res   = await api.accreditedList(reqParams)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.list = res.data.data
                    this.totalRecords = res.data.totalitems
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
            }
        },
    },
    components: {
        CategoryFilter
    }
}
</script>