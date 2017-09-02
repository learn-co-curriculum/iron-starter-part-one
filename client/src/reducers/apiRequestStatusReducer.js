const initialState = {
    makingAPIRequest: false,
    failedLastAPIRequest: false,
}
export default (state = initialState, action) => {
    switch(action.type) {

        case 'MAKING_API_REQUEST': {
            return {
                ...state,
                makingAPIRequest: true
            };
        };

        case 'SUCCESSFUL_API_REQUEST': {
            return {
                ...state,
                makingAPIRequest: false
            };
        };

        case 'UNSUCCESSFUL_API_REQUEST': {
            return {
                makingAPIRequest: false,
                failedLastAPIRequest: true,
            };
        };

        default: 
            return state;
    }
}