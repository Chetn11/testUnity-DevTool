import { MAKE_REQUEST } from "./actionType"


export const make_request=(payload)=>{
    return{
        type:MAKE_REQUEST,
        payload
    }
}