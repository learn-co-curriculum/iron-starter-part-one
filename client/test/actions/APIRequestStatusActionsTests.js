import { expect } from 'chai';
import { makingAPIRequest, successfulAPIRequest, unsuccessfulAPIRequest } from '../../src/actions/apiRequestStatus';

describe('APIRequestStatus Action Creators', () => {
    describe('makingAPIRequest()', () => {
        it("should return an Object with a type of 'MAKING_API_REQUEST'", () => {
            expect(makingAPIRequest()).to.deep.equal({ type: 'MAKING_API_REQUEST' });
        });
    });

    describe('successfulAPIRequest()', () => {
        it("should return an Object with a type of 'SUCCESSFUL_API_REQUEST'", () => {
            expect(successfulAPIRequest()).to.deep.equal({ type: 'SUCCESSFUL_API_REQUEST' });
        });
    });

    describe('unsuccessfulAPIRequest()', () => {
        it("should return an Object with a type of 'SUCCESSFUL_API_REQUEST'", () => {
            expect(unsuccessfulAPIRequest()).to.deep.equal({ type: 'UNSUCCESSFUL_API_REQUEST' });
        });
    });
});