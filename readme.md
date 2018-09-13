# An application on Node.js for P2P Bittorrent Tracker

tracker.js -  tracker file returns list of peers using bep conventions
              request response mechanism

download.js -  Connects to each peer obtained from tracker and requests pieces

message.js - functions for convenience to manipulate and parse buffer 

Protocol at a glance:
a) Let the peer know the file you're interested in. Unavailibility results in termination of the connection, whereas presence is acknowledged with a confirmation - a handshake
b) Peer tells the available pieces using "bitfield" and "have" messages. Multiple "have" messages sent for each piece 