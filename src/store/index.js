import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = {   
    user: JSON.parse(sessionStorage.getItem('user'))
};
const getters = {
    isLogin(state) {
        if(state.user == null){
            return false;
        }else{
            return true;
        }
    },
    getAvatar(state){
        return state.user.avatar;
    },
    getUser(state){
        if(state.user == null){
            return null;
        }
        return {
            avatar: state.user.avatar,
            id: state.user.id,
            nickname: state.user.nickname,
            phone:state.user.phone,
            logintime:state.user.logintime
        }
    },
    getToken(state){
        if(state.user == null){
            return null;
        }
        
        return state.user.token;
    }
};
const mutations = {
    clearuser (state) {
        state.user = null;
        sessionStorage.removeItem("user")
    },
    setuser(state, payload){
        state.user = payload;
    }
  }
const store = new Vuex.Store({
    state,
    getters,
    mutations
});
 
export default store;