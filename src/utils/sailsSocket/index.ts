import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
declare const window: any;

// '/locations/subscribe?channel=location'
/**
 * 创建socket连接
 * @param param0
 * @returns
 */
let io: any; // 全项目共享
export function create() {
  // const socketIOClient = require('socket.io-client');
  // const sailsIOClient = require('sails.io.js');
  /**
   * 如果存在就不需要重新创建------
   */
  if (!window.tmpIo) {
    // Instantiate the socket client (`io`)
    // (for now, you must explicitly pass in the socket.io client when using this library from Node.js)
    io = sailsIOClient(socketIOClient);
    window.tmpIo = io;

    // Set some options:
    // (you have to specify the host and port of the Sails backend when using this library from Node.js)
    // io.sails.headers = {
    //   token: 'asdfda'
    // }
    io.sails.url = 'http://110.42.252.193:3000/';
    io.sails.autoConnect = true;
    // ...
    io.socket.on('disconnect', function onDisconnect() {
      // eslint-disable-next-line no-console
      console.log('断开了与Sails server的连接');
    });
  }
  // When you are finished with `io.socket`, or any other sockets you connect manually,
  // you should make sure and disconnect them, e.g.:

  // 以下代码是主动断开连接
  // io.socket.disconnect();
  // ...结束

  // (note that there is no callback argument to the `.disconnect` method)
  return window.tmpIo;
}
/**
 * 订阅 准备放弃该功能(时间浪费在封闭上了),使用原生或subscirbe2
 * @param data
 * @returns
 */
interface params {
  name: string;
  url: string;
  callback: any;
}
export function subscribe(data: params) {
  const sailsIO = create();
  // 清空位置订阅

  // 摘取出来是关闭订阅的时候需要使用此方法才能删除
  const off = () => sailsIO.socket.off(data.name, data.callback);
  off();
  sailsIO.socket.get(`${data.url}`, () => {
    // 重新订阅
    sailsIO.socket.on(data.name, data.callback);
  });
}
