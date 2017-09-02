import { expect } from 'chai';
import { makingAPIRequest, successfulAPIRequest, unsuccessfulAPIRequest } from '../../src/actions/apiRequestStatus';

describe('APIRequestStatus Actions', () => {
    describe('Action Creators', () => {
        describe('makingAPIRequest', () => {
            it("should return an Object with MAKING_API_REQUEST type", () => {
                expect(makingAPIRequest()).to.deep.equal({ type: 'MAKING_API_REQUEST' });
            });
        });
    
        describe('successfulAPIRequest', () => {
            it("should return an Object with SUCCESSFUL_API_REQUEST type", () => {
                expect(successfulAPIRequest()).to.deep.equal({ type: 'SUCCESSFUL_API_REQUEST' });
            });
        });
    
        describe('unsuccessfulAPIRequest', () => {
            it("should return an Object with SUCCESSFUL_API_REQUEST type", () => {
                expect(unsuccessfulAPIRequest()).to.deep.equal({ type: 'UNSUCCESSFUL_API_REQUEST' });
            });
        });
    });
});