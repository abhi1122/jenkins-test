// import {
//   io
// } from "socket.io-client";
// const socket = io("http://192.168.1.6:3011");
// // socket.on("hello", (val) => {
// //   alert(val);
// // });
// const user = localStorage.getItem('user');
// console.log(user, '...user');
// if (user) {

// } else {
//   socket.on("connect", () => {
//     console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
//     localStorage.setItem('user', JSON.stringify({
//       socketId: socket.id
//     }));
//   });
// }

// socket.on("disconnect", (reason) => {
//   console.log('disconnected');
//   localStorage.removeItem("user");
// });

// export default socket;