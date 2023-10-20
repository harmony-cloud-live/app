export const ssr = false;
export const csr = true;

// TODO: serverside endpoint to get IP

// import { networkInterfaces } from 'os';

// export async function get(req, res) {
//     const nets = networkInterfaces();
//     let serverIp = '';

//     for (const name of Object.keys(nets)) {
//         for (const net of nets[name]) {
//             // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
//             if (net.family === 'IPv4' && !net.internal) {
//                 serverIp = net.address;
//             }
//         }
//     }

//     if (serverIp) {
//         res.end(serverIp);
//     } else {
//         res.end('Server IP not found');
//     }
// }
