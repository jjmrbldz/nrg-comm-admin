<template>
    <div class="formgrid grid">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('Type') }}</label>
            <Dropdown v-model="params.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Select level" checkmark :highlightOnSelect="false" class="w-full" @change="getList()" showClear/>
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
            <InputText type="search" v-model="params.title" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="getList()" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('usernameLang') }}</label>
            <InputText type="search" v-model="params.username" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="getList()" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`usernameLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_user_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`titleLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.trl_title }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Type`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.trl_type }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Amount`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.trl_amount }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`createdAtLang`)" style="min-width: 100px"> 
            <template #body="{ data }">
                <span>{{ $GF.getDateTime(data.trl_reg_datetime) }}</span>
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
                orderby : 'desc',
                page    : 1,
                limit   : 10,
                username   : '',
                type    : '',
                title   : '',
            },
            typeOptions: [
                { label: this.$store.getters['languageStore/translate']('Points'), value: 'Points'},
                { label: this.$store.getters['languageStore/translate']('Level'), value: 'Level'},
                { label: this.$store.getters['languageStore/translate']('Coupon'), value: 'Coupon'},
            ],
            totalitems:0,
            loading:false,
        }
    },
    mounted(){
        this.getList()
    },
    methods:{
        newItem(id) {
            this.$dialog.open(this.$modalComponent.AddEditRoulette, {
                props: {
                    header: this.$store.getters['languageStore/translate']('Add/Edit Roulette'),
                    style: {
                        width: '70vw'
                    },
                    modal: true
                },
                onClose: (options) => {
                    this.getList()
                },
            });
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
                const res       = await api.getRouletteLogsList(reqParams)
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