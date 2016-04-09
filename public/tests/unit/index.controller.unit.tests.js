/**
 * Created by Michaël on 31-03-16.
 */
describe('Testing MEAN main module', function(){
    var mainModule;
    
    beforeEach(function(){
        mainModule = angular.module('app');
    });
    
    it('Should be registered', function(){
        expect(mainModule).toBeDefined();
    })
});