var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

var b = function (a, b) {
  for (var d = 0; d < b.length - 2; d += 3) {
      var c = b.charAt(d + 2),
          c = "a" <= c ? c.charCodeAt(0) - 87 : Number(c),
          c = "+" == b.charAt(d + 1) ? a >>> c : a << c;
      a = "+" == b.charAt(d) ? a + c & 4294967295 : a ^ c
  }
  return a
}

var tk =  function (a,TKK) {
  for (var e = TKK.split("."), h = Number(e[0]) || 0, g = [], d = 0, f = 0; f < a.length; f++) {
      var c = a.charCodeAt(f);
      128 > c ? g[d++] = c : (2048 > c ? g[d++] = c >> 6 | 192 : (55296 == (c & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512) ? (c = 65536 + ((c & 1023) << 10) + (a.charCodeAt(++f) & 1023), g[d++] = c >> 18 | 240, g[d++] = c >> 12 & 63 | 128) : g[d++] = c >> 12 | 224, g[d++] = c >> 6 & 63 | 128), g[d++] = c & 63 | 128)
  }
  a = h;
  for (d = 0; d < g.length; d++) a += g[d], a = b(a, "+-a^+6");
  a = b(a, "+-3^+b+-f");
  a ^= Number(e[1]) || 0;
  0 > a && (a = (a & 2147483647) + 2147483648);
  a %= 1E6;
  return a.toString() + "." + (a ^ h)
}

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 4.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.post('/', function(req, res){
	var text = req.param('text');
	console.log(text)
	var sl = req.param('sl');
	var tl = req.param('tl');
	request('https://translate.google.cn/#'+sl+'/'+tl+'/'+text, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var have = body.indexOf('TKK');
			if(have>0){
				var tmp = body.split("TKK")[1];
				var tmp2 = tmp.split(");")[0];
				var TKK = eval('TKK'+tmp2+');')
				
				var resTK = tk(text,TKK);

				console.log(text)
				var url='https://translate.google.cn/translate_a/single?client=t&sl='+sl+'&tl='+tl+'&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&ssel=3&tsel=3&kc=0&tk='+resTK+'&q='+encodeURI(text);
				request(url, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						res.json(eval(body)[0][0][0]);
					}else{
						res.send(error);
					}
				})
			}

		}else{
			res.send(error);

		}
	})
});
app.listen(3030);