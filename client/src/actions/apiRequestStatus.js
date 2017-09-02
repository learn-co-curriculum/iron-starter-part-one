// @ Action Creators 
export const makingAPIRequest = () => {
    return { type: 'MAKING_API_REQUEST' };
};

export const successfulAPIRequest = () => {
    return { type: 'SUCCESSFUL_API_REQUEST' };
};

export const unsuccessfulAPIRequest = () => {
    return { type: 'UNSUCCESSFUL_API_REQUEST' };
};