'use strict';

const dgram = require('dgram');
const {Buffer} = require('buffer');
const urlParse = require('url').parse;
const crypto = require('crypto');


module.exports.getPeers = (torrent,callback) => {

    const socket = dgram.createSocket('udp4');
    const url = torrent.announce.toString();
    
    udpSend(socket,buildConnReq(),url);

    socket.on('message',response => {

    
    })
}

function udpSend(socket,message,rawUrl, callback = ()=>{}) {

    const url  = urlParse(rawUrl);
    socket.send(message,0,message.length,url.port,url.host,callback);
}

const buildConnReq = () => {
    
    const buf = Buffer.alloc(16);

    //protocol id
    buf.writeUInt32BE(0x417,0);
    buf.writeUInt32BE(0x27101980,4);

    //action
    buf.writeUInt32BE(0,8);

    crypto.randomBytes(4).copy(buf,12);
}

const parseResponse = (resp) => ({

        action: resp.readUINT32BE(0),
        transaction_id:resp.readUINT32BE(4),
        connect_id:resp.slice(8)
})
