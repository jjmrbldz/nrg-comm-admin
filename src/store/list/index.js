import store from ".."
import { api } from "@/axios/api"
import GF from "@/utils/GlobalFunctions"

const state     = {
    uploadProgress: null,
    listLoading: false,
    adminListParams: {
        tp_user_id  : '',
        tp_status   : '',
        orderby     : 'desc',
        page        : '1',
        limit       : '10'
    },
    adminList: [],
    adminListTotalItems: null,
}
 
const mutations = {
    setAdminListParams(state, payload) {
        console.log('AdminListParams mutation', payload);
        state.adminListParams[`${payload[0]}`] = payload[1]
    },
    setAdminListTotalItems(state, data) {
        state.adminListTotalItems = data
    },
    setAdminList(state, data) {
        state.adminList = data
    },
    setListLoading(state, bool) {
        state.listLoading = bool
    },
    setUploadProgress(state, data) {
        state.uploadProgress = data
    }
}

const actions   = {
    refetchList(callBack) {
        callBack()
    },
    setAdminListParams(context, payload) {
        context.commit('setAdminListParams', payload)
        console.log('setAdminListParams', context.state.adminListParams, payload);
    },
    setUploadProgress(context, data) {
        context.commit('setUploadProgress', data)
        console.log('setUploadProgress', context.state.uploadProgress, data);
    },
    async getAdminList(context, params) {
        context.commit('setListLoading', true)
        // params.page = String(params.page)
        // params.limit= String(params.limit)
        try {
            const res   = await api.adminList(params)
            const code  = parseInt(res.data.code);
            const msg   = res.data.message;
            if(code !== 1) {
                // GF.customToast(code, store.getters['languageStore/translate'](`${msg}`))
                context.commit('setAdminList', res.data.data) 
                context.commit('setAdminListTotalItems', res.data.totalitems) 
            } else {
                GF.customToast(code, store.getters['languageStore/translate'](`${msg}`) ? store.getters['languageStore/translate'](`${msg}`) : msg)
                context.commit('setAdminList', [])
            }
            
        } catch (error) {
            console.error(error)
            context.commit('setAdminList', [])
            throw error
        } finally {
            context.commit('setListLoading', false)
        }
    },
}

const getters = {
   getAdminListParams: (state) => state.adminListParams,
   getAdminListTotalItems: (state) => state.adminListTotalItems,
   getUploadProgress: (state) => state.uploadProgress,
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
