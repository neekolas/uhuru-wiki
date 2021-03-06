"use strict";

var __ = require("./translate");
var message = require("./message");
var ProgressBar = require("./progress-bar");
var Dropzone = require("./dropzone");
var handleErrors = require("./handle-xhr-errors");
var injectMedia = require("./inject-media");

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $("body").trigger("save");

    uploadFiles(document.location.href, evt.dataTransfer.files);
}

function uploadFiles(url, files) {
    var formData = new FormData();

    for (var i = 0, file; file = files[i]; ++i) {
        formData.append("attachments", file);
    }

    var xhr = new XMLHttpRequest();
    var finished = false;
    xhr.open('POST', "/attachments", true);
    xhr.onload = function (e) {
        if (!finished && xhr.status == 200) {
            finished = true;
            handleResponse(xhr.responseText);
            message("success", __("successfully-uploaded"));
        }

        handleErrors(xhr);
    };


    var progressBar = new ProgressBar('#content', xhr.upload);

    xhr.send(formData); // multipart/form-data
}

var handleResponse = function (res) {
    var response = JSON.parse(res);
    response.attachments.forEach(function (attachment) {
        var attachmentUrl = '/attachments/' + response.pageId + '/' + attachment;
        injectMedia(window.location.origin + attachmentUrl, '#content');
    });
    $("h1:first").data().lastModified = response.lastModified;
};