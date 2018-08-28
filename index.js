'use strict';
const fs = require('fs');
const torrent = fs.readFileSync('puppy.torrent',{encoding:'utf-8'});
console.log(torrent)