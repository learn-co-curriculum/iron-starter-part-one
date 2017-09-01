import { expect } from 'chai';
import reducer from '../../src/reducers/apiRequestStatusReducer.js'

describe('APIRequestStatus Reducer', () => {

    let initialState;

    beforeEach(() => {
        initialState = {
            makingAPIRequest: false,
            failedLastAPIRequest: false,
        }
    });

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).to.deep.equal(initialState);
    });

    it('should handle MAKING_API_REQUEST', () => {
        expect(reducer(initialState, { type: 'MAKING_API_REQUEST' })).to.deep.equal({
            makingAPIRequest: true,
            failedLastAPIRequest: false,
        });
    });

    it('should handle SUCCESSFUL_API_REQUEST', () => {
        expect(reducer({
            makingAPIRequest: true,
            failedLastAPIRequest: false,
        }, { type: 'SUCCESSFUL_API_REQUEST' })).to.deep.equal(initialState);
    });

    it('should handle SUCCESSFUL_API_REQUEST', () => {
        expect(reducer({
            makingAPIRequest: true,
            failedLastAPIRequest: false,
        }, { type: 'UNSUCCESSFUL_API_REQUEST' })).to.deep.equal({
            makingAPIRequest: false,
            failedLastAPIRequest: true,
        });
    });
});
