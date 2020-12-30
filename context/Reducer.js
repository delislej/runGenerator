import { storeHistory } from "../Utils/dataManagement";

const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ROUTES':
            //console.log("setting routes: " + action.payload)
            return {
                ...state,
                routes: action.payload
            };
        case 'ADD_ROUTE':
            //console.log("adding route: " + action.payload)
            temp = state.routes
            temp.push(action.payload)
            storeHistory(temp)
            return {
                ...state,
                routes: temp
            };
        case 'REMOVE_ROUTE':
            //console.log("removing: " + action.payload)
            storeHistory(state.routes.filter(route => route !== action.payload))    
            return {
                    ...state,
                    routes: state.routes.filter(route => route !== action.payload)
                    
                };
        case 'CLEAR_ROUTES':
            storeHistory([])
            console.log("cleared routes")
                return {
                    ...state,
                    routes: action.payload
                };

        case 'SELECT_ROUTE':
            //console.log("selecting route: " + action.payload)
                return {
                    ...state,
                    currentRoute: action.payload
                    };
        
        default:
            return state;
    }
};

export default Reducer;