/**
 * Created by Muhammad Faizan on 4/25/14.
 */
"use strict";
var db = require('../db');
var url = require('url');
var Emitter = require("events").EventEmitter;
var async = require("async");
var complete = new Emitter();
//var parse = require('parser');

exports.service = function(req,res){
    var url_parts = url.parse(req.url, true);
    var data = url_parts.query;
    var key = decodeURIComponent(data.keyword.replace(/\+/g,' '));
    var count = 0;

    complete.on("dataFilled",function(result,toCount){
        count++;
        if (count == toCount){
            res.json(result);
        }
    });
    var searchingFor = [];
    var ind = key.indexOf(' ');
    while( ind != -1){
        searchingFor.push(key.substring(0,ind));
        key = key.substring(ind+1);
        ind = key.indexOf(' ');
    }
    searchingFor.push(key);

    var result = [];

    for (var i = 0; i< searchingFor.length; i++){


        var query = "SELECT fName, lName, userName, email, imgUrl FROM users WHERE fName LIKE '%"
            + searchingFor[i]
            + "%' OR lName LIKE '%"
            + searchingFor[i]
            + "%' OR email LIKE '%"
            + searchingFor[i]
            + "%'";
        console.log(query);

        db.querydb(query).then(
            function(data){
                //console.log(data);
                data.forEach(function(slot){
                    result.push(slot);
                });

                complete.emit("dataFilled",result,searchingFor.length);

            },
            function(err){
                console.log(err);
            });
    }
}
