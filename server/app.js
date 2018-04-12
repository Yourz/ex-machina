const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');
const serve = require("koa-static");

app.use(serve(path.join(__dirname, '../build/')));
server.listen(8080);

router.get('/', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream(path.join(__dirname, '../build/index.html'));
  await next();
})
app.use(router.routes());

io.on('connection', (socket) => {
  // 群聊
  socket.on('sendGroupMsg', function (data) {
    socket.broadcast.emit('receiveGroupMsg', data);
  });
  // 上线
  socket.on('online', name => {
    socket.broadcast.emit('online', name)
  });
})
