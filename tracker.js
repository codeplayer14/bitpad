'use strict';

const dgram = require('dgram');
const {Buffer} = require('buffer');
const urlParse = require('url').parse;
const crypto = require('crypto');
const torrentParser = require('./torrent-parser');
const util = require('./util');

module.exports.getPeers = (torrent,callback) => {

    const socket = dgram.createSocket('udp4');
    const url = torrent.announce.toString();
    const announceReq  = 
    
    udpSend(socket,buildConnReq(),url);

    socket.on('message',response => {

        const announceReq = buildAnnounceReq(connectResp.connect_id,torrent);

        if(respType(response) === 'connect'){

            const connectResp = parseConnResp(response);

            const announceReq = parseAnnounceReq(connectResp.connect_id);
            
            udpSend(socket,announceReq,url);

        }else if(respType(response)==='announce'){

            const announceResp = parseAnnounceResp(response);
            
            // callback(announceResp.peers);
        }
    
    })

    const announceReq = buildAnnounceReq(conn)
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

const parseConnResp = (resp) => ({

        action: resp.readUINT32BE(0),
        transaction_id:resp.readUINT32BE(4),
        connect_id:resp.slice(8)
})


const buildAnnounceReq = (connectionId,torrent,port=6881) => {

    const buf = Buffer.allocUnsafe(98);

    connectionId.copy(buf,0);
    buf.writeUInt32BE(1,8);
    crypto.randomBytes(4).copy(buf,12);

    //info hash
    torrentParser.infoHash(torrent).copy(buf,16);
    //peer id
    util.genId().copy(buf,36);
    //downloaded
    Buffer.alloc(8).copy(buf,56);
    
    torrentParser.size(torrent).copy(buf,64);

    Buffer.alloc(8).copy(buf,72);

    //event 0-none, 1-started 2-completed 3-stopped
    buf.writeUInt32BE(0,80);
    //ip
    buf.writeUInt32BE(0,84);
    //key
    crypto.randomBytes(4).copy(buf,88);
    //num want
    buf.writeInt32BE(-1, 92);

    //port
    buf.writeUInt16BE(port,96);

    return buf;
}

const parseAnnounceResp = (resp) => {

    const group = (iterable,groupSize) => {

        let groups = [];
        for(let i=0;i<iterable.length;i+=groupSize){

            groups.push(iterable.slice(i,i+groupSize));
        }

        return groups;
    }

    return {

        action: resp.readUINT32BE(0),
        transaction_id:resp.readUINT32BE(4),
        leechers: resp.readUINT32BE(12),
        seeders: resp.readUINT32BE(16),
        peers: group(resp.slice(20),6).map(address => ({

                ip:address.slice(0,4).join('.'),
                port:address.readUINT16BE(4)
            })
        )

    }
    const respType = (resp) => {

        const action = resp.readUINT32BE(0);
        if(action === 0) return 'connect';
        if(action === 1) return 'announce';
    }
}

