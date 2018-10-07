'use strict';


const crypto = require('crypto');

let id = null;

module.exports.genId() = () => {

    if(!id){
  
        id = crypto.randomBytes(20);
        Buffer.from('-BP0001-').copy(id,0);
        //copy -BP0001- to id buffer at position 0
    }
    return id;
};