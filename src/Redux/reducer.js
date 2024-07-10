import { MAKE_REQUEST } from "./actionType";


const initialState={
    requestDetails:[]
}

export const reducer=(state=initialState, action)=>{
    const{type,payload}=action;

    switch(type){
        case MAKE_REQUEST:{
            return{
                ...state,
                requestDetails:[...state.requestDetails,payload]
            }
        }
        default:
            return state
    }
}