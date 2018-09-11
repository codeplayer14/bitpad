// Connects to each peer and requests pieces
// tracker file returns list of peers

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