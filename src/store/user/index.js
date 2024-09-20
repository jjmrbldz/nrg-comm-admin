import { api } from "@/axios/api"
import GF from "@/utils/GlobalFunctions"
import store from '@/store/index'
import router from "@/router"

const userState = JSON.parse(localStorage.getItem('user'))

const state     = {
    id          : userState ? userState.id : null,
    user_id     : userState ? userState.user_id : null,
    token       : userState ? userState.token : null,
    user_type   : userState ? userState.user_type : null,
    realCash    : null,
    glblLoading : false,
}

const mutations = {
    setLoading(state, bool) {
        state.glblLoading   = bool
    },
    setUser(state, user) {
        state.id        = user.id
        state.user_id   = user.tp_user_id
        state.token     = user.tp_session
        // state.user_type = user.user_type
    },
    logout(state) {
        state.id        = null
        state.user_id   = null
        state.token     = null
        state.user_type = null
        router.push('/login')
        setTimeout(()=> {
            router.go();
        }, 100);
    },
}

const actions   = {
    async login(context, data) {
        context.commit('setLoading', true);
        try {

            const res   = await api.login(data);
            const code  = parseInt(res.data.code);
            const msg   = res.data.message;
            console.log(msg, code)
            if(code !== 1) {
                context.commit('setUser', res.data.data)
                GF.customToast(code, store.getters['languageStore/translate'](`${msg}`))
                router.push('/')
            } else {
                // context.commit('logout')
                GF.customToast(code, store.getters['languageStore/translate'](`${msg}`))
            }

        } catch (error) {
            // context.commit('logout')
            console.error('Login failed:', error);
            throw error;
        } finally {
            context.commit('setLoading', false);
        }
    },
    async checkToken(context) {
        if (context.state.token) {
            try {
                const data = { 
                    // Authorization: `Bearer ${TOKEN}`,
                    tp_user_id: context.state.user_id,
                    tp_session: context.state.token, 
                }
                const res  = await api.checkToken(data);
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                
                if(code !== 1) {
                    // await context.dispatch('agentDetails')
                    return true
                    // GF.customToast(code, store.getters['languageStore/translate'](`${msg}`))
                } else {
                    context.commit('logout')
                    GF.customToast(code, store.getters['languageStore/translate'](`${msg}`))
                    return false
                }

            } catch(error) {
                console.error(error)
                context.commit('logout')
                return false
            }
        }
    },
    async agentDetails(context) {
        context.commit('setLoading', true);
        try {
            const data = { 
                // Authorization   : `Bearer ${TOKEN}`,
                token           : context.state.token,
                username        : context.state.username, 
                filter_agentid  : context.state.username, 
            }
            const res   = await api.agentDetails(data);
            const code  = res.data.code;
            const msg   = res.data.message;
            console.log(res);

            if(code === 1) {
                context.commit('setAgentDetails', res.data.data)
            } else {
                
            }

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            context.commit('setLoading', false);
        }
    },
}

const getters = {
    isLoggedIn: (state) => !!state.token,
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
