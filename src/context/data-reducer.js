import { ACTIONS } from "./indentifiers";
//actions increment and delete items from GlobalState
export const dataReducer =(state, action)=>{
    switch (action.type) {
        case ACTIONS.INCREMENT:
            return [...state, action.payload.dataEmployee]
        case ACTIONS.DELETE:
            return state.filter(employee=>employee.id!==action.payload.id)
        default:
            return state
    }
}

