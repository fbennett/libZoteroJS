'use strict';

var assert = require('chai').assert;
var should = require('chai').should();
var expect = require('chai').expect;
var Zotero = require('../../src/libzotero.js');

var config = {
	'target':'publications',
	'libraryType':'user',
	'libraryID':3
};

var fetcher = new Zotero.Fetcher(config);

describe.skip('Zotero.Fetcher', function(){
	describe('Fetchall', function() {
		it('should fetch all publications', function(done){
			var p = fetcher.fetchAll();
			p.then(function(publications){
				assert.lengthOf(publications, 4);
				done();
			}).catch(function(response){
				log.debug('caught error in Zotero.Fetcher Fetchall test');
				log.debug(response);
			});
		});
	});
});