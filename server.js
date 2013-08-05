(function(){

	var http = require('http');
	var url = require('url');
	var fs = require('fs');

	// ドキュメントルートのファイルパス
	var documentRoot = './htdocs/';

	var server = http.createServer(function(request, response) {

		// アクセスされたURLを解析してパスを抽出
		var path = url.parse(request.url).pathname;
		 
		// ディレクトリトラバーサル防止
		if (path.indexOf("..") != -1) {
		    path = '/';
		}
		if(path.length-1 == path.lastIndexOf('/')) {
			// リクエストが「/」で終わっている場合、index.htmlをつける。
		    path += 'index.html';
		}
		fs.readFile(documentRoot + path, function(error, data){
		    if(error) {
		        response.writeHead(404, 'NotFound', {'Content-Type': 'text/html'});
		        response.write('<h1>404 Not found.</h1>');
		        response.write('<p>ファイルが見つかりません。</p>');
		        response.end();
		    } else {
				var pathExt = (function (path) {
					var i = path.lastIndexOf('.');
					return (i < 0) ? '' : path.substr(i + 1);
				})(path);
				var mime = 'text/html';
				switch( pathExt ){
					case 'html': case 'htm':             mime = 'text/html';break;
					case 'js':                           mime = 'text/javascript';break;
					case 'css':                          mime = 'text/css';break;
					case 'gif':                          mime = 'image/gif';break;
					case 'jpg': case 'jpeg': case 'jpe': mime = 'image/jpeg';break;
					case 'png':                          mime = 'image/png';break;
					case 'svg':                          mime = 'image/svg+xml';break;
				}
				response.writeHead(200, { 'Content-Type': mime });
				response.write(data);
				response.end();
		    }
		});

	});

	var io = require('socket.io').listen(server);
	io.sockets.on('connection', function (socket) {
		console.log('Socket Connected.');
		socket.on('command', function (cmd) {
			console.log('onCommand.');
			console.log(cmd);
			socket.emit('report', 'Your command "' + cmd + '" roger.');
		});
	});

	// 80番ポートでLISTEN状態にする
	server.listen(80);

})();
