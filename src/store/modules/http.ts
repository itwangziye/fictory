const state = {
    httpRequestList: []
}

const actions = {
    removeHttpRequestList({commit}: any, payload: any){
        commit("addHttpRequestList", 0);
    }
}

const mutations = {
    addHttpRequestList(state: any, payload: any) {
        if (payload == 0) {
            //强行中断时才向下执行
            state.httpRequestList.forEach((item: any) => {
                item("interrupt"); //给个标志，中断请求
            });
            state.httpRequestList = [];
        } else {
            state.httpRequestList.push(payload);
        }
    }
}


export default{
    namespaced:true,
    state,
    actions,
    mutations,
}