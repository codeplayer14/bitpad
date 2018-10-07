
const net = require('net');
const tracker = require('./tracker');
const {Buffer} = require('buffer');


module.exports = torrent => {

    tracker.getPeers(torrent, peers => {

        peers.forEach(download);
    });
};

const download = (peer) => {

    const socket = new net.Socket();

    socket.on('error',console.log);
    socket.connect(peer.port,peer.ip, () => {

        console.log("Sending data");
    });

    socket.on('data',(data) => {
        console.log('Data resposne received');
    });
}
// }
// const socket = new net.Socket();
// socket.on('error',console.log);

// //essential to make a connection
// // unlike udp
// //errors are redirected to console
// socket.connect(port,ip, () => {

//     socket.write(Buffer.from('Hello World'));
// })

// socket.on('data', respBuffer => {}
function onWholeMsg(socket, callback) {
    let savedBuf = Buffer.alloc(0);
    let handshake = true;
  
    socket.on('data', recvBuf => {
      // msgLen calculates the length of a whole message
      const msgLen = () => handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readInt32BE(0) + 4;
      savedBuf = Buffer.concat([savedBuf, recvBuf]);
  
      while (savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
        callback(savedBuf.slice(0, msgLen()));
        savedBuf = savedBuf.slice(msgLen());
        handshake = false;
      }
    });
  } 