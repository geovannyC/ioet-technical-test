import React, {useReducer} from 'react'
import { ACTIONS } from "./indentifiers";
import { dataReducer } from "./data-reducer";
import DataContext from "./context";
//Global State for save or delete the data registered
export const GlobalState = props=>{
    const [data, dispatch] = useReducer(dataReducer, [])

    const addEmployee = (paramData)=>{
        dispatch({type: ACTIONS.INCREMENT, payload:{dataEmployee: paramData}})
    }
    const removeEmployee = (paramId)=>{
        dispatch({type: ACTIONS.DELETE, payload: {id: paramId}})
    }
    return(
        <DataContext.Provider value={{
            //set data as a event
            data: data,
            addEmployee,
            removeEmployee
        }}>
            {props.children}
        </DataContext.Provider>
    )
}




