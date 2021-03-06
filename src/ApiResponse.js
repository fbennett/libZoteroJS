'use strict';

var log = require('./Log.js').Logger('libZotero:ApiResponse');

module.exports = function(response) {
	log.debug('Zotero.ApiResponse', 3);
	this.totalResults = 0;
	this.apiVersion = null;
	this.lastModifiedVersion = 0;
	this.linkHeader = '';
	this.links = {};
	
	if(response){
		if(!response.isError){
			this.isError = false;
		} else {
			this.isError = true;
		}
		this.data = response.data;
		//this.jqxhr = response.jqxhr;
		this.parseResponse(response);
	}
};

module.exports.prototype.parseResponse = function(response){
	log.debug('parseResponse', 3);
	var apiResponse = this;
	apiResponse.jqxhr = response.jqxhr;
	apiResponse.status = response.jqxhr.status;
	//keep track of relevant headers
	apiResponse.lastModifiedVersion = response.jqxhr.getResponseHeader('Last-Modified-Version');
	apiResponse.apiVersion = response.jqxhr.getResponseHeader('Zotero-API-Version');
	apiResponse.backoff = response.jqxhr.getResponseHeader('Backoff');
	apiResponse.retryAfter = response.jqxhr.getResponseHeader('Retry-After');
	apiResponse.contentType = response.jqxhr.getResponseHeader('Content-Type');
	apiResponse.linkHeader = response.jqxhr.getResponseHeader('Link');
	apiResponse.totalResults = response.jqxhr.getResponseHeader('Total-Results');
	if(apiResponse.backoff){
		apiResponse.backoff = parseInt(apiResponse.backoff, 10);
	}
	if(apiResponse.retryAfter){
		apiResponse.retryAfter = parseInt(apiResponse.retryAfter, 10);
	}
	//TODO: parse link header into individual links
	log.debug('parse link header', 4);
	log.debug(apiResponse.linkHeader, 4);
	if(apiResponse.linkHeader){
		var links = apiResponse.linkHeader.split(',');
		var parsedLinks = {};
		var linkRegex = /^<([^>]+)>; rel="([^\"]*)"$/;
		for(var i = 0; i < links.length; i++){
			var matches = linkRegex.exec(links[i].trim());
			if(matches[2]){
				parsedLinks[matches[2]] = matches[1];
			}
		}
		apiResponse.parsedLinks = parsedLinks;
	}
};