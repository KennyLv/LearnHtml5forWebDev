//<![CDATA[

/*
* jsimgs: embedded images in web pages - decoder - 2006-12-06 ddzoom.net/jsimgs
*
* note: only one instance of this script need go (anywhere) in your web page
*
*/

var timer;

// base64 decoder...

var b64re = '', b2n = [], n2c = [];

function b64init() {
var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, a = b64.split(''); i < 64; i++) b2n[a[i]] = i;
for (var i = 0; i < 256; i++) n2c[i] = String.fromCharCode(i);
b64re = new RegExp('[^' + b64 + ']', 'g');
}

function b64decode(s) {
if (!b64re) b64init();
s = s.replace(b64re, '');
if (window.atob) return atob(s); // use fast mozilla builtin
s = s.split('');
var len = s.length, pad = len % 4;
s.push('A','A','A');
for (var i = 0, j = 0, a = []; i < len; ) {
var n = (b2n[s[i++]] << 18) + (b2n[s[i++]] << 12) + (b2n[s[i++]] << 6) + b2n[s[i++]];
a[j++] = n2c[(n >> 16) & 0xff];
a[j++] = n2c[(n >> 8) & 0xff];
a[j++] = n2c[ n        & 0xff];
}
if      (pad == 2) a.length -= 2;
else if (pad == 3) a.length -= 1;
return a.join('');
}

// huffman decoder...

var c2b = [], bs = '', bsptr = 0;

function bsnum(len) { return parseInt(bs.slice(bsptr, (bsptr += len)), 2); }

function hufinit() {
for (var i = 0; i < 256; i++)
c2b[String.fromCharCode(i)] = ('00000000' + i.toString(2)).slice(-8);
}

function hufdecode(s) {
if (!c2b.length) hufinit();
var a = s.split('');
var c = a.shift().charCodeAt(0);
if (((c >> 3) & 31) != (a.length & 31)) return null; // fails checksum
var lastcharbits = c & 7;
var len = (a.length * 8) - (8 - lastcharbits);
for (var i = 0, n = a.length, b = new Array(n); i < n; i++) b[i] = c2b[a[i]];
bs = b.join(''), bsptr = 0;
var num_paths = bsnum(16), code_size = bsnum(4) + 1, path_size = bsnum(4) + 1;
var map = [], r = [];
for (var i = 0; i < num_paths; i++) {
var code = bsnum(bsnum(code_size) + 1);
var psize = bsnum(path_size) + 1;
var path = bs.slice(bsptr, (bsptr += psize));
map[path] = String.fromCharCode(code);
r[i] = '(' + path + ')';
}
var re = new RegExp(r.join('|'), 'g');
var fn = function(m) { return map[m]; }
return bs.slice(bsptr, len).replace(re, fn);
}

// run length encoded data to html table...

function codes(s) { for (var i = 0, n = s.length, a = []; i < n; i++ ) a[i] = s.charCodeAt(i); return a; } // DEBUG

function d2h(n) { return '' + (n < 16 ? '0' : '') + n.toString(16); }

function rle2table(data, title) {

//timer = new Timer();

var w = (data.charCodeAt(0) << 8) + data.charCodeAt(1);
var h = (data.charCodeAt(2) << 8) + data.charCodeAt(3);
var psize = data.charCodeAt(4), rlind = psize;
for (var i = 0, j = 5, pal = []; i < psize; i++) {
pal[i] = '#' + d2h(data.charCodeAt(j++)) + d2h(data.charCodeAt(j++)) + d2h(data.charCodeAt(j++));
//if (i == tc) pal[i] = 'transparent'; // FIXME ie6 uses current color
}

var imgdata = data.slice(j);
var re = new RegExp('\\x' + d2h(rlind) + '([\\x00-\\x' + d2h(psize - 1) + '])([\\x02-\\xff])', 'g');
var fn = function(m, chr, count) {
for (var i = 0, n = count.charCodeAt(0), s = ''; i < n; i++) s += '' + chr;
return s;
};
data = imgdata.replace(re, fn); //alert([data.length, w, h, tc, j, '\n', pal, '\n', codes(data)])

//data = data.split('');
data = codes(data);

// non-dom...
var html = [], i = 0;
html[i++] = '<table cellspacing="0" cellpadding="0" title="' + title + '" style="display:inline;">';
for (var y = 0, c = 0, i = 1; y < h; y++) {
html[i++] = '<tr style="height:1px">';
for (var x = 0; x < w; x++) { // TIGHT LOOP
   html[i++] = '<td style="width:1px;background:';
   html[i++] = pal[data[c++]];
   html[i++] = '"> <\/td>';
}
html[i++] = '<\/tr>';
}
html[i++] = '<\/table>';
var span = document.createElement('span');
if (window.opera) span.style.verticalAlign = h + 'px'; // FIXME
span.innerHTML = html.join('');
return span;
}

//function Timer() {
// this.t = new Date(); this.toString = function() { return (new Date()) - this.t; };
//}

function render_jsimgs() {
//timer = new Timer();
for (var i = 0, n = document.images.length, imgs = []; i < n; i++) {
imgs[i] = document.images[i]; // save
imgs[i].title = imgs[i].getAttribute('alt') || imgs[i].title || 'embedded image';
}
for (var i = 0, m; i < n; i++)
if ((!imgs[i].complete || !imgs[i].src) && (m = imgs[i].className.match(/^jsimg:(.+)/)) !== null)
   imgs[i].parentNode.replaceChild(rle2table(hufdecode(b64decode(m[1])), imgs[i].title), imgs[i]);
// var e = document.getElementById('timer'); if (e) e.innerHTML = timer;
}



window.addEventListener ? window.addEventListener('load', render_jsimgs, false) : window.attachEvent ? window.attachEvent('onload', render_jsimgs) : null;


//]]>


}