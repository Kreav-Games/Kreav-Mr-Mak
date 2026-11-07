(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Eo="185",kh=0,el=1,Hh=2,cr=1,wc=2,_s=3,ti=0,$t=1,en=2,Bn=0,qi=1,tl=2,nl=3,il=4,Vh=5,di=100,Gh=101,Wh=102,Xh=103,qh=104,$h=200,Yh=201,Zh=202,Kh=203,wa=204,Ta=205,Jh=206,Qh=207,jh=208,eu=209,tu=210,nu=211,iu=212,su=213,ru=214,Aa=0,Ra=1,Ca=2,Ki=3,Pa=4,La=5,Ia=6,Da=7,Tc=0,au=1,ou=2,En=0,Ac=1,Rc=2,Cc=3,Pc=4,Lc=5,Ic=6,Dc=7,Nc=300,xi=301,Ji=302,Pr=303,Lr=304,Er=306,Na=1e3,On=1001,Ua=1002,Ut=1003,lu=1004,Us=1005,Ht=1006,Ir=1007,mi=1008,tn=1009,Uc=1010,Fc=1011,Es=1012,wo=1013,An=1014,dn=1015,Hn=1016,To=1017,Ao=1018,ws=1020,Oc=35902,Bc=35899,zc=1021,kc=1022,fn=1023,Vn=1026,gi=1027,Ro=1028,Co=1029,_i=1030,Po=1031,Lo=1033,hr=33776,ur=33777,dr=33778,fr=33779,Fa=35840,Oa=35841,Ba=35842,za=35843,ka=36196,Ha=37492,Va=37496,Ga=37488,Wa=37489,mr=37490,Xa=37491,qa=37808,$a=37809,Ya=37810,Za=37811,Ka=37812,Ja=37813,Qa=37814,ja=37815,eo=37816,to=37817,no=37818,io=37819,so=37820,ro=37821,ao=36492,oo=36494,lo=36495,co=36283,ho=36284,gr=36285,uo=36286,cu=3200,fo=0,hu=1,Qn="",Qt="srgb",xr="srgb-linear",_r="linear",je="srgb",Ti=7680,sl=519,uu=512,du=513,fu=514,Io=515,pu=516,mu=517,Do=518,gu=519,po=35044,rl="300 es",bn=2e3,Ts=2001;function xu(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function vr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function _u(){const s=vr("canvas");return s.style.display="block",s}const al={};function Mr(...s){const e="THREE."+s.shift();console.log(e,...s)}function Hc(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ce(...s){s=Hc(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Ve(...s){s=Hc(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function $i(...s){const e=s.join(" ");e in al||(al[e]=!0,Ce(...s))}function vu(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Mu={[Aa]:Ra,[Ca]:Ia,[Pa]:Da,[Ki]:La,[Ra]:Aa,[Ia]:Ca,[Da]:Pa,[La]:Ki};class yi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Dr=Math.PI/180,mo=180/Math.PI;function zn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Bt[s&255]+Bt[s>>8&255]+Bt[s>>16&255]+Bt[s>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]).toLowerCase()}function ke(s,e,t){return Math.max(e,Math.min(t,s))}function yu(s,e){return(s%e+e)%e}function Nr(s,e,t){return(1-t)*s+t*e}function Sn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function nt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}class le{static{le.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ni{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[a+0],f=r[a+1],g=r[a+2],y=r[a+3];if(u!==y||l!==d||c!==f||h!==g){let m=l*d+c*f+h*g+u*y;m<0&&(d=-d,f=-f,g=-g,y=-y,m=-m);let p=1-o;if(m<.9995){const S=Math.acos(m),b=Math.sin(S);p=Math.sin(p*S)/b,o=Math.sin(o*S)/b,l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+y*o}else{l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+y*o;const S=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=S,c*=S,h*=S,u*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-o*f,e[t+2]=c*g+h*f+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ke(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{static{C.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ol.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ol.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this.z=ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this.z=ke(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ur.copy(this).projectOnVector(e),this.sub(Ur)}reflect(e){return this.sub(Ur.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ur=new C,ol=new ni;class De{static{De.prototype.isMatrix3=!0}constructor(e,t,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],y=i[0],m=i[3],p=i[6],S=i[1],b=i[4],v=i[7],w=i[2],E=i[5],R=i[8];return r[0]=a*y+o*S+l*w,r[3]=a*m+o*b+l*E,r[6]=a*p+o*v+l*R,r[1]=c*y+h*S+u*w,r[4]=c*m+h*b+u*E,r[7]=c*p+h*v+u*R,r[2]=d*y+f*S+g*w,r[5]=d*m+f*b+g*E,r[8]=d*p+f*v+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return e[0]=u*y,e[1]=(i*c-h*n)*y,e[2]=(o*n-i*a)*y,e[3]=d*y,e[4]=(h*t-i*l)*y,e[5]=(i*r-o*t)*y,e[6]=f*y,e[7]=(n*l-c*t)*y,e[8]=(a*t-n*r)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return $i("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Fr.makeScale(e,t)),this}rotate(e){return $i("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Fr.makeRotation(-e)),this}translate(e,t){return $i("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Fr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Fr=new De,ll=new De().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cl=new De().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Su(){const s={enabled:!0,workingColorSpace:xr,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===je&&(i.r=kn(i.r),i.g=kn(i.g),i.b=kn(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===je&&(i.r=Yi(i.r),i.g=Yi(i.g),i.b=Yi(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Qn?_r:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return $i("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return $i("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[xr]:{primaries:e,whitePoint:n,transfer:_r,toXYZ:ll,fromXYZ:cl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Qt},outputColorSpaceConfig:{drawingBufferColorSpace:Qt}},[Qt]:{primaries:e,whitePoint:n,transfer:je,toXYZ:ll,fromXYZ:cl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Qt}}}),s}const Ge=Su();function kn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Yi(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ai;class bu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ai===void 0&&(Ai=vr("canvas")),Ai.width=e.width,Ai.height=e.height;const i=Ai.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ai}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=vr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=kn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(kn(t[n]/255)*255):t[n]=kn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Eu=0;class No{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Eu++}),this.uuid=zn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Or(i[a].image)):r.push(Or(i[a]))}else r=Or(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Or(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?bu.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}let wu=0;const Br=new C;class Vt extends yi{constructor(e=Vt.DEFAULT_IMAGE,t=Vt.DEFAULT_MAPPING,n=On,i=On,r=Ht,a=mi,o=fn,l=tn,c=Vt.DEFAULT_ANISOTROPY,h=Qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=zn(),this.name="",this.source=new No(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new De,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Br).x}get height(){return this.source.getSize(Br).y}get depth(){return this.source.getSize(Br).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Nc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Na:e.x=e.x-Math.floor(e.x);break;case On:e.x=e.x<0?0:1;break;case Ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Na:e.y=e.y-Math.floor(e.y);break;case On:e.y=e.y<0?0:1;break;case Ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=Nc;Vt.DEFAULT_ANISOTROPY=1;class ut{static{ut.prototype.isVector4=!0}constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,v=(f+1)/2,w=(p+1)/2,E=(h+d)/4,R=(u+y)/4,_=(g+m)/4;return b>v&&b>w?b<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(b),i=E/n,r=R/n):v>w?v<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(v),n=E/i,r=_/i):w<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(w),n=R/r,i=_/r),this.set(n,i,r,t),this}let S=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-y)/S,this.z=(d-h)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this.z=ke(this.z,e.z,t.z),this.w=ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this.z=ke(this.z,e,t),this.w=ke(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Tu extends yi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ht,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new Vt(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Ht,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new No(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wn extends Tu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Vc extends Vt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ut,this.minFilter=Ut,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Au extends Vt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ut,this.minFilter=Ut,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $e{static{$e.prototype.isMatrix4=!0}constructor(e,t,n,i,r,a,o,l,c,h,u,d,f,g,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,h,u,d,f,g,y,m)}set(e,t,n,i,r,a,o,l,c,h,u,d,f,g,y,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $e().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/Ri.setFromMatrixColumn(e,0).length(),r=1/Ri.setFromMatrixColumn(e,1).length(),a=1/Ri.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,g=o*h,y=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-y*c,t[9]=-o*l,t[2]=y-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,g=c*h,y=c*u;t[0]=d+y*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=y+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,g=c*h,y=c*u;t[0]=d-y*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=y-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,g=o*h,y=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+y,t[1]=l*u,t[5]=y*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,g=o*l,y=o*c;t[0]=l*h,t[4]=y-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-y*u}else if(e.order==="XZY"){const d=a*l,f=a*c,g=o*l,y=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+y,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=y*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ru,e,Cu)}lookAt(e,t,n){const i=this.elements;return Zt.subVectors(e,t),Zt.lengthSq()===0&&(Zt.z=1),Zt.normalize(),qn.crossVectors(n,Zt),qn.lengthSq()===0&&(Math.abs(n.z)===1?Zt.x+=1e-4:Zt.z+=1e-4,Zt.normalize(),qn.crossVectors(n,Zt)),qn.normalize(),Fs.crossVectors(Zt,qn),i[0]=qn.x,i[4]=Fs.x,i[8]=Zt.x,i[1]=qn.y,i[5]=Fs.y,i[9]=Zt.y,i[2]=qn.z,i[6]=Fs.z,i[10]=Zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],y=n[6],m=n[10],p=n[14],S=n[3],b=n[7],v=n[11],w=n[15],E=i[0],R=i[4],_=i[8],T=i[12],P=i[1],L=i[5],U=i[9],X=i[13],Z=i[2],O=i[6],q=i[10],H=i[14],J=i[3],j=i[7],ue=i[11],me=i[15];return r[0]=a*E+o*P+l*Z+c*J,r[4]=a*R+o*L+l*O+c*j,r[8]=a*_+o*U+l*q+c*ue,r[12]=a*T+o*X+l*H+c*me,r[1]=h*E+u*P+d*Z+f*J,r[5]=h*R+u*L+d*O+f*j,r[9]=h*_+u*U+d*q+f*ue,r[13]=h*T+u*X+d*H+f*me,r[2]=g*E+y*P+m*Z+p*J,r[6]=g*R+y*L+m*O+p*j,r[10]=g*_+y*U+m*q+p*ue,r[14]=g*T+y*X+m*H+p*me,r[3]=S*E+b*P+v*Z+w*J,r[7]=S*R+b*L+v*O+w*j,r[11]=S*_+b*U+v*q+w*ue,r[15]=S*T+b*X+v*H+w*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],y=e[7],m=e[11],p=e[15],S=l*f-c*d,b=o*f-c*u,v=o*d-l*u,w=a*f-c*h,E=a*d-l*h,R=a*u-o*h;return t*(y*S-m*b+p*v)-n*(g*S-m*w+p*E)+i*(g*b-y*w+p*R)-r*(g*v-y*E+m*R)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+i*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],y=e[13],m=e[14],p=e[15],S=t*o-n*a,b=t*l-i*a,v=t*c-r*a,w=n*l-i*o,E=n*c-r*o,R=i*c-r*l,_=h*y-u*g,T=h*m-d*g,P=h*p-f*g,L=u*m-d*y,U=u*p-f*y,X=d*p-f*m,Z=S*X-b*U+v*L+w*P-E*T+R*_;if(Z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/Z;return e[0]=(o*X-l*U+c*L)*O,e[1]=(i*U-n*X-r*L)*O,e[2]=(y*R-m*E+p*w)*O,e[3]=(d*E-u*R-f*w)*O,e[4]=(l*P-a*X-c*T)*O,e[5]=(t*X-i*P+r*T)*O,e[6]=(m*v-g*R-p*b)*O,e[7]=(h*R-d*v+f*b)*O,e[8]=(a*U-o*P+c*_)*O,e[9]=(n*P-t*U-r*_)*O,e[10]=(g*E-y*v+p*S)*O,e[11]=(u*v-h*E-f*S)*O,e[12]=(o*T-a*L-l*_)*O,e[13]=(t*L-n*T+i*_)*O,e[14]=(y*b-g*w-m*S)*O,e[15]=(h*w-u*b+d*S)*O,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,y=a*h,m=a*u,p=o*u,S=l*c,b=l*h,v=l*u,w=n.x,E=n.y,R=n.z;return i[0]=(1-(y+p))*w,i[1]=(f+v)*w,i[2]=(g-b)*w,i[3]=0,i[4]=(f-v)*E,i[5]=(1-(d+p))*E,i[6]=(m+S)*E,i[7]=0,i[8]=(g+b)*R,i[9]=(m-S)*R,i[10]=(1-(d+y))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Ri.set(i[0],i[1],i[2]).length();const o=Ri.set(i[4],i[5],i[6]).length(),l=Ri.set(i[8],i[9],i[10]).length();r<0&&(a=-a),on.copy(this);const c=1/a,h=1/o,u=1/l;return on.elements[0]*=c,on.elements[1]*=c,on.elements[2]*=c,on.elements[4]*=h,on.elements[5]*=h,on.elements[6]*=h,on.elements[8]*=u,on.elements[9]*=u,on.elements[10]*=u,t.setFromRotationMatrix(on),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,r,a,o=bn,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let g,y;if(l)g=r/(a-r),y=a*r/(a-r);else if(o===bn)g=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===Ts)g=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=bn,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let g,y;if(l)g=1/(a-r),y=a/(a-r);else if(o===bn)g=-2/(a-r),y=-(a+r)/(a-r);else if(o===Ts)g=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ri=new C,on=new $e,Ru=new C(0,0,0),Cu=new C(1,1,1),qn=new C,Fs=new C,Zt=new C,hl=new $e,ul=new ni;class ii{constructor(e=0,t=0,n=0,i=ii.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ke(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ke(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return hl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(hl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ul.setFromEuler(this),this.setFromQuaternion(ul,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ii.DEFAULT_ORDER="XYZ";class Uo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Pu=0;const dl=new C,Ci=new ni,Pn=new $e,Os=new C,rs=new C,Lu=new C,Iu=new ni,fl=new C(1,0,0),pl=new C(0,1,0),ml=new C(0,0,1),gl={type:"added"},Du={type:"removed"},Pi={type:"childadded",child:null},zr={type:"childremoved",child:null};class It extends yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pu++}),this.uuid=zn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=It.DEFAULT_UP.clone();const e=new C,t=new ii,n=new ni,i=new C(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new $e},normalMatrix:{value:new De}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=It.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Uo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ci.setFromAxisAngle(e,t),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(e,t){return Ci.setFromAxisAngle(e,t),this.quaternion.premultiply(Ci),this}rotateX(e){return this.rotateOnAxis(fl,e)}rotateY(e){return this.rotateOnAxis(pl,e)}rotateZ(e){return this.rotateOnAxis(ml,e)}translateOnAxis(e,t){return dl.copy(e).applyQuaternion(this.quaternion),this.position.add(dl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(fl,e)}translateY(e){return this.translateOnAxis(pl,e)}translateZ(e){return this.translateOnAxis(ml,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Pn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Os.copy(e):Os.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pn.lookAt(rs,Os,this.up):Pn.lookAt(Os,rs,this.up),this.quaternion.setFromRotationMatrix(Pn),i&&(Pn.extractRotation(i.matrixWorld),Ci.setFromRotationMatrix(Pn),this.quaternion.premultiply(Ci.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ve("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(gl),Pi.child=e,this.dispatchEvent(Pi),Pi.child=null):Ve("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Du),zr.child=e,this.dispatchEvent(zr),zr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Pn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Pn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Pn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(gl),Pi.child=e,this.dispatchEvent(Pi),Pi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,e,Lu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,Iu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}It.DEFAULT_UP=new C(0,1,0);It.DEFAULT_MATRIX_AUTO_UPDATE=!0;It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class At extends It{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Nu={type:"move"};class kr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new At,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new At,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new At,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const y of e.hand.values()){const m=t.getJointPose(y,n),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Nu)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new At;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Gc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},Bs={h:0,s:0,l:0};function Hr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class ze{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ge.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Ge.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ge.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Ge.workingColorSpace){if(e=yu(e,1),t=ke(t,0,1),n=ke(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Hr(a,r,e+1/3),this.g=Hr(a,r,e),this.b=Hr(a,r,e-1/3)}return Ge.colorSpaceToWorking(this,i),this}setStyle(e,t=Qt){function n(r){r!==void 0&&parseFloat(r)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Qt){const n=Gc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}copyLinearToSRGB(e){return this.r=Yi(e.r),this.g=Yi(e.g),this.b=Yi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Qt){return Ge.workingToColorSpace(zt.copy(this),e),Math.round(ke(zt.r*255,0,255))*65536+Math.round(ke(zt.g*255,0,255))*256+Math.round(ke(zt.b*255,0,255))}getHexString(e=Qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ge.workingColorSpace){Ge.workingToColorSpace(zt.copy(this),t);const n=zt.r,i=zt.g,r=zt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ge.workingColorSpace){return Ge.workingToColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=Qt){Ge.workingToColorSpace(zt.copy(this),e);const t=zt.r,n=zt.g,i=zt.b;return e!==Qt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL($n),this.setHSL($n.h+e,$n.s+t,$n.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL($n),e.getHSL(Bs);const n=Nr($n.h,Bs.h,t),i=Nr($n.s,Bs.s,t),r=Nr($n.l,Bs.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zt=new ze;ze.NAMES=Gc;class Fo{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ze(e),this.near=t,this.far=n}clone(){return new Fo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Wc extends It{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ii,this.environmentIntensity=1,this.environmentRotation=new ii,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const ln=new C,Ln=new C,Vr=new C,In=new C,Li=new C,Ii=new C,xl=new C,Gr=new C,Wr=new C,Xr=new C,qr=new ut,$r=new ut,Yr=new ut;class rn{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),ln.subVectors(e,t),i.cross(ln);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){ln.subVectors(i,t),Ln.subVectors(n,t),Vr.subVectors(e,t);const a=ln.dot(ln),o=ln.dot(Ln),l=ln.dot(Vr),c=Ln.dot(Ln),h=Ln.dot(Vr),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,In)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,In.x),l.addScaledVector(a,In.y),l.addScaledVector(o,In.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return qr.setScalar(0),$r.setScalar(0),Yr.setScalar(0),qr.fromBufferAttribute(e,t),$r.fromBufferAttribute(e,n),Yr.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(qr,r.x),a.addScaledVector($r,r.y),a.addScaledVector(Yr,r.z),a}static isFrontFacing(e,t,n,i){return ln.subVectors(n,t),Ln.subVectors(e,t),ln.cross(Ln).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ln.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),ln.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return rn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return rn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return rn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return rn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return rn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;Li.subVectors(i,n),Ii.subVectors(r,n),Gr.subVectors(e,n);const l=Li.dot(Gr),c=Ii.dot(Gr);if(l<=0&&c<=0)return t.copy(n);Wr.subVectors(e,i);const h=Li.dot(Wr),u=Ii.dot(Wr);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Li,a);Xr.subVectors(e,r);const f=Li.dot(Xr),g=Ii.dot(Xr);if(g>=0&&f<=g)return t.copy(r);const y=f*c-l*g;if(y<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ii,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return xl.subVectors(r,i),o=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(xl,o);const p=1/(m+y+d);return a=y*p,o=d*p,t.copy(n).addScaledVector(Li,a).addScaledVector(Ii,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Si{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,cn):cn.fromBufferAttribute(r,a),cn.applyMatrix4(e.matrixWorld),this.expandByPoint(cn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zs.copy(n.boundingBox)),zs.applyMatrix4(e.matrixWorld),this.union(zs)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,cn),cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(as),ks.subVectors(this.max,as),Di.subVectors(e.a,as),Ni.subVectors(e.b,as),Ui.subVectors(e.c,as),Yn.subVectors(Ni,Di),Zn.subVectors(Ui,Ni),ai.subVectors(Di,Ui);let t=[0,-Yn.z,Yn.y,0,-Zn.z,Zn.y,0,-ai.z,ai.y,Yn.z,0,-Yn.x,Zn.z,0,-Zn.x,ai.z,0,-ai.x,-Yn.y,Yn.x,0,-Zn.y,Zn.x,0,-ai.y,ai.x,0];return!Zr(t,Di,Ni,Ui,ks)||(t=[1,0,0,0,1,0,0,0,1],!Zr(t,Di,Ni,Ui,ks))?!1:(Hs.crossVectors(Yn,Zn),t=[Hs.x,Hs.y,Hs.z],Zr(t,Di,Ni,Ui,ks))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Dn=[new C,new C,new C,new C,new C,new C,new C,new C],cn=new C,zs=new Si,Di=new C,Ni=new C,Ui=new C,Yn=new C,Zn=new C,ai=new C,as=new C,ks=new C,Hs=new C,oi=new C;function Zr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){oi.fromArray(s,r);const o=i.x*Math.abs(oi.x)+i.y*Math.abs(oi.y)+i.z*Math.abs(oi.z),l=e.dot(oi),c=t.dot(oi),h=n.dot(oi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const bt=new C,Vs=new le;let Uu=0;class an extends yi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Uu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=po,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Vs.fromBufferAttribute(this,t),Vs.applyMatrix3(e),this.setXY(t,Vs.x,Vs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Sn(t,this.array)),t}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Sn(t,this.array)),t}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Sn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Sn(t,this.array)),t}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array),r=nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==po&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Xc extends an{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class qc extends an{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Je extends an{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Fu=new Si,os=new C,Kr=new C;class Is{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Fu.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;os.subVectors(e,this.center);const t=os.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(os,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Kr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(os.copy(e.center).add(Kr)),this.expandByPoint(os.copy(e.center).sub(Kr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Ou=0;const sn=new $e,Jr=new It,Fi=new C,Kt=new Si,ls=new Si,Lt=new C;class Ft extends yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ou++}),this.uuid=zn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(xu(e)?qc:Xc)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new De().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return sn.makeRotationFromQuaternion(e),this.applyMatrix4(sn),this}rotateX(e){return sn.makeRotationX(e),this.applyMatrix4(sn),this}rotateY(e){return sn.makeRotationY(e),this.applyMatrix4(sn),this}rotateZ(e){return sn.makeRotationZ(e),this.applyMatrix4(sn),this}translate(e,t,n){return sn.makeTranslation(e,t,n),this.applyMatrix4(sn),this}scale(e,t,n){return sn.makeScale(e,t,n),this.applyMatrix4(sn),this}lookAt(e){return Jr.lookAt(e),Jr.updateMatrix(),this.applyMatrix4(Jr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fi).negate(),this.translate(Fi.x,Fi.y,Fi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Je(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Si);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ve("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Kt.setFromBufferAttribute(r),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,Kt.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,Kt.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(Kt.min),this.boundingBox.expandByPoint(Kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ve('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Is);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ve("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){const n=this.boundingSphere.center;if(Kt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Lt.addVectors(Kt.min,ls.min),Kt.expandByPoint(Lt),Lt.addVectors(Kt.max,ls.max),Kt.expandByPoint(Lt)):(Kt.expandByPoint(ls.min),Kt.expandByPoint(ls.max))}Kt.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Lt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Lt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Lt.fromBufferAttribute(o,c),l&&(Fi.fromBufferAttribute(e,c),Lt.add(Fi)),i=Math.max(i,n.distanceToSquared(Lt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ve('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ve("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new an(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new C,l[_]=new C;const c=new C,h=new C,u=new C,d=new le,f=new le,g=new le,y=new C,m=new C;function p(_,T,P){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,T),u.fromBufferAttribute(n,P),d.fromBufferAttribute(r,_),f.fromBufferAttribute(r,T),g.fromBufferAttribute(r,P),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(L),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),o[_].add(y),o[T].add(y),o[P].add(y),l[_].add(m),l[T].add(m),l[P].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let _=0,T=S.length;_<T;++_){const P=S[_],L=P.start,U=P.count;for(let X=L,Z=L+U;X<Z;X+=3)p(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const b=new C,v=new C,w=new C,E=new C;function R(_){w.fromBufferAttribute(i,_),E.copy(w);const T=o[_];b.copy(T),b.sub(w.multiplyScalar(w.dot(T))).normalize(),v.crossVectors(E,T);const L=v.dot(l[_])<0?-1:1;a.setXYZW(_,b.x,b.y,b.z,L)}for(let _=0,T=S.length;_<T;++_){const P=S[_],L=P.start,U=P.count;for(let X=L,Z=L+U;X<Z;X+=3)R(e.getX(X+0)),R(e.getX(X+1)),R(e.getX(X+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new an(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new C,r=new C,a=new C,o=new C,l=new C,c=new C,h=new C,u=new C;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),y=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Lt.fromBufferAttribute(e,t),Lt.normalize(),e.setXYZ(t,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?f=l[y]*o.data.stride+o.offset:f=l[y]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new an(d,h,u)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ft,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Bu{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=po,this.updateRanges=[],this.version=0,this.uuid=zn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Gt=new C;class yr{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Sn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Sn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Sn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Sn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array),r=nt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Mr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new an(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new yr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Mr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let zu=0;class bi extends yi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=zn(),this.name="",this.type="Material",this.blending=qi,this.side=ti,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wa,this.blendDst=Ta,this.blendEquation=di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=Ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ti,this.stencilZFail=Ti,this.stencilZPass=Ti,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qi&&(n.blending=this.blending),this.side!==ti&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==wa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ta&&(n.blendDst=this.blendDst),this.blendEquation!==di&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ti&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ti&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ti&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ze().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new le().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new le().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class $c extends bi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Oi;const cs=new C,Bi=new C,zi=new C,ki=new le,hs=new le,Yc=new $e,Gs=new C,us=new C,Ws=new C,_l=new le,Qr=new le,vl=new le;class ku extends It{constructor(e=new $c){if(super(),this.isSprite=!0,this.type="Sprite",Oi===void 0){Oi=new Ft;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Bu(t,5);Oi.setIndex([0,1,2,0,2,3]),Oi.setAttribute("position",new yr(n,3,0,!1)),Oi.setAttribute("uv",new yr(n,2,3,!1))}this.geometry=Oi,this.material=e,this.center=new le(.5,.5),this.count=1}raycast(e,t){e.camera===null&&Ve('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Bi.setFromMatrixScale(this.matrixWorld),Yc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),zi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Bi.multiplyScalar(-zi.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;Xs(Gs.set(-.5,-.5,0),zi,a,Bi,i,r),Xs(us.set(.5,-.5,0),zi,a,Bi,i,r),Xs(Ws.set(.5,.5,0),zi,a,Bi,i,r),_l.set(0,0),Qr.set(1,0),vl.set(1,1);let o=e.ray.intersectTriangle(Gs,us,Ws,!1,cs);if(o===null&&(Xs(us.set(-.5,.5,0),zi,a,Bi,i,r),Qr.set(0,1),o=e.ray.intersectTriangle(Gs,Ws,us,!1,cs),o===null))return;const l=e.ray.origin.distanceTo(cs);l<e.near||l>e.far||t.push({distance:l,point:cs.clone(),uv:rn.getInterpolation(cs,Gs,us,Ws,_l,Qr,vl,new le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Xs(s,e,t,n,i,r){ki.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(hs.x=r*ki.x-i*ki.y,hs.y=i*ki.x+r*ki.y):hs.copy(ki),s.copy(e),s.x+=hs.x,s.y+=hs.y,s.applyMatrix4(Yc)}const Nn=new C,jr=new C,qs=new C,Kn=new C,ea=new C,$s=new C,ta=new C;class Zc{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Nn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Nn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Nn.copy(this.origin).addScaledVector(this.direction,t),Nn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){jr.copy(e).add(t).multiplyScalar(.5),qs.copy(t).sub(e).normalize(),Kn.copy(this.origin).sub(jr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(qs),o=Kn.dot(this.direction),l=-Kn.dot(qs),c=Kn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const y=1/h;u*=y,d*=y,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(jr).addScaledVector(qs,d),f}intersectSphere(e,t){Nn.subVectors(e.center,this.origin);const n=Nn.dot(this.direction),i=Nn.dot(Nn)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Nn)!==null}intersectTriangle(e,t,n,i,r){ea.subVectors(t,e),$s.subVectors(n,e),ta.crossVectors(ea,$s);let a=this.direction.dot(ta),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Kn.subVectors(this.origin,e);const l=o*this.direction.dot($s.crossVectors(Kn,$s));if(l<0)return null;const c=o*this.direction.dot(ea.cross(Kn));if(c<0||l+c>a)return null;const h=-o*Kn.dot(ta);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pn extends bi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.combine=Tc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ml=new $e,li=new Zc,Ys=new Is,yl=new C,Zs=new C,Ks=new C,Js=new C,na=new C,Qs=new C,Sl=new C,js=new C;class ct extends It{constructor(e=new Ft,t=new pn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){Qs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(na.fromBufferAttribute(u,e),a?Qs.addScaledVector(na,h):Qs.addScaledVector(na.sub(t),h))}t.add(Qs)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ys.copy(n.boundingSphere),Ys.applyMatrix4(r),li.copy(e.ray).recast(e.near),!(Ys.containsPoint(li.origin)===!1&&(li.intersectSphere(Ys,yl)===null||li.origin.distanceToSquared(yl)>(e.far-e.near)**2))&&(Ml.copy(r).invert(),li.copy(e.ray).applyMatrix4(Ml),!(n.boundingBox!==null&&li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,li)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=d.length;g<y;g++){const m=d[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),b=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let v=S,w=b;v<w;v+=3){const E=o.getX(v),R=o.getX(v+1),_=o.getX(v+2);i=er(this,p,e,n,c,h,u,E,R,_),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),y=Math.min(o.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){const S=o.getX(m),b=o.getX(m+1),v=o.getX(m+2);i=er(this,a,e,n,c,h,u,S,b,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,y=d.length;g<y;g++){const m=d[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),b=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=S,w=b;v<w;v+=3){const E=v,R=v+1,_=v+2;i=er(this,p,e,n,c,h,u,E,R,_),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),y=Math.min(l.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){const S=m,b=m+1,v=m+2;i=er(this,a,e,n,c,h,u,S,b,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function Hu(s,e,t,n,i,r,a,o){let l;if(e.side===$t?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===ti,o),l===null)return null;js.copy(o),js.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(js);return c<t.near||c>t.far?null:{distance:c,point:js.clone(),object:s}}function er(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,Zs),s.getVertexPosition(l,Ks),s.getVertexPosition(c,Js);const h=Hu(s,e,t,n,Zs,Ks,Js,Sl);if(h){const u=new C;rn.getBarycoord(Sl,Zs,Ks,Js,u),i&&(h.uv=rn.getInterpolatedAttribute(i,o,l,c,u,new le)),r&&(h.uv1=rn.getInterpolatedAttribute(r,o,l,c,u,new le)),a&&(h.normal=rn.getInterpolatedAttribute(a,o,l,c,u,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new C,materialIndex:0};rn.getNormal(Zs,Ks,Js,d.normal),h.face=d,h.barycoord=u}return h}class Kc extends Vt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Ut,h=Ut,u,d){super(null,a,o,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class bl extends an{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Hi=new $e,El=new $e,tr=[],wl=new Si,Vu=new $e,ds=new ct,fs=new Is;class Gu extends ct{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new bl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Vu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Si),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hi),wl.copy(e.boundingBox).applyMatrix4(Hi),this.boundingBox.union(wl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Is),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hi),fs.copy(e.boundingSphere).applyMatrix4(Hi),this.boundingSphere.union(fs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(ds.geometry=this.geometry,ds.material=this.material,ds.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fs.copy(this.boundingSphere),fs.applyMatrix4(n),e.ray.intersectsSphere(fs)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Hi),El.multiplyMatrices(n,Hi),ds.matrixWorld=El,ds.raycast(e,tr);for(let a=0,o=tr.length;a<o;a++){const l=tr[a];l.instanceId=r,l.object=this,t.push(l)}tr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new bl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Kc(new Float32Array(i*this.count),i,this.count,Ro,dn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ia=new C,Wu=new C,Xu=new De;class ui{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=ia.subVectors(n,t).cross(Wu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(ia),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Xu.getNormalMatrix(e),i=this.coplanarPoint(ia).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new Is,qu=new le(.5,.5),nr=new C;class Oo{constructor(e=new ui,t=new ui,n=new ui,i=new ui,r=new ui,a=new ui){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=bn,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],y=r[9],m=r[10],p=r[11],S=r[12],b=r[13],v=r[14],w=r[15];if(i[0].setComponents(c-a,f-h,p-g,w-S).normalize(),i[1].setComponents(c+a,f+h,p+g,w+S).normalize(),i[2].setComponents(c+o,f+u,p+y,w+b).normalize(),i[3].setComponents(c-o,f-u,p-y,w-b).normalize(),n)i[4].setComponents(l,d,m,v).normalize(),i[5].setComponents(c-l,f-d,p-m,w-v).normalize();else if(i[4].setComponents(c-l,f-d,p-m,w-v).normalize(),t===bn)i[5].setComponents(c+l,f+d,p+m,w+v).normalize();else if(t===Ts)i[5].setComponents(l,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(e){ci.center.set(0,0,0);const t=qu.distanceTo(e.center);return ci.radius=.7071067811865476+t,ci.applyMatrix4(e.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(nr.x=i.normal.x>0?e.max.x:e.min.x,nr.y=i.normal.y>0?e.max.y:e.min.y,nr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(nr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Jc extends Vt{constructor(e=[],t=xi,n,i,r,a,o,l,c,h){super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $u extends Vt{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Qi extends Vt{constructor(e,t,n=An,i,r,a,o=Ut,l=Ut,c,h=Vn,u=1){if(h!==Vn&&h!==gi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new No(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Yu extends Qi{constructor(e,t=An,n=xi,i,r,a=Ut,o=Ut,l,c=Vn){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Qc extends Vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class qe extends Ft{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Je(c,3)),this.setAttribute("normal",new Je(h,3)),this.setAttribute("uv",new Je(u,2));function g(y,m,p,S,b,v,w,E,R,_,T){const P=v/R,L=w/_,U=v/2,X=w/2,Z=E/2,O=R+1,q=_+1;let H=0,J=0;const j=new C;for(let ue=0;ue<q;ue++){const me=ue*L-X;for(let ve=0;ve<O;ve++){const Ye=ve*P-U;j[y]=Ye*S,j[m]=me*b,j[p]=Z,c.push(j.x,j.y,j.z),j[y]=0,j[m]=0,j[p]=E>0?1:-1,h.push(j.x,j.y,j.z),u.push(ve/R),u.push(1-ue/_),H+=1}}for(let ue=0;ue<_;ue++)for(let me=0;me<R;me++){const ve=d+me+O*ue,Ye=d+me+O*(ue+1),ft=d+(me+1)+O*(ue+1),Ze=d+(me+1)+O*ue;l.push(ve,Ye,Ze),l.push(Ye,ft,Ze),J+=6}o.addGroup(f,J,T),f+=J,d+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qe(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class ji extends Ft{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new C,h=new le;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*i;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Je(a,3)),this.setAttribute("normal",new Je(o,3)),this.setAttribute("uv",new Je(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ji(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class kt extends Ft{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const y=[],m=n/2;let p=0;S(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new Je(u,3)),this.setAttribute("normal",new Je(d,3)),this.setAttribute("uv",new Je(f,2));function S(){const v=new C,w=new C;let E=0;const R=(t-e)/n;for(let _=0;_<=r;_++){const T=[],P=_/r,L=P*(t-e)+e;for(let U=0;U<=i;U++){const X=U/i,Z=X*l+o,O=Math.sin(Z),q=Math.cos(Z);w.x=L*O,w.y=-P*n+m,w.z=L*q,u.push(w.x,w.y,w.z),v.set(O,R,q).normalize(),d.push(v.x,v.y,v.z),f.push(X,1-P),T.push(g++)}y.push(T)}for(let _=0;_<i;_++)for(let T=0;T<r;T++){const P=y[T][_],L=y[T+1][_],U=y[T+1][_+1],X=y[T][_+1];(e>0||T!==0)&&(h.push(P,L,X),E+=3),(t>0||T!==r-1)&&(h.push(L,U,X),E+=3)}c.addGroup(p,E,0),p+=E}function b(v){const w=g,E=new le,R=new C;let _=0;const T=v===!0?e:t,P=v===!0?1:-1;for(let U=1;U<=i;U++)u.push(0,m*P,0),d.push(0,P,0),f.push(.5,.5),g++;const L=g;for(let U=0;U<=i;U++){const Z=U/i*l+o,O=Math.cos(Z),q=Math.sin(Z);R.x=T*q,R.y=m*P,R.z=T*O,u.push(R.x,R.y,R.z),d.push(0,P,0),E.x=O*.5+.5,E.y=q*.5*P+.5,f.push(E.x,E.y),g++}for(let U=0;U<i;U++){const X=w+U,Z=L+U;v===!0?h.push(Z,Z+1,X):h.push(Z+1,Z,X),_+=3}c.addGroup(p,_,v===!0?1:2),p+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class un extends kt{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new un(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class is extends Ft{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new Je(r,3)),this.setAttribute("normal",new Je(r.slice(),3)),this.setAttribute("uv",new Je(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const b=new C,v=new C,w=new C;for(let E=0;E<t.length;E+=3)f(t[E+0],b),f(t[E+1],v),f(t[E+2],w),l(b,v,w,S)}function l(S,b,v,w){const E=w+1,R=[];for(let _=0;_<=E;_++){R[_]=[];const T=S.clone().lerp(v,_/E),P=b.clone().lerp(v,_/E),L=E-_;for(let U=0;U<=L;U++)U===0&&_===E?R[_][U]=T:R[_][U]=T.clone().lerp(P,U/L)}for(let _=0;_<E;_++)for(let T=0;T<2*(E-_)-1;T++){const P=Math.floor(T/2);T%2===0?(d(R[_][P+1]),d(R[_+1][P]),d(R[_][P])):(d(R[_][P+1]),d(R[_+1][P+1]),d(R[_+1][P]))}}function c(S){const b=new C;for(let v=0;v<r.length;v+=3)b.x=r[v+0],b.y=r[v+1],b.z=r[v+2],b.normalize().multiplyScalar(S),r[v+0]=b.x,r[v+1]=b.y,r[v+2]=b.z}function h(){const S=new C;for(let b=0;b<r.length;b+=3){S.x=r[b+0],S.y=r[b+1],S.z=r[b+2];const v=m(S)/2/Math.PI+.5,w=p(S)/Math.PI+.5;a.push(v,1-w)}g(),u()}function u(){for(let S=0;S<a.length;S+=6){const b=a[S+0],v=a[S+2],w=a[S+4],E=Math.max(b,v,w),R=Math.min(b,v,w);E>.9&&R<.1&&(b<.2&&(a[S+0]+=1),v<.2&&(a[S+2]+=1),w<.2&&(a[S+4]+=1))}}function d(S){r.push(S.x,S.y,S.z)}function f(S,b){const v=S*3;b.x=e[v+0],b.y=e[v+1],b.z=e[v+2]}function g(){const S=new C,b=new C,v=new C,w=new C,E=new le,R=new le,_=new le;for(let T=0,P=0;T<r.length;T+=9,P+=6){S.set(r[T+0],r[T+1],r[T+2]),b.set(r[T+3],r[T+4],r[T+5]),v.set(r[T+6],r[T+7],r[T+8]),E.set(a[P+0],a[P+1]),R.set(a[P+2],a[P+3]),_.set(a[P+4],a[P+5]),w.copy(S).add(b).add(v).divideScalar(3);const L=m(w);y(E,P+0,S,L),y(R,P+2,b,L),y(_,P+4,v,L)}}function y(S,b,v,w){w<0&&S.x===1&&(a[b]=S.x-1),v.x===0&&v.z===0&&(a[b]=w/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function p(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new is(e.vertices,e.indices,e.radius,e.detail)}}class jn extends is{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new jn(e.radius,e.detail)}}class Cn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ce("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new le:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new C,i=[],r=[],a=[],o=new C,l=new $e;for(let f=0;f<=e;f++){const g=f/e;i[f]=this.getTangentAt(g,new C)}r[0]=new C,a[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ke(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(ke(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Bo extends Cn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new le){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Zu extends Bo{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function zo(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const Tl=new C,Al=new C,sa=new zo,ra=new zo,aa=new zo;class Ku extends Cn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new C){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(Al.subVectors(i[0],i[1]).add(i[0]),c=Al);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(Tl.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Tl),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),y=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),sa.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,y,m),ra.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,y,m),aa.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(sa.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),ra.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),aa.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(sa.calc(l),ra.calc(l),aa.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new C().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Rl(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,l=s*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*s+t}function Ju(s,e){const t=1-s;return t*t*e}function Qu(s,e){return 2*(1-s)*s*e}function ju(s,e){return s*s*e}function ys(s,e,t,n){return Ju(s,e)+Qu(s,t)+ju(s,n)}function ed(s,e){const t=1-s;return t*t*t*e}function td(s,e){const t=1-s;return 3*t*t*s*e}function nd(s,e){return 3*(1-s)*s*s*e}function id(s,e){return s*s*s*e}function Ss(s,e,t,n,i){return ed(s,e)+td(s,t)+nd(s,n)+id(s,i)}class jc extends Cn{constructor(e=new le,t=new le,n=new le,i=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new le){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ss(e,i.x,r.x,a.x,o.x),Ss(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class sd extends Cn{constructor(e=new C,t=new C,n=new C,i=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new C){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ss(e,i.x,r.x,a.x,o.x),Ss(e,i.y,r.y,a.y,o.y),Ss(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class eh extends Cn{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class rd extends Cn{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class th extends Cn{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(ys(e,i.x,r.x,a.x),ys(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ad extends Cn{constructor(e=new C,t=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new C){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(ys(e,i.x,r.x,a.x),ys(e,i.y,r.y,a.y),ys(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class nh extends Cn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Rl(o,l.x,c.x,h.x,u.x),Rl(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new le().fromArray(i))}return this}}var Cl=Object.freeze({__proto__:null,ArcCurve:Zu,CatmullRomCurve3:Ku,CubicBezierCurve:jc,CubicBezierCurve3:sd,EllipseCurve:Bo,LineCurve:eh,LineCurve3:rd,QuadraticBezierCurve:th,QuadraticBezierCurve3:ad,SplineCurve:nh});class od extends Cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Cl[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Cl[i.type]().fromJSON(i))}return this}}class Pl extends od{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new eh(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new th(this.currentPoint.clone(),new le(e,t),new le(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new jc(this.currentPoint.clone(),new le(e,t),new le(n,i),new le(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new nh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,a,o,l),this}absellipse(e,t,n,i,r,a,o,l){const c=new Bo(e,t,n,i,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class ih extends Pl{constructor(e){super(e),this.uuid=zn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new Pl().fromJSON(i))}return this}}function ld(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=sh(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=fd(s,e,r,t)),s.length>80*t){o=s[0],l=s[1];let h=o,u=l;for(let d=t;d<i;d+=t){const f=s[d],g=s[d+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return As(r,a,t,o,l,c,0),a}function sh(s,e,t,n,i){let r;if(i===Ed(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=Ll(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Ll(a/n|0,s[a],s[a+1],r);return r&&es(r,r.next)&&(Cs(r),r=r.next),r}function vi(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(es(t,t.next)||dt(t.prev,t,t.next)===0)){if(Cs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function As(s,e,t,n,i,r,a){if(!s)return;!a&&r&&_d(s,n,i,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?hd(s,n,i,r):cd(s)){e.push(l.i,s.i,c.i),Cs(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=ud(vi(s),e),As(s,e,t,n,i,r,2)):a===2&&dd(s,e,t,n,i,r):As(vi(s),e,t,n,i,r,1);break}}}function cd(s){const e=s.prev,t=s,n=s.next;if(dt(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(i,r,a),u=Math.min(o,l,c),d=Math.max(i,r,a),f=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&vs(i,o,r,l,a,c,g.x,g.y)&&dt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function hd(s,e,t,n){const i=s.prev,r=s,a=s.next;if(dt(i,r,a)>=0)return!1;const o=i.x,l=r.x,c=a.x,h=i.y,u=r.y,d=a.y,f=Math.min(o,l,c),g=Math.min(h,u,d),y=Math.max(o,l,c),m=Math.max(h,u,d),p=go(f,g,e,t,n),S=go(y,m,e,t,n);let b=s.prevZ,v=s.nextZ;for(;b&&b.z>=p&&v&&v.z<=S;){if(b.x>=f&&b.x<=y&&b.y>=g&&b.y<=m&&b!==i&&b!==a&&vs(o,h,l,u,c,d,b.x,b.y)&&dt(b.prev,b,b.next)>=0||(b=b.prevZ,v.x>=f&&v.x<=y&&v.y>=g&&v.y<=m&&v!==i&&v!==a&&vs(o,h,l,u,c,d,v.x,v.y)&&dt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;b&&b.z>=p;){if(b.x>=f&&b.x<=y&&b.y>=g&&b.y<=m&&b!==i&&b!==a&&vs(o,h,l,u,c,d,b.x,b.y)&&dt(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;v&&v.z<=S;){if(v.x>=f&&v.x<=y&&v.y>=g&&v.y<=m&&v!==i&&v!==a&&vs(o,h,l,u,c,d,v.x,v.y)&&dt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function ud(s,e){let t=s;do{const n=t.prev,i=t.next.next;!es(n,i)&&ah(n,t,t.next,i)&&Rs(n,i)&&Rs(i,n)&&(e.push(n.i,t.i,i.i),Cs(t),Cs(t.next),t=s=i),t=t.next}while(t!==s);return vi(t)}function dd(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&yd(a,o)){let l=oh(a,o);a=vi(a,a.next),l=vi(l,l.next),As(a,e,t,n,i,r,0),As(l,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function fd(s,e,t,n){const i=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:s.length,c=sh(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Md(c))}i.sort(pd);for(let r=0;r<i.length;r++)t=md(i[r],t);return t}function pd(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function md(s,e){const t=gd(s,e);if(!t)return e;const n=oh(t,s);return vi(n,n.next),vi(t,t.next)}function gd(s,e){let t=e;const n=s.x,i=s.y;let r=-1/0,a;if(es(s,t))return t;do{if(es(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&rh(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){const u=Math.abs(i-t.y)/(n-t.x);Rs(t,s)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&xd(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function xd(s,e){return dt(s.prev,s,e.prev)<0&&dt(e.next,s,s.next)<0}function _d(s,e,t,n){let i=s;do i.z===0&&(i.z=go(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,vd(i)}function vd(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function go(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function Md(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function rh(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function vs(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&rh(s,e,t,n,i,r,a,o)}function yd(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!Sd(s,e)&&(Rs(s,e)&&Rs(e,s)&&bd(s,e)&&(dt(s.prev,s,e.prev)||dt(s,e.prev,e))||es(s,e)&&dt(s.prev,s,s.next)>0&&dt(e.prev,e,e.next)>0)}function dt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function es(s,e){return s.x===e.x&&s.y===e.y}function ah(s,e,t,n){const i=sr(dt(s,e,t)),r=sr(dt(s,e,n)),a=sr(dt(t,n,s)),o=sr(dt(t,n,e));return!!(i!==r&&a!==o||i===0&&ir(s,t,e)||r===0&&ir(s,n,e)||a===0&&ir(t,s,n)||o===0&&ir(t,e,n))}function ir(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function sr(s){return s>0?1:s<0?-1:0}function Sd(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&ah(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Rs(s,e){return dt(s.prev,s,s.next)<0?dt(s,e,s.next)>=0&&dt(s,s.prev,e)>=0:dt(s,e,s.prev)<0||dt(s,s.next,e)<0}function bd(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function oh(s,e){const t=xo(s.i,s.x,s.y),n=xo(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Ll(s,e,t,n){const i=xo(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Cs(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function xo(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ed(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class wd{static triangulate(e,t,n=2){return ld(e,t,n)}}class bs{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return bs.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Il(e),Dl(n,e);let a=e.length;t.forEach(Il);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Dl(n,t[l]);const o=wd.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Il(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Dl(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Tn extends is{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Tn(e.radius,e.detail)}}class si extends is{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new si(e.radius,e.detail)}}class Mi extends Ft{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,f=[],g=[],y=[],m=[];for(let p=0;p<h;p++){const S=p*d-a;for(let b=0;b<c;b++){const v=b*u-r;g.push(v,-S,0),y.push(0,0,1),m.push(b/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<o;S++){const b=S+c*p,v=S+c*(p+1),w=S+1+c*(p+1),E=S+1+c*p;f.push(b,v,E),f.push(v,w,E)}this.setIndex(f),this.setAttribute("position",new Je(g,3)),this.setAttribute("normal",new Je(y,3)),this.setAttribute("uv",new Je(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mi(e.width,e.height,e.widthSegments,e.heightSegments)}}class ko extends Ft{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],h=[];let u=e;const d=(t-e)/i,f=new C,g=new le;for(let y=0;y<=i;y++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let y=0;y<i;y++){const m=y*(n+1);for(let p=0;p<n;p++){const S=p+m,b=S,v=S+n+1,w=S+n+2,E=S+1;o.push(b,v,E),o.push(v,w,E)}}this.setIndex(o),this.setAttribute("position",new Je(l,3)),this.setAttribute("normal",new Je(c,3)),this.setAttribute("uv",new Je(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ko(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Ho extends Ft{constructor(e=new ih([new le(0,.5),new le(-.5,-.5),new le(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Je(i,3)),this.setAttribute("normal",new Je(r,3)),this.setAttribute("uv",new Je(a,2));function c(h){const u=i.length/3,d=h.extractPoints(t);let f=d.shape;const g=d.holes;bs.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const S=g[m];bs.isClockWise(S)===!0&&(g[m]=S.reverse())}const y=bs.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const S=g[m];f=f.concat(S)}for(let m=0,p=f.length;m<p;m++){const S=f[m];i.push(S.x,S.y,0),r.push(0,0,1),a.push(S.x,S.y)}for(let m=0,p=y.length;m<p;m++){const S=y[m],b=S[0]+u,v=S[1]+u,w=S[2]+u;n.push(b,v,w),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Td(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const a=t[e.shapes[i]];n.push(a)}return new Ho(n,e.curveSegments)}}function Td(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class Ps extends Ft{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new C,d=new C,f=[],g=[],y=[],m=[];for(let p=0;p<=n;p++){const S=[],b=p/n,v=a+b*o,w=e*Math.cos(v),E=Math.sqrt(e*e-w*w);let R=0;p===0&&a===0?R=.5/t:p===n&&l===Math.PI&&(R=-.5/t);for(let _=0;_<=t;_++){const T=_/t,P=i+T*r;u.x=-E*Math.cos(P),u.y=w,u.z=E*Math.sin(P),g.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),m.push(T+R,1-b),S.push(c++)}h.push(S)}for(let p=0;p<n;p++)for(let S=0;S<t;S++){const b=h[p][S+1],v=h[p][S],w=h[p+1][S],E=h[p+1][S+1];(p!==0||a>0)&&f.push(b,v,E),(p!==n-1||l<Math.PI)&&f.push(v,w,E)}this.setIndex(f),this.setAttribute("position",new Je(g,3)),this.setAttribute("normal",new Je(y,3)),this.setAttribute("uv",new Je(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ps(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Vo extends is{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Vo(e.radius,e.detail)}}class wr extends Ft{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],u=[],d=new C,f=new C,g=new C;for(let y=0;y<=n;y++){const m=a+y/n*o;for(let p=0;p<=i;p++){const S=p/i*r;f.x=(e+t*Math.cos(m))*Math.cos(S),f.y=(e+t*Math.cos(m))*Math.sin(S),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(S),d.y=e*Math.sin(S),g.subVectors(f,d).normalize(),h.push(g.x,g.y,g.z),u.push(p/i),u.push(y/n)}}for(let y=1;y<=n;y++)for(let m=1;m<=i;m++){const p=(i+1)*y+m-1,S=(i+1)*(y-1)+m-1,b=(i+1)*(y-1)+m,v=(i+1)*y+m;l.push(p,S,v),l.push(S,b,v)}this.setIndex(l),this.setAttribute("position",new Je(c,3)),this.setAttribute("normal",new Je(h,3)),this.setAttribute("uv",new Je(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wr(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ad extends bi{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new ze(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}function ts(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];if(Nl(i))i.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Nl(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Wt(s){const e={};for(let t=0;t<s.length;t++){const n=ts(s[t]);for(const i in n)e[i]=n[i]}return e}function Nl(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Rd(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function lh(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ge.workingColorSpace}const Cd={clone:ts,merge:Wt};var Pd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ld=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Rn extends bi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pd,this.fragmentShader=Ld,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ts(e.uniforms),this.uniformsGroups=Rd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new ze().setHex(i.value);break;case"v2":this.uniforms[n].value=new le().fromArray(i.value);break;case"v3":this.uniforms[n].value=new C().fromArray(i.value);break;case"v4":this.uniforms[n].value=new ut().fromArray(i.value);break;case"m3":this.uniforms[n].value=new De().fromArray(i.value);break;case"m4":this.uniforms[n].value=new $e().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Id extends Rn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Dd extends bi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fo,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Nd extends bi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=cu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ud extends bi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ch extends It{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class hh extends ch{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const oa=new $e,Ul=new C,Fl=new C;class Fd{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.mapType=tn,this.map=null,this.mapPass=null,this.matrix=new $e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Oo,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Ul.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ul),Fl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Fl),t.updateMatrixWorld(),oa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(oa,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Ts||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(oa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const rr=new C,ar=new ni,_n=new C;class uh extends It{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(rr,ar,_n),_n.x===1&&_n.y===1&&_n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(rr,ar,_n.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(rr,ar,_n),_n.x===1&&_n.y===1&&_n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(rr,ar,_n.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Jn=new C,Ol=new le,Bl=new le;class jt extends uh{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=mo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Dr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return mo*2*Math.atan(Math.tan(Dr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z)}getViewSize(e,t){return this.getViewBounds(e,Ol,Bl),t.subVectors(Bl,Ol)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Dr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Go extends uh{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Od extends Fd{constructor(){super(new Go(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Bd extends ch{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.shadow=new Od}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const Vi=-90,Gi=1;class zd extends It{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new jt(Vi,Gi,e,t);i.layers=this.layers,this.add(i);const r=new jt(Vi,Gi,e,t);r.layers=this.layers,this.add(r);const a=new jt(Vi,Gi,e,t);a.layers=this.layers,this.add(a);const o=new jt(Vi,Gi,e,t);o.layers=this.layers,this.add(o);const l=new jt(Vi,Gi,e,t);l.layers=this.layers,this.add(l);const c=new jt(Vi,Gi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===bn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ts)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class kd extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const zl=new $e;class dh{constructor(e,t,n=0,i=1/0){this.ray=new Zc(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Uo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ve("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return zl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zl),this}intersectObject(e,t=!0,n=[]){return _o(e,this,n,t),n.sort(kl),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)_o(e[i],this,n,t);return n.sort(kl),n}}function kl(s,e){return s.distance-e.distance}function _o(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)_o(r[a],e,t,!0)}}class Hd{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ce("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class fh{static{fh.prototype.isMatrix2=!0}constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}}function Hl(s,e,t,n){const i=Vd(n);switch(t){case zc:return s*e;case Ro:return s*e/i.components*i.byteLength;case Co:return s*e/i.components*i.byteLength;case _i:return s*e*2/i.components*i.byteLength;case Po:return s*e*2/i.components*i.byteLength;case kc:return s*e*3/i.components*i.byteLength;case fn:return s*e*4/i.components*i.byteLength;case Lo:return s*e*4/i.components*i.byteLength;case hr:case ur:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case dr:case fr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Oa:case za:return Math.max(s,16)*Math.max(e,8)/4;case Fa:case Ba:return Math.max(s,8)*Math.max(e,8)/2;case ka:case Ha:case Ga:case Wa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Va:case mr:case Xa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case qa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case $a:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Ya:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Za:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Ja:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Qa:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case ja:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case eo:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case to:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case no:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case io:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case so:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case ro:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case ao:case oo:case lo:return Math.ceil(s/4)*Math.ceil(e/4)*16;case co:case ho:return Math.ceil(s/4)*Math.ceil(e/4)*8;case gr:case uo:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Vd(s){switch(s){case tn:case Uc:return{byteLength:1,components:1};case Es:case Fc:case Hn:return{byteLength:2,components:1};case To:case Ao:return{byteLength:2,components:4};case An:case wo:case dn:return{byteLength:4,components:1};case Oc:case Bc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Eo}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Eo);function ph(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Gd(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],y=u[f];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++d,u[d]=y)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const y=u[f];s.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var Wd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$d=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Kd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Jd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,jd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ef=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,sf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,rf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,af=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,of=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,uf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,df=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ff=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,pf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,mf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,xf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_f=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Sf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Ef=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,wf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Tf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Af=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Pf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Lf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,If=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Df=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Nf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Uf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ff=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Of=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Bf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$f=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Yf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ep=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,np=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ip=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ap=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,op=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,lp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,pp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_p=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Mp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,yp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ep=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ap=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Rp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Pp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Lp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ip=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Dp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Np=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Up=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Op=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,kp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Qp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,jp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,em=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,nm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,im=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,am=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,om=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,um=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,dm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_m=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Mm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ym=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Em=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Oe={alphahash_fragment:Wd,alphahash_pars_fragment:Xd,alphamap_fragment:qd,alphamap_pars_fragment:$d,alphatest_fragment:Yd,alphatest_pars_fragment:Zd,aomap_fragment:Kd,aomap_pars_fragment:Jd,batching_pars_vertex:Qd,batching_vertex:jd,begin_vertex:ef,beginnormal_vertex:tf,bsdfs:nf,iridescence_fragment:sf,bumpmap_pars_fragment:rf,clipping_planes_fragment:af,clipping_planes_pars_fragment:of,clipping_planes_pars_vertex:lf,clipping_planes_vertex:cf,color_fragment:hf,color_pars_fragment:uf,color_pars_vertex:df,color_vertex:ff,common:pf,cube_uv_reflection_fragment:mf,defaultnormal_vertex:gf,displacementmap_pars_vertex:xf,displacementmap_vertex:_f,emissivemap_fragment:vf,emissivemap_pars_fragment:Mf,colorspace_fragment:yf,colorspace_pars_fragment:Sf,envmap_fragment:bf,envmap_common_pars_fragment:Ef,envmap_pars_fragment:wf,envmap_pars_vertex:Tf,envmap_physical_pars_fragment:Of,envmap_vertex:Af,fog_vertex:Rf,fog_pars_vertex:Cf,fog_fragment:Pf,fog_pars_fragment:Lf,gradientmap_pars_fragment:If,lightmap_pars_fragment:Df,lights_lambert_fragment:Nf,lights_lambert_pars_fragment:Uf,lights_pars_begin:Ff,lights_toon_fragment:Bf,lights_toon_pars_fragment:zf,lights_phong_fragment:kf,lights_phong_pars_fragment:Hf,lights_physical_fragment:Vf,lights_physical_pars_fragment:Gf,lights_fragment_begin:Wf,lights_fragment_maps:Xf,lights_fragment_end:qf,lightprobes_pars_fragment:$f,logdepthbuf_fragment:Yf,logdepthbuf_pars_fragment:Zf,logdepthbuf_pars_vertex:Kf,logdepthbuf_vertex:Jf,map_fragment:Qf,map_pars_fragment:jf,map_particle_fragment:ep,map_particle_pars_fragment:tp,metalnessmap_fragment:np,metalnessmap_pars_fragment:ip,morphinstance_vertex:sp,morphcolor_vertex:rp,morphnormal_vertex:ap,morphtarget_pars_vertex:op,morphtarget_vertex:lp,normal_fragment_begin:cp,normal_fragment_maps:hp,normal_pars_fragment:up,normal_pars_vertex:dp,normal_vertex:fp,normalmap_pars_fragment:pp,clearcoat_normal_fragment_begin:mp,clearcoat_normal_fragment_maps:gp,clearcoat_pars_fragment:xp,iridescence_pars_fragment:_p,opaque_fragment:vp,packing:Mp,premultiplied_alpha_fragment:yp,project_vertex:Sp,dithering_fragment:bp,dithering_pars_fragment:Ep,roughnessmap_fragment:wp,roughnessmap_pars_fragment:Tp,shadowmap_pars_fragment:Ap,shadowmap_pars_vertex:Rp,shadowmap_vertex:Cp,shadowmask_pars_fragment:Pp,skinbase_vertex:Lp,skinning_pars_vertex:Ip,skinning_vertex:Dp,skinnormal_vertex:Np,specularmap_fragment:Up,specularmap_pars_fragment:Fp,tonemapping_fragment:Op,tonemapping_pars_fragment:Bp,transmission_fragment:zp,transmission_pars_fragment:kp,uv_pars_fragment:Hp,uv_pars_vertex:Vp,uv_vertex:Gp,worldpos_vertex:Wp,background_vert:Xp,background_frag:qp,backgroundCube_vert:$p,backgroundCube_frag:Yp,cube_vert:Zp,cube_frag:Kp,depth_vert:Jp,depth_frag:Qp,distance_vert:jp,distance_frag:em,equirect_vert:tm,equirect_frag:nm,linedashed_vert:im,linedashed_frag:sm,meshbasic_vert:rm,meshbasic_frag:am,meshlambert_vert:om,meshlambert_frag:lm,meshmatcap_vert:cm,meshmatcap_frag:hm,meshnormal_vert:um,meshnormal_frag:dm,meshphong_vert:fm,meshphong_frag:pm,meshphysical_vert:mm,meshphysical_frag:gm,meshtoon_vert:xm,meshtoon_frag:_m,points_vert:vm,points_frag:Mm,shadow_vert:ym,shadow_frag:Sm,sprite_vert:bm,sprite_frag:Em},he={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new De}},envmap:{envMap:{value:null},envMapRotation:{value:new De},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new De}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new De}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new De},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new De},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new De},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new De}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new De}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new De}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0},uvTransform:{value:new De}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}}},Mn={basic:{uniforms:Wt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Wt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new ze(0)},envMapIntensity:{value:1}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Wt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Wt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Wt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new ze(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Wt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Wt([he.points,he.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Wt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Wt([he.common,he.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Wt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Wt([he.sprite,he.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new De},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new De}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distance:{uniforms:Wt([he.common,he.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distance_vert,fragmentShader:Oe.distance_frag},shadow:{uniforms:Wt([he.lights,he.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};Mn.physical={uniforms:Wt([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new De},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new De},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new De},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new De},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new De},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new De},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new De},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new De},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new De},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new De},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new De},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new De}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const or={r:0,b:0,g:0},wm=new $e,mh=new De;mh.set(-1,0,0,0,1,0,0,0,1);function Tm(s,e,t,n,i,r){const a=new ze(0);let o=i===!0?0:1,l,c,h=null,u=0,d=null;function f(S){let b=S.isScene===!0?S.background:null;if(b&&b.isTexture){const v=S.backgroundBlurriness>0;b=e.get(b,v)}return b}function g(S){let b=!1;const v=f(S);v===null?m(a,o):v&&v.isColor&&(m(v,1),b=!0);const w=s.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function y(S,b){const v=f(b);v&&(v.isCubeTexture||v.mapping===Er)?(c===void 0&&(c=new ct(new qe(1,1,1),new Rn({name:"BackgroundCubeMaterial",uniforms:ts(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,E,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(wm.makeRotationFromEuler(b.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(mh),c.material.toneMapped=Ge.getTransfer(v.colorSpace)!==je,(h!==v||u!==v.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ct(new Mi(2,2),new Rn({name:"BackgroundMaterial",uniforms:ts(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=Ge.getTransfer(v.colorSpace)!==je,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=s.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,b){S.getRGB(or,lh(s)),t.buffers.color.setClear(or.r,or.g,or.b,b,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,b=1){a.set(S),o=b,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,m(a,o)},render:g,addToRenderList:y,dispose:p}}function Am(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(L,U,X,Z,O){let q=!1;const H=u(L,Z,X,U);r!==H&&(r=H,c(r.object)),q=f(L,Z,X,O),q&&g(L,Z,X,O),O!==null&&e.update(O,s.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,v(L,U,X,Z),O!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return s.createVertexArray()}function c(L){return s.bindVertexArray(L)}function h(L){return s.deleteVertexArray(L)}function u(L,U,X,Z){const O=Z.wireframe===!0;let q=n[U.id];q===void 0&&(q={},n[U.id]=q);const H=L.isInstancedMesh===!0?L.id:0;let J=q[H];J===void 0&&(J={},q[H]=J);let j=J[X.id];j===void 0&&(j={},J[X.id]=j);let ue=j[O];return ue===void 0&&(ue=d(l()),j[O]=ue),ue}function d(L){const U=[],X=[],Z=[];for(let O=0;O<t;O++)U[O]=0,X[O]=0,Z[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:X,attributeDivisors:Z,object:L,attributes:{},index:null}}function f(L,U,X,Z){const O=r.attributes,q=U.attributes;let H=0;const J=X.getAttributes();for(const j in J)if(J[j].location>=0){const me=O[j];let ve=q[j];if(ve===void 0&&(j==="instanceMatrix"&&L.instanceMatrix&&(ve=L.instanceMatrix),j==="instanceColor"&&L.instanceColor&&(ve=L.instanceColor)),me===void 0||me.attribute!==ve||ve&&me.data!==ve.data)return!0;H++}return r.attributesNum!==H||r.index!==Z}function g(L,U,X,Z){const O={},q=U.attributes;let H=0;const J=X.getAttributes();for(const j in J)if(J[j].location>=0){let me=q[j];me===void 0&&(j==="instanceMatrix"&&L.instanceMatrix&&(me=L.instanceMatrix),j==="instanceColor"&&L.instanceColor&&(me=L.instanceColor));const ve={};ve.attribute=me,me&&me.data&&(ve.data=me.data),O[j]=ve,H++}r.attributes=O,r.attributesNum=H,r.index=Z}function y(){const L=r.newAttributes;for(let U=0,X=L.length;U<X;U++)L[U]=0}function m(L){p(L,0)}function p(L,U){const X=r.newAttributes,Z=r.enabledAttributes,O=r.attributeDivisors;X[L]=1,Z[L]===0&&(s.enableVertexAttribArray(L),Z[L]=1),O[L]!==U&&(s.vertexAttribDivisor(L,U),O[L]=U)}function S(){const L=r.newAttributes,U=r.enabledAttributes;for(let X=0,Z=U.length;X<Z;X++)U[X]!==L[X]&&(s.disableVertexAttribArray(X),U[X]=0)}function b(L,U,X,Z,O,q,H){H===!0?s.vertexAttribIPointer(L,U,X,O,q):s.vertexAttribPointer(L,U,X,Z,O,q)}function v(L,U,X,Z){y();const O=Z.attributes,q=X.getAttributes(),H=U.defaultAttributeValues;for(const J in q){const j=q[J];if(j.location>=0){let ue=O[J];if(ue===void 0&&(J==="instanceMatrix"&&L.instanceMatrix&&(ue=L.instanceMatrix),J==="instanceColor"&&L.instanceColor&&(ue=L.instanceColor)),ue!==void 0){const me=ue.normalized,ve=ue.itemSize,Ye=e.get(ue);if(Ye===void 0)continue;const ft=Ye.buffer,Ze=Ye.type,K=Ye.bytesPerElement,ie=Ze===s.INT||Ze===s.UNSIGNED_INT||ue.gpuType===wo;if(ue.isInterleavedBufferAttribute){const ee=ue.data,Pe=ee.stride,Ne=ue.offset;if(ee.isInstancedInterleavedBuffer){for(let Ae=0;Ae<j.locationSize;Ae++)p(j.location+Ae,ee.meshPerAttribute);L.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Ae=0;Ae<j.locationSize;Ae++)m(j.location+Ae);s.bindBuffer(s.ARRAY_BUFFER,ft);for(let Ae=0;Ae<j.locationSize;Ae++)b(j.location+Ae,ve/j.locationSize,Ze,me,Pe*K,(Ne+ve/j.locationSize*Ae)*K,ie)}else{if(ue.isInstancedBufferAttribute){for(let ee=0;ee<j.locationSize;ee++)p(j.location+ee,ue.meshPerAttribute);L.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let ee=0;ee<j.locationSize;ee++)m(j.location+ee);s.bindBuffer(s.ARRAY_BUFFER,ft);for(let ee=0;ee<j.locationSize;ee++)b(j.location+ee,ve/j.locationSize,Ze,me,ve*K,ve/j.locationSize*ee*K,ie)}}else if(H!==void 0){const me=H[J];if(me!==void 0)switch(me.length){case 2:s.vertexAttrib2fv(j.location,me);break;case 3:s.vertexAttrib3fv(j.location,me);break;case 4:s.vertexAttrib4fv(j.location,me);break;default:s.vertexAttrib1fv(j.location,me)}}}}S()}function w(){T();for(const L in n){const U=n[L];for(const X in U){const Z=U[X];for(const O in Z){const q=Z[O];for(const H in q)h(q[H].object),delete q[H];delete Z[O]}}delete n[L]}}function E(L){if(n[L.id]===void 0)return;const U=n[L.id];for(const X in U){const Z=U[X];for(const O in Z){const q=Z[O];for(const H in q)h(q[H].object),delete q[H];delete Z[O]}}delete n[L.id]}function R(L){for(const U in n){const X=n[U];for(const Z in X){const O=X[Z];if(O[L.id]===void 0)continue;const q=O[L.id];for(const H in q)h(q[H].object),delete q[H];delete O[L.id]}}}function _(L){for(const U in n){const X=n[U],Z=L.isInstancedMesh===!0?L.id:0,O=X[Z];if(O!==void 0){for(const q in O){const H=O[q];for(const J in H)h(H[J].object),delete H[J];delete O[q]}delete X[Z],Object.keys(X).length===0&&delete n[U]}}}function T(){P(),a=!0,r!==i&&(r=i,c(r.object))}function P(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:T,resetDefaultState:P,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfObject:_,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:m,disableUnusedAttributes:S}}function Rm(s,e,t){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Cm(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==fn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const _=R===Hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==tn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==dn&&!_)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ce("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ce("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),S=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),w=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:b,maxFragmentUniforms:v,maxSamples:w,samples:E}}function Pm(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new ui,o=new De,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const S=r?0:n,b=S*4;let v=p.clippingState||null;l.value=v,v=h(g,d,b,f);for(let w=0;w!==b;++w)v[w]=t[w];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const y=u!==null?u.length:0;let m=null;if(y!==0){if(m=l.value,g!==!0||m===null){const p=f+y*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,v=f;b!==y;++b,v+=4)a.copy(u[b]).applyMatrix4(S,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}const ei=4,Vl=[.125,.215,.35,.446,.526,.582],fi=20,Lm=256,ps=new Go,Gl=new ze;let la=null,ca=0,ha=0,ua=!1;const Im=new C;class Wl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=Im}=r;la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$l(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ql(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(la,ca,ha),this._renderer.xr.enabled=ua,e.scissorTest=!1,Wi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===xi||e.mapping===Ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ht,minFilter:Ht,generateMipmaps:!1,type:Hn,format:fn,colorSpace:xr,depthBuffer:!1},i=Xl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xl(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Dm(r)),this._blurMaterial=Um(r,e,t),this._ggxMaterial=Nm(r,e,t)}return i}_compileMaterial(e){const t=new ct(new Ft,e);this._renderer.compile(t,ps)}_sceneToCubeUV(e,t,n,i,r){const l=new jt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Gl),u.toneMapping=En,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ct(new qe,new pn({name:"PMREM.Background",side:$t,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,m=y.material;let p=!1;const S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,p=!0):(m.color.copy(Gl),p=!0);for(let b=0;b<6;b++){const v=b%3;v===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[b],r.y,r.z)):v===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[b]));const w=this._cubeSize;Wi(i,v*w,b>2?w:0,w,w),u.setRenderTarget(i),p&&u.render(y,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===xi||e.mapping===Ji;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=$l()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ql());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Wi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,ps)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:g}=this,y=this._sizeLods[n],m=3*y*(n>g-ei?n-g+ei:0),p=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,Wi(r,m,p,3*y,2*y),i.setRenderTarget(r),i.render(o,ps),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Wi(e,m,p,3*y,2*y),i.setRenderTarget(e),i.render(o,ps)}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ve("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[i];u.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*fi-1),y=r/g,m=isFinite(r)?1+Math.floor(h*y):fi;m>fi&&Ce(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${fi}`);const p=[];let S=0;for(let R=0;R<fi;++R){const _=R/y,T=Math.exp(-_*_/2);p.push(T),R===0?S+=T:R<m&&(S+=2*T)}for(let R=0;R<p.length;R++)p[R]=p[R]/S;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-n;const v=this._sizeLods[i],w=3*v*(i>b-ei?i-b+ei:0),E=4*(this._cubeSize-v);Wi(t,w,E,3*v,2*v),l.setRenderTarget(t),l.render(u,ps)}}function Dm(s){const e=[],t=[],n=[];let i=s;const r=s-ei+1+Vl.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>s-ei?l=Vl[a-s+ei-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,y=3,m=2,p=1,S=new Float32Array(y*g*f),b=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let E=0;E<f;E++){const R=E%3*2/3-1,_=E>2?0:-1,T=[R,_,0,R+2/3,_,0,R+2/3,_+1,0,R,_,0,R+2/3,_+1,0,R,_+1,0];S.set(T,y*g*E),b.set(d,m*g*E);const P=[E,E,E,E,E,E];v.set(P,p*g*E)}const w=new Ft;w.setAttribute("position",new an(S,y)),w.setAttribute("uv",new an(b,m)),w.setAttribute("faceIndex",new an(v,p)),n.push(new ct(w,null)),i>ei&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Xl(s,e,t){const n=new wn(s,e,t);return n.texture.mapping=Er,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Wi(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Nm(s,e,t){return new Rn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Lm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Tr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Um(s,e,t){const n=new Float32Array(fi),i=new C(0,1,0);return new Rn({name:"SphericalGaussianBlur",defines:{n:fi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Tr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function ql(){return new Rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function $l(){return new Rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Tr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class gh extends wn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Jc(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new qe(5,5,5),r=new Rn({name:"CubemapFromEquirect",uniforms:ts(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$t,blending:Bn});r.uniforms.tEquirect.value=t;const a=new ct(i,r),o=t.minFilter;return t.minFilter===mi&&(t.minFilter=Ht),new zd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}function Fm(s){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Pr||f===Lr)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const y=new gh(g.height);return y.fromEquirectangularTexture(s,d),e.set(d,y),d.addEventListener("dispose",c),o(y.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,g=f===Pr||f===Lr,y=f===xi||f===Ji;if(g||y){let m=t.get(d);const p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new Wl(s)),m=g?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const S=d.image;return g&&S&&S.height>0||y&&S&&l(S)?(n===null&&(n=new Wl(s)),m=g?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===Pr?d.mapping=xi:f===Lr&&(d.mapping=Ji),d}function l(d){let f=0;const g=6;for(let y=0;y<g;y++)d[y]!==void 0&&f++;return f===g}function c(d){const f=d.target;f.removeEventListener("dispose",c);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function Om(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&$i("WebGLRenderer: "+n+" extension not supported."),i}}}function Bm(s,e,t,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],s.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let y=0;if(g===void 0)return;if(f!==null){const S=f.array;y=f.version;for(let b=0,v=S.length;b<v;b+=3){const w=S[b+0],E=S[b+1],R=S[b+2];d.push(w,E,E,R,R,w)}}else{const S=g.array;y=g.version;for(let b=0,v=S.length/3-1;b<v;b+=3){const w=b+0,E=b+1,R=b+2;d.push(w,E,E,R,R,w)}}const m=new(g.count>=65535?qc:Xc)(d,1);m.version=y;const p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function zm(s,e,t){let n;function i(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){s.drawElements(n,d,r,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let y=0;for(let m=0;m<f;m++)y+=d[m];t.update(y,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function km(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:Ve("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Hm(s,e,t){const n=new WeakMap,i=new ut;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let P=function(){_.dispose(),n.delete(o),o.removeEventListener("dispose",P)};var f=P;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),y===!0&&(v=2),m===!0&&(v=3);let w=o.attributes.position.count*v,E=1;w>e.maxTextureSize&&(E=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const R=new Float32Array(w*E*4*u),_=new Vc(R,w,E,u);_.type=dn,_.needsUpdate=!0;const T=v*4;for(let L=0;L<u;L++){const U=p[L],X=S[L],Z=b[L],O=w*E*4*L;for(let q=0;q<U.count;q++){const H=q*T;g===!0&&(i.fromBufferAttribute(U,q),R[O+H+0]=i.x,R[O+H+1]=i.y,R[O+H+2]=i.z,R[O+H+3]=0),y===!0&&(i.fromBufferAttribute(X,q),R[O+H+4]=i.x,R[O+H+5]=i.y,R[O+H+6]=i.z,R[O+H+7]=0),m===!0&&(i.fromBufferAttribute(Z,q),R[O+H+8]=i.x,R[O+H+9]=i.y,R[O+H+10]=i.z,R[O+H+11]=Z.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new le(w,E)},n.set(o,d),o.addEventListener("dispose",P)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const y=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",y),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Vm(s,e,t,n,i){let r=new WeakMap;function a(c){const h=i.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Gm={[Ac]:"LINEAR_TONE_MAPPING",[Rc]:"REINHARD_TONE_MAPPING",[Cc]:"CINEON_TONE_MAPPING",[Pc]:"ACES_FILMIC_TONE_MAPPING",[Ic]:"AGX_TONE_MAPPING",[Dc]:"NEUTRAL_TONE_MAPPING",[Lc]:"CUSTOM_TONE_MAPPING"};function Wm(s,e,t,n,i,r){const a=new wn(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,depthTexture:i?new Qi(e,t):void 0}),o=new wn(e,t,{type:Hn,depthBuffer:!1,stencilBuffer:!1}),l=new Ft;l.setAttribute("position",new Je([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Je([0,2,0,0,2,0],2));const c=new Id({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new ct(l,c),u=new Go(-1,1,1,-1,0,1);let d=null,f=null,g=!1,y,m=null,p=[],S=!1;this.setSize=function(b,v){a.setSize(b,v),o.setSize(b,v);for(let w=0;w<p.length;w++){const E=p[w];E.setSize&&E.setSize(b,v)}},this.setEffects=function(b){p=b,S=p.length>0&&p[0].isRenderPass===!0;const v=a.width,w=a.height;for(let E=0;E<p.length;E++){const R=p[E];R.setSize&&R.setSize(v,w)}},this.begin=function(b,v){if(g||b.toneMapping===En&&p.length===0)return!1;if(m=v,v!==null){const w=v.width,E=v.height;(a.width!==w||a.height!==E)&&this.setSize(w,E)}return S===!1&&b.setRenderTarget(a),y=b.toneMapping,b.toneMapping=En,!0},this.hasRenderPass=function(){return S},this.end=function(b,v){b.toneMapping=y,g=!0;let w=a,E=o;for(let R=0;R<p.length;R++){const _=p[R];if(_.enabled!==!1&&(_.render(b,E,w,v),_.needsSwap!==!1)){const T=w;w=E,E=T}}if(d!==b.outputColorSpace||f!==b.toneMapping){d=b.outputColorSpace,f=b.toneMapping,c.defines={},Ge.getTransfer(d)===je&&(c.defines.SRGB_TRANSFER="");const R=Gm[f];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=w.texture,b.setRenderTarget(m),b.render(h,u),m=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const xh=new Vt,vo=new Qi(1,1),_h=new Vc,vh=new Au,Mh=new Jc,Yl=[],Zl=[],Kl=new Float32Array(16),Jl=new Float32Array(9),Ql=new Float32Array(4);function ss(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Yl[i];if(r===void 0&&(r=new Float32Array(i),Yl[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Rt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Ct(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Ar(s,e){let t=Zl[e];t===void 0&&(t=new Int32Array(e),Zl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Xm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function qm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2fv(this.addr,e),Ct(t,e)}}function $m(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Rt(t,e))return;s.uniform3fv(this.addr,e),Ct(t,e)}}function Ym(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4fv(this.addr,e),Ct(t,e)}}function Zm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Ql.set(n),s.uniformMatrix2fv(this.addr,!1,Ql),Ct(t,n)}}function Km(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Jl.set(n),s.uniformMatrix3fv(this.addr,!1,Jl),Ct(t,n)}}function Jm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Kl.set(n),s.uniformMatrix4fv(this.addr,!1,Kl),Ct(t,n)}}function Qm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function jm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2iv(this.addr,e),Ct(t,e)}}function e0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;s.uniform3iv(this.addr,e),Ct(t,e)}}function t0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4iv(this.addr,e),Ct(t,e)}}function n0(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function i0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2uiv(this.addr,e),Ct(t,e)}}function s0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;s.uniform3uiv(this.addr,e),Ct(t,e)}}function r0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4uiv(this.addr,e),Ct(t,e)}}function a0(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(vo.compareFunction=t.isReversedDepthBuffer()?Do:Io,r=vo):r=xh,t.setTexture2D(e||r,i)}function o0(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||vh,i)}function l0(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Mh,i)}function c0(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||_h,i)}function h0(s){switch(s){case 5126:return Xm;case 35664:return qm;case 35665:return $m;case 35666:return Ym;case 35674:return Zm;case 35675:return Km;case 35676:return Jm;case 5124:case 35670:return Qm;case 35667:case 35671:return jm;case 35668:case 35672:return e0;case 35669:case 35673:return t0;case 5125:return n0;case 36294:return i0;case 36295:return s0;case 36296:return r0;case 35678:case 36198:case 36298:case 36306:case 35682:return a0;case 35679:case 36299:case 36307:return o0;case 35680:case 36300:case 36308:case 36293:return l0;case 36289:case 36303:case 36311:case 36292:return c0}}function u0(s,e){s.uniform1fv(this.addr,e)}function d0(s,e){const t=ss(e,this.size,2);s.uniform2fv(this.addr,t)}function f0(s,e){const t=ss(e,this.size,3);s.uniform3fv(this.addr,t)}function p0(s,e){const t=ss(e,this.size,4);s.uniform4fv(this.addr,t)}function m0(s,e){const t=ss(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function g0(s,e){const t=ss(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function x0(s,e){const t=ss(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function _0(s,e){s.uniform1iv(this.addr,e)}function v0(s,e){s.uniform2iv(this.addr,e)}function M0(s,e){s.uniform3iv(this.addr,e)}function y0(s,e){s.uniform4iv(this.addr,e)}function S0(s,e){s.uniform1uiv(this.addr,e)}function b0(s,e){s.uniform2uiv(this.addr,e)}function E0(s,e){s.uniform3uiv(this.addr,e)}function w0(s,e){s.uniform4uiv(this.addr,e)}function T0(s,e,t){const n=this.cache,i=e.length,r=Ar(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=vo:a=xh;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function A0(s,e,t){const n=this.cache,i=e.length,r=Ar(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||vh,r[a])}function R0(s,e,t){const n=this.cache,i=e.length,r=Ar(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Mh,r[a])}function C0(s,e,t){const n=this.cache,i=e.length,r=Ar(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||_h,r[a])}function P0(s){switch(s){case 5126:return u0;case 35664:return d0;case 35665:return f0;case 35666:return p0;case 35674:return m0;case 35675:return g0;case 35676:return x0;case 5124:case 35670:return _0;case 35667:case 35671:return v0;case 35668:case 35672:return M0;case 35669:case 35673:return y0;case 5125:return S0;case 36294:return b0;case 36295:return E0;case 36296:return w0;case 35678:case 36198:case 36298:case 36306:case 35682:return T0;case 35679:case 36299:case 36307:return A0;case 35680:case 36300:case 36308:case 36293:return R0;case 36289:case 36303:case 36311:case 36292:return C0}}class L0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=h0(t.type)}}class I0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=P0(t.type)}}class D0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const da=/(\w+)(\])?(\[|\.)?/g;function jl(s,e){s.seq.push(e),s.map[e.id]=e}function N0(s,e,t){const n=s.name,i=n.length;for(da.lastIndex=0;;){const r=da.exec(n),a=da.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){jl(t,c===void 0?new L0(o,s,e):new I0(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new D0(o),jl(t,u)),t=u}}}class pr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);N0(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function ec(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const U0=37297;let F0=0;function O0(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const tc=new De;function B0(s){Ge._getMatrix(tc,Ge.workingColorSpace,s);const e=`mat3( ${tc.elements.map(t=>t.toFixed(4))} )`;switch(Ge.getTransfer(s)){case _r:return[e,"LinearTransferOETF"];case je:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function nc(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+O0(s.getShaderSource(e),o)}else return r}function z0(s,e){const t=B0(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const k0={[Ac]:"Linear",[Rc]:"Reinhard",[Cc]:"Cineon",[Pc]:"ACESFilmic",[Ic]:"AgX",[Dc]:"Neutral",[Lc]:"Custom"};function H0(s,e){const t=k0[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const lr=new C;function V0(){Ge.getLuminanceCoefficients(lr);const s=lr.x.toFixed(4),e=lr.y.toFixed(4),t=lr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function G0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ms).join(`
`)}function W0(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function X0(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Ms(s){return s!==""}function ic(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function sc(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const q0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Mo(s){return s.replace(q0,Y0)}const $0=new Map;function Y0(s,e){let t=Oe[e];if(t===void 0){const n=$0.get(e);if(n!==void 0)t=Oe[n],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Mo(t)}const Z0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rc(s){return s.replace(Z0,K0)}function K0(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function ac(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const J0={[cr]:"SHADOWMAP_TYPE_PCF",[_s]:"SHADOWMAP_TYPE_VSM"};function Q0(s){return J0[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const j0={[xi]:"ENVMAP_TYPE_CUBE",[Ji]:"ENVMAP_TYPE_CUBE",[Er]:"ENVMAP_TYPE_CUBE_UV"};function eg(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":j0[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const tg={[Ji]:"ENVMAP_MODE_REFRACTION"};function ng(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":tg[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const ig={[Tc]:"ENVMAP_BLENDING_MULTIPLY",[au]:"ENVMAP_BLENDING_MIX",[ou]:"ENVMAP_BLENDING_ADD"};function sg(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":ig[s.combine]||"ENVMAP_BLENDING_NONE"}function rg(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function ag(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Q0(t),c=eg(t),h=ng(t),u=sg(t),d=rg(t),f=G0(t),g=W0(r),y=i.createProgram();let m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ms).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ms).join(`
`),p.length>0&&(p+=`
`)):(m=[ac(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),p=[ac(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==En?"#define TONE_MAPPING":"",t.toneMapping!==En?Oe.tonemapping_pars_fragment:"",t.toneMapping!==En?H0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,z0("linearToOutputTexel",t.outputColorSpace),V0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ms).join(`
`)),a=Mo(a),a=ic(a,t),a=sc(a,t),o=Mo(o),o=ic(o,t),o=sc(o,t),a=rc(a),o=rc(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===rl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===rl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=S+m+a,v=S+p+o,w=ec(i,i.VERTEX_SHADER,b),E=ec(i,i.FRAGMENT_SHADER,v);i.attachShader(y,w),i.attachShader(y,E),t.index0AttributeName!==void 0?i.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(y,0,"position"),i.linkProgram(y);function R(L){if(s.debug.checkShaderErrors){const U=i.getProgramInfoLog(y)||"",X=i.getShaderInfoLog(w)||"",Z=i.getShaderInfoLog(E)||"",O=U.trim(),q=X.trim(),H=Z.trim();let J=!0,j=!0;if(i.getProgramParameter(y,i.LINK_STATUS)===!1)if(J=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,y,w,E);else{const ue=nc(i,w,"vertex"),me=nc(i,E,"fragment");Ve("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(y,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+O+`
`+ue+`
`+me)}else O!==""?Ce("WebGLProgram: Program Info Log:",O):(q===""||H==="")&&(j=!1);j&&(L.diagnostics={runnable:J,programLog:O,vertexShader:{log:q,prefix:m},fragmentShader:{log:H,prefix:p}})}i.deleteShader(w),i.deleteShader(E),_=new pr(i,y),T=X0(i,y)}let _;this.getUniforms=function(){return _===void 0&&R(this),_};let T;this.getAttributes=function(){return T===void 0&&R(this),T};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=i.getProgramParameter(y,U0)),P},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=F0++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=w,this.fragmentShader=E,this}let og=0;class lg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new cg(e),t.set(e,n)),n}}class cg{constructor(e){this.id=og++,this.code=e,this.usedTimes=0}}function hg(s){return s===_i||s===mr||s===gr}function ug(s,e,t,n,i,r){const a=new Uo,o=new lg,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function y(_,T,P,L,U,X){const Z=L.fog,O=U.geometry,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?L.environment:null,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,J=e.get(_.envMap||q,H),j=J&&J.mapping===Er?J.image.height:null,ue=f[_.type];_.precision!==null&&(d=n.getMaxPrecision(_.precision),d!==_.precision&&Ce("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const me=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ve=me!==void 0?me.length:0;let Ye=0;O.morphAttributes.position!==void 0&&(Ye=1),O.morphAttributes.normal!==void 0&&(Ye=2),O.morphAttributes.color!==void 0&&(Ye=3);let ft,Ze,K,ie;if(ue){const Me=Mn[ue];ft=Me.vertexShader,Ze=Me.fragmentShader}else{ft=_.vertexShader,Ze=_.fragmentShader;const Me=o.getVertexShaderStage(_),mt=o.getFragmentShaderStage(_);o.update(_,Me,mt),K=Me.id,ie=mt.id}const ee=s.getRenderTarget(),Pe=s.state.buffers.depth.getReversed(),Ne=U.isInstancedMesh===!0,Ae=U.isBatchedMesh===!0,_t=!!_.map,He=!!_.matcap,it=!!J,Ke=!!_.aoMap,We=!!_.lightMap,yt=!!_.bumpMap&&_.wireframe===!1,wt=!!_.normalMap,Pt=!!_.displacementMap,Dt=!!_.emissiveMap,pt=!!_.metalnessMap,St=!!_.roughnessMap,D=_.anisotropy>0,Xt=_.clearcoat>0,Qe=_.dispersion>0,A=_.iridescence>0,x=_.sheen>0,F=_.transmission>0,k=D&&!!_.anisotropyMap,G=Xt&&!!_.clearcoatMap,te=Xt&&!!_.clearcoatNormalMap,se=Xt&&!!_.clearcoatRoughnessMap,W=A&&!!_.iridescenceMap,Y=A&&!!_.iridescenceThicknessMap,re=x&&!!_.sheenColorMap,be=x&&!!_.sheenRoughnessMap,ce=!!_.specularMap,ae=!!_.specularColorMap,Te=!!_.specularIntensityMap,Re=F&&!!_.transmissionMap,Ue=F&&!!_.thicknessMap,I=!!_.gradientMap,ne=!!_.alphaMap,$=_.alphaTest>0,oe=!!_.alphaHash,pe=!!_.extensions;let Q=En;_.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Q=s.toneMapping);const Se={shaderID:ue,shaderType:_.type,shaderName:_.name,vertexShader:ft,fragmentShader:Ze,defines:_.defines,customVertexShaderID:K,customFragmentShaderID:ie,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Ae,batchingColor:Ae&&U._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&U.instanceColor!==null,instancingMorph:Ne&&U.morphTexture!==null,outputColorSpace:ee===null?s.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Ge.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:_t,matcap:He,envMap:it,envMapMode:it&&J.mapping,envMapCubeUVHeight:j,aoMap:Ke,lightMap:We,bumpMap:yt,normalMap:wt,displacementMap:Pt,emissiveMap:Dt,normalMapObjectSpace:wt&&_.normalMapType===hu,normalMapTangentSpace:wt&&_.normalMapType===fo,packedNormalMap:wt&&_.normalMapType===fo&&hg(_.normalMap.format),metalnessMap:pt,roughnessMap:St,anisotropy:D,anisotropyMap:k,clearcoat:Xt,clearcoatMap:G,clearcoatNormalMap:te,clearcoatRoughnessMap:se,dispersion:Qe,iridescence:A,iridescenceMap:W,iridescenceThicknessMap:Y,sheen:x,sheenColorMap:re,sheenRoughnessMap:be,specularMap:ce,specularColorMap:ae,specularIntensityMap:Te,transmission:F,transmissionMap:Re,thicknessMap:Ue,gradientMap:I,opaque:_.transparent===!1&&_.blending===qi&&_.alphaToCoverage===!1,alphaMap:ne,alphaTest:$,alphaHash:oe,combine:_.combine,mapUv:_t&&g(_.map.channel),aoMapUv:Ke&&g(_.aoMap.channel),lightMapUv:We&&g(_.lightMap.channel),bumpMapUv:yt&&g(_.bumpMap.channel),normalMapUv:wt&&g(_.normalMap.channel),displacementMapUv:Pt&&g(_.displacementMap.channel),emissiveMapUv:Dt&&g(_.emissiveMap.channel),metalnessMapUv:pt&&g(_.metalnessMap.channel),roughnessMapUv:St&&g(_.roughnessMap.channel),anisotropyMapUv:k&&g(_.anisotropyMap.channel),clearcoatMapUv:G&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:te&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:W&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:Y&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:re&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:be&&g(_.sheenRoughnessMap.channel),specularMapUv:ce&&g(_.specularMap.channel),specularColorMapUv:ae&&g(_.specularColorMap.channel),specularIntensityMapUv:Te&&g(_.specularIntensityMap.channel),transmissionMapUv:Re&&g(_.transmissionMap.channel),thicknessMapUv:Ue&&g(_.thicknessMap.channel),alphaMapUv:ne&&g(_.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(wt||D),vertexNormals:!!O.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!O.attributes.uv&&(_t||ne),fog:!!Z,useFog:_.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||O.attributes.normal===void 0&&wt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Pe,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:Ye,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:Q,decodeVideoTexture:_t&&_.map.isVideoTexture===!0&&Ge.getTransfer(_.map.colorSpace)===je,decodeVideoTextureEmissive:Dt&&_.emissiveMap.isVideoTexture===!0&&Ge.getTransfer(_.emissiveMap.colorSpace)===je,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===en,flipSided:_.side===$t,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:pe&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&_.extensions.multiDraw===!0||Ae)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Se.vertexUv1s=l.has(1),Se.vertexUv2s=l.has(2),Se.vertexUv3s=l.has(3),l.clear(),Se}function m(_){const T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(const P in _.defines)T.push(P),T.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(p(T,_),S(T,_),T.push(s.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function p(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function S(_,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function b(_){const T=f[_.type];let P;if(T){const L=Mn[T];P=Cd.clone(L.uniforms)}else P=_.uniforms;return P}function v(_,T){let P=h.get(T);return P!==void 0?++P.usedTimes:(P=new ag(s,T,_,i),c.push(P),h.set(T,P)),P}function w(_){if(--_.usedTimes===0){const T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function E(_){o.remove(_)}function R(){o.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:b,acquireProgram:v,releaseProgram:w,releaseShaderCache:E,programs:c,dispose:R}}function dg(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function fg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function oc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function lc(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,y,m,p){let S=s[e];return S===void 0?(S={id:d.id,object:d,geometry:f,material:g,materialVariant:a(d),groupOrder:y,renderOrder:d.renderOrder,z:m,group:p},s[e]=S):(S.id=d.id,S.object=d,S.geometry=f,S.material=g,S.materialVariant=a(d),S.groupOrder=y,S.renderOrder=d.renderOrder,S.z=m,S.group=p),e++,S}function l(d,f,g,y,m,p){const S=o(d,f,g,y,m,p);g.transmission>0?n.push(S):g.transparent===!0?i.push(S):t.push(S)}function c(d,f,g,y,m,p){const S=o(d,f,g,y,m,p);g.transmission>0?n.unshift(S):g.transparent===!0?i.unshift(S):t.unshift(S)}function h(d,f,g){t.length>1&&t.sort(d||fg),n.length>1&&n.sort(f||oc),i.length>1&&i.sort(f||oc),g&&(t.reverse(),n.reverse(),i.reverse())}function u(){for(let d=e,f=s.length;d<f;d++){const g=s[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:u,sort:h}}function pg(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new lc,s.set(n,[a])):i>=r.length?(a=new lc,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function mg(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new ze};break;case"SpotLight":t={position:new C,direction:new C,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new C,halfWidth:new C,halfHeight:new C};break}return s[e.id]=t,t}}}function gg(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let xg=0;function _g(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function vg(s){const e=new mg,t=gg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const i=new C,r=new $e,a=new $e;function o(c){let h=0,u=0,d=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let f=0,g=0,y=0,m=0,p=0,S=0,b=0,v=0,w=0,E=0,R=0;c.sort(_g);for(let T=0,P=c.length;T<P;T++){const L=c[T],U=L.color,X=L.intensity,Z=L.distance;let O=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===_i?O=L.shadow.map.texture:O=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=U.r*X,u+=U.g*X,d+=U.b*X;else if(L.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(L.sh.coefficients[q],X);R++}else if(L.isDirectionalLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const H=L.shadow,J=t.get(L);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,n.directionalShadow[f]=J,n.directionalShadowMap[f]=O,n.directionalShadowMatrix[f]=L.shadow.matrix,S++}n.directional[f]=q,f++}else if(L.isSpotLight){const q=e.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(U).multiplyScalar(X),q.distance=Z,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,n.spot[y]=q;const H=L.shadow;if(L.map&&(n.spotLightMap[w]=L.map,w++,H.updateMatrices(L),L.castShadow&&E++),n.spotLightMatrix[y]=H.matrix,L.castShadow){const J=t.get(L);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,n.spotShadow[y]=J,n.spotShadowMap[y]=O,v++}y++}else if(L.isRectAreaLight){const q=e.get(L);q.color.copy(U).multiplyScalar(X),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=q,m++}else if(L.isPointLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){const H=L.shadow,J=t.get(L);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,J.shadowCameraNear=H.camera.near,J.shadowCameraFar=H.camera.far,n.pointShadow[g]=J,n.pointShadowMap[g]=O,n.pointShadowMatrix[g]=L.shadow.matrix,b++}n.point[g]=q,g++}else if(L.isHemisphereLight){const q=e.get(L);q.skyColor.copy(L.color).multiplyScalar(X),q.groundColor.copy(L.groundColor).multiplyScalar(X),n.hemi[p]=q,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=he.LTC_FLOAT_1,n.rectAreaLTC2=he.LTC_FLOAT_2):(n.rectAreaLTC1=he.LTC_HALF_1,n.rectAreaLTC2=he.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const _=n.hash;(_.directionalLength!==f||_.pointLength!==g||_.spotLength!==y||_.rectAreaLength!==m||_.hemiLength!==p||_.numDirectionalShadows!==S||_.numPointShadows!==b||_.numSpotShadows!==v||_.numSpotMaps!==w||_.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=v+w-E,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=R,_.directionalLength=f,_.pointLength=g,_.spotLength=y,_.rectAreaLength=m,_.hemiLength=p,_.numDirectionalShadows=S,_.numPointShadows=b,_.numSpotShadows=v,_.numSpotMaps=w,_.numLightProbes=R,n.version=xg++)}function l(c,h){let u=0,d=0,f=0,g=0,y=0;const m=h.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){const b=c[p];if(b.isDirectionalLight){const v=n.directional[u];v.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(b.isSpotLight){const v=n.spot[f];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(b.width*.5,0,0),v.halfHeight.set(0,b.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){const v=n.point[d];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const v=n.hemi[y];v.direction.setFromMatrixPosition(b.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:n}}function cc(s){const e=new vg(s),t=[],n=[],i=[];function r(d){u.camera=d,t.length=0,n.length=0,i.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){i.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Mg(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new cc(s),e.set(i,[o])):r>=a.length?(o=new cc(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const yg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Sg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,bg=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],Eg=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],hc=new $e,ms=new C,fa=new C;function wg(s,e,t){let n=new Oo;const i=new le,r=new le,a=new ut,o=new Nd,l=new Ud,c={},h=t.maxTextureSize,u={[ti]:$t,[$t]:ti,[en]:en},d=new Rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:yg,fragmentShader:Sg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ft;g.setAttribute("position",new an(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new ct(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cr;let p=this.type;this.render=function(E,R,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===wc&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=cr);const T=s.getRenderTarget(),P=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),U=s.state;U.setBlending(Bn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const X=p!==this.type;X&&R.traverse(function(Z){Z.material&&(Array.isArray(Z.material)?Z.material.forEach(O=>O.needsUpdate=!0):Z.material.needsUpdate=!0)});for(let Z=0,O=E.length;Z<O;Z++){const q=E[Z],H=q.shadow;if(H===void 0){Ce("WebGLShadowMap:",q,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const J=H.getFrameExtents();i.multiply(J),r.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/J.x),i.x=r.x*J.x,H.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/J.y),i.y=r.y*J.y,H.mapSize.y=r.y));const j=s.state.buffers.depth.getReversed();if(H.camera._reversedDepth=j,H.map===null||X===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===_s){if(q.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new wn(i.x,i.y,{format:_i,type:Hn,minFilter:Ht,magFilter:Ht,generateMipmaps:!1}),H.map.texture.name=q.name+".shadowMap",H.map.depthTexture=new Qi(i.x,i.y,dn),H.map.depthTexture.name=q.name+".shadowMapDepth",H.map.depthTexture.format=Vn,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ut,H.map.depthTexture.magFilter=Ut}else q.isPointLight?(H.map=new gh(i.x),H.map.depthTexture=new Yu(i.x,An)):(H.map=new wn(i.x,i.y),H.map.depthTexture=new Qi(i.x,i.y,An)),H.map.depthTexture.name=q.name+".shadowMap",H.map.depthTexture.format=Vn,this.type===cr?(H.map.depthTexture.compareFunction=j?Do:Io,H.map.depthTexture.minFilter=Ht,H.map.depthTexture.magFilter=Ht):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ut,H.map.depthTexture.magFilter=Ut);H.camera.updateProjectionMatrix()}const ue=H.map.isWebGLCubeRenderTarget?6:1;for(let me=0;me<ue;me++){if(H.map.isWebGLCubeRenderTarget)s.setRenderTarget(H.map,me),s.clear();else{me===0&&(s.setRenderTarget(H.map),s.clear());const ve=H.getViewport(me);a.set(r.x*ve.x,r.y*ve.y,r.x*ve.z,r.y*ve.w),U.viewport(a)}if(q.isPointLight){const ve=H.camera,Ye=H.matrix,ft=q.distance||ve.far;ft!==ve.far&&(ve.far=ft,ve.updateProjectionMatrix()),ms.setFromMatrixPosition(q.matrixWorld),ve.position.copy(ms),fa.copy(ve.position),fa.add(bg[me]),ve.up.copy(Eg[me]),ve.lookAt(fa),ve.updateMatrixWorld(),Ye.makeTranslation(-ms.x,-ms.y,-ms.z),hc.multiplyMatrices(ve.projectionMatrix,ve.matrixWorldInverse),H._frustum.setFromProjectionMatrix(hc,ve.coordinateSystem,ve.reversedDepth)}else H.updateMatrices(q);n=H.getFrustum(),v(R,_,H.camera,q,this.type)}H.isPointLightShadow!==!0&&this.type===_s&&S(H,_),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(T,P,L)};function S(E,R){const _=e.update(y);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new wn(i.x,i.y,{format:_i,type:Hn})),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(R,null,_,d,y,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(R,null,_,f,y,null)}function b(E,R,_,T){let P=null;const L=_.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)P=L;else if(P=_.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const U=P.uuid,X=R.uuid;let Z=c[U];Z===void 0&&(Z={},c[U]=Z);let O=Z[X];O===void 0&&(O=P.clone(),Z[X]=O,R.addEventListener("dispose",w)),P=O}if(P.visible=R.visible,P.wireframe=R.wireframe,T===_s?P.side=R.shadowSide!==null?R.shadowSide:R.side:P.side=R.shadowSide!==null?R.shadowSide:u[R.side],P.alphaMap=R.alphaMap,P.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,P.map=R.map,P.clipShadows=R.clipShadows,P.clippingPlanes=R.clippingPlanes,P.clipIntersection=R.clipIntersection,P.displacementMap=R.displacementMap,P.displacementScale=R.displacementScale,P.displacementBias=R.displacementBias,P.wireframeLinewidth=R.wireframeLinewidth,P.linewidth=R.linewidth,_.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const U=s.properties.get(P);U.light=_}return P}function v(E,R,_,T,P){if(E.visible===!1)return;if(E.layers.test(R.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&P===_s)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,E.matrixWorld);const X=e.update(E),Z=E.material;if(Array.isArray(Z)){const O=X.groups;for(let q=0,H=O.length;q<H;q++){const J=O[q],j=Z[J.materialIndex];if(j&&j.visible){const ue=b(E,j,T,P);E.onBeforeShadow(s,E,R,_,X,ue,J),s.renderBufferDirect(_,null,X,ue,E,J),E.onAfterShadow(s,E,R,_,X,ue,J)}}}else if(Z.visible){const O=b(E,Z,T,P);E.onBeforeShadow(s,E,R,_,X,O,null),s.renderBufferDirect(_,null,X,O,E,null),E.onAfterShadow(s,E,R,_,X,O,null)}}const U=E.children;for(let X=0,Z=U.length;X<Z;X++)v(U[X],R,_,T,P)}function w(E){E.target.removeEventListener("dispose",w);for(const _ in c){const T=c[_],P=E.target.uuid;P in T&&(T[P].dispose(),delete T[P])}}}function Tg(s,e){function t(){let I=!1;const ne=new ut;let $=null;const oe=new ut(0,0,0,0);return{setMask:function(pe){$!==pe&&!I&&(s.colorMask(pe,pe,pe,pe),$=pe)},setLocked:function(pe){I=pe},setClear:function(pe,Q,Se,Me,mt){mt===!0&&(pe*=Me,Q*=Me,Se*=Me),ne.set(pe,Q,Se,Me),oe.equals(ne)===!1&&(s.clearColor(pe,Q,Se,Me),oe.copy(ne))},reset:function(){I=!1,$=null,oe.set(-1,0,0,0)}}}function n(){let I=!1,ne=!1,$=null,oe=null,pe=null;return{setReversed:function(Q){if(ne!==Q){const Se=e.get("EXT_clip_control");Q?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),ne=Q;const Me=pe;pe=null,this.setClear(Me)}},getReversed:function(){return ne},setTest:function(Q){Q?ee(s.DEPTH_TEST):Pe(s.DEPTH_TEST)},setMask:function(Q){$!==Q&&!I&&(s.depthMask(Q),$=Q)},setFunc:function(Q){if(ne&&(Q=Mu[Q]),oe!==Q){switch(Q){case Aa:s.depthFunc(s.NEVER);break;case Ra:s.depthFunc(s.ALWAYS);break;case Ca:s.depthFunc(s.LESS);break;case Ki:s.depthFunc(s.LEQUAL);break;case Pa:s.depthFunc(s.EQUAL);break;case La:s.depthFunc(s.GEQUAL);break;case Ia:s.depthFunc(s.GREATER);break;case Da:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}oe=Q}},setLocked:function(Q){I=Q},setClear:function(Q){pe!==Q&&(pe=Q,ne&&(Q=1-Q),s.clearDepth(Q))},reset:function(){I=!1,$=null,oe=null,pe=null,ne=!1}}}function i(){let I=!1,ne=null,$=null,oe=null,pe=null,Q=null,Se=null,Me=null,mt=null;return{setTest:function(ot){I||(ot?ee(s.STENCIL_TEST):Pe(s.STENCIL_TEST))},setMask:function(ot){ne!==ot&&!I&&(s.stencilMask(ot),ne=ot)},setFunc:function(ot,mn,gn){($!==ot||oe!==mn||pe!==gn)&&(s.stencilFunc(ot,mn,gn),$=ot,oe=mn,pe=gn)},setOp:function(ot,mn,gn){(Q!==ot||Se!==mn||Me!==gn)&&(s.stencilOp(ot,mn,gn),Q=ot,Se=mn,Me=gn)},setLocked:function(ot){I=ot},setClear:function(ot){mt!==ot&&(s.clearStencil(ot),mt=ot)},reset:function(){I=!1,ne=null,$=null,oe=null,pe=null,Q=null,Se=null,Me=null,mt=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d={},f=new WeakMap,g=[],y=null,m=!1,p=null,S=null,b=null,v=null,w=null,E=null,R=null,_=new ze(0,0,0),T=0,P=!1,L=null,U=null,X=null,Z=null,O=null;const q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,J=0;const j=s.getParameter(s.VERSION);j.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(j)[1]),H=J>=1):j.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),H=J>=2);let ue=null,me={};const ve=s.getParameter(s.SCISSOR_BOX),Ye=s.getParameter(s.VIEWPORT),ft=new ut().fromArray(ve),Ze=new ut().fromArray(Ye);function K(I,ne,$,oe){const pe=new Uint8Array(4),Q=s.createTexture();s.bindTexture(I,Q),s.texParameteri(I,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(I,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Se=0;Se<$;Se++)I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY?s.texImage3D(ne,0,s.RGBA,1,1,oe,0,s.RGBA,s.UNSIGNED_BYTE,pe):s.texImage2D(ne+Se,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,pe);return Q}const ie={};ie[s.TEXTURE_2D]=K(s.TEXTURE_2D,s.TEXTURE_2D,1),ie[s.TEXTURE_CUBE_MAP]=K(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[s.TEXTURE_2D_ARRAY]=K(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ie[s.TEXTURE_3D]=K(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(s.DEPTH_TEST),a.setFunc(Ki),yt(!1),wt(el),ee(s.CULL_FACE),Ke(Bn);function ee(I){h[I]!==!0&&(s.enable(I),h[I]=!0)}function Pe(I){h[I]!==!1&&(s.disable(I),h[I]=!1)}function Ne(I,ne){return d[I]!==ne?(s.bindFramebuffer(I,ne),d[I]=ne,I===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ne),I===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ne),!0):!1}function Ae(I,ne){let $=g,oe=!1;if(I){$=f.get(ne),$===void 0&&($=[],f.set(ne,$));const pe=I.textures;if($.length!==pe.length||$[0]!==s.COLOR_ATTACHMENT0){for(let Q=0,Se=pe.length;Q<Se;Q++)$[Q]=s.COLOR_ATTACHMENT0+Q;$.length=pe.length,oe=!0}}else $[0]!==s.BACK&&($[0]=s.BACK,oe=!0);oe&&s.drawBuffers($)}function _t(I){return y!==I?(s.useProgram(I),y=I,!0):!1}const He={[di]:s.FUNC_ADD,[Gh]:s.FUNC_SUBTRACT,[Wh]:s.FUNC_REVERSE_SUBTRACT};He[Xh]=s.MIN,He[qh]=s.MAX;const it={[$h]:s.ZERO,[Yh]:s.ONE,[Zh]:s.SRC_COLOR,[wa]:s.SRC_ALPHA,[tu]:s.SRC_ALPHA_SATURATE,[jh]:s.DST_COLOR,[Jh]:s.DST_ALPHA,[Kh]:s.ONE_MINUS_SRC_COLOR,[Ta]:s.ONE_MINUS_SRC_ALPHA,[eu]:s.ONE_MINUS_DST_COLOR,[Qh]:s.ONE_MINUS_DST_ALPHA,[nu]:s.CONSTANT_COLOR,[iu]:s.ONE_MINUS_CONSTANT_COLOR,[su]:s.CONSTANT_ALPHA,[ru]:s.ONE_MINUS_CONSTANT_ALPHA};function Ke(I,ne,$,oe,pe,Q,Se,Me,mt,ot){if(I===Bn){m===!0&&(Pe(s.BLEND),m=!1);return}if(m===!1&&(ee(s.BLEND),m=!0),I!==Vh){if(I!==p||ot!==P){if((S!==di||w!==di)&&(s.blendEquation(s.FUNC_ADD),S=di,w=di),ot)switch(I){case qi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case tl:s.blendFunc(s.ONE,s.ONE);break;case nl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case il:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ve("WebGLState: Invalid blending: ",I);break}else switch(I){case qi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case tl:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case nl:Ve("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case il:Ve("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ve("WebGLState: Invalid blending: ",I);break}b=null,v=null,E=null,R=null,_.set(0,0,0),T=0,p=I,P=ot}return}pe=pe||ne,Q=Q||$,Se=Se||oe,(ne!==S||pe!==w)&&(s.blendEquationSeparate(He[ne],He[pe]),S=ne,w=pe),($!==b||oe!==v||Q!==E||Se!==R)&&(s.blendFuncSeparate(it[$],it[oe],it[Q],it[Se]),b=$,v=oe,E=Q,R=Se),(Me.equals(_)===!1||mt!==T)&&(s.blendColor(Me.r,Me.g,Me.b,mt),_.copy(Me),T=mt),p=I,P=!1}function We(I,ne){I.side===en?Pe(s.CULL_FACE):ee(s.CULL_FACE);let $=I.side===$t;ne&&($=!$),yt($),I.blending===qi&&I.transparent===!1?Ke(Bn):Ke(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const oe=I.stencilWrite;o.setTest(oe),oe&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),Dt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ee(s.SAMPLE_ALPHA_TO_COVERAGE):Pe(s.SAMPLE_ALPHA_TO_COVERAGE)}function yt(I){L!==I&&(I?s.frontFace(s.CW):s.frontFace(s.CCW),L=I)}function wt(I){I!==kh?(ee(s.CULL_FACE),I!==U&&(I===el?s.cullFace(s.BACK):I===Hh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Pe(s.CULL_FACE),U=I}function Pt(I){I!==X&&(H&&s.lineWidth(I),X=I)}function Dt(I,ne,$){I?(ee(s.POLYGON_OFFSET_FILL),(Z!==ne||O!==$)&&(Z=ne,O=$,a.getReversed()&&(ne=-ne),s.polygonOffset(ne,$))):Pe(s.POLYGON_OFFSET_FILL)}function pt(I){I?ee(s.SCISSOR_TEST):Pe(s.SCISSOR_TEST)}function St(I){I===void 0&&(I=s.TEXTURE0+q-1),ue!==I&&(s.activeTexture(I),ue=I)}function D(I,ne,$){$===void 0&&(ue===null?$=s.TEXTURE0+q-1:$=ue);let oe=me[$];oe===void 0&&(oe={type:void 0,texture:void 0},me[$]=oe),(oe.type!==I||oe.texture!==ne)&&(ue!==$&&(s.activeTexture($),ue=$),s.bindTexture(I,ne||ie[I]),oe.type=I,oe.texture=ne)}function Xt(){const I=me[ue];I!==void 0&&I.type!==void 0&&(s.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Qe(){try{s.compressedTexImage2D(...arguments)}catch(I){Ve("WebGLState:",I)}}function A(){try{s.compressedTexImage3D(...arguments)}catch(I){Ve("WebGLState:",I)}}function x(){try{s.texSubImage2D(...arguments)}catch(I){Ve("WebGLState:",I)}}function F(){try{s.texSubImage3D(...arguments)}catch(I){Ve("WebGLState:",I)}}function k(){try{s.compressedTexSubImage2D(...arguments)}catch(I){Ve("WebGLState:",I)}}function G(){try{s.compressedTexSubImage3D(...arguments)}catch(I){Ve("WebGLState:",I)}}function te(){try{s.texStorage2D(...arguments)}catch(I){Ve("WebGLState:",I)}}function se(){try{s.texStorage3D(...arguments)}catch(I){Ve("WebGLState:",I)}}function W(){try{s.texImage2D(...arguments)}catch(I){Ve("WebGLState:",I)}}function Y(){try{s.texImage3D(...arguments)}catch(I){Ve("WebGLState:",I)}}function re(I){return u[I]!==void 0?u[I]:s.getParameter(I)}function be(I,ne){u[I]!==ne&&(s.pixelStorei(I,ne),u[I]=ne)}function ce(I){ft.equals(I)===!1&&(s.scissor(I.x,I.y,I.z,I.w),ft.copy(I))}function ae(I){Ze.equals(I)===!1&&(s.viewport(I.x,I.y,I.z,I.w),Ze.copy(I))}function Te(I,ne){let $=c.get(ne);$===void 0&&($=new WeakMap,c.set(ne,$));let oe=$.get(I);oe===void 0&&(oe=s.getUniformBlockIndex(ne,I.name),$.set(I,oe))}function Re(I,ne){const oe=c.get(ne).get(I);l.get(ne)!==oe&&(s.uniformBlockBinding(ne,oe,I.__bindingPointIndex),l.set(ne,oe))}function Ue(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},u={},ue=null,me={},d={},f=new WeakMap,g=[],y=null,m=!1,p=null,S=null,b=null,v=null,w=null,E=null,R=null,_=new ze(0,0,0),T=0,P=!1,L=null,U=null,X=null,Z=null,O=null,ft.set(0,0,s.canvas.width,s.canvas.height),Ze.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:Pe,bindFramebuffer:Ne,drawBuffers:Ae,useProgram:_t,setBlending:Ke,setMaterial:We,setFlipSided:yt,setCullFace:wt,setLineWidth:Pt,setPolygonOffset:Dt,setScissorTest:pt,activeTexture:St,bindTexture:D,unbindTexture:Xt,compressedTexImage2D:Qe,compressedTexImage3D:A,texImage2D:W,texImage3D:Y,pixelStorei:be,getParameter:re,updateUBOMapping:Te,uniformBlockBinding:Re,texStorage2D:te,texStorage3D:se,texSubImage2D:x,texSubImage3D:F,compressedTexSubImage2D:k,compressedTexSubImage3D:G,scissor:ce,viewport:ae,reset:Ue}}function Ag(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new le,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(A,x){return g?new OffscreenCanvas(A,x):vr("canvas")}function m(A,x,F){let k=1;const G=Qe(A);if((G.width>F||G.height>F)&&(k=F/Math.max(G.width,G.height)),k<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const te=Math.floor(k*G.width),se=Math.floor(k*G.height);d===void 0&&(d=y(te,se));const W=x?y(te,se):d;return W.width=te,W.height=se,W.getContext("2d").drawImage(A,0,0,te,se),Ce("WebGLRenderer: Texture has been resized from ("+G.width+"x"+G.height+") to ("+te+"x"+se+")."),W}else return"data"in A&&Ce("WebGLRenderer: Image in DataTexture is too big ("+G.width+"x"+G.height+")."),A;return A}function p(A){return A.generateMipmaps}function S(A){s.generateMipmap(A)}function b(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function v(A,x,F,k,G,te=!1){if(A!==null){if(s[A]!==void 0)return s[A];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let se;k&&(se=e.get("EXT_texture_norm16"),se||Ce("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let W=x;if(x===s.RED&&(F===s.FLOAT&&(W=s.R32F),F===s.HALF_FLOAT&&(W=s.R16F),F===s.UNSIGNED_BYTE&&(W=s.R8),F===s.UNSIGNED_SHORT&&se&&(W=se.R16_EXT),F===s.SHORT&&se&&(W=se.R16_SNORM_EXT)),x===s.RED_INTEGER&&(F===s.UNSIGNED_BYTE&&(W=s.R8UI),F===s.UNSIGNED_SHORT&&(W=s.R16UI),F===s.UNSIGNED_INT&&(W=s.R32UI),F===s.BYTE&&(W=s.R8I),F===s.SHORT&&(W=s.R16I),F===s.INT&&(W=s.R32I)),x===s.RG&&(F===s.FLOAT&&(W=s.RG32F),F===s.HALF_FLOAT&&(W=s.RG16F),F===s.UNSIGNED_BYTE&&(W=s.RG8),F===s.UNSIGNED_SHORT&&se&&(W=se.RG16_EXT),F===s.SHORT&&se&&(W=se.RG16_SNORM_EXT)),x===s.RG_INTEGER&&(F===s.UNSIGNED_BYTE&&(W=s.RG8UI),F===s.UNSIGNED_SHORT&&(W=s.RG16UI),F===s.UNSIGNED_INT&&(W=s.RG32UI),F===s.BYTE&&(W=s.RG8I),F===s.SHORT&&(W=s.RG16I),F===s.INT&&(W=s.RG32I)),x===s.RGB_INTEGER&&(F===s.UNSIGNED_BYTE&&(W=s.RGB8UI),F===s.UNSIGNED_SHORT&&(W=s.RGB16UI),F===s.UNSIGNED_INT&&(W=s.RGB32UI),F===s.BYTE&&(W=s.RGB8I),F===s.SHORT&&(W=s.RGB16I),F===s.INT&&(W=s.RGB32I)),x===s.RGBA_INTEGER&&(F===s.UNSIGNED_BYTE&&(W=s.RGBA8UI),F===s.UNSIGNED_SHORT&&(W=s.RGBA16UI),F===s.UNSIGNED_INT&&(W=s.RGBA32UI),F===s.BYTE&&(W=s.RGBA8I),F===s.SHORT&&(W=s.RGBA16I),F===s.INT&&(W=s.RGBA32I)),x===s.RGB&&(F===s.UNSIGNED_SHORT&&se&&(W=se.RGB16_EXT),F===s.SHORT&&se&&(W=se.RGB16_SNORM_EXT),F===s.UNSIGNED_INT_5_9_9_9_REV&&(W=s.RGB9_E5),F===s.UNSIGNED_INT_10F_11F_11F_REV&&(W=s.R11F_G11F_B10F)),x===s.RGBA){const Y=te?_r:Ge.getTransfer(G);F===s.FLOAT&&(W=s.RGBA32F),F===s.HALF_FLOAT&&(W=s.RGBA16F),F===s.UNSIGNED_BYTE&&(W=Y===je?s.SRGB8_ALPHA8:s.RGBA8),F===s.UNSIGNED_SHORT&&se&&(W=se.RGBA16_EXT),F===s.SHORT&&se&&(W=se.RGBA16_SNORM_EXT),F===s.UNSIGNED_SHORT_4_4_4_4&&(W=s.RGBA4),F===s.UNSIGNED_SHORT_5_5_5_1&&(W=s.RGB5_A1)}return(W===s.R16F||W===s.R32F||W===s.RG16F||W===s.RG32F||W===s.RGBA16F||W===s.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function w(A,x){let F;return A?x===null||x===An||x===ws?F=s.DEPTH24_STENCIL8:x===dn?F=s.DEPTH32F_STENCIL8:x===Es&&(F=s.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===An||x===ws?F=s.DEPTH_COMPONENT24:x===dn?F=s.DEPTH_COMPONENT32F:x===Es&&(F=s.DEPTH_COMPONENT16),F}function E(A,x){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ut&&A.minFilter!==Ht?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function R(A){const x=A.target;x.removeEventListener("dispose",R),T(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&u.delete(x)}function _(A){const x=A.target;x.removeEventListener("dispose",_),L(x)}function T(A){const x=n.get(A);if(x.__webglInit===void 0)return;const F=A.source,k=f.get(F);if(k){const G=k[x.__cacheKey];G.usedTimes--,G.usedTimes===0&&P(A),Object.keys(k).length===0&&f.delete(F)}n.remove(A)}function P(A){const x=n.get(A);s.deleteTexture(x.__webglTexture);const F=A.source,k=f.get(F);delete k[x.__cacheKey],a.memory.textures--}function L(A){const x=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(x.__webglFramebuffer[k]))for(let G=0;G<x.__webglFramebuffer[k].length;G++)s.deleteFramebuffer(x.__webglFramebuffer[k][G]);else s.deleteFramebuffer(x.__webglFramebuffer[k]);x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer[k])}else{if(Array.isArray(x.__webglFramebuffer))for(let k=0;k<x.__webglFramebuffer.length;k++)s.deleteFramebuffer(x.__webglFramebuffer[k]);else s.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&s.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let k=0;k<x.__webglColorRenderbuffer.length;k++)x.__webglColorRenderbuffer[k]&&s.deleteRenderbuffer(x.__webglColorRenderbuffer[k]);x.__webglDepthRenderbuffer&&s.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const F=A.textures;for(let k=0,G=F.length;k<G;k++){const te=n.get(F[k]);te.__webglTexture&&(s.deleteTexture(te.__webglTexture),a.memory.textures--),n.remove(F[k])}n.remove(A)}let U=0;function X(){U=0}function Z(){return U}function O(A){U=A}function q(){const A=U;return A>=i.maxTextures&&Ce("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),U+=1,A}function H(A){const x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function J(A,x){const F=n.get(A);if(A.isVideoTexture&&D(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&F.__version!==A.version){const k=A.image;if(k===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{Pe(F,A,x);return}}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,F.__webglTexture,s.TEXTURE0+x)}function j(A,x){const F=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){Pe(F,A,x);return}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,F.__webglTexture,s.TEXTURE0+x)}function ue(A,x){const F=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){Pe(F,A,x);return}t.bindTexture(s.TEXTURE_3D,F.__webglTexture,s.TEXTURE0+x)}function me(A,x){const F=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&F.__version!==A.version){Ne(F,A,x);return}t.bindTexture(s.TEXTURE_CUBE_MAP,F.__webglTexture,s.TEXTURE0+x)}const ve={[Na]:s.REPEAT,[On]:s.CLAMP_TO_EDGE,[Ua]:s.MIRRORED_REPEAT},Ye={[Ut]:s.NEAREST,[lu]:s.NEAREST_MIPMAP_NEAREST,[Us]:s.NEAREST_MIPMAP_LINEAR,[Ht]:s.LINEAR,[Ir]:s.LINEAR_MIPMAP_NEAREST,[mi]:s.LINEAR_MIPMAP_LINEAR},ft={[uu]:s.NEVER,[gu]:s.ALWAYS,[du]:s.LESS,[Io]:s.LEQUAL,[fu]:s.EQUAL,[Do]:s.GEQUAL,[pu]:s.GREATER,[mu]:s.NOTEQUAL};function Ze(A,x){if(x.type===dn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Ht||x.magFilter===Ir||x.magFilter===Us||x.magFilter===mi||x.minFilter===Ht||x.minFilter===Ir||x.minFilter===Us||x.minFilter===mi)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,ve[x.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,ve[x.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,ve[x.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,Ye[x.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,Ye[x.minFilter]),x.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,ft[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ut||x.minFilter!==Us&&x.minFilter!==mi||x.type===dn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");s.texParameterf(A,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function K(A,x){let F=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",R));const k=x.source;let G=f.get(k);G===void 0&&(G={},f.set(k,G));const te=H(x);if(te!==A.__cacheKey){G[te]===void 0&&(G[te]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,F=!0),G[te].usedTimes++;const se=G[A.__cacheKey];se!==void 0&&(G[A.__cacheKey].usedTimes--,se.usedTimes===0&&P(x)),A.__cacheKey=te,A.__webglTexture=G[te].texture}return F}function ie(A,x,F){return Math.floor(Math.floor(A/F)/x)}function ee(A,x,F,k){const te=A.updateRanges;if(te.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,x.width,x.height,F,k,x.data);else{te.sort((be,ce)=>be.start-ce.start);let se=0;for(let be=1;be<te.length;be++){const ce=te[se],ae=te[be],Te=ce.start+ce.count,Re=ie(ae.start,x.width,4),Ue=ie(ce.start,x.width,4);ae.start<=Te+1&&Re===Ue&&ie(ae.start+ae.count-1,x.width,4)===Re?ce.count=Math.max(ce.count,ae.start+ae.count-ce.start):(++se,te[se]=ae)}te.length=se+1;const W=t.getParameter(s.UNPACK_ROW_LENGTH),Y=t.getParameter(s.UNPACK_SKIP_PIXELS),re=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,x.width);for(let be=0,ce=te.length;be<ce;be++){const ae=te[be],Te=Math.floor(ae.start/4),Re=Math.ceil(ae.count/4),Ue=Te%x.width,I=Math.floor(Te/x.width),ne=Re,$=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,Ue),t.pixelStorei(s.UNPACK_SKIP_ROWS,I),t.texSubImage2D(s.TEXTURE_2D,0,Ue,I,ne,$,F,k,x.data)}A.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,W),t.pixelStorei(s.UNPACK_SKIP_PIXELS,Y),t.pixelStorei(s.UNPACK_SKIP_ROWS,re)}}function Pe(A,x,F){let k=s.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(k=s.TEXTURE_2D_ARRAY),x.isData3DTexture&&(k=s.TEXTURE_3D);const G=K(A,x),te=x.source;t.bindTexture(k,A.__webglTexture,s.TEXTURE0+F);const se=n.get(te);if(te.version!==se.__version||G===!0){if(t.activeTexture(s.TEXTURE0+F),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const $=Ge.getPrimaries(Ge.workingColorSpace),oe=x.colorSpace===Qn?null:Ge.getPrimaries(x.colorSpace),pe=x.colorSpace===Qn||$===oe?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}t.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment);let Y=m(x.image,!1,i.maxTextureSize);Y=Xt(x,Y);const re=r.convert(x.format,x.colorSpace),be=r.convert(x.type);let ce=v(x.internalFormat,re,be,x.normalized,x.colorSpace,x.isVideoTexture);Ze(k,x);let ae;const Te=x.mipmaps,Re=x.isVideoTexture!==!0,Ue=se.__version===void 0||G===!0,I=te.dataReady,ne=E(x,Y);if(x.isDepthTexture)ce=w(x.format===gi,x.type),Ue&&(Re?t.texStorage2D(s.TEXTURE_2D,1,ce,Y.width,Y.height):t.texImage2D(s.TEXTURE_2D,0,ce,Y.width,Y.height,0,re,be,null));else if(x.isDataTexture)if(Te.length>0){Re&&Ue&&t.texStorage2D(s.TEXTURE_2D,ne,ce,Te[0].width,Te[0].height);for(let $=0,oe=Te.length;$<oe;$++)ae=Te[$],Re?I&&t.texSubImage2D(s.TEXTURE_2D,$,0,0,ae.width,ae.height,re,be,ae.data):t.texImage2D(s.TEXTURE_2D,$,ce,ae.width,ae.height,0,re,be,ae.data);x.generateMipmaps=!1}else Re?(Ue&&t.texStorage2D(s.TEXTURE_2D,ne,ce,Y.width,Y.height),I&&ee(x,Y,re,be)):t.texImage2D(s.TEXTURE_2D,0,ce,Y.width,Y.height,0,re,be,Y.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Re&&Ue&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ne,ce,Te[0].width,Te[0].height,Y.depth);for(let $=0,oe=Te.length;$<oe;$++)if(ae=Te[$],x.format!==fn)if(re!==null)if(Re){if(I)if(x.layerUpdates.size>0){const pe=Hl(ae.width,ae.height,x.format,x.type);for(const Q of x.layerUpdates){const Se=ae.data.subarray(Q*pe/ae.data.BYTES_PER_ELEMENT,(Q+1)*pe/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,Q,ae.width,ae.height,1,re,Se)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,0,ae.width,ae.height,Y.depth,re,ae.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,$,ce,ae.width,ae.height,Y.depth,0,ae.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Re?I&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,0,ae.width,ae.height,Y.depth,re,be,ae.data):t.texImage3D(s.TEXTURE_2D_ARRAY,$,ce,ae.width,ae.height,Y.depth,0,re,be,ae.data)}else{Re&&Ue&&t.texStorage2D(s.TEXTURE_2D,ne,ce,Te[0].width,Te[0].height);for(let $=0,oe=Te.length;$<oe;$++)ae=Te[$],x.format!==fn?re!==null?Re?I&&t.compressedTexSubImage2D(s.TEXTURE_2D,$,0,0,ae.width,ae.height,re,ae.data):t.compressedTexImage2D(s.TEXTURE_2D,$,ce,ae.width,ae.height,0,ae.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Re?I&&t.texSubImage2D(s.TEXTURE_2D,$,0,0,ae.width,ae.height,re,be,ae.data):t.texImage2D(s.TEXTURE_2D,$,ce,ae.width,ae.height,0,re,be,ae.data)}else if(x.isDataArrayTexture)if(Re){if(Ue&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ne,ce,Y.width,Y.height,Y.depth),I)if(x.layerUpdates.size>0){const $=Hl(Y.width,Y.height,x.format,x.type);for(const oe of x.layerUpdates){const pe=Y.data.subarray(oe*$/Y.data.BYTES_PER_ELEMENT,(oe+1)*$/Y.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,oe,Y.width,Y.height,1,re,be,pe)}x.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,re,be,Y.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ce,Y.width,Y.height,Y.depth,0,re,be,Y.data);else if(x.isData3DTexture)Re?(Ue&&t.texStorage3D(s.TEXTURE_3D,ne,ce,Y.width,Y.height,Y.depth),I&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,re,be,Y.data)):t.texImage3D(s.TEXTURE_3D,0,ce,Y.width,Y.height,Y.depth,0,re,be,Y.data);else if(x.isFramebufferTexture){if(Ue)if(Re)t.texStorage2D(s.TEXTURE_2D,ne,ce,Y.width,Y.height);else{let $=Y.width,oe=Y.height;for(let pe=0;pe<ne;pe++)t.texImage2D(s.TEXTURE_2D,pe,ce,$,oe,0,re,be,null),$>>=1,oe>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in s){const $=s.canvas;if($.hasAttribute("layoutsubtree")||$.setAttribute("layoutsubtree","true"),Y.parentNode!==$){$.appendChild(Y),u.add(x),$.onpaint=oe=>{const pe=oe.changedElements;for(const Q of u)pe.includes(Q.image)&&(Q.needsUpdate=!0)},$.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,Y);else{const pe=s.RGBA,Q=s.RGBA,Se=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,pe,Q,Se,Y)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Te.length>0){if(Re&&Ue){const $=Qe(Te[0]);t.texStorage2D(s.TEXTURE_2D,ne,ce,$.width,$.height)}for(let $=0,oe=Te.length;$<oe;$++)ae=Te[$],Re?I&&t.texSubImage2D(s.TEXTURE_2D,$,0,0,re,be,ae):t.texImage2D(s.TEXTURE_2D,$,ce,re,be,ae);x.generateMipmaps=!1}else if(Re){if(Ue){const $=Qe(Y);t.texStorage2D(s.TEXTURE_2D,ne,ce,$.width,$.height)}I&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,re,be,Y)}else t.texImage2D(s.TEXTURE_2D,0,ce,re,be,Y);p(x)&&S(k),se.__version=te.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Ne(A,x,F){if(x.image.length!==6)return;const k=K(A,x),G=x.source;t.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+F);const te=n.get(G);if(G.version!==te.__version||k===!0){t.activeTexture(s.TEXTURE0+F);const se=Ge.getPrimaries(Ge.workingColorSpace),W=x.colorSpace===Qn?null:Ge.getPrimaries(x.colorSpace),Y=x.colorSpace===Qn||se===W?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Y);const re=x.isCompressedTexture||x.image[0].isCompressedTexture,be=x.image[0]&&x.image[0].isDataTexture,ce=[];for(let Q=0;Q<6;Q++)!re&&!be?ce[Q]=m(x.image[Q],!0,i.maxCubemapSize):ce[Q]=be?x.image[Q].image:x.image[Q],ce[Q]=Xt(x,ce[Q]);const ae=ce[0],Te=r.convert(x.format,x.colorSpace),Re=r.convert(x.type),Ue=v(x.internalFormat,Te,Re,x.normalized,x.colorSpace),I=x.isVideoTexture!==!0,ne=te.__version===void 0||k===!0,$=G.dataReady;let oe=E(x,ae);Ze(s.TEXTURE_CUBE_MAP,x);let pe;if(re){I&&ne&&t.texStorage2D(s.TEXTURE_CUBE_MAP,oe,Ue,ae.width,ae.height);for(let Q=0;Q<6;Q++){pe=ce[Q].mipmaps;for(let Se=0;Se<pe.length;Se++){const Me=pe[Se];x.format!==fn?Te!==null?I?$&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,0,0,Me.width,Me.height,Te,Me.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,Ue,Me.width,Me.height,0,Me.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,0,0,Me.width,Me.height,Te,Re,Me.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,Ue,Me.width,Me.height,0,Te,Re,Me.data)}}}else{if(pe=x.mipmaps,I&&ne){pe.length>0&&oe++;const Q=Qe(ce[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,oe,Ue,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(be){I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ce[Q].width,ce[Q].height,Te,Re,ce[Q].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ue,ce[Q].width,ce[Q].height,0,Te,Re,ce[Q].data);for(let Se=0;Se<pe.length;Se++){const mt=pe[Se].image[Q].image;I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,0,0,mt.width,mt.height,Te,Re,mt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,Ue,mt.width,mt.height,0,Te,Re,mt.data)}}else{I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Te,Re,ce[Q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ue,Te,Re,ce[Q]);for(let Se=0;Se<pe.length;Se++){const Me=pe[Se];I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,0,0,Te,Re,Me.image[Q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,Ue,Te,Re,Me.image[Q])}}}p(x)&&S(s.TEXTURE_CUBE_MAP),te.__version=G.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Ae(A,x,F,k,G,te){const se=r.convert(F.format,F.colorSpace),W=r.convert(F.type),Y=v(F.internalFormat,se,W,F.normalized,F.colorSpace),re=n.get(x),be=n.get(F);if(be.__renderTarget=x,!re.__hasExternalTextures){const ce=Math.max(1,x.width>>te),ae=Math.max(1,x.height>>te);G===s.TEXTURE_3D||G===s.TEXTURE_2D_ARRAY?t.texImage3D(G,te,Y,ce,ae,x.depth,0,se,W,null):t.texImage2D(G,te,Y,ce,ae,0,se,W,null)}t.bindFramebuffer(s.FRAMEBUFFER,A),St(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,k,G,be.__webglTexture,0,pt(x)):(G===s.TEXTURE_2D||G>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&G<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,k,G,be.__webglTexture,te),t.bindFramebuffer(s.FRAMEBUFFER,null)}function _t(A,x,F){if(s.bindRenderbuffer(s.RENDERBUFFER,A),x.depthBuffer){const k=x.depthTexture,G=k&&k.isDepthTexture?k.type:null,te=w(x.stencilBuffer,G),se=x.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;St(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,pt(x),te,x.width,x.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,pt(x),te,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,te,x.width,x.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,se,s.RENDERBUFFER,A)}else{const k=x.textures;for(let G=0;G<k.length;G++){const te=k[G],se=r.convert(te.format,te.colorSpace),W=r.convert(te.type),Y=v(te.internalFormat,se,W,te.normalized,te.colorSpace);St(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,pt(x),Y,x.width,x.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,pt(x),Y,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,Y,x.width,x.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function He(A,x,F){const k=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const G=n.get(x.depthTexture);if(G.__renderTarget=x,(!G.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),k){if(G.__webglInit===void 0&&(G.__webglInit=!0,x.depthTexture.addEventListener("dispose",R)),G.__webglTexture===void 0){G.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture),Ze(s.TEXTURE_CUBE_MAP,x.depthTexture);const re=r.convert(x.depthTexture.format),be=r.convert(x.depthTexture.type);let ce;x.depthTexture.format===Vn?ce=s.DEPTH_COMPONENT24:x.depthTexture.format===gi&&(ce=s.DEPTH24_STENCIL8);for(let ae=0;ae<6;ae++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,ce,x.width,x.height,0,re,be,null)}}else J(x.depthTexture,0);const te=G.__webglTexture,se=pt(x),W=k?s.TEXTURE_CUBE_MAP_POSITIVE_X+F:s.TEXTURE_2D,Y=x.depthTexture.format===gi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(x.depthTexture.format===Vn)St(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Y,W,te,0,se):s.framebufferTexture2D(s.FRAMEBUFFER,Y,W,te,0);else if(x.depthTexture.format===gi)St(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Y,W,te,0,se):s.framebufferTexture2D(s.FRAMEBUFFER,Y,W,te,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function it(A){const x=n.get(A),F=A.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==A.depthTexture){const k=A.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),k){const G=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,k.removeEventListener("dispose",G)};k.addEventListener("dispose",G),x.__depthDisposeCallback=G}x.__boundDepthTexture=k}if(A.depthTexture&&!x.__autoAllocateDepthBuffer)if(F)for(let k=0;k<6;k++)He(x.__webglFramebuffer[k],A,k);else{const k=A.texture.mipmaps;k&&k.length>0?He(x.__webglFramebuffer[0],A,0):He(x.__webglFramebuffer,A,0)}else if(F){x.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(t.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[k]),x.__webglDepthbuffer[k]===void 0)x.__webglDepthbuffer[k]=s.createRenderbuffer(),_t(x.__webglDepthbuffer[k],A,!1);else{const G=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,te=x.__webglDepthbuffer[k];s.bindRenderbuffer(s.RENDERBUFFER,te),s.framebufferRenderbuffer(s.FRAMEBUFFER,G,s.RENDERBUFFER,te)}}else{const k=A.texture.mipmaps;if(k&&k.length>0?t.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=s.createRenderbuffer(),_t(x.__webglDepthbuffer,A,!1);else{const G=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,te=x.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,te),s.framebufferRenderbuffer(s.FRAMEBUFFER,G,s.RENDERBUFFER,te)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ke(A,x,F){const k=n.get(A);x!==void 0&&Ae(k.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),F!==void 0&&it(A)}function We(A){const x=A.texture,F=n.get(A),k=n.get(x);A.addEventListener("dispose",_);const G=A.textures,te=A.isWebGLCubeRenderTarget===!0,se=G.length>1;if(se||(k.__webglTexture===void 0&&(k.__webglTexture=s.createTexture()),k.__version=x.version,a.memory.textures++),te){F.__webglFramebuffer=[];for(let W=0;W<6;W++)if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer[W]=[];for(let Y=0;Y<x.mipmaps.length;Y++)F.__webglFramebuffer[W][Y]=s.createFramebuffer()}else F.__webglFramebuffer[W]=s.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer=[];for(let W=0;W<x.mipmaps.length;W++)F.__webglFramebuffer[W]=s.createFramebuffer()}else F.__webglFramebuffer=s.createFramebuffer();if(se)for(let W=0,Y=G.length;W<Y;W++){const re=n.get(G[W]);re.__webglTexture===void 0&&(re.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&St(A)===!1){F.__webglMultisampledFramebuffer=s.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let W=0;W<G.length;W++){const Y=G[W];F.__webglColorRenderbuffer[W]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,F.__webglColorRenderbuffer[W]);const re=r.convert(Y.format,Y.colorSpace),be=r.convert(Y.type),ce=v(Y.internalFormat,re,be,Y.normalized,Y.colorSpace,A.isXRRenderTarget===!0),ae=pt(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,ae,ce,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+W,s.RENDERBUFFER,F.__webglColorRenderbuffer[W])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(F.__webglDepthRenderbuffer=s.createRenderbuffer(),_t(F.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(te){t.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture),Ze(s.TEXTURE_CUBE_MAP,x);for(let W=0;W<6;W++)if(x.mipmaps&&x.mipmaps.length>0)for(let Y=0;Y<x.mipmaps.length;Y++)Ae(F.__webglFramebuffer[W][Y],A,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+W,Y);else Ae(F.__webglFramebuffer[W],A,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+W,0);p(x)&&S(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){for(let W=0,Y=G.length;W<Y;W++){const re=G[W],be=n.get(re);let ce=s.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ce=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ce,be.__webglTexture),Ze(ce,re),Ae(F.__webglFramebuffer,A,re,s.COLOR_ATTACHMENT0+W,ce,0),p(re)&&S(ce)}t.unbindTexture()}else{let W=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(W=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(W,k.__webglTexture),Ze(W,x),x.mipmaps&&x.mipmaps.length>0)for(let Y=0;Y<x.mipmaps.length;Y++)Ae(F.__webglFramebuffer[Y],A,x,s.COLOR_ATTACHMENT0,W,Y);else Ae(F.__webglFramebuffer,A,x,s.COLOR_ATTACHMENT0,W,0);p(x)&&S(W),t.unbindTexture()}A.depthBuffer&&it(A)}function yt(A){const x=A.textures;for(let F=0,k=x.length;F<k;F++){const G=x[F];if(p(G)){const te=b(A),se=n.get(G).__webglTexture;t.bindTexture(te,se),S(te),t.unbindTexture()}}}const wt=[],Pt=[];function Dt(A){if(A.samples>0){if(St(A)===!1){const x=A.textures,F=A.width,k=A.height;let G=s.COLOR_BUFFER_BIT;const te=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,se=n.get(A),W=x.length>1;if(W)for(let re=0;re<x.length;re++)t.bindFramebuffer(s.FRAMEBUFFER,se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+re,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+re,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer);const Y=A.texture.mipmaps;Y&&Y.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,se.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let re=0;re<x.length;re++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(G|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(G|=s.STENCIL_BUFFER_BIT)),W){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,se.__webglColorRenderbuffer[re]);const be=n.get(x[re]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,be,0)}s.blitFramebuffer(0,0,F,k,0,0,F,k,G,s.NEAREST),l===!0&&(wt.length=0,Pt.length=0,wt.push(s.COLOR_ATTACHMENT0+re),A.depthBuffer&&A.resolveDepthBuffer===!1&&(wt.push(te),Pt.push(te),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Pt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,wt))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),W)for(let re=0;re<x.length;re++){t.bindFramebuffer(s.FRAMEBUFFER,se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+re,s.RENDERBUFFER,se.__webglColorRenderbuffer[re]);const be=n.get(x[re]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+re,s.TEXTURE_2D,be,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const x=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[x])}}}function pt(A){return Math.min(i.maxSamples,A.samples)}function St(A){const x=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function D(A){const x=a.render.frame;h.get(A)!==x&&(h.set(A,x),A.update())}function Xt(A,x){const F=A.colorSpace,k=A.format,G=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||F!==xr&&F!==Qn&&(Ge.getTransfer(F)===je?(k!==fn||G!==tn)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ve("WebGLTextures: Unsupported texture color space:",F)),x}function Qe(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=X,this.getTextureUnits=Z,this.setTextureUnits=O,this.setTexture2D=J,this.setTexture2DArray=j,this.setTexture3D=ue,this.setTextureCube=me,this.rebindTextures=Ke,this.setupRenderTarget=We,this.updateRenderTargetMipmap=yt,this.updateMultisampleRenderTarget=Dt,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=St,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Rg(s,e){function t(n,i=Qn){let r;const a=Ge.getTransfer(i);if(n===tn)return s.UNSIGNED_BYTE;if(n===To)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ao)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Oc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Bc)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Uc)return s.BYTE;if(n===Fc)return s.SHORT;if(n===Es)return s.UNSIGNED_SHORT;if(n===wo)return s.INT;if(n===An)return s.UNSIGNED_INT;if(n===dn)return s.FLOAT;if(n===Hn)return s.HALF_FLOAT;if(n===zc)return s.ALPHA;if(n===kc)return s.RGB;if(n===fn)return s.RGBA;if(n===Vn)return s.DEPTH_COMPONENT;if(n===gi)return s.DEPTH_STENCIL;if(n===Ro)return s.RED;if(n===Co)return s.RED_INTEGER;if(n===_i)return s.RG;if(n===Po)return s.RG_INTEGER;if(n===Lo)return s.RGBA_INTEGER;if(n===hr||n===ur||n===dr||n===fr)if(a===je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===hr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===hr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ur)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===fr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Fa||n===Oa||n===Ba||n===za)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Fa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Oa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ba)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===za)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ka||n===Ha||n===Va||n===Ga||n===Wa||n===mr||n===Xa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ka||n===Ha)return a===je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Va)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ga)return r.COMPRESSED_R11_EAC;if(n===Wa)return r.COMPRESSED_SIGNED_R11_EAC;if(n===mr)return r.COMPRESSED_RG11_EAC;if(n===Xa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===qa||n===$a||n===Ya||n===Za||n===Ka||n===Ja||n===Qa||n===ja||n===eo||n===to||n===no||n===io||n===so||n===ro)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===qa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===$a)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ya)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Za)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ka)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ja)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Qa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ja)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===eo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===to)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===no)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===io)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===so)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ro)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ao||n===oo||n===lo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ao)return a===je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===oo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===lo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===co||n===ho||n===gr||n===uo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===co)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ho)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===gr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===uo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ws?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const Cg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Pg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Lg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Qc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Rn({vertexShader:Cg,fragmentShader:Pg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ct(new Mi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ig extends yi{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const y=typeof XRWebGLBinding<"u",m=new Lg,p={},S=t.getContextAttributes();let b=null,v=null;const w=[],E=[],R=new le;let _=null;const T=new jt;T.viewport=new ut;const P=new jt;P.viewport=new ut;const L=[T,P],U=new kd;let X=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ie=w[K];return ie===void 0&&(ie=new kr,w[K]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(K){let ie=w[K];return ie===void 0&&(ie=new kr,w[K]=ie),ie.getGripSpace()},this.getHand=function(K){let ie=w[K];return ie===void 0&&(ie=new kr,w[K]=ie),ie.getHandSpace()};function O(K){const ie=E.indexOf(K.inputSource);if(ie===-1)return;const ee=w[ie];ee!==void 0&&(ee.update(K.inputSource,K.frame,c||a),ee.dispatchEvent({type:K.type,data:K.inputSource}))}function q(){i.removeEventListener("select",O),i.removeEventListener("selectstart",O),i.removeEventListener("selectend",O),i.removeEventListener("squeeze",O),i.removeEventListener("squeezestart",O),i.removeEventListener("squeezeend",O),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",H);for(let K=0;K<w.length;K++){const ie=E[K];ie!==null&&(E[K]=null,w[K].disconnect(ie))}X=null,Z=null,m.reset();for(const K in p)delete p[K];e.setRenderTarget(b),f=null,d=null,u=null,i=null,v=null,Ze.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(K){if(i=K,i!==null){if(b=e.getRenderTarget(),i.addEventListener("select",O),i.addEventListener("selectstart",O),i.addEventListener("selectend",O),i.addEventListener("squeeze",O),i.addEventListener("squeezestart",O),i.addEventListener("squeezeend",O),i.addEventListener("end",q),i.addEventListener("inputsourceschange",H),S.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let ee=null,Pe=null,Ne=null;S.depth&&(Ne=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=S.stencil?gi:Vn,Pe=S.stencil?ws:An);const Ae={colorFormat:t.RGBA8,depthFormat:Ne,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Ae),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new wn(d.textureWidth,d.textureHeight,{format:fn,type:tn,depthTexture:new Qi(d.textureWidth,d.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ee={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,ee),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new wn(f.framebufferWidth,f.framebufferHeight,{format:fn,type:tn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Ze.setContext(i),Ze.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function H(K){for(let ie=0;ie<K.removed.length;ie++){const ee=K.removed[ie],Pe=E.indexOf(ee);Pe>=0&&(E[Pe]=null,w[Pe].disconnect(ee))}for(let ie=0;ie<K.added.length;ie++){const ee=K.added[ie];let Pe=E.indexOf(ee);if(Pe===-1){for(let Ae=0;Ae<w.length;Ae++)if(Ae>=E.length){E.push(ee),Pe=Ae;break}else if(E[Ae]===null){E[Ae]=ee,Pe=Ae;break}if(Pe===-1)break}const Ne=w[Pe];Ne&&Ne.connect(ee)}}const J=new C,j=new C;function ue(K,ie,ee){J.setFromMatrixPosition(ie.matrixWorld),j.setFromMatrixPosition(ee.matrixWorld);const Pe=J.distanceTo(j),Ne=ie.projectionMatrix.elements,Ae=ee.projectionMatrix.elements,_t=Ne[14]/(Ne[10]-1),He=Ne[14]/(Ne[10]+1),it=(Ne[9]+1)/Ne[5],Ke=(Ne[9]-1)/Ne[5],We=(Ne[8]-1)/Ne[0],yt=(Ae[8]+1)/Ae[0],wt=_t*We,Pt=_t*yt,Dt=Pe/(-We+yt),pt=Dt*-We;if(ie.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(pt),K.translateZ(Dt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Ne[10]===-1)K.projectionMatrix.copy(ie.projectionMatrix),K.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const St=_t+Dt,D=He+Dt,Xt=wt-pt,Qe=Pt+(Pe-pt),A=it*He/D*St,x=Ke*He/D*St;K.projectionMatrix.makePerspective(Xt,Qe,A,x,St,D),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function me(K,ie){ie===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ie.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(i===null)return;let ie=K.near,ee=K.far;m.texture!==null&&(m.depthNear>0&&(ie=m.depthNear),m.depthFar>0&&(ee=m.depthFar)),U.near=P.near=T.near=ie,U.far=P.far=T.far=ee,(X!==U.near||Z!==U.far)&&(i.updateRenderState({depthNear:U.near,depthFar:U.far}),X=U.near,Z=U.far),U.layers.mask=K.layers.mask|6,T.layers.mask=U.layers.mask&-5,P.layers.mask=U.layers.mask&-3;const Pe=K.parent,Ne=U.cameras;me(U,Pe);for(let Ae=0;Ae<Ne.length;Ae++)me(Ne[Ae],Pe);Ne.length===2?ue(U,T,P):U.projectionMatrix.copy(T.projectionMatrix),ve(K,U,Pe)};function ve(K,ie,ee){ee===null?K.matrix.copy(ie.matrixWorld):(K.matrix.copy(ee.matrixWorld),K.matrix.invert(),K.matrix.multiply(ie.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ie.projectionMatrix),K.projectionMatrixInverse.copy(ie.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=mo*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(K){return p[K]};let Ye=null;function ft(K,ie){if(h=ie.getViewerPose(c||a),g=ie,h!==null){const ee=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Pe=!1;ee.length!==U.cameras.length&&(U.cameras.length=0,Pe=!0);for(let He=0;He<ee.length;He++){const it=ee[He];let Ke=null;if(f!==null)Ke=f.getViewport(it);else{const yt=u.getViewSubImage(d,it);Ke=yt.viewport,He===0&&(e.setRenderTargetTextures(v,yt.colorTexture,yt.depthStencilTexture),e.setRenderTarget(v))}let We=L[He];We===void 0&&(We=new jt,We.layers.enable(He),We.viewport=new ut,L[He]=We),We.matrix.fromArray(it.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(it.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),He===0&&(U.matrix.copy(We.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Pe===!0&&U.cameras.push(We)}const Ne=i.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&y){u=n.getBinding();const He=u.getDepthInformation(ee[0]);He&&He.isValid&&He.texture&&m.init(He,i.renderState)}if(Ne&&Ne.includes("camera-access")&&y){e.state.unbindTexture(),u=n.getBinding();for(let He=0;He<ee.length;He++){const it=ee[He].camera;if(it){let Ke=p[it];Ke||(Ke=new Qc,p[it]=Ke);const We=u.getCameraImage(it);Ke.sourceTexture=We}}}}for(let ee=0;ee<w.length;ee++){const Pe=E[ee],Ne=w[ee];Pe!==null&&Ne!==void 0&&Ne.update(Pe,ie,c||a)}Ye&&Ye(K,ie),ie.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ie}),g=null}const Ze=new ph;Ze.setAnimationLoop(ft),this.setAnimationLoop=function(K){Ye=K},this.dispose=function(){}}}const Dg=new $e,yh=new De;yh.set(-1,0,0,0,1,0,0,0,1);function Ng(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,lh(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,S,b,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,S,b):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===$t&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===$t&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),b=S.envMap,v=S.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(Dg.makeRotationFromEuler(v)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(yh),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===$t&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Ug(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,w){const E=w.program;n.uniformBlockBinding(v,E)}function c(v,w){let E=i[v.id];E===void 0&&(m(v),E=h(v),i[v.id]=E,v.addEventListener("dispose",S));const R=w.program;n.updateUBOMapping(v,R);const _=e.render.frame;r[v.id]!==_&&(d(v),r[v.id]=_)}function h(v){const w=u();v.__bindingPointIndex=w;const E=s.createBuffer(),R=v.__size,_=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,R,_),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,w,E),E}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Ve("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const w=i[v.id],E=v.uniforms,R=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,w);for(let _=0,T=E.length;_<T;_++){const P=E[_];if(Array.isArray(P))for(let L=0,U=P.length;L<U;L++)f(P[L],_,L,R);else f(P,_,0,R)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(v,w,E,R){if(y(v,w,E,R)===!0){const _=v.__offset,T=v.value;if(Array.isArray(T)){let P=0;for(let L=0;L<T.length;L++){const U=T[L],X=p(U);g(U,v.__data,P),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(P+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(T,v.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,_,v.__data)}}function g(v,w,E){typeof v=="number"||typeof v=="boolean"?w[0]=v:v.isMatrix3?(w[0]=v.elements[0],w[1]=v.elements[1],w[2]=v.elements[2],w[3]=0,w[4]=v.elements[3],w[5]=v.elements[4],w[6]=v.elements[5],w[7]=0,w[8]=v.elements[6],w[9]=v.elements[7],w[10]=v.elements[8],w[11]=0):ArrayBuffer.isView(v)?w.set(new v.constructor(v.buffer,v.byteOffset,w.length)):v.toArray(w,E)}function y(v,w,E,R){const _=v.value,T=w+"_"+E;if(R[T]===void 0)return typeof _=="number"||typeof _=="boolean"?R[T]=_:ArrayBuffer.isView(_)?R[T]=_.slice():R[T]=_.clone(),!0;{const P=R[T];if(typeof _=="number"||typeof _=="boolean"){if(P!==_)return R[T]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(P.equals(_)===!1)return P.copy(_),!0}}return!1}function m(v){const w=v.uniforms;let E=0;const R=16;for(let T=0,P=w.length;T<P;T++){const L=Array.isArray(w[T])?w[T]:[w[T]];for(let U=0,X=L.length;U<X;U++){const Z=L[U],O=Array.isArray(Z.value)?Z.value:[Z.value];for(let q=0,H=O.length;q<H;q++){const J=O[q],j=p(J),ue=E%R,me=ue%j.boundary,ve=ue+me;E+=me,ve!==0&&R-ve<j.storage&&(E+=R-ve),Z.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),Z.__offset=E,E+=j.storage}}}const _=E%R;return _>0&&(E+=R-_),v.__size=E,v.__cache={},this}function p(v){const w={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(w.boundary=4,w.storage=4):v.isVector2?(w.boundary=8,w.storage=8):v.isVector3||v.isColor?(w.boundary=16,w.storage=12):v.isVector4?(w.boundary=16,w.storage=16):v.isMatrix3?(w.boundary=48,w.storage=48):v.isMatrix4?(w.boundary=64,w.storage=64):v.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(w.boundary=16,w.storage=v.byteLength):Ce("WebGLRenderer: Unsupported uniform value type.",v),w}function S(v){const w=v.target;w.removeEventListener("dispose",S);const E=a.indexOf(w.__bindingPointIndex);a.splice(E,1),s.deleteBuffer(i[w.id]),delete i[w.id],delete r[w.id]}function b(){for(const v in i)s.deleteBuffer(i[v]);a=[],i={},r={}}return{bind:l,update:c,dispose:b}}const Fg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let vn=null;function Og(){return vn===null&&(vn=new Kc(Fg,16,16,_i,Hn),vn.name="DFG_LUT",vn.minFilter=Ht,vn.magFilter=Ht,vn.wrapS=On,vn.wrapT=On,vn.generateMipmaps=!1,vn.needsUpdate=!0),vn}class Sh{constructor(e={}){const{canvas:t=_u(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=tn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const y=f,m=new Set([Lo,Po,Co]),p=new Set([tn,An,Es,ws,To,Ao]),S=new Uint32Array(4),b=new Int32Array(4),v=new C;let w=null,E=null;const R=[],_=[];let T=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=En,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let L=!1,U=null,X=null,Z=null,O=null;this._outputColorSpace=Qt;let q=0,H=0,J=null,j=-1,ue=null;const me=new ut,ve=new ut;let Ye=null;const ft=new ze(0);let Ze=0,K=t.width,ie=t.height,ee=1,Pe=null,Ne=null;const Ae=new ut(0,0,K,ie),_t=new ut(0,0,K,ie);let He=!1;const it=new Oo;let Ke=!1,We=!1;const yt=new $e,wt=new C,Pt=new ut,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pt=!1;function St(){return J===null?ee:1}let D=n;function Xt(M,N){return t.getContext(M,N)}try{const M={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Eo}`),t.addEventListener("webglcontextlost",mt,!1),t.addEventListener("webglcontextrestored",ot,!1),t.addEventListener("webglcontextcreationerror",mn,!1),D===null){const N="webgl2";if(D=Xt(N,M),D===null)throw Xt(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(M){throw Ve("WebGLRenderer: "+M.message),M}let Qe,A,x,F,k,G,te,se,W,Y,re,be,ce,ae,Te,Re,Ue,I,ne,$,oe,pe,Q;function Se(){Qe=new Om(D),Qe.init(),oe=new Rg(D,Qe),A=new Cm(D,Qe,e,oe),x=new Tg(D,Qe),A.reversedDepthBuffer&&d&&x.buffers.depth.setReversed(!0),X=D.createFramebuffer(),Z=D.createFramebuffer(),O=D.createFramebuffer(),F=new km(D),k=new dg,G=new Ag(D,Qe,x,k,A,oe,F),te=new Fm(P),se=new Gd(D),pe=new Am(D,se),W=new Bm(D,se,F,pe),Y=new Vm(D,W,se,pe,F),I=new Hm(D,A,G),Te=new Pm(k),re=new ug(P,te,Qe,A,pe,Te),be=new Ng(P,k),ce=new pg,ae=new Mg(Qe),Ue=new Tm(P,te,x,Y,g,l),Re=new wg(P,Y,A),Q=new Ug(D,F,A,x),ne=new Rm(D,Qe,F),$=new zm(D,Qe,F),F.programs=re.programs,P.capabilities=A,P.extensions=Qe,P.properties=k,P.renderLists=ce,P.shadowMap=Re,P.state=x,P.info=F}Se(),y!==tn&&(T=new Wm(y,t.width,t.height,o,i,r));const Me=new Ig(P,D);this.xr=Me,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const M=Qe.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Qe.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(M){M!==void 0&&(ee=M,this.setSize(K,ie,!1))},this.getSize=function(M){return M.set(K,ie)},this.setSize=function(M,N,V=!0){if(Me.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}K=M,ie=N,t.width=Math.floor(M*ee),t.height=Math.floor(N*ee),V===!0&&(t.style.width=M+"px",t.style.height=N+"px"),T!==null&&T.setSize(t.width,t.height),this.setViewport(0,0,M,N)},this.getDrawingBufferSize=function(M){return M.set(K*ee,ie*ee).floor()},this.setDrawingBufferSize=function(M,N,V){K=M,ie=N,ee=V,t.width=Math.floor(M*V),t.height=Math.floor(N*V),this.setViewport(0,0,M,N)},this.setEffects=function(M){if(y===tn){Ve("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let N=0;N<M.length;N++)if(M[N].isOutputPass===!0){Ce("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(me)},this.getViewport=function(M){return M.copy(Ae)},this.setViewport=function(M,N,V,B){M.isVector4?Ae.set(M.x,M.y,M.z,M.w):Ae.set(M,N,V,B),x.viewport(me.copy(Ae).multiplyScalar(ee).round())},this.getScissor=function(M){return M.copy(_t)},this.setScissor=function(M,N,V,B){M.isVector4?_t.set(M.x,M.y,M.z,M.w):_t.set(M,N,V,B),x.scissor(ve.copy(_t).multiplyScalar(ee).round())},this.getScissorTest=function(){return He},this.setScissorTest=function(M){x.setScissorTest(He=M)},this.setOpaqueSort=function(M){Pe=M},this.setTransparentSort=function(M){Ne=M},this.getClearColor=function(M){return M.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor(...arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha(...arguments)},this.clear=function(M=!0,N=!0,V=!0){let B=0;if(M){let z=!1;if(J!==null){const fe=J.texture.format;z=m.has(fe)}if(z){const fe=J.texture.type,_e=p.has(fe),de=Ue.getClearColor(),ye=Ue.getClearAlpha(),Ee=de.r,Fe=de.g,Be=de.b;_e?(S[0]=Ee,S[1]=Fe,S[2]=Be,S[3]=ye,D.clearBufferuiv(D.COLOR,0,S)):(b[0]=Ee,b[1]=Fe,b[2]=Be,b[3]=ye,D.clearBufferiv(D.COLOR,0,b))}else B|=D.COLOR_BUFFER_BIT}N&&(B|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),V&&(B|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&D.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),U=M},this.dispose=function(){t.removeEventListener("webglcontextlost",mt,!1),t.removeEventListener("webglcontextrestored",ot,!1),t.removeEventListener("webglcontextcreationerror",mn,!1),Ue.dispose(),ce.dispose(),ae.dispose(),k.dispose(),te.dispose(),Y.dispose(),pe.dispose(),Q.dispose(),re.dispose(),Me.dispose(),Me.removeEventListener("sessionstart",qo),Me.removeEventListener("sessionend",$o),ri.stop()};function mt(M){M.preventDefault(),Mr("WebGLRenderer: Context Lost."),L=!0}function ot(){Mr("WebGLRenderer: Context Restored."),L=!1;const M=F.autoReset,N=Re.enabled,V=Re.autoUpdate,B=Re.needsUpdate,z=Re.type;Se(),F.autoReset=M,Re.enabled=N,Re.autoUpdate=V,Re.needsUpdate=B,Re.type=z}function mn(M){Ve("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function gn(M){const N=M.target;N.removeEventListener("dispose",gn),Dh(N)}function Dh(M){Nh(M),k.remove(M)}function Nh(M){const N=k.get(M).programs;N!==void 0&&(N.forEach(function(V){re.releaseProgram(V)}),M.isShaderMaterial&&re.releaseShaderCache(M))}this.renderBufferDirect=function(M,N,V,B,z,fe){N===null&&(N=Dt);const _e=z.isMesh&&z.matrixWorld.determinantAffine()<0,de=Oh(M,N,V,B,z);x.setMaterial(B,_e);let ye=V.index,Ee=1;if(B.wireframe===!0){if(ye=W.getWireframeAttribute(V),ye===void 0)return;Ee=2}const Fe=V.drawRange,Be=V.attributes.position;let we=Fe.start*Ee,tt=(Fe.start+Fe.count)*Ee;fe!==null&&(we=Math.max(we,fe.start*Ee),tt=Math.min(tt,(fe.start+fe.count)*Ee)),ye!==null?(we=Math.max(we,0),tt=Math.min(tt,ye.count)):Be!=null&&(we=Math.max(we,0),tt=Math.min(tt,Be.count));const vt=tt-we;if(vt<0||vt===1/0)return;pe.setup(z,B,de,V,ye);let gt,st=ne;if(ye!==null&&(gt=se.get(ye),st=$,st.setIndex(gt)),z.isMesh)B.wireframe===!0?(x.setLineWidth(B.wireframeLinewidth*St()),st.setMode(D.LINES)):st.setMode(D.TRIANGLES);else if(z.isLine){let Ot=B.linewidth;Ot===void 0&&(Ot=1),x.setLineWidth(Ot*St()),z.isLineSegments?st.setMode(D.LINES):z.isLineLoop?st.setMode(D.LINE_LOOP):st.setMode(D.LINE_STRIP)}else z.isPoints?st.setMode(D.POINTS):z.isSprite&&st.setMode(D.TRIANGLES);if(z.isBatchedMesh)if(Qe.get("WEBGL_multi_draw"))st.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Ot=z._multiDrawStarts,xe=z._multiDrawCounts,Yt=z._multiDrawCount,Xe=ye?se.get(ye).bytesPerElement:1,nn=k.get(B).currentProgram.getUniforms();for(let xn=0;xn<Yt;xn++)nn.setValue(D,"_gl_DrawID",xn),st.render(Ot[xn]/Xe,xe[xn])}else if(z.isInstancedMesh)st.renderInstances(we,vt,z.count);else if(V.isInstancedBufferGeometry){const Ot=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,xe=Math.min(V.instanceCount,Ot);st.renderInstances(we,vt,xe)}else st.render(we,vt)};function Xo(M,N,V){M.transparent===!0&&M.side===en&&M.forceSinglePass===!1?(M.side=$t,M.needsUpdate=!0,Ns(M,N,V),M.side=ti,M.needsUpdate=!0,Ns(M,N,V),M.side=en):Ns(M,N,V)}this.compile=function(M,N,V=null){V===null&&(V=M),E=ae.get(V),E.init(N),_.push(E),V.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(E.pushLight(z),z.castShadow&&E.pushShadow(z))}),M!==V&&M.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(E.pushLight(z),z.castShadow&&E.pushShadow(z))}),E.setupLights();const B=new Set;return M.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const fe=z.material;if(fe)if(Array.isArray(fe))for(let _e=0;_e<fe.length;_e++){const de=fe[_e];Xo(de,V,z),B.add(de)}else Xo(fe,V,z),B.add(fe)}),E=_.pop(),B},this.compileAsync=function(M,N,V=null){const B=this.compile(M,N,V);return new Promise(z=>{function fe(){if(B.forEach(function(_e){k.get(_e).currentProgram.isReady()&&B.delete(_e)}),B.size===0){z(M);return}setTimeout(fe,10)}Qe.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let Rr=null;function Uh(M){Rr&&Rr(M)}function qo(){ri.stop()}function $o(){ri.start()}const ri=new ph;ri.setAnimationLoop(Uh),typeof self<"u"&&ri.setContext(self),this.setAnimationLoop=function(M){Rr=M,Me.setAnimationLoop(M),M===null?ri.stop():ri.start()},Me.addEventListener("sessionstart",qo),Me.addEventListener("sessionend",$o),this.render=function(M,N){if(N!==void 0&&N.isCamera!==!0){Ve("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;U!==null&&U.renderStart(M,N);const V=Me.enabled===!0&&Me.isPresenting===!0,B=T!==null&&(J===null||V)&&T.begin(P,J);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Me.enabled===!0&&Me.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Me.cameraAutoUpdate===!0&&Me.updateCamera(N),N=Me.getCamera()),M.isScene===!0&&M.onBeforeRender(P,M,N,J),E=ae.get(M,_.length),E.init(N),E.state.textureUnits=G.getTextureUnits(),_.push(E),yt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),it.setFromProjectionMatrix(yt,bn,N.reversedDepth),We=this.localClippingEnabled,Ke=Te.init(this.clippingPlanes,We),w=ce.get(M,R.length),w.init(),R.push(w),Me.enabled===!0&&Me.isPresenting===!0){const _e=P.xr.getDepthSensingMesh();_e!==null&&Cr(_e,N,-1/0,P.sortObjects)}Cr(M,N,0,P.sortObjects),w.finish(),P.sortObjects===!0&&w.sort(Pe,Ne,N.reversedDepth),pt=Me.enabled===!1||Me.isPresenting===!1||Me.hasDepthSensing()===!1,pt&&Ue.addToRenderList(w,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ke===!0&&Te.beginShadows();const z=E.state.shadowsArray;if(Re.render(z,M,N),Ke===!0&&Te.endShadows(),(B&&T.hasRenderPass())===!1){const _e=w.opaque,de=w.transmissive;if(E.setupLights(),N.isArrayCamera){const ye=N.cameras;if(de.length>0)for(let Ee=0,Fe=ye.length;Ee<Fe;Ee++){const Be=ye[Ee];Zo(_e,de,M,Be)}pt&&Ue.render(M);for(let Ee=0,Fe=ye.length;Ee<Fe;Ee++){const Be=ye[Ee];Yo(w,M,Be,Be.viewport)}}else de.length>0&&Zo(_e,de,M,N),pt&&Ue.render(M),Yo(w,M,N)}J!==null&&H===0&&(G.updateMultisampleRenderTarget(J),G.updateRenderTargetMipmap(J)),B&&T.end(P),M.isScene===!0&&M.onAfterRender(P,M,N),pe.resetDefaultState(),j=-1,ue=null,_.pop(),_.length>0?(E=_[_.length-1],G.setTextureUnits(E.state.textureUnits),Ke===!0&&Te.setGlobalState(P.clippingPlanes,E.state.camera)):E=null,R.pop(),R.length>0?w=R[R.length-1]:w=null,U!==null&&U.renderEnd()};function Cr(M,N,V,B){if(M.visible===!1)return;if(M.layers.test(N.layers)){if(M.isGroup)V=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(N);else if(M.isLightProbeGrid)E.pushLightProbeGrid(M);else if(M.isLight)E.pushLight(M),M.castShadow&&E.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||it.intersectsSprite(M)){B&&Pt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(yt);const _e=Y.update(M),de=M.material;de.visible&&w.push(M,_e,de,V,Pt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||it.intersectsObject(M))){const _e=Y.update(M),de=M.material;if(B&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Pt.copy(M.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),Pt.copy(_e.boundingSphere.center)),Pt.applyMatrix4(M.matrixWorld).applyMatrix4(yt)),Array.isArray(de)){const ye=_e.groups;for(let Ee=0,Fe=ye.length;Ee<Fe;Ee++){const Be=ye[Ee],we=de[Be.materialIndex];we&&we.visible&&w.push(M,_e,we,V,Pt.z,Be)}}else de.visible&&w.push(M,_e,de,V,Pt.z,null)}}const fe=M.children;for(let _e=0,de=fe.length;_e<de;_e++)Cr(fe[_e],N,V,B)}function Yo(M,N,V,B){const{opaque:z,transmissive:fe,transparent:_e}=M;E.setupLightsView(V),Ke===!0&&Te.setGlobalState(P.clippingPlanes,V),B&&x.viewport(me.copy(B)),z.length>0&&Ds(z,N,V),fe.length>0&&Ds(fe,N,V),_e.length>0&&Ds(_e,N,V),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Zo(M,N,V,B){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[B.id]===void 0){const we=Qe.has("EXT_color_buffer_half_float")||Qe.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[B.id]=new wn(1,1,{generateMipmaps:!0,type:we?Hn:tn,minFilter:mi,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ge.workingColorSpace})}const fe=E.state.transmissionRenderTarget[B.id],_e=B.viewport||me;fe.setSize(_e.z*P.transmissionResolutionScale,_e.w*P.transmissionResolutionScale);const de=P.getRenderTarget(),ye=P.getActiveCubeFace(),Ee=P.getActiveMipmapLevel();P.setRenderTarget(fe),P.getClearColor(ft),Ze=P.getClearAlpha(),Ze<1&&P.setClearColor(16777215,.5),P.clear(),pt&&Ue.render(V);const Fe=P.toneMapping;P.toneMapping=En;const Be=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),E.setupLightsView(B),Ke===!0&&Te.setGlobalState(P.clippingPlanes,B),Ds(M,V,B),G.updateMultisampleRenderTarget(fe),G.updateRenderTargetMipmap(fe),Qe.has("WEBGL_multisampled_render_to_texture")===!1){let we=!1;for(let tt=0,vt=N.length;tt<vt;tt++){const gt=N[tt],{object:st,geometry:Ot,material:xe,group:Yt}=gt;if(xe.side===en&&st.layers.test(B.layers)){const Xe=xe.side;xe.side=$t,xe.needsUpdate=!0,Ko(st,V,B,Ot,xe,Yt),xe.side=Xe,xe.needsUpdate=!0,we=!0}}we===!0&&(G.updateMultisampleRenderTarget(fe),G.updateRenderTargetMipmap(fe))}P.setRenderTarget(de,ye,Ee),P.setClearColor(ft,Ze),Be!==void 0&&(B.viewport=Be),P.toneMapping=Fe}function Ds(M,N,V){const B=N.isScene===!0?N.overrideMaterial:null;for(let z=0,fe=M.length;z<fe;z++){const _e=M[z],{object:de,geometry:ye,group:Ee}=_e;let Fe=_e.material;Fe.allowOverride===!0&&B!==null&&(Fe=B),de.layers.test(V.layers)&&Ko(de,N,V,ye,Fe,Ee)}}function Ko(M,N,V,B,z,fe){M.onBeforeRender(P,N,V,B,z,fe),M.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),z.onBeforeRender(P,N,V,B,M,fe),z.transparent===!0&&z.side===en&&z.forceSinglePass===!1?(z.side=$t,z.needsUpdate=!0,P.renderBufferDirect(V,N,B,z,M,fe),z.side=ti,z.needsUpdate=!0,P.renderBufferDirect(V,N,B,z,M,fe),z.side=en):P.renderBufferDirect(V,N,B,z,M,fe),M.onAfterRender(P,N,V,B,z,fe)}function Ns(M,N,V){N.isScene!==!0&&(N=Dt);const B=k.get(M),z=E.state.lights,fe=E.state.shadowsArray,_e=z.state.version,de=re.getParameters(M,z.state,fe,N,V,E.state.lightProbeGridArray),ye=re.getProgramCacheKey(de);let Ee=B.programs;B.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?N.environment:null,B.fog=N.fog;const Fe=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;B.envMap=te.get(M.envMap||B.environment,Fe),B.envMapRotation=B.environment!==null&&M.envMap===null?N.environmentRotation:M.envMapRotation,Ee===void 0&&(M.addEventListener("dispose",gn),Ee=new Map,B.programs=Ee);let Be=Ee.get(ye);if(Be!==void 0){if(B.currentProgram===Be&&B.lightsStateVersion===_e)return Qo(M,de),Be}else de.uniforms=re.getUniforms(M),U!==null&&M.isNodeMaterial&&U.build(M,V,de),M.onBeforeCompile(de,P),Be=re.acquireProgram(de,ye),Ee.set(ye,Be),B.uniforms=de.uniforms;const we=B.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(we.clippingPlanes=Te.uniform),Qo(M,de),B.needsLights=zh(M),B.lightsStateVersion=_e,B.needsLights&&(we.ambientLightColor.value=z.state.ambient,we.lightProbe.value=z.state.probe,we.directionalLights.value=z.state.directional,we.directionalLightShadows.value=z.state.directionalShadow,we.spotLights.value=z.state.spot,we.spotLightShadows.value=z.state.spotShadow,we.rectAreaLights.value=z.state.rectArea,we.ltc_1.value=z.state.rectAreaLTC1,we.ltc_2.value=z.state.rectAreaLTC2,we.pointLights.value=z.state.point,we.pointLightShadows.value=z.state.pointShadow,we.hemisphereLights.value=z.state.hemi,we.directionalShadowMatrix.value=z.state.directionalShadowMatrix,we.spotLightMatrix.value=z.state.spotLightMatrix,we.spotLightMap.value=z.state.spotLightMap,we.pointShadowMatrix.value=z.state.pointShadowMatrix),B.lightProbeGrid=E.state.lightProbeGridArray.length>0,B.currentProgram=Be,B.uniformsList=null,Be}function Jo(M){if(M.uniformsList===null){const N=M.currentProgram.getUniforms();M.uniformsList=pr.seqWithValue(N.seq,M.uniforms)}return M.uniformsList}function Qo(M,N){const V=k.get(M);V.outputColorSpace=N.outputColorSpace,V.batching=N.batching,V.batchingColor=N.batchingColor,V.instancing=N.instancing,V.instancingColor=N.instancingColor,V.instancingMorph=N.instancingMorph,V.skinning=N.skinning,V.morphTargets=N.morphTargets,V.morphNormals=N.morphNormals,V.morphColors=N.morphColors,V.morphTargetsCount=N.morphTargetsCount,V.numClippingPlanes=N.numClippingPlanes,V.numIntersection=N.numClipIntersection,V.vertexAlphas=N.vertexAlphas,V.vertexTangents=N.vertexTangents,V.toneMapping=N.toneMapping}function Fh(M,N){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;v.setFromMatrixPosition(N.matrixWorld);for(let V=0,B=M.length;V<B;V++){const z=M[V];if(z.texture!==null&&z.boundingBox.containsPoint(v))return z}return null}function Oh(M,N,V,B,z){N.isScene!==!0&&(N=Dt),G.resetTextureUnits();const fe=N.fog,_e=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?N.environment:null,de=J===null?P.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Ge.workingColorSpace,ye=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,Ee=te.get(B.envMap||_e,ye),Fe=B.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Be=!!V.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),we=!!V.morphAttributes.position,tt=!!V.morphAttributes.normal,vt=!!V.morphAttributes.color;let gt=En;B.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(gt=P.toneMapping);const st=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ot=st!==void 0?st.length:0,xe=k.get(B),Yt=E.state.lights;if(Ke===!0&&(We===!0||M!==ue)){const lt=M===ue&&B.id===j;Te.setState(B,M,lt)}let Xe=!1;B.version===xe.__version?(xe.needsLights&&xe.lightsStateVersion!==Yt.state.version||xe.outputColorSpace!==de||z.isBatchedMesh&&xe.batching===!1||!z.isBatchedMesh&&xe.batching===!0||z.isBatchedMesh&&xe.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&xe.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&xe.instancing===!1||!z.isInstancedMesh&&xe.instancing===!0||z.isSkinnedMesh&&xe.skinning===!1||!z.isSkinnedMesh&&xe.skinning===!0||z.isInstancedMesh&&xe.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&xe.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&xe.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&xe.instancingMorph===!1&&z.morphTexture!==null||xe.envMap!==Ee||B.fog===!0&&xe.fog!==fe||xe.numClippingPlanes!==void 0&&(xe.numClippingPlanes!==Te.numPlanes||xe.numIntersection!==Te.numIntersection)||xe.vertexAlphas!==Fe||xe.vertexTangents!==Be||xe.morphTargets!==we||xe.morphNormals!==tt||xe.morphColors!==vt||xe.toneMapping!==gt||xe.morphTargetsCount!==Ot||!!xe.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(Xe=!0):(Xe=!0,xe.__version=B.version);let nn=xe.currentProgram;Xe===!0&&(nn=Ns(B,N,z),U&&B.isNodeMaterial&&U.onUpdateProgram(B,nn,xe));let xn=!1,Gn=!1,Ei=!1;const rt=nn.getUniforms(),Mt=xe.uniforms;if(x.useProgram(nn.program)&&(xn=!0,Gn=!0,Ei=!0),B.id!==j&&(j=B.id,Gn=!0),xe.needsLights){const lt=Fh(E.state.lightProbeGridArray,z);xe.lightProbeGrid!==lt&&(xe.lightProbeGrid=lt,Gn=!0)}if(xn||ue!==M){x.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),rt.setValue(D,"projectionMatrix",M.projectionMatrix),rt.setValue(D,"viewMatrix",M.matrixWorldInverse);const Xn=rt.map.cameraPosition;Xn!==void 0&&Xn.setValue(D,wt.setFromMatrixPosition(M.matrixWorld)),A.logarithmicDepthBuffer&&rt.setValue(D,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&rt.setValue(D,"isOrthographic",M.isOrthographicCamera===!0),ue!==M&&(ue=M,Gn=!0,Ei=!0)}if(xe.needsLights&&(Yt.state.directionalShadowMap.length>0&&rt.setValue(D,"directionalShadowMap",Yt.state.directionalShadowMap,G),Yt.state.spotShadowMap.length>0&&rt.setValue(D,"spotShadowMap",Yt.state.spotShadowMap,G),Yt.state.pointShadowMap.length>0&&rt.setValue(D,"pointShadowMap",Yt.state.pointShadowMap,G)),z.isSkinnedMesh){rt.setOptional(D,z,"bindMatrix"),rt.setOptional(D,z,"bindMatrixInverse");const lt=z.skeleton;lt&&(lt.boneTexture===null&&lt.computeBoneTexture(),rt.setValue(D,"boneTexture",lt.boneTexture,G))}z.isBatchedMesh&&(rt.setOptional(D,z,"batchingTexture"),rt.setValue(D,"batchingTexture",z._matricesTexture,G),rt.setOptional(D,z,"batchingIdTexture"),rt.setValue(D,"batchingIdTexture",z._indirectTexture,G),rt.setOptional(D,z,"batchingColorTexture"),z._colorsTexture!==null&&rt.setValue(D,"batchingColorTexture",z._colorsTexture,G));const Wn=V.morphAttributes;if((Wn.position!==void 0||Wn.normal!==void 0||Wn.color!==void 0)&&I.update(z,V,nn),(Gn||xe.receiveShadow!==z.receiveShadow)&&(xe.receiveShadow=z.receiveShadow,rt.setValue(D,"receiveShadow",z.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&N.environment!==null&&(Mt.envMapIntensity.value=N.environmentIntensity),Mt.dfgLUT!==void 0&&(Mt.dfgLUT.value=Og()),Gn){if(rt.setValue(D,"toneMappingExposure",P.toneMappingExposure),xe.needsLights&&Bh(Mt,Ei),fe&&B.fog===!0&&be.refreshFogUniforms(Mt,fe),be.refreshMaterialUniforms(Mt,B,ee,ie,E.state.transmissionRenderTarget[M.id]),xe.needsLights&&xe.lightProbeGrid){const lt=xe.lightProbeGrid;Mt.probesSH.value=lt.texture,Mt.probesMin.value.copy(lt.boundingBox.min),Mt.probesMax.value.copy(lt.boundingBox.max),Mt.probesResolution.value.copy(lt.resolution)}pr.upload(D,Jo(xe),Mt,G)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(pr.upload(D,Jo(xe),Mt,G),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&rt.setValue(D,"center",z.center),rt.setValue(D,"modelViewMatrix",z.modelViewMatrix),rt.setValue(D,"normalMatrix",z.normalMatrix),rt.setValue(D,"modelMatrix",z.matrixWorld),B.uniformsGroups!==void 0){const lt=B.uniformsGroups;for(let Xn=0,wi=lt.length;Xn<wi;Xn++){const jo=lt[Xn];Q.update(jo,nn),Q.bind(jo,nn)}}return nn}function Bh(M,N){M.ambientLightColor.needsUpdate=N,M.lightProbe.needsUpdate=N,M.directionalLights.needsUpdate=N,M.directionalLightShadows.needsUpdate=N,M.pointLights.needsUpdate=N,M.pointLightShadows.needsUpdate=N,M.spotLights.needsUpdate=N,M.spotLightShadows.needsUpdate=N,M.rectAreaLights.needsUpdate=N,M.hemisphereLights.needsUpdate=N}function zh(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(M,N,V){const B=k.get(M);B.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),k.get(M.texture).__webglTexture=N,k.get(M.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:V,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,N){const V=k.get(M);V.__webglFramebuffer=N,V.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(M,N=0,V=0){J=M,q=N,H=V;let B=null,z=!1,fe=!1;if(M){const de=k.get(M);if(de.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(D.FRAMEBUFFER,de.__webglFramebuffer),me.copy(M.viewport),ve.copy(M.scissor),Ye=M.scissorTest,x.viewport(me),x.scissor(ve),x.setScissorTest(Ye),j=-1;return}else if(de.__webglFramebuffer===void 0)G.setupRenderTarget(M);else if(de.__hasExternalTextures)G.rebindTextures(M,k.get(M.texture).__webglTexture,k.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Fe=M.depthTexture;if(de.__boundDepthTexture!==Fe){if(Fe!==null&&k.has(Fe)&&(M.width!==Fe.image.width||M.height!==Fe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");G.setupDepthRenderbuffer(M)}}const ye=M.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(fe=!0);const Ee=k.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ee[N])?B=Ee[N][V]:B=Ee[N],z=!0):M.samples>0&&G.useMultisampledRTT(M)===!1?B=k.get(M).__webglMultisampledFramebuffer:Array.isArray(Ee)?B=Ee[V]:B=Ee,me.copy(M.viewport),ve.copy(M.scissor),Ye=M.scissorTest}else me.copy(Ae).multiplyScalar(ee).floor(),ve.copy(_t).multiplyScalar(ee).floor(),Ye=He;if(V!==0&&(B=X),x.bindFramebuffer(D.FRAMEBUFFER,B)&&x.drawBuffers(M,B),x.viewport(me),x.scissor(ve),x.setScissorTest(Ye),z){const de=k.get(M.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+N,de.__webglTexture,V)}else if(fe){const de=N;for(let ye=0;ye<M.textures.length;ye++){const Ee=k.get(M.textures[ye]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+ye,Ee.__webglTexture,V,de)}}else if(M!==null&&V!==0){const de=k.get(M.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,de.__webglTexture,V)}j=-1},this.readRenderTargetPixels=function(M,N,V,B,z,fe,_e,de=0){if(!(M&&M.isWebGLRenderTarget)){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=k.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&_e!==void 0&&(ye=ye[_e]),ye){x.bindFramebuffer(D.FRAMEBUFFER,ye);try{const Ee=M.textures[de],Fe=Ee.format,Be=Ee.type;if(M.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+de),!A.textureFormatReadable(Fe)){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!A.textureTypeReadable(Be)){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=M.width-B&&V>=0&&V<=M.height-z&&D.readPixels(N,V,B,z,oe.convert(Fe),oe.convert(Be),fe)}finally{const Ee=J!==null?k.get(J).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(M,N,V,B,z,fe,_e,de=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=k.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&_e!==void 0&&(ye=ye[_e]),ye)if(N>=0&&N<=M.width-B&&V>=0&&V<=M.height-z){x.bindFramebuffer(D.FRAMEBUFFER,ye);const Ee=M.textures[de],Fe=Ee.format,Be=Ee.type;if(M.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+de),!A.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!A.textureTypeReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const we=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,we),D.bufferData(D.PIXEL_PACK_BUFFER,fe.byteLength,D.STREAM_READ),D.readPixels(N,V,B,z,oe.convert(Fe),oe.convert(Be),0);const tt=J!==null?k.get(J).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,tt);const vt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await vu(D,vt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,we),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,fe),D.deleteBuffer(we),D.deleteSync(vt),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,N=null,V=0){const B=Math.pow(2,-V),z=Math.floor(M.image.width*B),fe=Math.floor(M.image.height*B),_e=N!==null?N.x:0,de=N!==null?N.y:0;G.setTexture2D(M,0),D.copyTexSubImage2D(D.TEXTURE_2D,V,0,0,_e,de,z,fe),x.unbindTexture()},this.copyTextureToTexture=function(M,N,V=null,B=null,z=0,fe=0){let _e,de,ye,Ee,Fe,Be,we,tt,vt;const gt=M.isCompressedTexture?M.mipmaps[fe]:M.image;if(V!==null)_e=V.max.x-V.min.x,de=V.max.y-V.min.y,ye=V.isBox3?V.max.z-V.min.z:1,Ee=V.min.x,Fe=V.min.y,Be=V.isBox3?V.min.z:0;else{const Mt=Math.pow(2,-z);_e=Math.floor(gt.width*Mt),de=Math.floor(gt.height*Mt),M.isDataArrayTexture?ye=gt.depth:M.isData3DTexture?ye=Math.floor(gt.depth*Mt):ye=1,Ee=0,Fe=0,Be=0}B!==null?(we=B.x,tt=B.y,vt=B.z):(we=0,tt=0,vt=0);const st=oe.convert(N.format),Ot=oe.convert(N.type);let xe;N.isData3DTexture?(G.setTexture3D(N,0),xe=D.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(G.setTexture2DArray(N,0),xe=D.TEXTURE_2D_ARRAY):(G.setTexture2D(N,0),xe=D.TEXTURE_2D),x.activeTexture(D.TEXTURE0),x.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,N.flipY),x.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),x.pixelStorei(D.UNPACK_ALIGNMENT,N.unpackAlignment);const Yt=x.getParameter(D.UNPACK_ROW_LENGTH),Xe=x.getParameter(D.UNPACK_IMAGE_HEIGHT),nn=x.getParameter(D.UNPACK_SKIP_PIXELS),xn=x.getParameter(D.UNPACK_SKIP_ROWS),Gn=x.getParameter(D.UNPACK_SKIP_IMAGES);x.pixelStorei(D.UNPACK_ROW_LENGTH,gt.width),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,gt.height),x.pixelStorei(D.UNPACK_SKIP_PIXELS,Ee),x.pixelStorei(D.UNPACK_SKIP_ROWS,Fe),x.pixelStorei(D.UNPACK_SKIP_IMAGES,Be);const Ei=M.isDataArrayTexture||M.isData3DTexture,rt=N.isDataArrayTexture||N.isData3DTexture;if(M.isDepthTexture){const Mt=k.get(M),Wn=k.get(N),lt=k.get(Mt.__renderTarget),Xn=k.get(Wn.__renderTarget);x.bindFramebuffer(D.READ_FRAMEBUFFER,lt.__webglFramebuffer),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,Xn.__webglFramebuffer);for(let wi=0;wi<ye;wi++)Ei&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,k.get(M).__webglTexture,z,Be+wi),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,k.get(N).__webglTexture,fe,vt+wi)),D.blitFramebuffer(Ee,Fe,_e,de,we,tt,_e,de,D.DEPTH_BUFFER_BIT,D.NEAREST);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(z!==0||M.isRenderTargetTexture||k.has(M)){const Mt=k.get(M),Wn=k.get(N);x.bindFramebuffer(D.READ_FRAMEBUFFER,Z),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,O);for(let lt=0;lt<ye;lt++)Ei?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Mt.__webglTexture,z,Be+lt):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Mt.__webglTexture,z),rt?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Wn.__webglTexture,fe,vt+lt):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Wn.__webglTexture,fe),z!==0?D.blitFramebuffer(Ee,Fe,_e,de,we,tt,_e,de,D.COLOR_BUFFER_BIT,D.NEAREST):rt?D.copyTexSubImage3D(xe,fe,we,tt,vt+lt,Ee,Fe,_e,de):D.copyTexSubImage2D(xe,fe,we,tt,Ee,Fe,_e,de);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else rt?M.isDataTexture||M.isData3DTexture?D.texSubImage3D(xe,fe,we,tt,vt,_e,de,ye,st,Ot,gt.data):N.isCompressedArrayTexture?D.compressedTexSubImage3D(xe,fe,we,tt,vt,_e,de,ye,st,gt.data):D.texSubImage3D(xe,fe,we,tt,vt,_e,de,ye,st,Ot,gt):M.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,fe,we,tt,_e,de,st,Ot,gt.data):M.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,fe,we,tt,gt.width,gt.height,st,gt.data):D.texSubImage2D(D.TEXTURE_2D,fe,we,tt,_e,de,st,Ot,gt);x.pixelStorei(D.UNPACK_ROW_LENGTH,Yt),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Xe),x.pixelStorei(D.UNPACK_SKIP_PIXELS,nn),x.pixelStorei(D.UNPACK_SKIP_ROWS,xn),x.pixelStorei(D.UNPACK_SKIP_IMAGES,Gn),fe===0&&N.generateMipmaps&&D.generateMipmap(xe),x.unbindTexture()},this.initRenderTarget=function(M){k.get(M).__webglFramebuffer===void 0&&G.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?G.setTextureCube(M,0):M.isData3DTexture?G.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?G.setTexture2DArray(M,0):G.setTexture2D(M,0),x.unbindTexture()},this.resetState=function(){q=0,H=0,J=null,x.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ge._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ge._getUnpackColorSpace()}}const pa=20,ma=20,pi=20,Bg=3,yo=[{id:"poor",name:"Poor",color:"#9d9d9d",budget:.6,weight:18},{id:"common",name:"Common",color:"#ffffff",budget:1,weight:40},{id:"uncommon",name:"Uncommon",color:"#1eff00",budget:1.35,weight:26},{id:"rare",name:"Rare",color:"#0070dd",budget:1.75,weight:11},{id:"epic",name:"Epic",color:"#a335ee",budget:2.3,weight:4},{id:"legendary",name:"Legendary",color:"#ff8000",budget:3,weight:1}],yn=Object.fromEntries(yo.map(s=>[s.id,s])),ns=["head","shoulders","chest","hands","legs","feet","weapon","trinket"],ga={head:"Head",shoulders:"Shoulders",chest:"Chest",hands:"Hands",legs:"Legs",feet:"Feet",weapon:"Weapon",trinket:"Trinket"},zg={head:1,shoulders:.8,chest:1.1,hands:.7,legs:1,feet:.7,weapon:1.4,trinket:.8},kg={plate:6,mail:4,leather:3,cloth:1.5},uc={str:"Strength",agi:"Agility",int:"Intellect",spi:"Spirit",sta:"Stamina",armor:"Armor"},xt={warrior:{id:"warrior",name:"Warrior",role:"Tank",color:"#c79c6e",armor:"plate",weapon:"Sword",mainStat:"str",resource:"rage",blurb:"Stands in front. Builds rage by hitting and being hit; holds enemy attention.",base:{str:12,agi:6,int:2,spi:2,sta:12},perLevel:{str:2,agi:1,int:0,spi:0,sta:2},abilities:["strike","cleave","taunt","shieldWall"]},mage:{id:"mage",name:"Mage",role:"Ranged damage",color:"#69ccf0",armor:"cloth",weapon:"Staff",mainStat:"int",resource:"mana",blurb:"Fragile, deadly at range. Frost Nova roots everything near you.",base:{str:2,agi:3,int:14,spi:8,sta:7},perLevel:{str:0,agi:0,int:2,spi:1,sta:1},abilities:["fireball","frostNova","arcaneMissiles","manaShield"]},ranger:{id:"ranger",name:"Ranger",role:"Ranged damage",color:"#abd473",armor:"mail",weapon:"Bow",mainStat:"agi",resource:"focus",blurb:"Steady damage from range. Focus refills on its own; traps slow enemies.",base:{str:4,agi:13,int:4,spi:4,sta:9},perLevel:{str:0,agi:2,int:0,spi:0,sta:2},abilities:["aimedShot","multiShot","frostTrap","mendWounds"]},cleric:{id:"cleric",name:"Cleric",role:"Healer",color:"#f0ebe0",armor:"cloth",weapon:"Mace",mainStat:"int",resource:"mana",blurb:"Keeps the party alive. Tap an ally (or nobody, for yourself) and heal.",base:{str:4,agi:3,int:12,spi:12,sta:9},perLevel:{str:0,agi:0,int:2,spi:1,sta:1},abilities:["smite","heal","renew","holyNova"]}},Zi={rage:{name:"Rage",color:"#c41e3a",max:()=>100,regen:-1,start:0},mana:{name:"Mana",color:"#2f6fe0",max:s=>60+s.int*8,regen:0,start:1},focus:{name:"Focus",color:"#d8a03a",max:()=>100,regen:8,start:1}},Sr={strike:{name:"Heroic Strike",icon:"⚔",cost:0,cd:1.5,range:2.2,target:"enemy",power:1.2,gain:12,desc:"A heavy melee blow. Generates rage."},cleave:{name:"Cleave",icon:"🌀",cost:25,cd:5,radius:2.4,target:"self",power:1,threat:2,desc:"Hits every enemy within 2.4 m."},taunt:{name:"Taunt",icon:"📣",cost:0,cd:8,range:6,target:"enemy",taunt:!0,power:.3,desc:"Forces the target and enemies near it to attack you."},shieldWall:{name:"Shield Wall",icon:"🛡",cost:15,cd:20,target:"self",buff:{id:"shieldWall",dur:6,dr:.5},desc:"Take 50% less damage for 6 s."},fireball:{name:"Fireball",icon:"🔥",cost:12,cd:1.6,range:9,target:"enemy",power:1.6,projectile:"fire",desc:"Hurls a ball of fire."},frostNova:{name:"Frost Nova",icon:"❄",cost:20,cd:12,radius:3,target:"self",power:.5,debuff:{id:"root",dur:4},desc:"Damages and roots enemies within 3 m for 4 s."},arcaneMissiles:{name:"Arcane Missiles",icon:"✨",cost:25,cd:6,range:9,target:"enemy",power:2.6,projectile:"arcane",desc:"A volley of arcane bolts."},manaShield:{name:"Mana Shield",icon:"🔮",cost:30,cd:18,target:"self",buff:{id:"absorb",dur:10,absorbMul:2.5},desc:"Absorbs damage for 10 s."},aimedShot:{name:"Aimed Shot",icon:"🏹",cost:15,cd:1.5,range:10,target:"enemy",power:1.5,projectile:"arrow",desc:"A precise arrow."},multiShot:{name:"Multi-Shot",icon:"🎯",cost:35,cd:6,range:10,target:"enemy",power:1.1,chain:3,projectile:"arrow",desc:"Hits the target and two enemies near it."},frostTrap:{name:"Frost Trap",icon:"🧊",cost:25,cd:14,radius:2.5,target:"self",power:.2,debuff:{id:"slow",dur:6,mul:.4},desc:"Slows enemies within 2.5 m by 60% for 6 s."},mendWounds:{name:"Mend Wounds",icon:"🌿",cost:30,cd:15,range:8,target:"ally",heal:.8,hot:{dur:6,mul:1.6},desc:"Heals you or an ally over 6 s."},smite:{name:"Smite",icon:"☀",cost:8,cd:1.6,range:8,target:"enemy",power:1.1,projectile:"holy",desc:"Strikes an enemy with light."},heal:{name:"Heal",icon:"✚",cost:18,cd:1.6,range:9,target:"ally",heal:2.2,desc:"Heals the targeted ally, or you."},renew:{name:"Renew",icon:"💫",cost:15,cd:4,range:9,target:"ally",hot:{dur:9,mul:2.4},desc:"Heals the target over 9 s."},holyNova:{name:"Holy Nova",icon:"🌟",cost:30,cd:8,radius:4,target:"self",power:.6,heal:1,desc:"Damages enemies and heals allies within 4 m."}},qt={imp:{name:"Rift Imp",hp:45,dmg:6,speed:.55,range:1,attackCd:2.2,windup:.9,aoe:.9,aggro:5,xp:40,gold:[1,4],scale:.5,color:"#e0482f",loot:.35},wisp:{name:"Void Wisp",hp:30,dmg:8,speed:.7,range:4.5,attackCd:3,windup:1.2,aoe:.8,aggro:6,xp:45,gold:[1,5],scale:.4,color:"#8a5cff",loot:.35,ranged:!0},hound:{name:"Shade Hound",hp:70,dmg:9,speed:.85,range:1.1,attackCd:2,windup:.7,aoe:1,aggro:6,xp:60,gold:[2,6],scale:.55,color:"#4b4b63",loot:.4},warden:{name:"Rift Warden",hp:420,dmg:18,speed:.45,range:1.6,attackCd:3.2,windup:1.4,aoe:1.8,aggro:8,xp:300,gold:[20,35],scale:.9,color:"#3fb6a8",loot:1,elite:!0,minRarity:"uncommon"},colossus:{name:"Rift Colossus",hp:1800,dmg:26,speed:.35,range:2.4,attackCd:3.5,windup:1.6,aoe:2.6,aggro:12,xp:1200,gold:[80,120],scale:1.4,color:"#b0743a",loot:2,boss:!0,minRarity:"rare",summon:{type:"imp",every:12,count:2}}},bh={shard:{name:"Rift Shard",color:"#7ef9ff"},ember:{name:"Hearth Ember",color:"#ffb347"}},Eh=[{id:"q1",name:"A Breach at Home",level:1,giver:"keeper",text:"Something tore a hole between our world and yours, right here on your floor. Imps are already slipping through. Thin them out.",objectives:[{kind:"kill",target:"imp",count:5}],reward:{xp:200,gold:15,item:{slot:"chest",rarity:"uncommon"}}},{id:"q2",name:"Shards Underfoot",level:2,giver:"keeper",requires:"q1",text:"The breach sheds shards of raw rift. Walk your room and gather them before the wisps feed on them.",objectives:[{kind:"collect",target:"shard",count:4},{kind:"kill",target:"wisp",count:3}],reward:{xp:350,gold:25,item:{slot:"weapon",rarity:"uncommon"}}},{id:"q3",name:"Hounds of the Hall",level:3,giver:"keeper",requires:"q2",text:"Shade hounds hunt by sound. Stay on your feet, step out of their lunges, and put them down.",objectives:[{kind:"kill",target:"hound",count:4}],reward:{xp:500,gold:35,item:{slot:"legs",rarity:"rare"}}},{id:"q4",name:"The Warden",level:4,giver:"keeper",requires:"q3",text:"A Warden guards the breach from the other side. It hits hard and its slam covers a wide circle. Bring friends if you can.",objectives:[{kind:"kill",target:"warden",count:1}],reward:{xp:900,gold:60,item:{slot:"head",rarity:"rare"}}},{id:"q5",name:"Embers of the Hearth",level:5,giver:"keeper",requires:"q4",text:"To close the breach I need the warmth of a home. Embers have scattered across your room. Bring me five.",objectives:[{kind:"collect",target:"ember",count:5},{kind:"kill",target:"any",count:8}],reward:{xp:1100,gold:70,item:{slot:"shoulders",rarity:"rare"}}},{id:"q6",name:"Close the Rift",level:6,giver:"keeper",requires:"q5",group:!0,text:"The Colossus is coming through. When it falls, the rift closes. This is a fight for a full party.",objectives:[{kind:"kill",target:"colossus",count:1}],reward:{xp:2500,gold:200,item:{slot:"weapon",rarity:"epic"}}},{id:"d1",name:"Daily: Keep the Peace",level:1,giver:"keeper",requires:"q1",repeatable:!0,text:"The breach never fully sleeps. Clear out whatever wanders in.",objectives:[{kind:"kill",target:"any",count:10}],reward:{xp:300,gold:20,item:{slot:"random",rarity:"uncommon"}}}],Fn=Object.fromEntries(Eh.map(s=>[s.id,s])),Ls=[{id:"hpPotion",name:"Healing Draught",price:5,icon:"🧪",desc:"Restores 40% health.",use:{heal:.4}},{id:"mpPotion",name:"Mana Draught",price:5,icon:"💧",desc:"Restores 50% mana.",use:{mana:.5}}],xa=s=>Math.round(150*Math.pow(s,1.6));function Hg(s,e,t){const n=xt[s],i={armor:0};for(const a of Object.keys(n.base))i[a]=n.base[a]+n.perLevel[a]*(e-1);for(const a of ns){const o=t?.[a];if(o)for(const[l,c]of Object.entries(o.stats))i[l]=(i[l]||0)+c}const r=Zi[n.resource];return{...i,maxHp:Math.round(60+e*18+i.sta*9),maxRes:Math.round(r.max(i)),power:i[n.mainStat],dr:Math.min(.6,i.armor/(i.armor+200+e*20)),ilvl:Vg(t)}}function Vg(s){const e=ns.map(t=>s?.[t]).filter(Boolean);return e.length?Math.round(e.reduce((t,n)=>t+n.ilvl,0)/e.length):0}const Xi=(s,e,t)=>(8+t*2.5+s*1.1)*e,_a=s=>1+(s-1)*.22,Gg={plate:{head:"Greathelm",shoulders:"Pauldrons",chest:"Breastplate",hands:"Gauntlets",legs:"Legplates",feet:"Sabatons"},mail:{head:"Coif",shoulders:"Mantle",chest:"Hauberk",hands:"Grips",legs:"Chausses",feet:"Treads"},leather:{head:"Hood",shoulders:"Spaulders",chest:"Jerkin",hands:"Gloves",legs:"Breeches",feet:"Boots"},cloth:{head:"Cowl",shoulders:"Amice",chest:"Robe",hands:"Handwraps",legs:"Leggings",feet:"Slippers"}},dc=["Charm","Idol","Talisman","Locket","Rune"],fc=["Rift-Touched","Hearthbound","Gloaming","Shardforged","Wardens'","Emberlit","Hollow","Starward","Ashen","Duskwoven"],Wg={str:["of the Bear","of Might","of the Bulwark"],agi:["of the Falcon","of the Fox","of Swiftness"],int:["of the Owl","of Insight","of the Arcane"],spi:["of Grace","of the Hearth","of Renewal"],sta:["of the Mountain","of Endurance","of the Oak"]},pc=["Riftbreaker","Hearthguard","Doorwarden's Oath","Last Light","Thresholdfang"];let Xg=0;const wh=()=>`i${Date.now().toString(36)}${(Xg++).toString(36)}${Math.floor(Math.random()*1e4).toString(36)}`;function qg(s=Math.random,e="poor"){const t=yo.findIndex(a=>a.id===e),n=yo.slice(t),i=n.reduce((a,o)=>a+o.weight,0);let r=s()*i;for(const a of n)if(r-=a.weight,r<=0)return a.id;return n[n.length-1].id}function So({cls:s,level:e,slot:t,rarity:n,rng:i=Math.random}){const r=xt[s];(!t||t==="random")&&(t=ns[Math.floor(i()*ns.length)]);const a=yn[n]||yn.common,o=Math.max(1,e+(n==="epic"?3:n==="legendary"?6:0)),l=(4+o*2.2)*a.budget*zg[t],c=i()<.5?"sta":i()<.5?"spi":r.mainStat==="str"?"agi":"sta",h={};n==="poor"?h.sta=Math.max(1,Math.round(l*.5)):(h[r.mainStat]=Math.max(1,Math.round(l*.55)),h[c]=(h[c]||0)+Math.max(1,Math.round(l*.35))),t!=="weapon"&&t!=="trinket"&&(h.armor=Math.round(l*kg[r.armor]));let u;t==="weapon"?u=r.weapon:t==="trinket"?u=dc[Math.floor(i()*dc.length)]:u=Gg[r.armor][t];let d;if(n==="legendary")d=pc[Math.floor(i()*pc.length)];else if(n==="poor")d=`Frayed ${u}`;else{const f=n==="common"?"":`${fc[Math.floor(i()*fc.length)]} `,g=n==="common"?"":` ${Wg[r.mainStat][Math.floor(i()*3)]}`;d=`${f}${u}${g}`}return{id:wh(),kind:"gear",name:d,slot:t,rarity:n,ilvl:o,cls:s,armorType:t==="weapon"||t==="trinket"?null:r.armor,stats:h,value:Math.max(1,Math.round(o*a.budget*1.5))}}function va(s){const e=Ls.find(t=>t.id===s);return{id:wh(),kind:"consumable",vendorId:s,name:e.name,icon:e.icon,rarity:"common",value:1,stack:1}}function $g(s){const e={};for(const t of["chest","legs","weapon"])e[t]=So({cls:s,level:1,slot:t,rarity:"common",rng:()=>.5});return e}function mc(s,e){if(!s)return 0;const t=xt[e].mainStat,n=s.stats||{};return(n[t]||0)*2+(n.sta||0)*1.5+(n.spi||0)*(t==="int"?1:.3)+(n.armor||0)*.05}const hn=.2,Yg=.15,gc=new Set(["stairs","bathtub","fireplace","stove","oven"]);function Zg(s,e,t){let n=!1;for(let i=0,r=t.length-1;i<t.length;r=i++){const[a,o]=t[i],[l,c]=t[r];o>e!=c>e&&s<(l-a)*(e-o)/(c-o)+a&&(n=!n)}return n}function Kg(s){let e=0;for(let t=0,n=s.length-1;t<s.length;n=t++)e+=(s[n][0]+s[t][0])*(s[n][1]-s[t][1]);return Math.abs(e/2)}function xc(s,e,t,n){const i=Math.cos(t.yaw||0),r=Math.sin(t.yaw||0),a=s-t.x,o=e-t.z,l=a*i-o*r,c=a*r+o*i;return Math.abs(l)<=t.w/2+n&&Math.abs(c)<=t.d/2+n}class Th{constructor(e){this.world=e,this.zones=e.zones||[],this.zoneById=new Map(this.zones.map(t=>[t.id,t])),this.links=e.links||[],this.hearth=e.hearth||this.defaultHearth(),this.levels=this.computeZoneLevels(),this.buildGrid()}defaultHearth(){const e=this.zones[0],t=Jg(e.floor);return{x:t[0],z:t[1],zone:e.id}}computeZoneLevels(){const e=new Map,t=this.hearth.zone||this.zones[0]?.id,n=[[t,0]],i=new Set([t]);for(;n.length;){const[r,a]=n.shift();e.set(r,a);for(const o of this.links){const l=o.a===r?o.b:o.b===r?o.a:null;l&&!i.has(l)&&(i.add(l),n.push([l,a+1]))}}for(const r of this.zones){const a=e.has(r.id)?e.get(r.id):1;e.set(r.id,a*2+(r.kind==="outdoor"?3:0))}return e}buildGrid(){let e=1/0,t=1/0,n=-1/0,i=-1/0;for(const a of this.zones)for(const[o,l]of a.floor)e=Math.min(e,o),t=Math.min(t,l),n=Math.max(n,o),i=Math.max(i,l);Number.isFinite(e)||(e=t=-1,n=i=1),this.ox=e-hn,this.oz=t-hn,this.w=Math.ceil((n-e)/hn)+3,this.h=Math.ceil((i-t)/hn)+3,this.walk=new Uint8Array(this.w*this.h),this.hazard=new Uint8Array(this.w*this.h),this.zoneOf=new Int16Array(this.w*this.h).fill(-1);const r=this.zones.flatMap(a=>a.objects||[]);for(let a=0;a<this.h;a++)for(let o=0;o<this.w;o++){const l=this.ox+(o+.5)*hn,c=this.oz+(a+.5)*hn,h=a*this.w+o,u=this.zones.findIndex(f=>Zg(l,c,f.floor));if(u<0&&!this.inDoorway(l,c))continue;this.zoneOf[h]=u>=0?u:this.zoneAtDoor(l,c);let d=!1;for(const f of r)xc(l,c,f,Yg)?(d=!0,gc.has(f.cat)&&(this.hazard[h]=1)):gc.has(f.cat)&&xc(l,c,f,.6)&&(this.hazard[h]=1);this.walk[h]=d?0:1}}inDoorway(e,t){return this.links.some(n=>Math.hypot(e-n.x,t-n.z)<=Math.max(.45,(n.w||.9)/2))}zoneAtDoor(e,t){const n=this.links.find(i=>Math.hypot(e-i.x,t-i.z)<=Math.max(.45,(i.w||.9)/2));return n?this.zones.findIndex(i=>i.id===n.a):-1}cell(e,t){const n=Math.floor((e-this.ox)/hn),i=Math.floor((t-this.oz)/hn);return n<0||i<0||n>=this.w||i>=this.h?-1:i*this.w+n}center(e){return{x:this.ox+(e%this.w+.5)*hn,z:this.oz+(Math.floor(e/this.w)+.5)*hn}}walkable(e,t){const n=this.cell(e,t);return n>=0&&this.walk[n]===1}inside(e,t){const n=this.cell(e,t);return n>=0&&this.zoneOf[n]>=0}isHazard(e,t){const n=this.cell(e,t);return n>=0&&this.hazard[n]===1}zoneAt(e,t){const n=this.cell(e,t);return n>=0&&this.zoneOf[n]>=0?this.zones[this.zoneOf[n]]:null}zoneLevel(e){return e&&this.levels.get(e.id)||0}clearLine(e,t){const n=Math.hypot(t.x-e.x,t.z-e.z),i=Math.ceil(n/(hn*.5));for(let r=1;r<=i;r++){const a=r/i;if(!this.walkable(e.x+(t.x-e.x)*a,e.z+(t.z-e.z)*a))return!1}return!0}path(e,t,n=4e3){let i=this.cell(e.x,e.z);const r=this.nearestWalkable(this.cell(t.x,t.z));if(i<0||r<0||(this.walk[i]||(i=this.nearestWalkable(i)),i<0))return null;const a=this.w,o=new Map([[i,0]]),l=new Map,c=[[this.heur(i,r),i]];let h=0;for(;c.length&&h++<n;){let y=0;for(let b=1;b<c.length;b++)c[b][0]<c[y][0]&&(y=b);const[,m]=c.splice(y,1)[0];if(m===r)break;const p=m%a,S=Math.floor(m/a);for(let b=-1;b<=1;b++)for(let v=-1;v<=1;v++){if(!v&&!b)continue;const w=p+v,E=S+b;if(w<0||E<0||w>=a||E>=this.h)continue;const R=E*a+w;if(!this.walk[R]||v&&b&&(!this.walk[S*a+w]||!this.walk[E*a+p]))continue;const _=o.get(m)+(v&&b?1.414:1);_<(o.get(R)??1/0)&&(o.set(R,_),l.set(R,m),c.push([_+this.heur(R,r),R]))}}if(!l.has(r)&&i!==r)return null;const u=[];for(let y=r;y!==void 0&&y!==i;y=l.get(y))u.push(y);u.reverse();const d=u.map(y=>this.center(y)),f=[];let g=e;for(let y=0;y<d.length;y++){const m=d[y+1];(!m||!this.clearLine(g,m))&&(f.push(d[y]),g=d[y])}return f}heur(e,t){const n=this.w;return Math.hypot(e%n-t%n,Math.floor(e/n)-Math.floor(t/n))}nearestWalkable(e,t=12){if(e<0)return-1;if(this.walk[e])return e;const n=this.w,i=e%n,r=Math.floor(e/n);for(let a=1;a<=t;a++)for(let o=-a;o<=a;o++)for(let l=-a;l<=a;l++){if(Math.max(Math.abs(l),Math.abs(o))!==a)continue;const c=i+l,h=r+o;if(!(c<0||h<0||c>=n||h>=this.h)&&this.walk[h*n+c])return h*n+c}return-1}randomPoint(e,{zones:t=null,avoid:n=[],minDist:i=1.2,nearFurniture:r=!1}={}){const a=t?new Set(t.map(l=>this.zones.indexOf(l))):null,o=[];for(let l=0;l<this.walk.length;l++)!this.walk[l]||this.hazard[l]||this.zoneOf[l]<0||a&&!a.has(this.zoneOf[l])||r&&!this.besideObstacle(l)||o.push(l);if(!o.length)return r?this.randomPoint(e,{zones:t,avoid:n,minDist:i}):null;for(let l=0;l<30;l++){const c=this.center(o[Math.floor(e()*o.length)]);if(n.every(h=>Math.hypot(h.x-c.x,h.z-c.z)>=i))return c}return this.center(o[Math.floor(e()*o.length)])}besideObstacle(e){const t=this.w,n=e%t,i=Math.floor(e/t);for(const[r,a]of[[2,0],[-2,0],[0,2],[0,-2]]){const o=(i+a)*t+(n+r);if(o>=0&&o<this.walk.length&&this.zoneOf[o]>=0&&!this.walk[o])return!0}return!1}snap(e,t){const n=this.nearestWalkable(this.cell(e,t));return n>=0?this.center(n):{x:e,z:t}}describe(){return{...this.world,levels:Object.fromEntries(this.levels)}}}function Jg(s){let e=0,t=0;for(const n of s)e+=n[0],t+=n[1];return[e/s.length,t/s.length]}function Qg(s){if(!s||typeof s!="object"||!Array.isArray(s.zones)||!s.zones.length)return null;const e=(o,l=0)=>Number.isFinite(Number(o))?Number(o):l,t=o=>[e(o?.[0]),e(o?.[1])],n=s.zones.slice(0,32).map((o,l)=>({id:String(o.id||`z${l}`).slice(0,40),name:String(o.name||`Zone ${l+1}`).slice(0,40),kind:["room","hall","outdoor"].includes(o.kind)?o.kind:"room",theme:String(o.theme||"hearth").slice(0,20),floorY:e(o.floorY),floor:(o.floor||[]).slice(0,256).map(t),walls:(o.walls||[]).slice(0,256).map(c=>({a:t(c.a),b:t(c.b),h:e(c.h,2.4),t:e(c.t,.1)})),openings:(o.openings||[]).slice(0,64).map(c=>({kind:String(c.kind||"door").slice(0,10),x:e(c.x),y:e(c.y),z:e(c.z),w:e(c.w,.9),h:e(c.h,2),yaw:e(c.yaw)})),objects:(o.objects||[]).slice(0,256).map(c=>({cat:String(c.cat||"storage").slice(0,20),x:e(c.x),y:e(c.y),z:e(c.z),w:e(c.w,.5),h:e(c.h,.5),d:e(c.d,.5),yaw:e(c.yaw)}))})).filter(o=>o.floor.length>=3&&Kg(o.floor)<2e3);if(!n.length)return null;const i=new Set(n.map(o=>o.id)),r=(s.links||[]).slice(0,64).filter(o=>i.has(o.a)&&i.has(o.b)).map(o=>({a:String(o.a),b:String(o.b),x:e(o.x),z:e(o.z),w:e(o.w,.9)})),a=s.hearth&&i.has(s.hearth.zone)?{x:e(s.hearth.x),z:e(s.hearth.z),zone:String(s.hearth.zone)}:null;return{v:1,id:String(s.id||"world").slice(0,64),name:String(s.name||"A world").slice(0,60),hearth:a,zones:n,links:r}}const Et=(s,e)=>Math.hypot(s.x-e.x,s.z-e.z),Ma=(s,e,t)=>Math.max(e,Math.min(t,s)),jg=1.6,ex=3.5,tx=6,nx=5;class ix{constructor({arenaRadius:e=Bg,rng:t=Math.random,world:n=null}={}){if(this.rng=t,this.arenaRadius=e,this.map=n?new Th(n):null,this.time=0,this.players=new Map,this.enemies=new Map,this.pickups=new Map,this.loot=new Map,this.events=[],this.seq=0,this.spawnTimer=1,this.npcs=[{id:"keeper",name:"Ysolde, Keeper of the Threshold",kind:"questgiver",x:0,z:0},{id:"vendor",name:"Bram the Pedlar",kind:"vendor",x:.9,z:.5}],this.map){const i=this.map.hearth,r=this.map.snap(i.x,i.z),a=this.map.snap(i.x+.9,i.z+.5);Object.assign(this.npcs[0],r),Object.assign(this.npcs[1],a)}}homePoint(){if(this.map){const e=this.map.hearth;return this.map.snap(e.x+.3*(this.rng()-.5),e.z+1)}return{x:.6*(this.rng()-.5),z:1.2}}nextId(e){return`${e}${++this.seq}`}emit(e){this.events.push({t:this.time,...e})}join(e,t={}){const n=xt[t.cls]?t.cls:"warrior",i=t.save&&t.save.cls===n?t.save:null,r={id:e,kind:"player",name:String(t.name||"Adventurer").slice(0,18),cls:n,level:Ma(i?.level||1,1,ma),xp:i?.xp||0,gold:i?.gold??10,equipment:i?.equipment||$g(n),bag:(i?.bag||[va("hpPotion"),va("hpPotion")]).slice(0,pi),quests:i?.quests||{},...this.homePoint(),facing:Math.PI,mode:t.mode==="body"||t.mode==="ar"?"body":"avatar",target:null,cds:{},buffs:[],alive:!0,respawnAt:0,lastCombat:-99,gcd:0,privateVersion:1,sentVersion:0};return this.recalc(r,!0),this.players.set(e,r),this.emit({type:"join",id:e,name:r.name}),r}leave(e){const t=this.players.get(e);if(t){this.players.delete(e);for(const n of this.enemies.values())n.threat.delete(e);this.emit({type:"leave",id:e,name:t.name})}}recalc(e,t=!1){const n=Hg(e.cls,e.level,e.equipment),i=e.maxHp?e.hp/e.maxHp:1,r=e.maxRes?e.res/e.maxRes:1;e.stats=n,e.maxHp=n.maxHp,e.maxRes=n.maxRes;const a=Zi[xt[e.cls].resource];e.hp=t?e.maxHp:Math.round(e.maxHp*i),e.res=t?e.maxRes*a.start:e.maxRes*r,e.privateVersion++}saveOf(e){const t=this.players.get(e);return t?{v:1,name:t.name,cls:t.cls,level:t.level,xp:t.xp,gold:t.gold,equipment:t.equipment,bag:t.bag,quests:t.quests}:null}handle(e,t){const n=this.players.get(e);if(!(!n||!t||typeof t!="object"))switch(t.t){case"move":return this.cmdMove(n,t);case"target":n.target=t.id||null;return;case"cast":return this.cmdCast(n,t);case"accept":return this.cmdAccept(n,t.id);case"turnin":return this.cmdTurnIn(n,t.id);case"abandon":delete n.quests[t.id],n.privateVersion++;return;case"equip":return this.cmdEquip(n,t.index);case"unequip":return this.cmdUnequip(n,t.slot);case"use":return this.cmdUse(n,t.index);case"sell":return this.cmdSell(n,t.index);case"buy":return this.cmdBuy(n,t.id);case"loot":return this.cmdLoot(n,t.id);case"chat":this.emit({type:"chat",id:n.id,name:n.name,text:String(t.text||"").slice(0,140)});return}}cmdMove(e,t){if(!e.alive||_c(e,"root"))return;typeof t.facing=="number"&&(e.facing=t.facing);let n,i;if(typeof t.x=="number"&&typeof t.z=="number"){n=t.x,i=t.z;const r=Math.max(.05,this.time-(e.lastMoveAt??this.time-.1)),a=Math.hypot(n-e.x,i-e.z),o=ex*r+.25;a>o&&(n=e.x+(n-e.x)/a*o,i=e.z+(i-e.z)/a*o)}else if(typeof t.dx=="number"&&typeof t.dz=="number"){const r=Math.hypot(t.dx,t.dz);if(r<.01)return;const a=Math.min(1,r)/r,o=jg*Ma(t.dt||.05,0,.2);n=e.x+t.dx*a*o,i=e.z+t.dz*a*o,e.facing=Math.atan2(t.dx,t.dz)}else return;if(this.map){if(e.mode==="avatar"&&!this.map.walkable(n,i)&&this.map.walkable(e.x,e.z))if(this.map.walkable(n,e.z))i=e.z;else if(this.map.walkable(e.x,i))n=e.x;else return}else{const r=Math.hypot(n,i),a=this.arenaRadius+1.5;r>a&&(n=n/r*a,i=i/r*a)}e.x=n,e.z=i,e.lastMoveAt=this.time,this.autoPickup(e)}cmdCast(e,t){if(!e.alive)return;const n=xt[e.cls],i=t.ability;if(!n.abilities.includes(i))return;const r=Sr[i];if((e.cds[i]||0)>this.time)return this.fail(e,"Not ready yet");if(e.gcd>this.time)return;if(e.res<r.cost)return this.fail(e,`Not enough ${Zi[n.resource].name.toLowerCase()}`);const a=t.target??e.target;let o=null;if(r.target==="enemy"){if(o=this.enemies.get(a),!o||!o.alive)return this.fail(e,"No enemy targeted");if(Et(e,o)>r.range+o.radius)return this.fail(e,"Out of range — step closer")}else if(r.target==="ally"&&(o=this.players.get(a),(!o||!o.alive)&&(o=e),o!==e&&Et(e,o)>r.range))return this.fail(e,"Ally out of range");e.res-=r.cost,e.cds[i]=this.time+r.cd,e.gcd=this.time+.6,o&&o!==e&&(e.facing=Math.atan2(o.x-e.x,o.z-e.z)),this.emit({type:"cast",id:e.id,ability:i,target:o?.id,projectile:r.projectile});const l=e.stats.power,c=e.level,h=()=>this.rng()<.05+(e.stats.agi||0)/1e3;if(r.target==="enemy"){const u=[o];if(r.chain){const d=[...this.enemies.values()].filter(f=>f.alive&&f!==o).sort((f,g)=>Et(f,o)-Et(g,o)).slice(0,r.chain-1).filter(f=>Et(f,o)<3);u.push(...d)}for(const d of u)r.power&&this.damageEnemy(d,e,Xi(l,r.power,c),h()),r.taunt&&this.taunt(d,e);if(r.taunt)for(const d of this.enemies.values())d.alive&&Et(d,o)<3&&this.taunt(d,e);r.gain&&e.cls==="warrior"&&(e.res=Math.min(e.maxRes,e.res+r.gain))}else if(r.target==="ally")r.heal&&this.healPlayer(o,e,Xi(l,r.heal,c),h()),r.hot&&ya(o,{id:"hot",until:this.time+r.hot.dur,perSec:Xi(l,r.hot.mul,c)/r.hot.dur,src:e.id});else{if(r.radius){this.emit({type:"nova",id:e.id,ability:i,radius:r.radius,x:e.x,z:e.z});for(const u of this.enemies.values())!u.alive||Et(u,e)>r.radius+u.radius||(r.power&&this.damageEnemy(u,e,Xi(l,r.power,c),h(),r.threat),r.debuff&&ya(u,{id:r.debuff.id,until:this.time+r.debuff.dur,mul:r.debuff.mul}));if(r.heal)for(const u of this.players.values())u.alive&&Et(u,e)<=r.radius&&this.healPlayer(u,e,Xi(l,r.heal,c),!1)}if(r.buff){const u={id:r.buff.id,until:this.time+r.buff.dur};r.buff.dr&&(u.dr=r.buff.dr),r.buff.absorbMul&&(u.absorb=Xi(l,r.buff.absorbMul,c)),ya(e,u),this.emit({type:"buff",id:e.id,buff:u.id})}}e.lastCombat=this.time}fail(e,t){this.emit({type:"error",to:e.id,text:t})}cmdAccept(e,t){const n=Fn[t];!n||!this.questAvailable(e,n)||(e.quests[t]={state:"active",progress:n.objectives.map(()=>0)},e.privateVersion++,this.emit({type:"quest",to:e.id,text:`Quest accepted: ${n.name}`}))}cmdTurnIn(e,t){const n=Fn[t],i=e.quests[t];if(!n||!i||i.state!=="done")return;if(Et(e,this.npcs[0])>2.5)return this.fail(e,"Walk back to the Keeper to turn in");const r=So({cls:e.cls,level:Math.max(e.level,n.level),slot:n.reward.item.slot,rarity:n.reward.item.rarity,rng:this.rng});if(e.bag.length>=pi)return this.fail(e,"Your bags are full");e.bag.push(r),e.gold+=n.reward.gold,i.state=n.repeatable?"repeat":"complete",n.repeatable&&(i.availableAt=Date.now()+20*3600*1e3),this.emit({type:"quest",to:e.id,text:`Quest complete: ${n.name}`,reward:{gold:n.reward.gold,item:r.name,rarity:r.rarity}}),this.giveXp(e,n.reward.xp),e.privateVersion++}questAvailable(e,t){const n=e.quests[t.id];return n&&n.state==="repeat"&&t.repeatable&&(n.availableAt||0)<=Date.now()?!0:n||t.requires&&e.quests[t.requires]?.state!=="complete"?!1:e.level>=t.level-1}cmdEquip(e,t){const n=e.bag[t];if(!n||n.kind!=="gear")return;if(n.cls&&n.cls!==e.cls)return this.fail(e,`Only a ${xt[n.cls].name} can use that`);const i=e.equipment[n.slot];e.bag.splice(t,1),i&&e.bag.push(i),e.equipment[n.slot]=n,this.recalc(e),this.emit({type:"gear",id:e.id})}cmdUnequip(e,t){const n=e.equipment[t];if(n){if(e.bag.length>=pi)return this.fail(e,"Your bags are full");delete e.equipment[t],e.bag.push(n),this.recalc(e),this.emit({type:"gear",id:e.id})}}cmdUse(e,t){const n=e.bag[t];if(!n||n.kind!=="consumable"||!e.alive)return;const i=Ls.find(r=>r.id===n.vendorId);if((e.cds.potion||0)>this.time)return this.fail(e,"Potion not ready");e.cds.potion=this.time+10,i.use.heal&&this.healPlayer(e,e,e.maxHp*i.use.heal,!1),i.use.mana&&xt[e.cls].resource==="mana"&&(e.res=Math.min(e.maxRes,e.res+e.maxRes*i.use.mana)),e.bag.splice(t,1),e.privateVersion++}cmdSell(e,t){const n=e.bag[t];if(n){if(Et(e,this.npcs[1])>2.5)return this.fail(e,"Walk to the pedlar to sell");e.bag.splice(t,1),e.gold+=n.value,e.privateVersion++}}cmdBuy(e,t){const n=Ls.find(i=>i.id===t);if(n){if(Et(e,this.npcs[1])>2.5)return this.fail(e,"Walk to the pedlar to buy");if(e.gold<n.price)return this.fail(e,"Not enough gold");if(e.bag.length>=pi)return this.fail(e,"Your bags are full");e.gold-=n.price,e.bag.push(va(t)),e.privateVersion++}}cmdLoot(e,t){const n=this.loot.get(t);if(!(!n||n.owner!==e.id)){if(Et(e,n)>1.5)return this.fail(e,"Walk closer to the loot");this.takeLoot(e,n)}}takeLoot(e,t){if(t.item&&e.bag.length>=pi)return this.fail(e,"Your bags are full");t.item&&e.bag.push(t.item),e.gold+=t.gold||0,this.loot.delete(t.id),this.emit({type:"looted",to:e.id,gold:t.gold,item:t.item?.name,rarity:t.item?.rarity}),e.privateVersion++}autoPickup(e){for(const t of this.loot.values())t.owner===e.id&&Et(e,t)<.6&&this.takeLoot(e,t);for(const t of this.pickups.values())Et(e,t)>.55||this.needsPickup(e,t.type)&&(this.pickups.delete(t.id),this.progress(e,"collect",t.type),this.emit({type:"pickup",id:e.id,kind:t.type,x:t.x,z:t.z}))}needsPickup(e,t){for(const[n,i]of Object.entries(e.quests)){if(i.state!=="active")continue;if(Fn[n].objectives.some((a,o)=>a.kind==="collect"&&a.target===t&&i.progress[o]<a.count))return!0}return!1}progress(e,t,n){for(const[i,r]of Object.entries(e.quests)){if(r.state!=="active")continue;const a=Fn[i];let o=!1;a.objectives.forEach((l,c)=>{l.kind===t&&(l.target!==n&&!(l.target==="any"&&t==="kill")||r.progress[c]>=l.count||(r.progress[c]++,o=!0))}),o&&(e.privateVersion++,a.objectives.every((l,c)=>r.progress[c]>=l.count)&&(r.state="done",this.emit({type:"quest",to:e.id,text:`${a.name}: return to the Keeper`})))}}damageEnemy(e,t,n,i,r=1){e.alive&&(n=Math.round(n*(i?2:1)*(.9+this.rng()*.2)),e.hp-=n,e.threat.set(t.id,(e.threat.get(t.id)||0)+n*r*(t.cls==="warrior"?2.5:1)),e.lastHit=this.time,t.lastCombat=this.time,this.emit({type:"dmg",id:e.id,src:t.id,amount:n,crit:i}),t.cls==="warrior"&&(t.res=Math.min(t.maxRes,t.res+n*.08)),e.hp<=0&&this.killEnemy(e))}taunt(e,t){let n=0;for(const i of e.threat.values())n=Math.max(n,i);e.threat.set(t.id,n+50),e.target=t.id}killEnemy(e){e.alive=!1,e.hp=0,e.diedAt=this.time;const t=qt[e.type];this.emit({type:"death",id:e.id,x:e.x,z:e.z});for(const n of this.players.values()){if(!(e.threat.has(n.id)||Et(n,e)<8))continue;const r=e.level-n.level,a=Math.round(t.xp*_a(e.level)*Ma(1+r*.15,.2,1.5));this.giveXp(n,a),this.progress(n,"kill",e.type),this.dropLoot(n,e,t)}t.boss&&this.emit({type:"banner",text:"The rift is closing! The Colossus has fallen."})}dropLoot(e,t,n){const i=Math.round(n.gold[0]+this.rng()*(n.gold[1]-n.gold[0]));let r=null,a=n.loot>=1?n.loot:this.rng()<n.loot?1:0;const o=[];for(;a-- >0;){const c=qg(this.rng,n.minRarity||"poor");o.push(So({cls:e.cls,level:t.level,slot:"random",rarity:c,rng:this.rng}))}r=o.shift()||null;const l=(c,h,u)=>{const d=this.rng()*Math.PI*2,f=.25+u*.3,g=this.nextId("l");this.loot.set(g,{id:g,owner:e.id,x:t.x+Math.cos(d)*f,z:t.z+Math.sin(d)*f,gold:h,item:c,expires:this.time+120})};l(r,i,0),o.forEach((c,h)=>l(c,0,h+1))}giveXp(e,t){if(!(e.level>=ma)){for(e.xp+=t,this.emit({type:"xp",to:e.id,amount:t});e.level<ma&&e.xp>=xa(e.level);)e.xp-=xa(e.level),e.level++,this.recalc(e,!0),this.emit({type:"levelup",id:e.id,level:e.level});e.privateVersion++}}healPlayer(e,t,n,i){if(!e.alive)return;n=Math.round(n*(i?1.5:1));const r=e.hp;e.hp=Math.min(e.maxHp,e.hp+n),e.hp-r>0&&this.emit({type:"heal",id:e.id,src:t.id,amount:Math.round(e.hp-r),crit:i});for(const a of this.enemies.values())a.alive&&a.threat.has(e.id)&&a.threat.set(t.id,(a.threat.get(t.id)||0)+n*.5)}damagePlayer(e,t,n){if(!e.alive)return;for(const r of e.buffs)r.dr&&(t*=1-r.dr);t*=1-e.stats.dr,t=Math.round(t*(.9+this.rng()*.2));const i=e.buffs.find(r=>r.absorb>0);if(i){const r=Math.min(i.absorb,t);i.absorb-=r,t-=r,i.absorb<=0&&(e.buffs=e.buffs.filter(a=>a!==i))}if(e.hp-=t,e.lastCombat=this.time,e.cls==="warrior"&&(e.res=Math.min(e.maxRes,e.res+t*.5)),this.emit({type:"hurt",id:e.id,src:n?.id,amount:t}),e.hp<=0){e.hp=0,e.alive=!1,e.respawnAt=this.time+tx,e.buffs=[],this.emit({type:"died",id:e.id,name:e.name});for(const r of this.enemies.values())r.threat.delete(e.id)}}wantedSpawns(){const e={imp:0,wisp:0,hound:0,warden:0,colossus:0},t={shard:0,ember:0};let n=1;const i=[...this.players.values()];for(const a of i){n=Math.max(n,a.level);for(const[o,l]of Object.entries(a.quests)){if(l.state!=="active")continue;Fn[o].objectives.forEach((h,u)=>{l.progress[u]>=h.count||(h.kind==="collect"?t[h.target]=Math.max(t[h.target],3):h.target==="warden"||h.target==="colossus"?e[h.target]=1:h.target==="any"?e.imp=Math.max(e.imp,2):e[h.target]!==void 0&&(e[h.target]=Math.max(e[h.target],3)))})}}i.length&&Object.values(e).every(a=>a===0)&&(e.imp=2);const r=1+(i.length-1)*.5;for(const a of["imp","wisp","hound"])e[a]=Math.round(e[a]*r);return{want:e,pick:t,level:n}}spawnPoint(e=1.6,t={}){if(this.map)return this.worldSpawnPoint(e,t);for(let i=0;i<20;i++){const r=this.rng()*Math.PI*2,a=this.arenaRadius*(.45+this.rng()*.55),o={x:Math.cos(r)*a,z:Math.sin(r)*a};let l=!0;for(const c of this.players.values())Et(c,o)<e&&(l=!1);if(l)return o}const n=this.rng()*Math.PI*2;return{x:Math.cos(n)*this.arenaRadius,z:Math.sin(n)*this.arenaRadius}}worldSpawnPoint(e,{nearFurniture:t=!1}={}){const n=this.map,i=new Set;for(const o of this.players.values()){const l=n.zoneAt(o.x,o.z);if(l){i.add(l.id);for(const c of n.links)c.a===l.id&&i.add(c.b),c.b===l.id&&i.add(c.a)}}const r=i.size?n.zones.filter(o=>i.has(o.id)):null,a=[...this.players.values()];return n.randomPoint(this.rng,{zones:r,avoid:a,minDist:e,nearFurniture:t})||n.snap(n.hearth.x,n.hearth.z)}spawnEnemy(e,t,n){const i=qt[e],r=n||this.spawnPoint();this.map&&!n&&(t+=this.map.zoneLevel(this.map.zoneAt(r.x,r.z)));const a=this.nextId("e"),o=Math.max(1,this.players.size),l=_a(t)*(i.elite||i.boss?1+(o-1)*.7:1),c={id:a,kind:"enemy",type:e,name:i.name,level:t,x:r.x,z:r.z,facing:0,hp:Math.round(i.hp*l),maxHp:Math.round(i.hp*l),alive:!0,radius:i.scale*.5,threat:new Map,target:null,attackAt:this.time+1.5,windup:null,buffs:[],summonAt:this.time+(i.summon?.every||0),spawnedAt:this.time};return this.enemies.set(a,c),this.emit({type:"spawn",id:a,enemy:e,x:c.x,z:c.z}),c}updateSpawns(e){if(this.spawnTimer-=e,this.spawnTimer>0||(this.spawnTimer=2.5,!this.players.size))return;const{want:t,pick:n,level:i}=this.wantedSpawns(),r={};for(const o of this.enemies.values())o.alive&&(r[o.type]=(r[o.type]||0)+1);for(const[o,l]of Object.entries(t))if((r[o]||0)<l){const c=o==="warden"?Math.max(4,i):o==="colossus"?Math.max(6,i+1):Math.max(1,i-(this.rng()<.5?1:0));this.spawnEnemy(o,c),qt[o].boss?this.emit({type:"banner",text:"The Rift Colossus tears through!"}):qt[o].elite&&this.emit({type:"banner",text:"A Rift Warden emerges."});break}const a={};for(const o of this.pickups.values())a[o.type]=(a[o.type]||0)+1;for(const[o,l]of Object.entries(n))if((a[o]||0)<l){const c=this.spawnPoint(1,{nearFurniture:!0}),h=this.nextId("k");this.pickups.set(h,{id:h,type:o,name:bh[o].name,x:c.x,z:c.z})}for(const[o,l]of this.pickups)n[l.type]||this.pickups.delete(o)}updateEnemies(e){for(const[t,n]of this.enemies){if(!n.alive){this.time-n.diedAt>4&&this.enemies.delete(t);continue}n.buffs=n.buffs.filter(c=>c.until>this.time);const i=qt[n.type];let r=null,a=-1;for(const[c,h]of n.threat){const u=this.players.get(c);u&&u.alive&&h>a&&(a=h,r=u)}if(!r){let c=i.aggro;for(const h of this.players.values()){if(!h.alive)continue;const u=Et(h,n);u<c&&(c=u,r=h)}r&&n.threat.set(r.id,1)}if(n.target=r?.id||null,n.windup){if(this.time>=n.windup.at){for(const c of this.players.values())c.alive&&Et(c,n.windup)<=n.windup.r&&this.damagePlayer(c,i.dmg*_a(n.level),n);this.emit({type:"slam",id:n.id,x:n.windup.x,z:n.windup.z,r:n.windup.r}),n.windup=null,n.attackAt=this.time+i.attackCd}continue}if(!r)continue;if(i.summon&&this.time>=n.summonAt){n.summonAt=this.time+i.summon.every;for(let c=0;c<i.summon.count;c++){const h=this.rng()*Math.PI*2;this.spawnEnemy(i.summon.type,Math.max(1,n.level-2),{x:n.x+Math.cos(h)*1.2,z:n.z+Math.sin(h)*1.2})}}const o=Et(n,r);n.facing=Math.atan2(r.x-n.x,r.z-n.z);const l=i.range+n.radius;if(o>l*.9){if(_c(n,"root"))continue;const c=n.buffs.find(d=>d.id==="slow"),h=i.speed*(c?c.mul:1)*e,u=Math.min(h,o-l*.8);this.map?this.walkToward(n,r,u):(n.x+=(r.x-n.x)/o*u,n.z+=(r.z-n.z)/o*u)}if(o<=l&&this.time>=n.attackAt){const c=i.ranged?r.x:n.x+Math.sin(n.facing)*(i.range*.6),h=i.ranged?r.z:n.z+Math.cos(n.facing)*(i.range*.6),u=i.aoe;if(this.map&&r.mode==="body"&&(this.map.isHazard(c,h)||this.map.isHazard(r.x,r.z))){n.attackAt=this.time+.5;continue}n.windup={x:c,z:h,r:u,at:this.time+i.windup,dur:i.windup},this.emit({type:"telegraph",id:n.id,x:c,z:h,r:u,dur:i.windup})}for(const c of this.enemies.values()){if(c===n||!c.alive)continue;const h=Et(n,c),u=n.radius+c.radius;if(h>.001&&h<u){const d=(u-h)*.5,f=n.x+(n.x-c.x)/h*d,g=n.z+(n.z-c.z)/h*d;(!this.map||this.map.walkable(f,g))&&(n.x=f,n.z=g)}}}}walkToward(e,t,n){const i=this.map;let r=t;if(i.clearLine(e,t))e.path=null;else{for((!e.path||this.time>=e.pathAt||e.pathFor!==t.id)&&(e.path=i.path(e,t)||[],e.pathAt=this.time+.5,e.pathFor=t.id);e.path.length&&Math.hypot(e.path[0].x-e.x,e.path[0].z-e.z)<.12;)e.path.shift();e.path.length&&(r=e.path[0])}const a=Math.hypot(r.x-e.x,r.z-e.z);if(a<1e-4)return;const o=Math.min(n,a)/a,l=e.x+(r.x-e.x)*o,c=e.z+(r.z-e.z)*o;(i.walkable(l,c)||!i.walkable(e.x,e.z))&&(e.x=l,e.z=c),r!==t&&(e.facing=Math.atan2(r.x-e.x,r.z-e.z))}updatePlayers(e){for(const t of this.players.values()){if(!t.alive){this.time>=t.respawnAt&&(t.alive=!0,t.hp=Math.round(t.maxHp*.5),(t.mode==="avatar"||!this.map)&&Object.assign(t,this.homePoint()),this.emit({type:"respawn",id:t.id}));continue}t.buffs=t.buffs.filter(r=>r.until>this.time);for(const r of t.buffs)r.id==="hot"&&(t.hp=Math.min(t.maxHp,t.hp+r.perSec*e));const n=Zi[xt[t.cls].resource],i=this.time-t.lastCombat>nx;xt[t.cls].resource==="mana"?t.res=Math.min(t.maxRes,t.res+(t.stats.spi*.12+(i?t.maxRes*.04:0))*e):n.regen>0?t.res=Math.min(t.maxRes,t.res+n.regen*e):i&&(t.res=Math.max(0,t.res-3*e)),i&&(t.hp=Math.min(t.maxHp,t.hp+t.maxHp*.03*e)),t.target&&!this.enemies.get(t.target)?.alive&&!this.players.has(t.target)&&(t.target=null)}for(const[t,n]of this.loot)n.expires<this.time&&this.loot.delete(t)}step(e){this.time+=e,this.updatePlayers(e),this.updateEnemies(e),this.updateSpawns(e)}snapshot(e,t){const n=a=>Math.round(a*100)/100,i={t:n(this.time),players:[...this.players.values()].map(a=>({id:a.id,name:a.name,cls:a.cls,level:a.level,x:n(a.x),z:n(a.z),f:n(a.facing),hp:Math.round(a.hp),maxHp:a.maxHp,res:Math.round(a.res),maxRes:a.maxRes,alive:a.alive,target:a.target,buffs:a.buffs.map(o=>o.id),look:Object.fromEntries(ns.map(o=>[o,a.equipment[o]?a.equipment[o].rarity:null]))})),enemies:[...this.enemies.values()].map(a=>({id:a.id,type:a.type,name:a.name,level:a.level,x:n(a.x),z:n(a.z),f:n(a.facing),hp:Math.max(0,Math.round(a.hp)),maxHp:a.maxHp,alive:a.alive,target:a.target,wind:a.windup?{x:n(a.windup.x),z:n(a.windup.z),r:a.windup.r,left:n(a.windup.at-this.time),dur:a.windup.dur}:null,buffs:a.buffs.map(o=>o.id)})),pickups:[...this.pickups.values()].map(a=>({id:a.id,type:a.type,x:n(a.x),z:n(a.z)})),loot:[...this.loot.values()].filter(a=>a.owner===e).map(a=>({id:a.id,x:n(a.x),z:n(a.z),rarity:a.item?.rarity||null})),npcs:this.npcs,arena:this.arenaRadius,events:(t||[]).filter(a=>!a.to||a.to===e)},r=this.players.get(e);return r&&r.privateVersion!==r.sentVersion&&(r.sentVersion=r.privateVersion,i.me={id:r.id,xp:r.xp,xpNext:xa(r.level),gold:r.gold,stats:r.stats,equipment:r.equipment,bag:r.bag,quests:r.quests,available:Eh.filter(a=>this.questAvailable(r,a)).map(a=>a.id)}),r&&(i.cds=Object.fromEntries(Object.entries(r.cds).map(([a,o])=>[a,n(Math.max(0,o-this.time))]))),i}drainEvents(){const e=this.events;return this.events=[],e}}function _c(s,e){return s.buffs.some(t=>t.id===e)}function ya(s,e){s.buffs=s.buffs.filter(t=>!(t.id===e.id&&(!e.src||t.src===e.src))),s.buffs.push(e)}class sx{constructor({arena:e,world:t=null}){this.sim=new ix({arenaRadius:e,world:Qg(t)}),this.id="solo"}connect(e){this.sim.join(this.id,e);let t=0;return this.timer=setInterval(()=>{if(this.sim.step(1/pa),++t%2)return;const n=this.sim.drainEvents();this.onSnapshot?.(this.sim.snapshot(this.id,n)),t%(pa*5)===0&&this.onSave?.(this.sim.saveOf(this.id))},1e3/pa),Promise.resolve({id:this.id,room:null,world:this.sim.map?this.sim.map.describe():null})}send(e){this.sim.handle(this.id,e)}requestSave(){this.onSave?.(this.sim.saveOf(this.id))}close(){this.requestSave(),clearInterval(this.timer)}}class rx{constructor({url:e}){this.url=e}connect(e){return new Promise((t,n)=>{const i=new WebSocket(this.url);this.ws=i;let r=!1;i.onopen=()=>i.send(JSON.stringify({t:"hello",...e})),i.onerror=()=>{r||n(new Error("Could not reach the game server"))},i.onclose=()=>{r&&this.onClose?.(this.closedText)},i.onmessage=a=>{const o=JSON.parse(a.data);o.t==="welcome"?(r=!0,this.id=o.id,t(o)):o.t==="error"&&!r?n(new Error(o.text)):o.t==="snap"?this.onSnapshot?.(o.s):o.t==="save"?this.onSave?.(o.save):o.t==="waiting"?this.onWaiting?.():o.t==="knock"?this.onKnock?.(o):o.t==="closed"&&(this.closedText=o.text)}})}send(e){this.ws?.readyState===1&&this.ws.send(JSON.stringify(e))}requestSave(){this.send({t:"save"})}close(){this.ws?.close()}}function ax(){const s=new URLSearchParams(location.search).get("server");return s||`${location.protocol==="https:"?"wss":"ws"}://${location.host}/ws`}const Sa=new Map;function Le(s,e={}){const t=`${s}|${JSON.stringify(e)}`;return Sa.has(t)||Sa.set(t,new Dd({color:s,roughness:.7,metalness:.05,flatShading:!0,...e})),Sa.get(t)}const Nt=(s,e=1.5)=>Le(s,{emissive:s,emissiveIntensity:e,roughness:.4});function ge(s,e,t=0,n=0,i=0){const r=new ct(s,e);return r.position.set(t,n,i),r.castShadow=!0,r}const br="#e9c3a0",ox={warrior:"#6b4f3a",mage:"#4a3d7a",ranger:"#4f5d3a",cleric:"#d8d2c0"},vc={poor:"#7d7d7d",common:"#b9b9b9",uncommon:"#3fae2a",rare:"#2f79d6",epic:"#9b3ae6",legendary:"#ff8a1a"};function Mc(s,e={}){const t=xt[s],n=new At,i=ox[s],r=(w,E)=>e[w]?vc[e[w]]:E,a=t.armor==="plate"||t.armor==="mail",o=(w,E)=>Le(r(w,E),a&&e[w]?{metalness:.6,roughness:.35}:{}),l=w=>e[w]==="legendary"||e[w]==="epic",c=new At;c.position.y=.85,n.add(c);const h=new qe(.16,.8,.18),u=new qe(.18,.16,.26),d=[-.11,.11].map(w=>{const E=new At;return E.position.set(w,0,0),E.add(ge(h,o("legs",i),0,-.4,0)),E.add(ge(u,o("feet","#3b2b20"),0,-.78,.04)),c.add(E),E}),f=ge(new qe(.46,.6,.26),o("chest",i),0,.32,0);c.add(f),t.armor==="cloth"&&c.add(ge(new kt(.2,.3,.4,7),o("chest",i),0,-.1,0));const g=ge(new qe(.48,.07,.28),Le(t.color),0,.04,0);c.add(g);const y=ge(new Tn(.15,1),Le(br),0,.8,0);if(c.add(y),e.head){const w=ge(new Ps(.17,8,6,0,Math.PI*2,0,Math.PI*.55),o("head"),0,.82,0);c.add(w),s==="warrior"&&c.add(ge(new un(.04,.16,5),o("head"),0,1.02,0))}else t.armor==="cloth"&&c.add(ge(new un(.17,.3,7),Le(i),0,1,-.02));for(const w of[-.05,.05])c.add(ge(new qe(.03,.03,.02),Le("#111"),w,.82,.14));const m=new Ps(e.shoulders?.12:.08,7,5),p=[-1,1].map(w=>{const E=new At;return E.position.set(w*.3,.56,0),E.add(ge(m,o("shoulders",i),0,0,0)),E.add(ge(new qe(.12,.5,.12),Le(i),0,-.27,0)),E.add(ge(new qe(.13,.12,.13),o("hands",br),0,-.55,0)),c.add(E),E}),S=new At;S.position.set(0,-.58,.05);const b=e.weapon?vc[e.weapon]:"#9a9a9a",v=l("weapon");if(s==="warrior"){S.add(ge(new qe(.05,.75,.02),v?Nt(b,.8):Le(b,{metalness:.7,roughness:.3}),0,0,.38).rotateX(Math.PI/2)),S.add(ge(new qe(.2,.04,.05),Le("#5a4630"),0,0,.02));const w=ge(new kt(.22,.22,.04,8),o("chest","#7a5a3a"),0,-.45,.12);w.rotation.x=Math.PI/2,p[0].add(w)}else if(s==="mage")S.add(ge(new kt(.025,.03,1.3,6),Le("#5b3a22"),0,.3,0)),S.add(ge(new si(.08),Nt(e.weapon?b:"#69ccf0"),0,.98,0));else if(s==="ranger"){const w=ge(new wr(.42,.02,4,12,Math.PI),v?Nt(b,.8):Le(e.weapon?b:"#6d4a2a"),0,0,.05);w.rotation.z=Math.PI/2,w.rotation.y=Math.PI/2,S.add(w),c.add(ge(new kt(.06,.06,.45,6),Le("#5a3d22"),.12,.4,-.18))}else S.add(ge(new kt(.025,.025,.55,6),Le("#6d5a3a"),0,.15,0)),S.add(ge(new jn(.09),v?Nt(b,.8):Le(e.weapon?b:"#d9c27a",{metalness:.6}),0,.45,0));return p[1].add(S),n.userData={legs:d,arms:p,hips:c,kind:"humanoid",baseY:.85},n}function lx(s){const e=qt[s],t=new At,n=new At;t.add(n);const i=e.color,r=Nt("#ffef5a",2);if(s==="imp"){n.add(ge(new Tn(.35,0),Le(i),0,.5,0)),n.add(ge(new Tn(.22,0),Le(i),0,.95,.05));for(const a of[-1,1]){n.add(ge(new un(.06,.25,4),Le("#2a1010"),a*.12,1.18,0).rotateZ(-a*.4)),n.add(ge(new qe(.04,.04,.02),r,a*.08,.98,.24));const o=ge(new un(.18,.5,3),Le("#7a1d12"),a*.38,.75,-.15);o.rotation.z=a*1.2,n.add(o),n.add(ge(new qe(.09,.3,.09),Le(i),a*.16,.15,0))}}else if(s==="wisp"){n.add(ge(new Tn(.3,1),Nt(i,1.2),0,1.1,0));for(let a=0;a<4;a++){const o=ge(new Vo(.08),Nt("#d4c2ff",1.5),0,1.1,0);o.userData.orbit=a*Math.PI/2,n.add(o)}for(const a of[-1,1])n.add(ge(new qe(.05,.05,.02),Nt("#ffffff",2),a*.09,1.15,.28))}else if(s==="hound"){n.add(ge(new qe(.4,.4,.9),Le(i),0,.55,0)),n.add(ge(new qe(.32,.3,.38),Le("#33334a"),0,.7,.55)),n.add(ge(new qe(.2,.14,.2),Le("#222235"),0,.62,.8));for(const o of[-1,1]){n.add(ge(new qe(.05,.05,.02),Nt("#9cf3ff",2),o*.09,.76,.75)),n.add(ge(new un(.06,.18,4),Le("#222235"),o*.1,.92,.5));for(const l of[-.32,.32])n.add(ge(new qe(.1,.4,.1),Le("#2a2a3c"),o*.15,.2,l))}const a=ge(new un(.06,.45,4),Le(i),0,.7,-.6);a.rotation.x=-1,n.add(a)}else if(s==="warden"){const a=Le(i,{metalness:.5,roughness:.4});n.add(ge(new qe(.8,.9,.5),a,0,1.25,0)),n.add(ge(new si(.15),Nt("#7ef9ff",2),0,1.3,.27)),n.add(ge(new qe(.4,.38,.4),a,0,1.9,0));for(const o of[-1,1])n.add(ge(new un(.08,.5,5),Le("#e8e2cf"),o*.25,2.2,0).rotateZ(-o*.5)),n.add(ge(new qe(.06,.05,.02),Nt("#7ef9ff",2),o*.09,1.92,.21)),n.add(ge(new qe(.28,.8,.3),a,o*.22,.4,0)),n.add(ge(new qe(.24,.9,.26),a,o*.56,1.15,0));n.add(ge(new qe(.12,1.6,.12),Le("#2b3b3a"),.75,.9,.35)),n.add(ge(new qe(.5,.35,.12),Le("#5c6d6b",{metalness:.7}),.75,1.65,.35))}else if(s==="colossus"){const a=Le(i,{roughness:.95}),o=Nt("#ff6a1a",2);n.add(ge(new jn(.75,0),a,0,1.6,0)),n.add(ge(new jn(.45,0),a,0,2.55,.1)),n.add(ge(new si(.25),o,0,1.6,.62));for(const l of[-1,1])n.add(ge(new jn(.4,0),a,l*.45,.45,0)),n.add(ge(new jn(.42,0),a,l*1,1.9,0)),n.add(ge(new jn(.38,0),a,l*1.15,1.2,.2)),n.add(ge(new qe(.1,.06,.03),o,l*.15,2.6,.5))}return t.userData={body:n,kind:"enemy",type:s},t}function cx(s){const e=new At;if(s==="questgiver"){e.add(ge(new un(.32,1.3,8),Le("#2e4a6b"),0,.65,0)),e.add(ge(new Tn(.15,1),Le(br),0,1.42,0)),e.add(ge(new un(.18,.32,8),Le("#d9c27a"),0,1.62,0)),e.add(ge(new kt(.02,.02,1.6,5),Le("#6b4a2a"),.3,.8,.1));const t=ge(new si(.09),Nt("#7ef9ff",2),.3,1.65,.1);e.add(t),e.userData.orb=t}else e.add(ge(new kt(.25,.3,.9,7),Le("#7a5230"),0,.45,0)),e.add(ge(new Tn(.15,1),Le(br),0,1.05,0)),e.add(ge(new kt(.2,.2,.06,8),Le("#3e2a1a"),0,1.18,0)),e.add(ge(new qe(.4,.5,.25),Le("#5a3a1f"),0,.8,-.28)),e.add(ge(new kt(.07,.07,.03,10),Nt("#ffd34a",.8),.3,.6,.15).rotateX(Math.PI/2));return e.userData.kind="npc",e}function hx(s,e){const t=document.createElement("canvas");t.width=t.height=128;const n=t.getContext("2d");n.font="bold 110px Georgia, serif",n.textAlign="center",n.textBaseline="middle",n.lineWidth=10,n.strokeStyle="#000",n.strokeText(s,64,70),n.fillStyle=e,n.fillText(s,64,70);const i=new ku(new $c({map:new $u(t),depthTest:!1}));return i.scale.set(.35,.35,.35),i}function ux(){const s=new At,e=ge(new wr(.75,.07,6,24),Le("#3a3550",{roughness:.6}),0,.85,0);s.add(e);for(let n=0;n<8;n++){const i=n/8*Math.PI*2;s.add(ge(new si(.07),Nt("#7ef9ff",2),Math.cos(i)*.75,.85+Math.sin(i)*.75,0))}const t=new ct(new ji(.7,32),new pn({color:"#6b3cff",transparent:!0,opacity:.55,side:en}));return t.position.y=.85,s.add(t),s.userData={disc:t},s}function dx(s){const e=new At,t=bh[s].color,n=s==="shard"?ge(new si(.1),Nt(t,1.8),0,.3,0):ge(new Tn(.09,1),Nt(t,2.2),0,.3,0);s==="shard"&&(n.scale.y=1.8),e.add(n);const i=new ct(new kt(.04,.04,1.2,6,1,!0),new pn({color:t,transparent:!0,opacity:.25,depthWrite:!1}));return i.position.y=.6,e.add(i),e.userData={gem:n},e}function fx(s){const e=new At;e.add(ge(new Tn(.1,0),Le("#8a5a2b"),0,.1,0)),e.add(ge(new kt(.04,.06,.06,6),Le("#5a3a1a"),0,.2,0));const t=s?yn[s].color:"#ffd34a",n=new ct(new kt(.05,.05,1.5,6,1,!0),new pn({color:t,transparent:!0,opacity:.35,depthWrite:!1}));return n.position.y=.75,e.add(n),e}function Un(s,e,t,n=.8){const i=new ct(new ko(s,e,40),new pn({color:t,transparent:!0,opacity:n,depthWrite:!1,side:en}));return i.rotation.x=-Math.PI/2,i.position.y=.01,i.renderOrder=2,i}function px(s,e,t=.35){const n=new ct(new ji(s,40),new pn({color:e,transparent:!0,opacity:t,depthWrite:!1,side:en}));return n.rotation.x=-Math.PI/2,n.position.y=.012,n.renderOrder=2,n}const mx={fire:"#ff7a2a",arcane:"#d18bff",arrow:"#e8d9b0",holy:"#ffe88a"};class gx{constructor(e){this.scene=e,this.root=new At,e.add(this.root),this.entities=new Map,this.effects=[],this.selfId=null,this.hideSelf=!1,this.raycastTargets=[],this.portal=ux(),this.portal.position.set(0,0,-.9),this.root.add(this.portal),this.arenaRing=Un(2.95,3,"#7ef9ff",.35),this.root.add(this.arenaRing),this.selection=Un(.42,.5,"#ffd34a",.9),this.selection.visible=!1,this.root.add(this.selection),this.selfRing=Un(.22,.28,"#4ad8ff",.7),this.root.add(this.selfRing),this.shadowFloor=new ct(new Mi(20,20),new Ad({opacity:.3})),this.shadowFloor.rotation.x=-Math.PI/2,this.shadowFloor.receiveShadow=!0,this.root.add(this.shadowFloor),this.sun=new Bd("#fff4e0",2.2),this.sun.position.set(2,6,3),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(1024,1024);const t=this.sun.shadow.camera;t.left=-6,t.right=6,t.top=6,t.bottom=-6,t.near=.5,t.far=20,this.root.add(this.sun),this.root.add(this.sun.target),e.add(new hh("#dfe8ff","#5a4a3a",1.3))}setArena(e){this.arenaR!==e&&(this.arenaR=e,this.root.remove(this.arenaRing),this.arenaRing=Un(e-.05,e,"#7ef9ff",.35),this.root.add(this.arenaRing))}apply(e,t){this.setArena(e.arena);const n=new Set,i=(r,a,o,l)=>{n.add(r);let c=this.entities.get(r);if(!c){const h=l();h.position.set(o.x,0,o.z),h.traverse(u=>{u.userData.entityId=r}),this.root.add(h),c={id:r,obj:h,kind:a,data:o,pos:new C(o.x,0,o.z),facing:o.f||0,speed:0},this.entities.set(r,c)}return c.data=o,c.pos.set(o.x,0,o.z),typeof o.f=="number"&&(c.facing=o.f),c};for(const r of e.players){const a=JSON.stringify(r.look),o=i(r.id,"player",r,()=>Mc(r.cls,r.look));o.lookKey&&o.lookKey!==a&&this.rebuild(o,()=>Mc(r.cls,r.look)),o.lookKey=a}for(const r of e.enemies){const a=i(r.id,"enemy",r,()=>{const o=lx(r.type);return o.scale.setScalar(qt[r.type].scale*1.2),o});this.updateTelegraph(a,r.wind)}for(const r of e.npcs){const a=i(r.id,"npc",r,()=>cx(r.kind));r.kind==="questgiver"&&this.updateQuestMarker(a,t)}for(const r of e.pickups)i(r.id,"pickup",r,()=>dx(r.type));for(const r of e.loot)i(r.id,"loot",r,()=>fx(r.rarity));for(const[r,a]of this.entities)n.has(r)||(this.root.remove(a.obj),a.tele&&this.root.remove(a.tele.group),this.entities.delete(r));this.raycastTargets=[...this.entities.values()].filter(r=>r.kind!=="player"||r.id!==this.selfId).map(r=>r.obj)}rebuild(e,t){const n=e.obj.position.clone(),i=e.obj.rotation.y;this.root.remove(e.obj),e.obj=t(),e.obj.position.copy(n),e.obj.rotation.y=i,e.obj.traverse(r=>{r.userData.entityId=e.id}),this.root.add(e.obj)}updateQuestMarker(e,t){const n=t?.questMarker||null;e.markerChar!==n&&(e.marker&&e.obj.remove(e.marker),e.marker=null,e.markerChar=n,n&&(e.marker=hx(n,"#ffd34a"),e.marker.position.y=2.05,e.obj.add(e.marker)))}updateTelegraph(e,t){if(!t){e.tele&&(this.root.remove(e.tele.group),e.tele=null);return}if(!e.tele){const n=new At,i=Un(t.r-.04,t.r,"#ff2a2a",.95),r=px(t.r,"#ff3b2a",.35);n.add(i,r),this.root.add(n),e.tele={group:n,fill:r}}e.tele.group.position.set(t.x,0,t.z),e.tele.left=t.left,e.tele.dur=t.dur}handleEvent(e){const t=this.entities.get(e.id);if(e.type==="cast"){const n=t,i=this.entities.get(e.target);n&&(n.swing=.35),n&&i&&e.projectile&&i!==n&&this.projectile(n.obj.position,i.obj.position,mx[e.projectile])}else if(e.type==="nova"){const n={cleave:"#ffcf8a",frostNova:"#a8e8ff",frostTrap:"#a8e8ff",holyNova:"#ffe88a"}[e.ability]||"#ffffff";this.expandRing(e.x,e.z,e.radius,n,.45)}else e.type==="slam"?this.expandRing(e.x,e.z,e.r,"#ff5a3a",.35):e.type==="dmg"&&t?t.flash=.15:e.type==="death"&&t?t.dying=0:e.type==="levelup"&&t?this.column(t.obj.position,"#ffd34a"):e.type==="pickup"?this.expandRing(e.x,e.z,.6,"#7ef9ff",.4):e.type==="spawn"?this.expandRing(e.x,e.z,.8,"#8a5cff",.6):e.type==="buff"&&t&&this.column(t.obj.position,e.buff==="shieldWall"?"#ffcf8a":"#d18bff",.6)}projectile(e,t,n){const i=new ct(new Ps(.07,8,6),new pn({color:n}));this.root.add(i);const r=e.clone().setY(1.1),a=t.clone().setY(.8);this.effects.push({t:0,dur:.28,update:o=>i.position.lerpVectors(r,a,o),done:()=>this.root.remove(i)})}expandRing(e,t,n,i,r){const a=Un(.85,1,i,.9);a.position.set(e,.02,t),this.root.add(a),this.effects.push({t:0,dur:r,update:o=>{a.scale.setScalar(Math.max(.01,n*(.2+.8*o))),a.material.opacity=.9*(1-o)},done:()=>{this.root.remove(a),a.material.dispose()}})}column(e,t,n=1.2){const i=new ct(new kt(.35,.35,2.4,16,1,!0),new pn({color:t,transparent:!0,opacity:.5,depthWrite:!1,side:en}));i.position.set(e.x,1.2,e.z),this.root.add(i),this.effects.push({t:0,dur:n,update:r=>{i.material.opacity=.5*(1-r),i.scale.x=i.scale.z=1+r*.5},done:()=>this.root.remove(i)})}update(e,t,n,i){for(const a of this.entities.values()){const o=a.obj,l=a.id===this.selfId,c=l&&n?n:a.pos,h=o.position.clone();o.position.lerp(c,l?1:Math.min(1,e*10));const u=h.distanceTo(o.position)/Math.max(e,.001);a.speed+=(u-a.speed)*Math.min(1,e*8);let d=a.facing-o.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d)),o.rotation.y+=d*Math.min(1,e*12),o.visible=!(l&&this.hideSelf);const f=o.userData;if(f.kind==="humanoid"){const g=Math.sin(t*9)*Math.min(1,a.speed*1.2)*.6;f.legs[0].rotation.x=g,f.legs[1].rotation.x=-g,f.arms[0].rotation.x=-g*.7,a.swing>0?(a.swing-=e,f.arms[1].rotation.x=-1.6*Math.sin(a.swing/.35*Math.PI)):f.arms[1].rotation.x=g*.7,f.hips.position.y=f.baseY+Math.abs(g)*.04;const y=a.data.alive===!1;o.rotation.x=y?-Math.PI/2:0,o.position.y=y?.15:0}else if(f.kind==="enemy"){const g=f.type==="wisp"?Math.sin(t*3+a.id.length)*.08:Math.abs(Math.sin(t*8))*Math.min(1,a.speed)*.06;if(f.body.position.y=g,f.type==="wisp"&&f.body.children.forEach(y=>{if(y.userData.orbit!==void 0){const m=y.userData.orbit+t*2.5;y.position.set(Math.cos(m)*.45,1.1+Math.sin(m*2)*.1,Math.sin(m)*.45)}}),a.tele){a.tele.left-=e;const y=1-Math.max(0,a.tele.left)/a.tele.dur;a.tele.fill.scale.setScalar(Math.max(.01,y)),f.body.rotation.x=-.25*y}else f.body.rotation.x=0;a.data.alive===!1&&a.dying===void 0&&(a.dying=0),a.dying!==void 0&&(a.dying+=e,o.position.y=-a.dying*.5,o.rotation.z=Math.min(1.4,a.dying*2)),(a.data.buffs?.includes("root")||a.data.buffs?.includes("slow"))&&(f.body.rotation.z=Math.sin(t*30)*.02)}else a.kind==="pickup"?(o.userData.gem.rotation.y=t*2,o.userData.gem.position.y=.3+Math.sin(t*3)*.05):a.kind==="npc"&&o.userData.orb&&(o.userData.orb.position.y=1.65+Math.sin(t*2)*.05,a.marker&&(a.marker.position.y=2.05+Math.sin(t*2.5)*.05));a.flash>0?(a.flash-=e,o.scale.setScalar((a.baseScale??=o.scale.x)*(1+a.flash))):a.baseScale&&o.scale.setScalar(a.baseScale)}this.portal.userData.disc.rotation.z=t,this.portal.userData.disc.material.opacity=.45+Math.sin(t*2)*.1;const r=i&&this.entities.get(i);if(this.selection.visible=!!r,r){this.selection.position.set(r.obj.position.x,.015,r.obj.position.z);const a=r.kind==="enemy"?qt[r.data.type].scale*.9+.2:.5;this.selection.scale.setScalar(a/.5),this.selection.material.color.set(r.kind==="enemy"?"#ff4a3a":"#4aff7a")}n&&this.selfRing.position.set(n.x,.015,n.z),this.effects=this.effects.filter(a=>{a.t+=e;const o=Math.min(1,a.t/a.dur);return a.update(o),o>=1?(a.done(),!1):!0})}entityAt(e){const t=e.intersectObjects(this.raycastTargets,!0);for(const r of t){const a=r.object.userData.entityId;if(a&&this.entities.has(a))return this.entities.get(a)}let n=null,i=.6;for(const r of this.entities.values()){if(r.id===this.selfId||r.kind==="pickup")continue;const a=r.obj.getWorldPosition(new C).add(new C(0,.6*this.root.scale.x,0)),o=e.ray.distanceToPoint(a)/this.root.scale.x;o<i&&(i=o,n=r)}return n}setWorld(e,{twin:t}){this.root.remove(this.arenaRing),this.arenaR=-1,this.setArena=()=>{};const n=e.hearth||{x:0,z:0};if(this.portal.position.set(n.x,0,n.z-.9),!t)return;const i={hearth:"#8a6a4a",barracks:"#5a4a6b",forge:"#7a4a2a",grotto:"#2f5a6b",feasthall:"#6b5a2f",gloam:"#3a3550",wilds:"#3f6b2f"};for(const r of e.zones){const a=new ih(r.floor.map(([l,c])=>new le(l,-c))),o=new ct(new Ho(a).rotateX(-Math.PI/2),Le(i[r.theme]||i.hearth,{roughness:.95}));o.position.y=(r.floorY||0)+.002,o.receiveShadow=!0,this.root.add(o);for(const l of r.objects||[]){const c=new ct(new qe(l.w,l.h,l.d),Le(l.cat==="stairs"?"#a05050":"#5b4c40"));c.position.set(l.x,(r.floorY||0)+l.h/2,l.z),c.rotation.y=l.yaw||0,c.castShadow=c.receiveShadow=!0,this.root.add(c)}for(const l of r.walls||[]){const[c,h]=l.a,[u,d]=l.b,f=Math.hypot(u-c,d-h),g=new ct(new qe(f,l.h,.08),Le("#d8d0c0"));g.position.set((c+u)/2,(r.floorY||0)+l.h/2,(h+d)/2),g.rotation.y=-Math.atan2(d-h,u-c),this.root.add(g)}}this.shadowFloor.visible=!1}addPreviewFloor(){const e=new ct(new ji(12,48),Le("#8a6a4a",{roughness:.95}));e.rotation.x=-Math.PI/2,e.receiveShadow=!0,e.position.y=-.005,this.root.add(e);const t=new At;for(let i=-12;i<=12;i+=.6){const r=new ct(new Mi(.015,24),new pn({color:"#6e5238"}));r.rotation.x=-Math.PI/2,r.position.set(i,.001,0),t.add(r)}this.root.add(t);const n=new ct(new ji(2.2,40),Le("#7a2e3a",{roughness:1}));n.rotation.x=-Math.PI/2,n.position.y=.003,n.receiveShadow=!0,this.root.add(n),this.shadowFloor.visible=!1}}let hi=null;const xx={hit:[[320,.05,"square",.05]],hurt:[[140,.12,"sawtooth",.08]],warn:[[880,.06,"triangle",.06],[660,.06,"triangle",.06]],loot:[[660,.06,"sine",.08],[990,.08,"sine",.08]],quest:[[523,.1,"triangle",.08],[659,.1,"triangle",.08],[784,.16,"triangle",.08]],level:[[523,.1,"sine",.1],[659,.1,"sine",.1],[784,.1,"sine",.1],[1046,.3,"sine",.1]],portal:[[200,.4,"sine",.1],[300,.4,"sine",.08]],die:[[300,.2,"sawtooth",.08],[180,.4,"sawtooth",.08]]};function Jt(s){try{hi??=new AudioContext,hi.state==="suspended"&&hi.resume();let e=hi.currentTime;for(const[t,n,i,r]of xx[s]||[]){const a=hi.createOscillator(),o=hi.createGain();a.type=i,a.frequency.value=t,o.gain.setValueAtTime(r,e),o.gain.exponentialRampToValueAtTime(1e-4,e+n),a.connect(o).connect(hi.destination),a.start(e),a.stop(e+n),e+=n*.8}}catch{}}const at=s=>document.querySelector(s),Tt=s=>String(s).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Ah={head:"⛑",shoulders:"🪖",chest:"🥋",hands:"🧤",legs:"👖",feet:"🥾",weapon:"🗡",trinket:"📿"},_x={warrior:"🗡",mage:"🪄",ranger:"🏹",cleric:"🔨"},yc={shieldWall:"🛡",absorb:"🔮",hot:"💚",root:"❄",slow:"🐌"};function gs(s,e,t,n=!0){const i=e>0?Math.max(0,Math.min(1,s/e)):0;return`<div class="bar"><div class="fill" style="background:${t};transform:scaleX(${i})"></div>${n?`<span>${Math.round(s)} / ${e}</span>`:""}</div>`}class vx{constructor(e){this.game=e,this.panel=null,this.plates=new Map,this.buildActionBar(),at("#topButtons").addEventListener("click",t=>{const n=t.target.closest("button");n&&this.toggle(n.dataset.panel)}),at("#panel").addEventListener("click",t=>this.onPanelClick(t)),at("#tooltip").addEventListener("click",t=>this.onTooltipClick(t)),at("#partyFrames").addEventListener("click",t=>{const n=t.target.closest("[data-id]");n&&e.setTarget(n.dataset.id)});for(const t of document.querySelectorAll("#hud > *"))t.addEventListener("beforexrselect",n=>n.preventDefault())}buildActionBar(){const e=xt[this.game.cls],t=["1","2","3","4"],n=e.abilities.map((i,r)=>{const a=Sr[i];return`<button class="ab" data-ab="${i}" title="${Tt(a.name)}: ${Tt(a.desc)}"><span class="key">${t[r]}</span>${a.icon}<div class="cd"></div><span class="cdt"></span></button>`}).join("");at("#actionBar").innerHTML=`<button class="ab small" data-act="next" title="Target nearest enemy (Tab)">🎯</button>${n}<button class="ab small" data-act="potion" title="Drink a potion (Q)">🧪<span class="cnt"></span><div class="cd"></div></button>`,at("#actionBar").onclick=i=>{const r=i.target.closest("button");r&&(r.dataset.ab?this.game.cast(r.dataset.ab):r.dataset.act==="next"?this.game.targetNearest():r.dataset.act==="potion"&&this.game.drinkPotion())}}update(e,t,n,i){if(!n)return;const r=xt[n.cls],a=Zi[r.resource];at("#playerFrame").innerHTML=`<div class="name"><span>${Tt(n.name)}</span><span class="lvl">${n.level}</span></div>
      ${gs(n.hp,n.maxHp,"var(--hp)")}${gs(n.res,n.maxRes,a.color)}
      <div class="buffs">${n.buffs.map(u=>yc[u]||"").join("")}<span style="margin-left:auto;color:var(--gold)">${t?.gold??0}g</span></div>`;const o=at("#targetFrame");if(i){o.classList.remove("hidden");const u=!!i.type,d=u?qt[i.type]:null,f=d?.boss?" 💀":d?.elite?" ★":"";o.innerHTML=`<div class="name"><span>${Tt(i.name)}${f}</span><span class="lvl">${i.level}</span></div>
        ${gs(i.hp,i.maxHp,u?"var(--danger)":"var(--hp)")}
        <div class="buffs">${(i.buffs||[]).map(g=>yc[g]||"").join("")}</div>`}else o.classList.add("hidden");const l=e.players.filter(u=>u.id!==n.id);at("#partyFrames").innerHTML=l.map(u=>`<div class="unitframe ${this.game.targetId===u.id?"sel":""}" data-id="${u.id}">
      <div class="name"><span style="color:${xt[u.cls].color}">${Tt(u.name)}</span><span class="lvl">${u.level}</span></div>
      ${gs(u.hp,u.maxHp,u.alive?"var(--hp)":"#555",!1)}${gs(u.res,u.maxRes,Zi[xt[u.cls].resource].color,!1)}</div>`).join("");for(const u of document.querySelectorAll("#actionBar [data-ab]")){const d=Sr[u.dataset.ab],f=this.game.cooldownLeft(u.dataset.ab);u.querySelector(".cd").style.setProperty("--p",`${Math.min(100,f/d.cd*100)}%`),u.querySelector(".cdt").textContent=f>.05?f>3?Math.ceil(f):f.toFixed(1):"",u.classList.toggle("nores",n.res<d.cost)}const c=(t?.bag||[]).filter(u=>u.kind==="consumable").length,h=at('#actionBar [data-act="potion"]');h.querySelector(".cnt").textContent=c||"",h.querySelector(".cd").style.setProperty("--p",`${Math.min(100,this.game.cooldownLeft("potion")/10*100)}%`),t&&(at("#xpBar .fill").style.transform=`scaleX(${t.xp/t.xpNext})`,at("#xpBar span").textContent=`XP ${t.xp} / ${t.xpNext}`),at("#deathNote").classList.toggle("hidden",n.alive)}tracker(e){if(!e)return;const t=[];for(const[n,i]of Object.entries(e.quests)){if(i.state!=="active"&&i.state!=="done")continue;const r=Fn[n];t.push(`<b>${Tt(r.name)}</b>`),i.state==="done"?t.push('<div class="ok">Return to the Keeper</div>'):r.objectives.forEach((a,o)=>t.push(`<div class="${i.progress[o]>=a.count?"ok":""}">${ba(a)}: ${i.progress[o]}/${a.count}</div>`))}!t.length&&e.available.length&&t.push("<b>Talk to the Keeper</b><div>Tap her for a quest</div>"),at("#tracker").innerHTML=t.join(""),this.panel&&this.panel!=="menu"&&this.renderPanel()}radar(e,t,n){const i=at("#radar"),r=i.getContext("2d"),a=i.width,o=a/2;r.clearRect(0,0,a,a);const l=Math.max(4,e.arena*2),c=(o-8)/l;r.strokeStyle="rgba(126,249,255,0.25)",r.beginPath(),r.arc(o,o,o-8,0,Math.PI*2),r.stroke(),r.beginPath(),r.arc(o,o,(o-8)/2,0,Math.PI*2),r.stroke();const h=Math.cos(n),u=Math.sin(n),d=(f,g,y,m)=>{const p=f-t.x,S=g-t.z;let b=(-p*h+S*u)*c,v=-(p*u+S*h)*c;const w=Math.hypot(b,v),E=o-8;w>E&&(b*=E/w,v*=E/w),r.fillStyle=y,r.beginPath(),r.arc(o+b,o+v,m,0,Math.PI*2),r.fill()};for(const f of e.npcs)d(f.x,f.z,f.kind==="questgiver"?"#ffd34a":"#c08a4a",6);for(const f of e.pickups)d(f.x,f.z,"#7ef9ff",5);for(const f of e.loot)d(f.x,f.z,f.rarity?yn[f.rarity].color:"#ffd34a",4);for(const f of e.players)f.id!==this.game.selfId&&d(f.x,f.z,"#4aff7a",6);for(const f of e.enemies)f.alive&&d(f.x,f.z,qt[f.type].boss||qt[f.type].elite?"#ff8a1a":"#ff3a2a",qt[f.type].boss?9:6);r.fillStyle="#fff",r.beginPath(),r.moveTo(o,o-9),r.lineTo(o-6,o+6),r.lineTo(o+6,o+6),r.fill()}plate(e,t,n,i,r,a){let o=this.plates.get(e);if(o||(o=document.createElement("div"),o.className=`plate ${n}`,at("#floaters").appendChild(o),this.plates.set(e,o)),!a){o.style.display="none";return}o.style.display="",o._html!==t&&(o.innerHTML=t,o._html=t),o.style.left=`${i}px`,o.style.top=`${r}px`}prunePlates(e){for(const[t,n]of this.plates)e.has(t)||(n.remove(),this.plates.delete(t))}floatText(e,t,n,i){const r=document.createElement("div");r.className=`float ${i}`,r.textContent=e,r.style.left=`${t+(Math.random()-.5)*30}px`,r.style.top=`${n}px`,at("#floaters").appendChild(r),setTimeout(()=>r.remove(),1e3)}toast(e,t=!1){const n=performance.now();if(this.lastToast===e&&n-this.lastToastAt<1500)return;this.lastToast=e,this.lastToastAt=n;const i=document.createElement("div");for(i.className=`toast ${t?"err":""}`,i.innerHTML=e,at("#toasts").appendChild(i),setTimeout(()=>i.remove(),2600);at("#toasts").children.length>4;)at("#toasts").firstChild.remove()}banner(e){const t=at("#banner");t.textContent=e,t.classList.remove("hidden"),clearTimeout(this.bannerT),this.bannerT=setTimeout(()=>t.classList.add("hidden"),3500)}knock(e){const t=document.createElement("div");t.className="knock",t.innerHTML=`<b>${Tt(e.name)}</b> (${Tt(xt[e.cls]?.name||"Adventurer")}) wants to join your home.<br><small>They will see your rooms' layout while you host.</small>
      <div class="acts"><button data-allow="1" class="primary">Let them in</button><button data-allow="0" class="secondary">No</button></div>`,t.addEventListener("beforexrselect",n=>n.preventDefault()),t.addEventListener("click",n=>{const i=n.target.closest("[data-allow]");i&&(this.game.send({t:"admit",id:e.id,allow:i.dataset.allow==="1"}),t.remove())}),at("#hud").appendChild(t),Jt("warn")}toggle(e,t){if(this.panel===e&&t===void 0)return this.close();this.panel=e,this.panelArg=t,this.hideTooltip(),this.renderPanel(),at("#panel").classList.remove("hidden")}close(){this.panel=null,at("#panel").classList.add("hidden"),this.hideTooltip()}renderPanel(){const e=this.game.me;if(!e)return;const t=at("#panel .panel-inner"),n='<button class="close" data-act="close">✕</button>';this.panel==="keeper"?t.innerHTML=n+this.keeperHtml(e):this.panel==="vendor"?t.innerHTML=n+this.vendorHtml(e):this.panel==="quests"?t.innerHTML=n+this.questLogHtml(e):this.panel==="character"?t.innerHTML=n+this.characterHtml(e):this.panel==="menu"&&(t.innerHTML=n+this.menuHtml())}keeperHtml(e){const t=this.panelArg&&Fn[this.panelArg];if(t){const a=e.quests[t.id],o=t.reward,l=yn[o.item.rarity],c=o.item.slot==="random"?"gear":ga[o.item.slot].toLowerCase();let h="";return!a||a.state==="repeat"?h=`<button class="btn primary" data-act="accept" data-id="${t.id}">Accept</button>`:a.state==="done"?h=`<button class="btn primary" data-act="turnin" data-id="${t.id}">Complete quest</button>`:h='<p class="note">In progress.</p>',`<h2>${Tt(t.name)}</h2><p class="qtext">${Tt(t.text)}</p>
        <h3>Objectives</h3>${t.objectives.map(u=>`<div>• ${ba(u)} ×${u.count}</div>`).join("")}
        ${t.group?'<p class="note">Group quest: bring a party.</p>':""}
        <h3>Rewards</h3><div>${o.xp} XP · ${o.gold} gold · <span style="color:${l.color}">${l.name} ${c}</span></div>
        <div style="margin-top:12px">${h}</div><button class="btn" data-act="keeper">Back</button>`}const n=Object.entries(e.quests).filter(([,a])=>a.state==="done").map(([a])=>a),i=Object.entries(e.quests).filter(([,a])=>a.state==="active").map(([a])=>a),r=(a,o)=>a.map(l=>`<button data-act="quest" data-id="${l}">${o} ${Tt(Fn[l].name)}</button>`).join("");return`<h2>Ysolde, Keeper of the Threshold</h2>
      <p class="qtext">“The rift sits on your floor now, traveller. Walk it. What you see through this glass is as real as you let it be.”</p>
      <div class="list">${r(n,"❓")}${r(e.available,"❗")}${r(i,"⏳")}</div>
      ${!n.length&&!e.available.length&&!i.length?'<p class="note">Nothing more for now. Return tomorrow for the daily task, or when you are stronger.</p>':""}`}vendorHtml(e){const t=e.bag.map((n,i)=>({it:n,i})).filter(({it:n})=>n.kind==="gear");return`<h2>Bram the Pedlar</h2><p class="qtext">“Potions, fresh-ish. And I'll take that junk off your hands.”</p>
      <h3>Buy</h3><div class="list">${Ls.map(n=>`<button data-act="buy" data-id="${n.id}">${n.icon} ${Tt(n.name)} — ${n.price}g <small class="note">${Tt(n.desc)}</small></button>`).join("")}</div>
      <h3>Sell (you have ${e.gold}g)</h3><div class="list">${t.length?t.map(({it:n,i})=>`<button data-act="sell" data-index="${i}"><span style="color:${yn[n.rarity].color}">${Tt(n.name)}</span> — ${n.value}g</button>`).join(""):'<p class="note">No gear in your bags.</p>'}</div>`}questLogHtml(e){const t=Object.entries(e.quests).filter(([,i])=>i.state==="active"||i.state==="done"),n=Object.entries(e.quests).filter(([,i])=>i.state==="complete").length;return`<h2>Quest log</h2>${t.length?t.map(([i,r])=>{const a=Fn[i];return`<h3>${Tt(a.name)}${r.state==="done"?" — ready":""}</h3><p class="qtext">${Tt(a.text)}</p>
        ${a.objectives.map((o,l)=>`<div>${ba(o)}: ${r.progress[l]}/${o.count}</div>`).join("")}
        <button class="btn" data-act="abandon" data-id="${i}">Abandon</button>`}).join(""):'<p class="note">No active quests. Talk to the Keeper at the rift.</p>'}<p class="note">${n} quest(s) completed.</p>`}characterHtml(e){const t=xt[this.game.cls],n=e.stats,i=ns.map(a=>{const o=e.equipment[a],l=o?yn[o.rarity].color:"#3a3048";return`<button class="item" data-act="eq" data-slot="${a}" style="border-color:${l}">${o?Sc(o,this.game.cls):`<span style="opacity:.25">${Ah[a]}</span>`}<small>${ga[a]}</small></button>`}).join(""),r=[];for(let a=0;a<pi;a++){const o=e.bag[a];if(!o){r.push('<div class="item"></div>');continue}const l=o.kind==="gear"&&o.cls===this.game.cls&&mc(o,this.game.cls)>mc(e.equipment[o.slot],this.game.cls);r.push(`<button class="item" data-act="bag" data-index="${a}" style="border-color:${yn[o.rarity].color}">${Sc(o,this.game.cls)}${l?'<span class="up">▲</span>':""}</button>`)}return`<h2>${Tt(this.game.name)} — level ${this.game.self?.level} ${t.name}</h2>
      <div class="stats">${["str","agi","int","spi","sta","armor"].map(a=>`<span>${uc[a]}</span><span>${n[a]||0}</span>`).join("")}
      <span>Health</span><span>${n.maxHp}</span><span>Damage reduction</span><span>${Math.round(n.dr*100)}%</span><span>Item level</span><span>${n.ilvl}</span><span>Gold</span><span>${e.gold}</span></div>
      <h3>Equipped</h3><div class="slots">${i}</div>
      <h3>Bags (${e.bag.length}/${pi})</h3><div class="bag">${r.join("")}</div>
      <p class="note">Tap an item for details. ▲ marks an upgrade.</p>`}menuHtml(){const e=this.game;return`<h2>Menu</h2>
      ${e.roomCode?`<p>Room code: <b style="font-size:22px;color:var(--gold);letter-spacing:3px">${e.roomCode}</b><br><span class="note">Friends join with this code. In the same room, place the rift on the same spot facing the same way.</span></p>`:'<p class="note">Solo game. Create a room from the lobby to play with friends.</p>'}
      ${e.mode==="ar"||e.mode==="table"||e.mode==="home"?`<button class="btn" data-act="replace">${e.mode==="home"?"Line up with my room again":"Move the rift"}</button>`:""}
      <button class="btn" data-act="leave">Leave to lobby</button>
      <h3>Controls</h3><p class="note">${e.mode==="home"?"Stay seated. Steer your hero with the stick; up on the stick is the way your phone points. Tap enemies to target them and the Keeper for quests.":e.mode==="ar"?"Walk around your room to move. Tap enemies to target them, tap the Keeper for quests. Step out of red circles!":"Move with the stick or WASD. Tap/click to target. 1–4 abilities, Tab next target, Q potion, C character, L quests."}</p>`}onPanelClick(e){const t=e.target.closest("[data-act]");if(!t)return;const n=this.game,i=t.dataset.act;if(i==="close")this.close();else if(i==="quest")this.toggle("keeper",t.dataset.id);else if(i==="keeper")this.toggle("keeper",null);else if(i==="accept")n.send({t:"accept",id:t.dataset.id}),this.toggle("keeper",null);else if(i==="turnin")n.send({t:"turnin",id:t.dataset.id}),this.toggle("keeper",null);else if(i==="abandon")n.send({t:"abandon",id:t.dataset.id});else if(i==="buy")n.send({t:"buy",id:t.dataset.id});else if(i==="sell")n.send({t:"sell",index:Number(t.dataset.index)});else if(i==="bag")this.showTooltip(n.me.bag[Number(t.dataset.index)],{index:Number(t.dataset.index)});else if(i==="eq"){const r=n.me.equipment[t.dataset.slot];r&&this.showTooltip(r,{slot:t.dataset.slot})}else i==="leave"?n.leave():i==="replace"&&(n.replaceArena(),this.close())}showTooltip(e,t){if(!e)return;const n=this.game.me,i=yn[e.rarity],r=at("#tooltip");let a="";if(e.kind==="gear"){const l=t.index!==void 0?n.equipment[e.slot]:null,c=Object.entries(e.stats).map(([u,d])=>{const f=l?d-(l.stats[u]||0):0;return`<div>+${d} ${uc[u]} ${l&&f?`<span class="${f>0?"green":"red"}">(${f>0?"+":""}${f})</span>`:""}</div>`}).join(""),h=e.cls===this.game.cls;a=`<div class="sub"><span>${ga[e.slot]}${e.armorType?` · ${e.armorType}`:""}</span><span>Item level ${e.ilvl}</span></div>${c}
        ${h?"":`<div class="red">Requires ${xt[e.cls].name}</div>`}<div class="note">Sells for ${e.value}g</div>`}else{const l=Ls.find(c=>c.id===e.vendorId);a=`<div>${Tt(l?.desc||"")}</div>`}const o=[];t.index!==void 0&&e.kind==="gear"&&o.push(`<button data-tt="equip" data-index="${t.index}">Equip</button>`),t.index!==void 0&&e.kind==="consumable"&&o.push(`<button data-tt="use" data-index="${t.index}">Use</button>`),t.slot&&o.push(`<button data-tt="unequip" data-slot="${t.slot}">Unequip</button>`),t.index!==void 0&&o.push(`<button data-tt="sell" data-index="${t.index}">Sell</button>`),o.push('<button data-tt="x">Close</button>'),r.innerHTML=`<div class="tn" style="color:${i.color}">${Tt(e.name)}</div><div class="sub"><span>${i.name}</span></div>${a}<div class="acts">${o.join("")}</div>`,r.classList.remove("hidden")}hideTooltip(){at("#tooltip").classList.add("hidden")}onTooltipClick(e){const t=e.target.closest("[data-tt]");if(!t)return;const n=this.game,i=t.dataset.tt;i==="equip"?n.send({t:"equip",index:Number(t.dataset.index)}):i==="use"?n.send({t:"use",index:Number(t.dataset.index)}):i==="unequip"?n.send({t:"unequip",slot:t.dataset.slot}):i==="sell"&&n.send({t:"sell",index:Number(t.dataset.index)}),this.hideTooltip()}}function ba(s){return s.kind==="collect"?`Collect ${s.target==="shard"?"Rift Shards":"Hearth Embers"}`:s.target==="any"?"Defeat rift creatures":`Defeat ${qt[s.target].name}${s.count>1?"s":""}`}function Sc(s,e){return s.kind==="consumable"?s.icon:s.slot==="weapon"?_x[s.cls||e]:Ah[s.slot]}async function Mx(){try{return!!(navigator.xr&&await navigator.xr.isSessionSupported("immersive-ar"))}catch{return!1}}class Rh{constructor(e,t,n,i){this.renderer=e,this.scene=t,this.world=n,this.overlay=i,this.session=null,this.placed=!1,this.reticle=Un(.25,.32,"#7ef9ff",.9),this.reticle.matrixAutoUpdate=!1,this.reticle.visible=!1,this.reticleInner=Un(0,.06,"#7ef9ff",.9),this.reticleInner.rotation.x=0,this.reticle.add(this.reticleInner),t.add(this.reticle),this.hitSource=null,this.onPlaced=null,this.onSelect=null}async start({scale:e=1,placement:t="auto",keepReticle:n=!1}={}){this.scale=e,this.placement=t,this.keepReticle=n,this.firstTap=null;const i=await navigator.xr.requestSession("immersive-ar",{requiredFeatures:["hit-test","local-floor"],optionalFeatures:["dom-overlay","anchors","light-estimation"],domOverlay:{root:this.overlay}});this.session=i,this.renderer.xr.setReferenceSpaceType("local-floor"),await this.renderer.xr.setSession(i);const r=await i.requestReferenceSpace("viewer");this.hitSource=await i.requestHitTestSource({space:r}),this.world.root.visible=!1;const a=this.renderer.xr.getController(0);return a.addEventListener("select",()=>this.select(a)),this.scene.add(a),this.controller=a,i.addEventListener("end",()=>{this.session=null,this.onEnd?.()}),i}select(e){if(!this.placed){if(!this.reticle.visible)return;if(this.placement==="twoTap"){const i=new C().setFromMatrixPosition(this.reticle.matrix);if(!this.firstTap){this.firstTap=i,this.firstMarker=Un(.08,.14,"#ffd34a",1),this.firstMarker.position.copy(i).setY(i.y+.01),this.scene.add(this.firstMarker),this.onFirstTap?.();return}if(i.distanceTo(this.firstTap)<.3)return;this.placeAt(this.firstTap,Math.atan2(i.x-this.firstTap.x,i.z-this.firstTap.z)),this.scene.remove(this.firstMarker);return}this.place();return}const t=new dh,n=new $e().extractRotation(e.matrixWorld);t.ray.origin.setFromMatrixPosition(e.matrixWorld),t.ray.direction.set(0,0,-1).applyMatrix4(n),this.onSelect?.(t)}place(){const e=new C().setFromMatrixPosition(this.reticle.matrix),t=this.renderer.xr.getCamera().getWorldPosition(new C);this.placeAt(e,Math.atan2(t.x-e.x,t.z-e.z))}placeAt(e,t){const n=this.world.root;n.position.copy(e),n.rotation.set(0,t,0),n.scale.setScalar(this.scale),n.visible=!0,this.placed=!0,this.reticle.visible=this.keepReticle&&this.reticle.visible,this.onPlaced?.()}reticleInArena(){if(!this.reticle.visible||!this.placed)return null;const e=new C().setFromMatrixPosition(this.reticle.matrix);return this.world.root.worldToLocal(e)}replace(){this.placed=!1,this.firstTap=null,this.world.root.visible=!1}update(e){if(!e||this.placed&&!this.keepReticle||!this.hitSource)return;const t=this.renderer.xr.getReferenceSpace(),n=e.getHitTestResults(this.hitSource);if(n.length){const i=n[0].getPose(t);this.reticle.visible=!0,this.reticle.matrix.fromArray(i.transform.matrix),this.reticle.matrix.multiply(new $e().makeRotationX(-Math.PI/2))}else this.reticle.visible=!1}playerPosition(){const e=this.renderer.xr.getCamera(),t=e.getWorldPosition(new C),n=this.world.root.worldToLocal(t.clone()),i=new C(0,0,-1).applyQuaternion(e.getWorldQuaternion(new ni)),r=this.world.root.getWorldQuaternion(new ni).invert();return i.applyQuaternion(r),{x:n.x,z:n.z,facing:Math.atan2(i.x,i.z)}}end(){this.session?.end()}}const et=.2,yx=.08,Ch=(s,e)=>`${Math.floor(s/et)},${Math.floor(e/et)}`,bo=s=>s.split(",").map(Number);function Sx(s){const e=[...new Map(s.map(r=>[`${r[0]},${r[1]}`,r])).values()].sort((r,a)=>r[0]-a[0]||r[1]-a[1]);if(e.length<3)return e;const t=(r,a,o)=>(a[0]-r[0])*(o[1]-r[1])-(a[1]-r[1])*(o[0]-r[0]),n=[];for(const r of e){for(;n.length>=2&&t(n.at(-2),n.at(-1),r)<=0;)n.pop();n.push(r)}const i=[];for(const r of e.slice().reverse()){for(;i.length>=2&&t(i.at(-2),i.at(-1),r)<=0;)i.pop();i.push(r)}return n.slice(0,-1).concat(i.slice(0,-1))}function bx(s,e,t){let n=!1;for(let i=0,r=t.length-1;i<t.length;r=i++){const[a,o]=t[i],[l,c]=t[r];o>e!=c>e&&s<(l-a)*(e-o)/(c-o)+a&&(n=!n)}return n}function Ex(s,{id:e,name:t,kind:n="room",theme:i}){const r=[...s].map(bo);if(r.length<6)throw new Error("Paint more of the floor first.");const a=[];for(const[m,p]of r)a.push([m*et,p*et],[(m+1)*et,p*et],[m*et,(p+1)*et],[(m+1)*et,(p+1)*et]);const o=Sx(a),l=new Set(s),c=r.map(m=>m[0]),h=r.map(m=>m[1]),[u,d,f,g]=[Math.min(...c),Math.max(...c),Math.min(...h),Math.max(...h)],y=[];for(let m=f;m<=g;m++){let p=null;for(let S=u;S<=d+1;S++){const b=(S+.5)*et,v=(m+.5)*et;if(S<=d&&!l.has(`${S},${m}`)&&bx(b,v,o))p=p?{...p,i1:S}:{i0:S,i1:S};else if(p){const E=(p.i1-p.i0+1)*et;y.push({cat:"clutter",x:p.i0*et+E/2,y:.4,z:(m+.5)*et,w:E,h:.8,d:et,yaw:0}),p=null}}}return{id:e,name:t,kind:n,theme:i||(n==="outdoor"?"wilds":n==="hall"?"gloam":"hearth"),floorY:0,floor:o,walls:[],openings:[],objects:y.slice(0,250),cells:[...s]}}function wx(s){const e=[];for(let t=0;t<s.length;t++)for(let n=t+1;n<s.length;n++){let i=null;const r=s[n].cells.map(bo);for(const[a,o]of s[t].cells.map(bo))for(const[l,c]of r){const h=Math.hypot(a-l,o-c)*et;(!i||h<i.d)&&(i={d:h,x:((a+l)/2+.5)*et,z:((o+c)/2+.5)*et})}i&&i.d<=.6&&e.push({a:s[t].id,b:s[n].id,x:i.x,z:i.z,w:.9})}return e}function Tx(s,e="My home"){const t=s.find(n=>n.cells.includes(Ch(.01,.01)))||s[0];return{v:1,id:`w${Date.now().toString(36)}`,name:e,hearth:{x:0,z:0,zone:t.id},zones:s,links:wx(s)}}const Ph="realmgate.home";function Wo(){try{return JSON.parse(localStorage.getItem(Ph))}catch{return null}}const xs=[["room","Room"],["hall","Hallway"],["outdoor","Outdoors"]],Ax={room:"#ffd34a",hall:"#8a7cff",outdoor:"#5fd35f"};class Rx{async start(){const e=document.querySelector("#view");this.renderer=new Sh({canvas:e,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(Math.min(2,devicePixelRatio)),this.renderer.setSize(innerWidth,innerHeight),this.scene=new Wc,this.camera=new jt(60,innerWidth/innerHeight,.05,100),this.scene.add(new hh("#ffffff","#444444",2));const t=new At;this.scene.add(t),this.world={root:t},this.zones=[],this.kind="room",this.cells=new Set,this.allCells=new Set,this.paint=new Gu(new Mi(et*.9,et*.9).rotateX(-Math.PI/2),new pn({color:"#ffffff",transparent:!0,opacity:.45,depthWrite:!1}),8e3),this.paint.count=0,this.paint.frustumCulled=!1,t.add(this.paint),this.ui=document.createElement("div"),this.ui.id="scanUi",this.ui.innerHTML=`
      <div class="scan-status"></div>
      <div class="scan-buttons">
        <button data-a="kind" class="secondary"></button>
        <button data-a="next" class="secondary">Next area</button>
        <button data-a="finish" class="primary">Finish</button>
        <button data-a="cancel" class="secondary">Cancel</button>
      </div>`,document.querySelector("#overlay").appendChild(this.ui),this.ui.addEventListener("beforexrselect",n=>n.preventDefault()),this.ui.addEventListener("click",n=>this.onButton(n.target.closest("[data-a]")?.dataset.a)),document.querySelector("#lobby").classList.add("hidden"),this.ar=new Rh(this.renderer,this.scene,this.world,document.querySelector("#overlay")),this.ar.onFirstTap=()=>{this.status("Now tap the spot the rift faces — for example the TV or a doorway."),Jt("loot")},this.ar.onPlaced=()=>{this.status(null),Jt("portal")},this.ar.onEnd=()=>this.exit(),await this.ar.start({placement:"twoTap",keepReticle:!0}),this.status("Tap a spot on the floor you will remember (a rug corner, a table leg). That is where the rift opens."),this.renderer.setAnimationLoop((n,i)=>this.frame(i)),this.refreshKind()}status(e){this.statusText=e,this.render()}render(){const e=(this.cells.size*et*et).toFixed(1),t=xs.find(n=>n[0]===this.kind)[1];this.ui.querySelector(".scan-status").innerHTML=this.statusText||`<b>Area ${this.zones.length+1}: ${t}</b> — ${e} m² painted<br><small>Walk slowly and sweep the floor. Skip the area under furniture. Mind steps and stairs while scanning.</small>`,this.ui.querySelector('[data-a="kind"]').textContent=`Type: ${t}`}refreshKind(){this.paint.material.color.set(Ax[this.kind]),this.render()}frame(e){this.ar.update(e);const t=this.ar.reticleInArena();if(t&&Math.abs(t.y)<yx)for(const[n,i]of[[0,0],[et,0],[-et,0],[0,et],[0,-et]]){const r=Ch(t.x+n,t.z+i);if(this.allCells.has(r)||this.paint.count>=8e3)continue;this.allCells.add(r),this.cells.add(r);const[a,o]=r.split(",").map(Number),l=new $e().makeTranslation((a+.5)*et,.005,(o+.5)*et);this.paint.setMatrixAt(this.paint.count++,l),this.paint.instanceMatrix.needsUpdate=!0,!this.statusText&&this.cells.size%25===0&&this.render()}this.renderer.render(this.scene,this.camera)}closeArea(){if(this.cells.size<6)return!1;const e=this.zones.filter(i=>i.kind===this.kind).length+1,t=xs.find(i=>i[0]===this.kind)[1],n=this.kind==="room"?this.zones.length===0?"Living room":`Room ${e}`:e>1?`${t} ${e}`:t;return this.zones.push(Ex(this.cells,{id:`z${this.zones.length+1}`,name:n,kind:this.kind})),this.cells=new Set,!0}onButton(e){if(e)if(e==="kind"){const t=xs.findIndex(n=>n[0]===this.kind);this.kind=xs[(t+1)%xs.length][0],this.refreshKind()}else if(e==="next"){if(!this.closeArea())return this.status("Paint more floor before starting the next area.");Jt("quest"),this.status(null)}else if(e==="finish"){if(this.cells.size>=6&&this.closeArea(),!this.zones.length)return this.status("Paint some floor first.");const t=Tx(this.zones,"My home");localStorage.setItem(Ph,JSON.stringify(t)),this.exit()}else e==="cancel"&&this.exit()}exit(){this.left||(this.left=!0,this.renderer.setAnimationLoop(null),this.ar.end(),location.href=location.pathname)}}const Ie=s=>document.querySelector(s),Lh=s=>`realmgate.char.${s}`,Ih=s=>{try{return JSON.parse(localStorage.getItem(Lh(s)))}catch{return null}},Cx=.15,ht={cls:localStorage.getItem("realmgate.cls")||"warrior",party:"solo",arena:3,useHome:!!Wo()};function bc(){Ie("#classes").innerHTML=Object.values(xt).map(s=>{const e=Ih(s.id);return`<button class="cls ${ht.cls===s.id?"on":""}" data-cls="${s.id}">
      <b style="color:${s.color}">${s.name}</b><span class="role">${s.role} · ${s.armor}</span>
      <small>${s.blurb}</small>${e?`<span class="saved">Saved: level ${e.level}</span>`:""}</button>`}).join("")}function Px(){Ie("#name").value=localStorage.getItem("realmgate.name")||"",bc(),Ie("#classes").onclick=t=>{const n=t.target.closest("[data-cls]");n&&(ht.cls=n.dataset.cls,bc())};const s=(t,n)=>{Ie(t).onclick=i=>{const r=i.target.closest("button");if(r){for(const a of Ie(t).children)a.classList.toggle("on",a===r);n(r)}}};s("#partyMode",t=>{ht.party=t.dataset.mode,Ie("#roomCode").classList.toggle("hidden",ht.party!=="join")}),s("#arenaSize",t=>{ht.arena=Number(t.dataset.r)});const e=new URLSearchParams(location.search);if(location.hostname.endsWith("github.io")&&!e.get("server")){for(const t of Ie("#partyMode").querySelectorAll('[data-mode="create"], [data-mode="join"]'))t.disabled=!0;Ie("#partyMode").insertAdjacentHTML("afterend",`<p class="note">Multiplayer needs the game server, which isn't online yet. Solo works fully here.</p>`)}if(e.get("room")){ht.party="join",Ie("#roomCode").value=e.get("room").toUpperCase(),Ie("#roomCode").classList.remove("hidden");for(const t of Ie("#partyMode").children)t.classList.toggle("on",t.dataset.mode==="join")}Mx().then(t=>{t?Ie("#arNote").textContent="AR ready. Clear some floor space and keep your surroundings in view while you play.":(Ie("#startAR").disabled=!0,Ie("#startTable").disabled=!0,Ie("#arNote").textContent="AR needs Chrome on an ARCore Android phone over HTTPS. iPhone Safari does not offer WebXR AR yet; use Preview here.")}),Ec(),Ie("#scanHome").onclick=()=>new Rx().start().catch(t=>{Ie("#lobbyError").textContent=t.message}),Ie("#useHome").onchange=t=>{ht.useHome=t.target.checked,Ec()},Ie("#startAR").onclick=()=>Ea("ar"),Ie("#startTable").onclick=()=>Ea("table"),Ie("#startPreview").onclick=()=>Ea("preview")}function Ec(){const s=Wo(),e=s?.zones||[];Ie("#homeInfo").textContent=s?`Saved: ${e.map(t=>t.name).join(", ")} (${s.links.length} doorway${s.links.length===1?"":"s"}).`:"No home scanned yet. Scanning takes a few minutes of slow walking; after that you play seated.",Ie("#useHomeRow").classList.toggle("hidden",!s),Ie("#useHome").checked=ht.useHome&&!!s,Ie("#arenaRow").classList.toggle("hidden",ht.useHome&&!!s),Ie("#startAR").textContent=ht.useHome&&s?"Play seated in my home (AR)":"Play in AR (walk around)"}async function Ea(s){const e=ht.useHome&&ht.party!=="join"?Wo():null;s==="ar"&&e&&(s="home");const t=Ie("#name").value.trim()||"Adventurer";localStorage.setItem("realmgate.name",t),localStorage.setItem("realmgate.cls",ht.cls),Ie("#lobbyError").textContent="";const n={name:t,cls:ht.cls,save:Ih(ht.cls),arena:ht.arena,mode:s==="ar"?"body":"avatar"};let i;if(e&&ht.party==="create"){if(!confirm(`Host your home?

Players you let in will see the layout of your scanned rooms (shapes only, no camera images). It is not saved on the server, and sharing stops when you stop hosting. You approve each player before they join.`))return;n.shareConsent=!0}if(e&&(n.world=e),ht.party==="solo")i=new sx({arena:ht.arena,world:e});else if(i=new rx({url:ax()}),n.room=ht.party==="join"?Ie("#roomCode").value.trim().toUpperCase():"",n.create=ht.party==="create",ht.party==="join"&&n.room.length!==4){Ie("#lobbyError").textContent="Enter the 4-letter room code.";return}i.onWaiting=()=>{Ie("#lobbyError").textContent="",Ie("#arNote").textContent="Waiting for the host to let you in… You will see the layout of their home: it is theirs, so please do not record or share it."};const r=new Lx({mode:s,name:t,cls:ht.cls,transport:i});try{await r.start(n)}catch(a){Ie("#lobbyError").textContent=a.message||String(a),r.dispose()}}class Lx{constructor({mode:e,name:t,cls:n,transport:i}){this.mode=e,this.name=t,this.cls=n,this.transport=i,this.snap=null,this.me=null,this.self=null,this.selfId=null,this.targetId=null,this.cds={},this.cdsAt=0,this.selfPos=new C(0,0,1.2),this.facing=Math.PI,this.camYaw=Math.PI,this.camDist=6.5,this.camPitch=.75,this.keys=new Set,this.stick={x:0,y:0},this.lastMoveSent=0,this.clock=new Hd}async start(e){const t=Ie("#view");this.renderer=new Sh({canvas:t,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(Math.min(2,devicePixelRatio)),this.renderer.setSize(innerWidth,innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=wc,this.renderer.outputColorSpace=Qt,this.scene=new Wc,this.camera=new jt(60,innerWidth/innerHeight,.05,100),this.world=new gx(this.scene),addEventListener("resize",this.onResize=()=>{this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(innerWidth,innerHeight)}),this.transport.onSnapshot=i=>this.onSnapshot(i),this.transport.onSave=i=>this.storeSave(i),this.transport.onClose=i=>{this.hud?.banner(i||"Disconnected from the server")},this.transport.onKnock=i=>this.hud?.knock(i);const n=await this.transport.connect(e);this.selfId=n.id,this.roomCode=n.room,this.world.selfId=this.selfId,this.worldData=n.world||null,this.walk=this.worldData?new Th(this.worldData):null,Ie("#lobby").classList.add("hidden"),Ie("#hud").classList.remove("hidden"),this.hud=new vx(this),this.bindInput(),this.worldData&&this.world.setWorld(this.worldData,{twin:this.mode!=="home"}),this.mode==="ar"||this.mode==="table"||this.mode==="home"?(this.ar=new Rh(this.renderer,this.scene,this.world,Ie("#overlay")),this.ar.onSelect=i=>this.pick(i),this.ar.onPlaced=()=>{Ie("#placeHint").classList.add("hidden"),Jt("portal")},this.ar.onFirstTap=()=>{Ie("#placeHint").textContent="Now tap the spot the rift faces, the same one you chose when scanning."},this.ar.onEnd=()=>this.leave(),await this.ar.start({scale:this.mode==="table"?Cx:1,placement:this.mode==="home"?"twoTap":"auto"}),this.mode==="home"&&(Ie("#placeHint").textContent="Sit somewhere comfy. Tap the rift spot you chose when scanning."),Ie("#placeHint").classList.remove("hidden"),this.world.hideSelf=this.mode==="ar",this.mode==="ar"&&(this.world.selfRing.visible=!0)):(this.scene.background=new ze("#1c1826"),this.scene.fog=new Fo("#1c1826",9,22),this.worldData||this.world.addPreviewFloor()),Ie("#joystick").classList.toggle("hidden",this.mode==="ar"),this.roomCode&&this.hud.banner(`Room ${this.roomCode} — share this code`),this.renderer.setAnimationLoop((i,r)=>this.frame(r))}dispose(){this.renderer?.setAnimationLoop(null),this.transport?.close(),removeEventListener("resize",this.onResize)}leave(){this.left||(this.left=!0,this.transport.requestSave(),setTimeout(()=>{this.dispose(),location.href=location.pathname},200),this.ar?.end())}replaceArena(){this.ar?.replace(),Ie("#placeHint").classList.remove("hidden")}send(e){this.transport.send(e)}storeSave(e){e&&localStorage.setItem(Lh(e.cls),JSON.stringify(e))}onSnapshot(e){const t=!this.me&&e.me;if(e.me){this.me=e.me;const n=Object.values(e.me.quests).some(i=>i.state==="done");this.me.questMarker=n?"?":e.me.available.length?"!":null}if(this.snap=e,this.self=e.players.find(n=>n.id===this.selfId)||null,e.cds&&(this.cds=e.cds,this.cdsAt=performance.now()),this.self){const n=new C(this.self.x,0,this.self.z);this.mode!=="ar"&&(n.distanceTo(this.selfPos)>.75||!this.self.alive)&&this.selfPos.copy(n),this.self.target!==this.targetId&&this.targetId&&!this.findEntity(this.targetId)&&(this.targetId=null)}this.world.apply(e,this.me);for(const n of e.events)this.onEvent(n);e.me&&(this.hud.tracker(this.me),this.self&&this.storeSave({v:1,name:this.name,cls:this.cls,level:this.self.level,xp:e.me.xp,gold:e.me.gold,equipment:e.me.equipment,bag:e.me.bag,quests:e.me.quests}),t&&this.me.available.includes("q1")&&setTimeout(()=>this.hud.toggle("keeper","q1"),600))}findEntity(e){return this.snap&&(this.snap.enemies.find(t=>t.id===e&&t.alive)||this.snap.players.find(t=>t.id===e))||null}onEvent(e){const t=(n,i=1.6)=>{const r=this.world.entities.get(n);return r?this.project(r.obj.position.clone().setY(i)):null};if(e.type==="dmg"){const n=t(e.id,1.2);n&&(e.src===this.selfId||this.targetId===e.id)&&this.hud.floatText(e.amount,n.x,n.y,e.crit?"crit":""),e.src===this.selfId&&Jt("hit")}else if(e.type==="hurt"){const n=t(e.id,1.4);n&&e.id===this.selfId&&(this.hud.floatText(`-${e.amount}`,n.x,n.y,"hurt"),Jt("hurt"),navigator.vibrate?.(60))}else if(e.type==="heal"){const n=t(e.id,1.5);n&&(e.id===this.selfId||e.src===this.selfId)&&this.hud.floatText(`+${e.amount}`,n.x,n.y,`heal ${e.crit?"crit":""}`)}else if(e.type==="xp")this.hud.toast(`<span style="color:#c06aff">+${e.amount} XP</span>`);else if(e.type==="levelup")e.id===this.selfId?(this.hud.banner(`Level ${e.level}!`),Jt("level")):this.hud.toast(`${this.nameOf(e.id)} reached level ${e.level}`);else if(e.type==="quest")this.hud.toast(`<b style="color:var(--gold)">${e.text}</b>`),Jt("quest");else if(e.type==="error")this.hud.toast(e.text,!0);else if(e.type==="looted")e.item&&this.hud.toast(`Looted <span style="color:${yn[e.rarity].color}">[${e.item}]</span>`),e.gold&&this.hud.toast(`<span style="color:var(--gold)">+${e.gold} gold</span>`),Jt("loot");else if(e.type==="banner")this.hud.banner(e.text),Jt("quest");else if(e.type==="died"&&e.id===this.selfId)Jt("die");else if(e.type==="telegraph"){const n=this.self;n&&Math.hypot(n.x-e.x,n.z-e.z)<=e.r&&(navigator.vibrate?.([30,40,30]),Jt("warn"))}else e.type==="join"&&e.id!==this.selfId?this.hud.toast(`${e.name} joined the party`):e.type==="leave"&&this.hud.toast(`${e.name} left`);this.world.handleEvent(e)}nameOf(e){return this.snap?.players.find(t=>t.id===e)?.name||"Someone"}cooldownLeft(e){const t=(this.cds[e]||0)-(performance.now()-this.cdsAt)/1e3;return Math.max(0,t)}setTarget(e){this.targetId=e,this.send({t:"target",id:e})}targetNearest(e=1/0){if(!this.snap)return null;const t=this.snap.enemies.filter(o=>o.alive);t.sort((o,l)=>this.distTo(o)-this.distTo(l));const n=t.filter(o=>this.distTo(o)<=e),i=n.length?n:t;if(!i.length)return null;const r=i.findIndex(o=>o.id===this.targetId),a=i[(r+1)%i.length];return this.setTarget(a.id),a}distTo(e){return Math.hypot(e.x-this.selfPos.x,e.z-this.selfPos.z)}cast(e){const t=Sr[e];if(t.target==="enemy"&&!this.snap?.enemies.find(i=>i.id===this.targetId&&i.alive)&&!this.targetNearest(t.range))return this.hud.toast("No enemies nearby",!0);this.send({t:"cast",ability:e,target:this.targetId})}drinkPotion(){const e=this.me?.bag||[],t=this.self;let n=-1;if(xt[this.cls].resource==="mana"&&t&&t.res<t.maxRes*.4&&t.hp>t.maxHp*.6&&(n=e.findIndex(r=>r.vendorId==="mpPotion")),n<0&&(n=e.findIndex(r=>r.vendorId==="hpPotion")),n<0&&(n=e.findIndex(r=>r.kind==="consumable")),n<0)return this.hud.toast("No potions — buy some from Bram",!0);this.send({t:"use",index:n})}pick(e){const t=this.world.entityAt(e);t&&(t.kind==="enemy"&&t.data.alive?this.setTarget(t.id):t.kind==="player"?this.setTarget(t.id):t.kind==="npc"?this.hud.toggle(t.data.kind==="questgiver"?"keeper":"vendor",null):t.kind==="loot"?this.send({t:"loot",id:t.id}):t.kind==="pickup"&&this.hud.toast("Walk over it to pick it up"))}bindInput(){addEventListener("keydown",h=>{if(h.target.tagName==="INPUT")return;const u=h.key.toLowerCase();this.keys.add(u);const d=xt[this.cls].abilities;["1","2","3","4"].includes(u)?this.cast(d[Number(u)-1]):u==="tab"?(h.preventDefault(),this.targetNearest()):u==="q"?this.drinkPotion():u==="c"||u==="b"?this.hud.toggle("character"):u==="l"?this.hud.toggle("quests"):u==="escape"&&(this.hud.close(),this.setTarget(null))}),addEventListener("keyup",h=>this.keys.delete(h.key.toLowerCase()));const e=Ie("#joystick"),t=e.querySelector(".knob");let n=null;const i=h=>{const u=e.getBoundingClientRect();let d=(h.clientX-u.left-u.width/2)/(u.width/2),f=(h.clientY-u.top-u.height/2)/(u.height/2);const g=Math.hypot(d,f);g>1&&(d/=g,f/=g),this.stick={x:d,y:f},t.style.transform=`translate(${d*35}px, ${f*35}px)`};e.addEventListener("pointerdown",h=>{n=h.pointerId,e.setPointerCapture(n),i(h),h.stopPropagation()}),e.addEventListener("pointermove",h=>{h.pointerId===n&&i(h)});const r=h=>{h.pointerId===n&&(n=null,this.stick={x:0,y:0},t.style.transform="")};if(e.addEventListener("pointerup",r),e.addEventListener("pointercancel",r),this.mode!=="preview")return;const a=Ie("#hud"),o=new Map;let l=null;a.addEventListener("pointerdown",h=>{h.target!==a&&h.target.id!=="floaters"&&!h.target.closest("#floaters")||(o.set(h.pointerId,{x:h.clientX,y:h.clientY}),l={x:h.clientX,y:h.clientY,t:performance.now(),moved:0})}),a.addEventListener("pointermove",h=>{const u=o.get(h.pointerId);if(!u)return;const d=h.clientX-u.x,f=h.clientY-u.y;if(o.size===2){const[g,y]=[...o.values()],m=Math.hypot(g.x-y.x,g.y-y.y);u.x=h.clientX,u.y=h.clientY;const[p,S]=[...o.values()];this.camDist=Math.min(9,Math.max(2,this.camDist*(m/Math.max(1,Math.hypot(p.x-S.x,p.y-S.y)))))}else this.camYaw-=d*.008,this.camPitch=Math.min(1.3,Math.max(.15,this.camPitch+f*.005)),u.x=h.clientX,u.y=h.clientY;l&&(l.moved+=Math.abs(d)+Math.abs(f))});const c=h=>{if(o.has(h.pointerId)){if(o.delete(h.pointerId),l&&l.moved<10&&performance.now()-l.t<400){const u=new dh;u.setFromCamera(new le(h.clientX/innerWidth*2-1,-(h.clientY/innerHeight)*2+1),this.camera),this.world.entityAt(u)?this.pick(u):this.targetId&&this.setTarget(null)}l=null}};a.addEventListener("pointerup",c),a.addEventListener("pointercancel",h=>o.delete(h.pointerId)),a.addEventListener("wheel",h=>{this.camDist=Math.min(9,Math.max(2,this.camDist+h.deltaY*.004))},{passive:!0})}stickVector(){let e=this.stick.x,t=this.stick.y;(this.keys.has("w")||this.keys.has("arrowup"))&&(t-=1),(this.keys.has("s")||this.keys.has("arrowdown"))&&(t+=1),(this.keys.has("a")||this.keys.has("arrowleft"))&&(e-=1),(this.keys.has("d")||this.keys.has("arrowright"))&&(e+=1);const n=Math.hypot(e,t);return n>1&&(e/=n,t/=n),{x:e,y:t}}frame(e){const t=Math.min(.05,this.clock.getDelta()),n=this.clock.elapsedTime;this.ar&&this.ar.update(e);const i=!this.ar||this.ar.placed;i&&this.self&&this.updateMovement(t),this.world.update(t,n,this.selfPos,this.targetId),this.ar||this.updateCamera();const r=this.ar?this.renderer.xr.getCamera():this.camera;this.renderer.render(this.scene,this.camera),this.snap&&this.self&&i&&(this.hud.update(this.snap,this.me,this.self,this.findEntity(this.targetId)),this.hud.radar(this.snap,this.selfPos,this.facing),this.updatePlates(r))}updateMovement(e){let t=!1;if(this.mode==="ar"){const r=this.ar.playerPosition();this.selfPos.set(r.x,0,r.z),this.facing=r.facing,t=!0}else{const r=this.stickVector(),a=this.self.buffs.includes("root")||!this.self.alive,l=this.mode==="table"||this.mode==="home"?this.ar.playerPosition().facing:this.camYaw;if(!a&&Math.hypot(r.x,r.y)>.1){const c=Math.sin(l),h=Math.cos(l),u=-r.y*c+r.x*-h,d=-r.y*h+r.x*c,f=1.6,g=u*f*e,y=d*f*e,m=this.selfPos;if(this.walk){const p=(S,b)=>this.walk.walkable(S,b);p(m.x+g,m.z+y)||!p(m.x,m.z)?(m.x+=g,m.z+=y):p(m.x+g,m.z)?m.x+=g:p(m.x,m.z+y)&&(m.z+=y)}else{m.x+=g,m.z+=y;const p=(this.snap?.arena||3)+1.5,S=Math.hypot(m.x,m.z);S>p&&m.multiplyScalar(p/S)}this.facing=Math.atan2(u,d),t=!0}this.mode==="preview"&&!t&&this.self&&(this.facing=this.self.f)}const n=performance.now();t&&n-this.lastMoveSent>66&&(this.lastMoveSent=n,this.send({t:"move",x:this.selfPos.x,z:this.selfPos.z,facing:this.facing}));const i=this.world.entities.get(this.selfId);i&&(i.facing=this.mode==="preview"&&!t?this.self.f:this.facing)}updateCamera(){const e=this.selfPos.clone().setY(1),t=new C(-Math.sin(this.camYaw)*Math.cos(this.camPitch),Math.sin(this.camPitch),-Math.cos(this.camYaw)*Math.cos(this.camPitch)).multiplyScalar(this.camDist);this.camera.position.copy(e).add(t),this.camera.lookAt(e)}project(e){const t=this.ar?this.renderer.xr.getCamera():this.camera,n=this.world.root.localToWorld(e.clone()),i=t.getWorldPosition(new C),r=t.getWorldDirection(new C);return n.clone().sub(i).dot(r)<0?null:(n.project(t),{x:(n.x+1)/2*innerWidth,y:(1-n.y)/2*innerHeight})}updatePlates(){const e=new Set;for(const t of this.world.entities.values()){const n=t.data;if(t.id===this.selfId)continue;let i=null,r="",a=1.9;if(t.kind==="enemy"){if(!n.alive)continue;const l=qt[n.type];a=l.scale*1.2*(n.type==="colossus"?2.3:n.type==="warden"?2:1.5)+.2,r=l.elite||l.boss?"elite":"",i=`${n.name} <span style="color:#ffd34a">${n.level}</span><div class="hpb"><i style="width:${n.hp/n.maxHp*100}%"></i></div>`}else if(t.kind==="player")r="friend",i=`<span style="color:${xt[n.cls].color}">${n.name}</span><div class="hpb"><i style="width:${n.hp/n.maxHp*100}%"></i></div>`;else if(t.kind==="npc")a=n.kind==="questgiver"?2.35:1.5,i=`<span style="color:#ffd34a">${n.kind==="questgiver"?"Ysolde":"Bram"}</span><br><small>${n.kind==="questgiver"?"&lt;Keeper&gt;":"&lt;Pedlar&gt;"}</small>`;else continue;e.add(t.id);const o=this.project(t.obj.position.clone().setY(a));this.hud.plate(t.id,i,r,o?.x||0,o?.y||0,!!o)}this.hud.prunePlates(e)}}Px();
