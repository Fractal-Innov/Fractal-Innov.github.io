import{O as fi,P as pi,bq as _e,M as ni,D as ai,br as yi,I as pt,bs as k,b7 as zi,b1 as tt,S as Qe,B as bi,g as ct,e as Ti,Z as Ni,r as Oi,bt as Ai,bu as Pi,a as Le}from"./three@0.169.19.js";const J=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let oi=1234567;const gi=Math.PI/180,xi=180/Math.PI;function Ei(){const c=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(J[c&255]+J[c>>8&255]+J[c>>16&255]+J[c>>24&255]+"-"+J[t&255]+J[t>>8&255]+"-"+J[t>>16&15|64]+J[t>>24&255]+"-"+J[e&63|128]+J[e>>8&255]+"-"+J[e>>16&255]+J[e>>24&255]+J[i&255]+J[i>>8&255]+J[i>>16&255]+J[i>>24&255]).toLowerCase()}function st(c,t,e){return Math.max(t,Math.min(e,c))}function vi(c,t){return(c%t+t)%t}function Ui(c,t,e,i,s){return i+(c-t)*(s-i)/(e-t)}function Ci(c,t,e){return c!==t?(e-c)/(t-c):0}function _i(c,t,e){return(1-e)*c+e*t}function Bi(c,t,e,i){return _i(c,t,1-Math.exp(-e*i))}function Ri(c,t=1){return t-Math.abs(vi(c,t*2)-t)}function Fi(c,t,e){return c<=t?0:c>=e?1:(c=(c-t)/(e-t),c*c*(3-2*c))}function Vi(c,t,e){return c<=t?0:c>=e?1:(c=(c-t)/(e-t),c*c*c*(c*(c*6-15)+10))}function Ii(c,t){return c+Math.floor(Math.random()*(t-c+1))}function Ji(c,t){return c+Math.random()*(t-c)}function ki(c){return c*(.5-Math.random())}function Li(c){c!==void 0&&(oi=c);let t=oi+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Di(c){return c*gi}function Gi(c){return c*xi}function Xi(c){return(c&c-1)===0&&c!==0}function qi(c){return Math.pow(2,Math.ceil(Math.log(c)/Math.LN2))}function Yi(c){return Math.pow(2,Math.floor(Math.log(c)/Math.LN2))}function Zi(c,t,e,i,s){const r=Math.cos,n=Math.sin,o=r(e/2),a=n(e/2),l=r((t+i)/2),h=n((t+i)/2),u=r((t-i)/2),m=n((t-i)/2),d=r((i-t)/2),f=n((i-t)/2);switch(s){case"XYX":c.set(o*h,a*u,a*m,o*l);break;case"YZY":c.set(a*m,o*h,a*u,o*l);break;case"ZXZ":c.set(a*u,a*m,o*h,o*l);break;case"XZX":c.set(o*h,a*f,a*d,o*l);break;case"YXY":c.set(a*d,o*h,a*f,o*l);break;case"ZYZ":c.set(a*f,a*d,o*h,o*l);break;default:console.warn("../math.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Hi(c,t){switch(t.constructor){case Float32Array:return c;case Uint32Array:return c/4294967295;case Uint16Array:return c/65535;case Uint8Array:return c/255;case Int32Array:return Math.max(c/2147483647,-1);case Int16Array:return Math.max(c/32767,-1);case Int8Array:return Math.max(c/127,-1);default:throw new Error("Invalid component type.")}}function Wi(c,t){switch(t.constructor){case Float32Array:return c;case Uint32Array:return Math.round(c*4294967295);case Uint16Array:return Math.round(c*65535);case Uint8Array:return Math.round(c*255);case Int32Array:return Math.round(c*2147483647);case Int16Array:return Math.round(c*32767);case Int8Array:return Math.round(c*127);default:throw new Error("Invalid component type.")}}const Tt={DEG2RAD:gi,RAD2DEG:xi,generateUUID:Ei,clamp:st,euclideanModulo:vi,mapLinear:Ui,inverseLerp:Ci,lerp:_i,damp:Bi,pingpong:Ri,smoothstep:Fi,smootherstep:Vi,randInt:Ii,randFloat:Ji,randFloatSpread:ki,seededRandom:Li,degToRad:Di,radToDeg:Gi,isPowerOfTwo:Xi,ceilPowerOfTwo:qi,floorPowerOfTwo:Yi,setQuaternionFromProperEuler:Zi,normalize:Wi,denormalize:Hi};class E{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,n,o){let a=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const m=r[n+0],d=r[n+1],f=r[n+2],p=r[n+3];if(o===0){t[e+0]=a,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=m,t[e+1]=d,t[e+2]=f,t[e+3]=p;return}if(u!==p||a!==m||l!==d||h!==f){let x=1-o;const g=a*m+l*d+h*f+u*p,b=g>=0?1:-1,z=1-g*g;if(z>Number.EPSILON){const y=Math.sqrt(z),M=Math.atan2(y,g*b);x=Math.sin(x*M)/y,o=Math.sin(o*M)/y}const w=o*b;if(a=a*x+m*w,l=l*x+d*w,h=h*x+f*w,u=u*x+p*w,x===1-o){const y=1/Math.sqrt(a*a+l*l+h*h+u*u);a*=y,l*=y,h*=y,u*=y}}t[e]=a,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,n){const o=i[s],a=i[s+1],l=i[s+2],h=i[s+3],u=r[n],m=r[n+1],d=r[n+2],f=r[n+3];return t[e]=o*f+h*u+a*d-l*m,t[e+1]=a*f+h*m+l*u-o*d,t[e+2]=l*f+h*d+o*m-a*u,t[e+3]=h*f-o*u-a*m-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new E(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,n=t._order,o=Math.cos,a=Math.sin,l=o(i/2),h=o(s/2),u=o(r/2),m=a(i/2),d=a(s/2),f=a(r/2);switch(n){case"XYZ":this._x=m*h*u+l*d*f,this._y=l*d*u-m*h*f,this._z=l*h*f+m*d*u,this._w=l*h*u-m*d*f;break;case"YXZ":this._x=m*h*u+l*d*f,this._y=l*d*u-m*h*f,this._z=l*h*f-m*d*u,this._w=l*h*u+m*d*f;break;case"ZXY":this._x=m*h*u-l*d*f,this._y=l*d*u+m*h*f,this._z=l*h*f+m*d*u,this._w=l*h*u-m*d*f;break;case"ZYX":this._x=m*h*u-l*d*f,this._y=l*d*u+m*h*f,this._z=l*h*f-m*d*u,this._w=l*h*u+m*d*f;break;case"YZX":this._x=m*h*u+l*d*f,this._y=l*d*u+m*h*f,this._z=l*h*f-m*d*u,this._w=l*h*u-m*d*f;break;case"XZY":this._x=m*h*u-l*d*f,this._y=l*d*u-m*h*f,this._z=l*h*f+m*d*u,this._w=l*h*u+m*d*f;break;default:console.warn("../math.Quaternion: .setFromEuler() encountered an unknown order: "+n)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],n=e[1],o=e[5],a=e[9],l=e[2],h=e[6],u=e[10],m=i+o+u;if(m>0){const d=.5/Math.sqrt(m+1);this._w=.25/d,this._x=(h-a)*d,this._y=(r-l)*d,this._z=(n-s)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(h-a)/d,this._x=.25*d,this._y=(s+n)/d,this._z=(r+l)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(r-l)/d,this._x=(s+n)/d,this._y=.25*d,this._z=(a+h)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(n-s)/d,this._x=(r+l)/d,this._y=(a+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(st(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,n=t._w,o=e._x,a=e._y,l=e._z,h=e._w;return this._x=i*h+n*o+s*l-r*a,this._y=s*h+n*a+r*o-i*l,this._z=r*h+n*l+i*a-s*o,this._w=n*h-i*o-s*a-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,n=this._w;let o=n*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=n,this._x=i,this._y=s,this._z=r,this;const a=1-o*o;if(a<=Number.EPSILON){const d=1-e;return this._w=d*n+e*this._w,this._x=d*i+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const l=Math.sqrt(a),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,m=Math.sin(e*h)/l;return this._w=n*u+this._w*m,this._x=i*u+this._x*m,this._y=s*u+this._y*m,this._z=r*u+this._z*m,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class S{constructor(t=0,e=0,i=0){this.isVector3=!0,S.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new S(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(hi.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(hi.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,n=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*n,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*n,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*n,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,n=t.y,o=t.z,a=t.w,l=2*(n*s-o*i),h=2*(o*e-r*s),u=2*(r*i-n*e);return this.x=e+a*l+n*u-o*h,this.y=i+a*h+o*l-r*u,this.z=s+a*u+r*h-n*l,this}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,n=e.x,o=e.y,a=e.z;return this.x=s*a-r*o,this.y=r*n-i*a,this.z=i*o-s*n,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return De.copy(this).projectOnVector(t),this.sub(De)}reflect(t){return this.sub(De.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(st(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}abs(){return this.x=Math.abs(this.x),this.y=Math.abs(this.y),this.z=Math.abs(this.z),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const De=new S,hi=new E,ye=2e3,li=2001;class nt{constructor(t,e,i,s,r,n,o,a,l,h,u,m,d,f,p,x){this.isMatrix4=!0,nt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,n,o,a,l,h,u,m,d,f,p,x)}extractPosition(t){return console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."),this.copyPosition(t)}multiplyToArray(t,e,i){return console.error("THREE.Matrix4: .multiplyToArray() has been removed."),this}setRotationFromQuaternion(t){return this.makeRotationFromQuaternion(t)}set(t,e,i,s,r,n,o,a,l,h,u,m,d,f,p,x){const g=this.elements;return g[0]=t,g[4]=e,g[8]=i,g[12]=s,g[1]=r,g[5]=n,g[9]=o,g[13]=a,g[2]=l,g[6]=h,g[10]=u,g[14]=m,g[3]=d,g[7]=f,g[11]=p,g[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new nt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/_t.setFromMatrixColumn(t,0).length(),r=1/_t.setFromMatrixColumn(t,1).length(),n=1/_t.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*n,e[9]=i[9]*n,e[10]=i[10]*n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,n=Math.cos(i),o=Math.sin(i),a=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const m=n*h,d=n*u,f=o*h,p=o*u;e[0]=a*h,e[4]=-a*u,e[8]=l,e[1]=d+f*l,e[5]=m-p*l,e[9]=-o*a,e[2]=p-m*l,e[6]=f+d*l,e[10]=n*a}else if(t.order==="YXZ"){const m=a*h,d=a*u,f=l*h,p=l*u;e[0]=m+p*o,e[4]=f*o-d,e[8]=n*l,e[1]=n*u,e[5]=n*h,e[9]=-o,e[2]=d*o-f,e[6]=p+m*o,e[10]=n*a}else if(t.order==="ZXY"){const m=a*h,d=a*u,f=l*h,p=l*u;e[0]=m-p*o,e[4]=-n*u,e[8]=f+d*o,e[1]=d+f*o,e[5]=n*h,e[9]=p-m*o,e[2]=-n*l,e[6]=o,e[10]=n*a}else if(t.order==="ZYX"){const m=n*h,d=n*u,f=o*h,p=o*u;e[0]=a*h,e[4]=f*l-d,e[8]=m*l+p,e[1]=a*u,e[5]=p*l+m,e[9]=d*l-f,e[2]=-l,e[6]=o*a,e[10]=n*a}else if(t.order==="YZX"){const m=n*a,d=n*l,f=o*a,p=o*l;e[0]=a*h,e[4]=p-m*u,e[8]=f*u+d,e[1]=u,e[5]=n*h,e[9]=-o*h,e[2]=-l*h,e[6]=d*u+f,e[10]=m-p*u}else if(t.order==="XZY"){const m=n*a,d=n*l,f=o*a,p=o*l;e[0]=a*h,e[4]=-u,e[8]=l*h,e[1]=m*u+p,e[5]=n*h,e[9]=d*u-f,e[2]=f*u-d,e[6]=o*h,e[10]=p*u+m}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Qi,t,Ki)}lookAt(t,e,i){const s=this.elements;return D.subVectors(t,e),D.lengthSq()===0&&(D.z=1),D.normalize(),ut.crossVectors(i,D),ut.lengthSq()===0&&(Math.abs(i.z)===1?D.x+=1e-4:D.z+=1e-4,D.normalize(),ut.crossVectors(i,D)),ut.normalize(),ge.crossVectors(D,ut),s[0]=ut.x,s[4]=ge.x,s[8]=D.x,s[1]=ut.y,s[5]=ge.y,s[9]=D.y,s[2]=ut.z,s[6]=ge.z,s[10]=D.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,n=i[0],o=i[4],a=i[8],l=i[12],h=i[1],u=i[5],m=i[9],d=i[13],f=i[2],p=i[6],x=i[10],g=i[14],b=i[3],z=i[7],w=i[11],y=i[15],M=s[0],_=s[4],T=s[8],O=s[12],A=s[1],U=s[5],B=s[9],Y=s[13],Z=s[2],H=s[6],W=s[10],Q=s[14],K=s[3],$=s[7],X=s[11],q=s[15];return r[0]=n*M+o*A+a*Z+l*K,r[4]=n*_+o*U+a*H+l*$,r[8]=n*T+o*B+a*W+l*X,r[12]=n*O+o*Y+a*Q+l*q,r[1]=h*M+u*A+m*Z+d*K,r[5]=h*_+u*U+m*H+d*$,r[9]=h*T+u*B+m*W+d*X,r[13]=h*O+u*Y+m*Q+d*q,r[2]=f*M+p*A+x*Z+g*K,r[6]=f*_+p*U+x*H+g*$,r[10]=f*T+p*B+x*W+g*X,r[14]=f*O+p*Y+x*Q+g*q,r[3]=b*M+z*A+w*Z+y*K,r[7]=b*_+z*U+w*H+y*$,r[11]=b*T+z*B+w*W+y*X,r[15]=b*O+z*Y+w*Q+y*q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],n=t[1],o=t[5],a=t[9],l=t[13],h=t[2],u=t[6],m=t[10],d=t[14],f=t[3],p=t[7],x=t[11],g=t[15];return f*(+r*a*u-s*l*u-r*o*m+i*l*m+s*o*d-i*a*d)+p*(+e*a*d-e*l*m+r*n*m-s*n*d+s*l*h-r*a*h)+x*(+e*l*u-e*o*d-r*n*u+i*n*d+r*o*h-i*l*h)+g*(-s*o*h-e*a*u+e*o*m+s*n*u-i*n*m+i*a*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],n=t[4],o=t[5],a=t[6],l=t[7],h=t[8],u=t[9],m=t[10],d=t[11],f=t[12],p=t[13],x=t[14],g=t[15],b=u*x*l-p*m*l+p*a*d-o*x*d-u*a*g+o*m*g,z=f*m*l-h*x*l-f*a*d+n*x*d+h*a*g-n*m*g,w=h*p*l-f*u*l+f*o*d-n*p*d-h*o*g+n*u*g,y=f*u*a-h*p*a-f*o*m+n*p*m+h*o*x-n*u*x,M=e*b+i*z+s*w+r*y;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const _=1/M;return t[0]=b*_,t[1]=(p*m*r-u*x*r-p*s*d+i*x*d+u*s*g-i*m*g)*_,t[2]=(o*x*r-p*a*r+p*s*l-i*x*l-o*s*g+i*a*g)*_,t[3]=(u*a*r-o*m*r-u*s*l+i*m*l+o*s*d-i*a*d)*_,t[4]=z*_,t[5]=(h*x*r-f*m*r+f*s*d-e*x*d-h*s*g+e*m*g)*_,t[6]=(f*a*r-n*x*r-f*s*l+e*x*l+n*s*g-e*a*g)*_,t[7]=(n*m*r-h*a*r+h*s*l-e*m*l-n*s*d+e*a*d)*_,t[8]=w*_,t[9]=(f*u*r-h*p*r-f*i*d+e*p*d+h*i*g-e*u*g)*_,t[10]=(n*p*r-f*o*r+f*i*l-e*p*l-n*i*g+e*o*g)*_,t[11]=(h*o*r-n*u*r-h*i*l+e*u*l+n*i*d-e*o*d)*_,t[12]=y*_,t[13]=(h*p*s-f*u*s+f*i*m-e*p*m-h*i*x+e*u*x)*_,t[14]=(f*o*s-n*p*s-f*i*a+e*p*a+n*i*x-e*o*x)*_,t[15]=(n*u*s-h*o*s+h*i*a-e*u*a-n*i*m+e*o*m)*_,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,n=t.x,o=t.y,a=t.z,l=r*n,h=r*o;return this.set(l*n+i,l*o-s*a,l*a+s*o,0,l*o+s*a,h*o+i,h*a-s*n,0,l*a-s*o,h*a+s*n,r*a*a+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,n){return this.set(1,i,r,0,t,1,n,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,n=e._y,o=e._z,a=e._w,l=r+r,h=n+n,u=o+o,m=r*l,d=r*h,f=r*u,p=n*h,x=n*u,g=o*u,b=a*l,z=a*h,w=a*u,y=i.x,M=i.y,_=i.z;return s[0]=(1-(p+g))*y,s[1]=(d+w)*y,s[2]=(f-z)*y,s[3]=0,s[4]=(d-w)*M,s[5]=(1-(m+g))*M,s[6]=(x+b)*M,s[7]=0,s[8]=(f+z)*_,s[9]=(x-b)*_,s[10]=(1-(m+p))*_,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=_t.set(s[0],s[1],s[2]).length();const n=_t.set(s[4],s[5],s[6]).length(),o=_t.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],j.copy(this);const l=1/r,h=1/n,u=1/o;return j.elements[0]*=l,j.elements[1]*=l,j.elements[2]*=l,j.elements[4]*=h,j.elements[5]*=h,j.elements[6]*=h,j.elements[8]*=u,j.elements[9]*=u,j.elements[10]*=u,e.setFromRotationMatrix(j),i.x=r,i.y=n,i.z=o,this}makePerspective(t,e,i,s,r,n,o=ye){const a=this.elements,l=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),m=(i+s)/(i-s);let d,f;if(o===ye)d=-(n+r)/(n-r),f=-2*n*r/(n-r);else if(o===li)d=-n/(n-r),f=-n*r/(n-r);else throw new Error("Matrix4.makePerspective(): Invalid coordinate system: "+o);return a[0]=l,a[4]=0,a[8]=u,a[12]=0,a[1]=0,a[5]=h,a[9]=m,a[13]=0,a[2]=0,a[6]=0,a[10]=d,a[14]=f,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}makeOrthographic(t,e,i,s,r,n,o=ye){const a=this.elements,l=1/(e-t),h=1/(i-s),u=1/(n-r),m=(e+t)*l,d=(i+s)*h;let f,p;if(o===ye)f=(n+r)*u,p=-2*u;else if(o===li)f=r*u,p=-1*u;else throw new Error("../math.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return a[0]=2*l,a[4]=0,a[8]=0,a[12]=-m,a[1]=0,a[5]=2*h,a[9]=0,a[13]=-d,a[2]=0,a[6]=0,a[10]=p,a[14]=-f,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const _t=new S,j=new nt,Qi=new S(0,0,0),Ki=new S(1,1,1),ut=new S,ge=new S,D=new S,ci=new nt,ui=new E;class Vt{constructor(t=0,e=0,i=0,s=Vt.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new Vt(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],n=s[4],o=s[8],a=s[1],l=s[5],h=s[9],u=s[2],m=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-n,r)):(this._x=Math.atan2(m,l),this._z=0);break;case"YXZ":this._x=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(a,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(st(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-n,l)):(this._y=0,this._z=Math.atan2(a,r));break;case"ZYX":this._y=Math.asin(-st(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(m,d),this._z=Math.atan2(a,r)):(this._x=0,this._z=Math.atan2(-n,l));break;case"YZX":this._z=Math.asin(st(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-st(n,-1,1)),Math.abs(n)<.9999999?(this._x=Math.atan2(m,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("../math.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ci.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ci,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ui.setFromEuler(this),this.setFromQuaternion(ui,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(t){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Vt.DEFAULT_ORDER="XYZ";class St{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new St(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(st(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,n=this.y-t.y;return this.x=r*i-n*s+t.x,this.y=r*s+n*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}St.isVector2=!0;class G{constructor(t=0,e=0,i=0,s=1){G.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new G(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,n=t.elements;return this.x=n[0]*e+n[4]*i+n[8]*s+n[12]*r,this.y=n[1]*e+n[5]*i+n[9]*s+n[13]*r,this.z=n[2]*e+n[6]*i+n[10]*s+n[14]*r,this.w=n[3]*e+n[7]*i+n[11]*s+n[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const a=t.elements,l=a[0],h=a[4],u=a[8],m=a[1],d=a[5],f=a[9],p=a[2],x=a[6],g=a[10];if(Math.abs(h-m)<.01&&Math.abs(u-p)<.01&&Math.abs(f-x)<.01){if(Math.abs(h+m)<.1&&Math.abs(u+p)<.1&&Math.abs(f+x)<.1&&Math.abs(l+d+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const z=(l+1)/2,w=(d+1)/2,y=(g+1)/2,M=(h+m)/4,_=(u+p)/4,T=(f+x)/4;return z>w&&z>y?z<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(z),s=M/i,r=_/i):w>y?w<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),i=M/s,r=T/s):y<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(y),i=_/r,s=T/r),this.set(i,s,r,e),this}let b=Math.sqrt((x-f)*(x-f)+(u-p)*(u-p)+(m-h)*(m-h));return Math.abs(b)<.001&&(b=1),this.x=(x-f)/b,this.y=(u-p)/b,this.z=(m-h)/b,this.w=Math.acos((l+d+g-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class rt{constructor(t,e,i,s,r,n,o,a,l){rt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,n,o,a,l)}set(t,e,i,s,r,n,o,a,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=a,h[6]=i,h[7]=n,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,n=i[0],o=i[3],a=i[6],l=i[1],h=i[4],u=i[7],m=i[2],d=i[5],f=i[8],p=s[0],x=s[3],g=s[6],b=s[1],z=s[4],w=s[7],y=s[2],M=s[5],_=s[8];return r[0]=n*p+o*b+a*y,r[3]=n*x+o*z+a*M,r[6]=n*g+o*w+a*_,r[1]=l*p+h*b+u*y,r[4]=l*x+h*z+u*M,r[7]=l*g+h*w+u*_,r[2]=m*p+d*b+f*y,r[5]=m*x+d*z+f*M,r[8]=m*g+d*w+f*_,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],n=t[4],o=t[5],a=t[6],l=t[7],h=t[8];return e*n*h-e*o*l-i*r*h+i*o*a+s*r*l-s*n*a}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],n=t[4],o=t[5],a=t[6],l=t[7],h=t[8],u=h*n-o*l,m=o*a-h*r,d=l*r-n*a,f=e*u+i*m+s*d;if(f===0)return this.set(0,0,0,0,0,0,0,0,0);const p=1/f;return t[0]=u*p,t[1]=(s*l-h*i)*p,t[2]=(o*i-s*n)*p,t[3]=m*p,t[4]=(h*e-s*a)*p,t[5]=(s*r-o*e)*p,t[6]=d*p,t[7]=(i*a-l*e)*p,t[8]=(n*e-i*r)*p,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,n,o){const a=Math.cos(r),l=Math.sin(r);return this.set(i*a,i*l,-i*(a*n+l*o)+n+t,-s*l,s*a,-s*(-l*n+a*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ge.makeScale(t,e)),this}rotate(t){return this.premultiply(Ge.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ge.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new rt().fromArray(this.elements)}}const Ge=new rt;var L;(function(c){c[c.Random=0]="Random",c[c.Loop=1]="Loop",c[c.PingPong=2]="PingPong",c[c.Burst=3]="Burst"})(L||(L={}));function pe(c,t,e,i){let s;switch(L.Random===c?t=Math.random():L.Burst===c&&i.isBursting&&(t=i.burstParticleIndex/i.burstParticleCount),e>0?s=Math.floor(t/e)*e:s=t,c){case L.Loop:s=s%1;break;case L.PingPong:s=Math.abs(s%2-1);break}return s}class yt{constructor(t,e,i,s){this.p=[t,e,i,s]}genValue(t){const e=t*t,i=t*t*t,s=1-t,r=s*s,n=r*s;return this.p[0]*n+this.p[1]*r*t*3+this.p[2]*s*e*3+this.p[3]*i}derivativeCoefficients(t){const e=[];for(let i=t,s=i.length-1;s>0;s--){const r=[];for(let n=0;n<s;n++){const o=s*(i[n+1]-i[n]);r.push(o)}e.push(r),i=r}return e}getSlope(t){const e=this.derivativeCoefficients(this.p)[0],i=1-t,s=i*i,r=i*t*2,n=t*t;return s*e[0]+r*e[1]+n*e[2]}controlCurve(t,e){this.p[1]=t/3+this.p[0],this.p[2]=this.p[3]-e/3}hull(t){let e=this.p,i=[],s,r=0,n=0,o=0;const a=[];for(a[r++]=e[0],a[r++]=e[1],a[r++]=e[2],a[r++]=e[3];e.length>1;){for(i=[],n=0,o=e.length-1;n<o;n++)s=t*e[n]+(1-t)*e[n+1],a[r++]=s,i.push(s);e=i}return a}split(t){const e=this.hull(t);return{left:new yt(e[0],e[4],e[7],e[9]),right:new yt(e[9],e[8],e[6],e[3]),span:e}}clone(){return new yt(this.p[0],this.p[1],this.p[2],this.p[3])}toJSON(){return{p0:this.p[0],p1:this.p[1],p2:this.p[2],p3:this.p[3]}}static fromJSON(t){return new yt(t.p0,t.p1,t.p2,t.p3)}}const It=c=>({r:c.x,g:c.y,b:c.z,a:c.w}),Jt=c=>new G(c.r,c.g,c.b,c.a),$i=(c,t)=>{switch(t){case"Vector3":return new S(c.x,c.y,c.z);case"Vector4":return new G(c.x,c.y,c.z,c.w);case"Color":return new S(c.r,c.g,c.b);case"Number":return c;default:return c}},ji=(c,t)=>{switch(t){case"Vector3":return{x:c.x,y:c.y,z:c.z};case"Vector4":return{x:c.x,y:c.y,z:c.z,w:c.w};case"Color":return{r:c.x,g:c.y,b:c.z};case"Number":return c;default:return c}};class Me{constructor(t,e){this.a=t,this.b=e,this.type="value"}startGen(t){}genColor(t,e){const i=Math.random();return e.copy(this.a).lerp(this.b,i)}toJSON(){return{type:"RandomColor",a:It(this.a),b:It(this.b)}}static fromJSON(t){return new Me(Jt(t.a),Jt(t.b))}clone(){return new Me(this.a.clone(),this.b.clone())}}class wt{constructor(t,e){this.a=t,this.b=e,this.indexCount=-1,this.type="value"}startGen(t){this.indexCount=t.length,t.push(Math.random())}genColor(t,e){return this.indexCount===-1&&this.startGen(t),e.copy(this.a).lerp(this.b,t[this.indexCount])}toJSON(){return{type:"ColorRange",a:It(this.a),b:It(this.b)}}static fromJSON(t){return new wt(Jt(t.a),Jt(t.b))}clone(){return new wt(this.a.clone(),this.b.clone())}}class mt{constructor(t,e){this.subType=e,this.type="function",this.keys=t}findKey(t){let e=0,i=0,s=this.keys.length-1;for(;i+1<s;)if(e=Math.floor((i+s)/2),t<this.getStartX(e))s=e-1;else if(t>this.getEndX(e))i=e+1;else return e;for(let r=i;r<=s;r++)if(t>=this.getStartX(r)&&t<=this.getEndX(r))return r;return-1}getStartX(t){return this.keys[t][1]}getEndX(t){return t+1<this.keys.length?this.keys[t+1][1]:1}genValue(t,e){const i=this.findKey(e);return this.subType==="Number"?i===-1?this.keys[0][0]:i+1>=this.keys.length?this.keys[this.keys.length-1][0]:(this.keys[i+1][0]-this.keys[i][0])*((e-this.getStartX(i))/(this.getEndX(i)-this.getStartX(i)))+this.keys[i][0]:i===-1?t.copy(this.keys[0][0]):i+1>=this.keys.length?t.copy(this.keys[this.keys.length-1][0]):t.copy(this.keys[i][0]).lerp(this.keys[i+1][0],(e-this.getStartX(i))/(this.getEndX(i)-this.getStartX(i)))}toJSON(){return this.keys[0][0].constructor.name,{type:"CLinearFunction",subType:this.subType,keys:this.keys.map(([t,e])=>({value:ji(t,this.subType),pos:e}))}}static fromJSON(t){return new mt(t.keys.map(e=>[$i(e.value,t.subType),e.pos]),t.subType)}clone(){return this.subType==="Number"?new mt(this.keys.map(([t,e])=>[t,e]),this.subType):new mt(this.keys.map(([t,e])=>[t.clone(),e]),this.subType)}}const xe=new S;class gt{constructor(t=[[new S(0,0,0),0],[new S(1,1,1),0]],e=[[1,0],[1,1]]){this.type="function",this.color=new mt(t,"Color"),this.alpha=new mt(e,"Number")}genColor(t,e,i){return this.color.genValue(xe,i),e.set(xe.x,xe.y,xe.z,this.alpha.genValue(1,i))}toJSON(){return{type:"Gradient",color:this.color.toJSON(),alpha:this.alpha.toJSON()}}static fromJSON(t){if(t.functions){const e=t.functions.map(i=>[wt.fromJSON(i.function).a,i.start]);return t.functions.length>0&&e.push([wt.fromJSON(t.functions[t.functions.length-1].function).b,1]),new gt(e.map(i=>[new S(i[0].x,i[0].y,i[0].z),i[1]]),e.map(i=>[i[0].w,i[1]]))}else{const e=new gt;return e.alpha=mt.fromJSON(t.alpha),e.color=mt.fromJSON(t.color),e}}clone(){const t=new gt;return t.alpha=this.alpha.clone(),t.color=this.color.clone(),t}startGen(t){}}const Xe=new G;class Se{constructor(t,e){this.indexCount=0,this.type="function",this.gradient1=t,this.gradient2=e}startGen(t){this.indexCount=t.length,t.push(Math.random())}genColor(t,e,i){return this.gradient1.genColor(t,e,i),this.gradient2.genColor(t,Xe,i),t&&t[this.indexCount]!==void 0?e.lerp(Xe,t[this.indexCount]):e.lerp(Xe,Math.random()),e}toJSON(){return{type:"RandomColorBetweenGradient",gradient1:this.gradient1.toJSON(),gradient2:this.gradient2.toJSON()}}static fromJSON(t){return new Se(gt.fromJSON(t.gradient1),gt.fromJSON(t.gradient2))}clone(){return new Se(this.gradient1.clone(),this.gradient2.clone())}}class zt{constructor(t){this.color=t,this.type="value"}startGen(t){}genColor(t,e){return e.copy(this.color)}toJSON(){return{type:"ConstantColor",color:It(this.color)}}static fromJSON(t){return new zt(Jt(t.color))}clone(){return new zt(this.color.clone())}}function ei(c){switch(c.type){case"ConstantColor":return zt.fromJSON(c);case"ColorRange":return wt.fromJSON(c);case"RandomColor":return Me.fromJSON(c);case"Gradient":return gt.fromJSON(c);case"RandomColorBetweenGradient":return Se.fromJSON(c);default:return new zt(new G(1,1,1,1))}}class P{constructor(t){this.value=t,this.type="value"}startGen(t){}genValue(t){return this.value}toJSON(){return{type:"ConstantValue",value:this.value}}static fromJSON(t){return new P(t.value)}clone(){return new P(this.value)}}class xt{constructor(t,e){this.a=t,this.b=e,this.indexCount=-1,this.type="value"}startGen(t){this.indexCount=t.length,t.push(Math.random())}genValue(t){return this.indexCount===-1&&this.startGen(t),Tt.lerp(this.a,this.b,t[this.indexCount])}toJSON(){return{type:"IntervalValue",a:this.a,b:this.b}}static fromJSON(t){return new xt(t.a,t.b)}clone(){return new xt(this.a,this.b)}}class ts{constructor(){this.functions=new Array}findFunction(t){let e=0,i=0,s=this.functions.length-1;for(;i+1<s;)if(e=Math.floor((i+s)/2),t<this.getStartX(e))s=e-1;else if(t>this.getEndX(e))i=e+1;else return e;for(let r=i;r<=s;r++)if(t>=this.functions[r][1]&&t<=this.getEndX(r))return r;return-1}getStartX(t){return this.functions[t][1]}setStartX(t,e){t>0&&(this.functions[t][1]=e)}getEndX(t){return t+1<this.functions.length?this.functions[t+1][1]:1}setEndX(t,e){t+1<this.functions.length&&(this.functions[t+1][1]=e)}insertFunction(t,e){const i=this.findFunction(t);this.functions.splice(i+1,0,[e,t])}removeFunction(t){return this.functions.splice(t,1)[0][0]}getFunction(t){return this.functions[t][0]}setFunction(t,e){this.functions[t][0]=e}get numOfFunctions(){return this.functions.length}}class kt extends ts{constructor(t=[[new yt(0,1/3,1/3*2,1),0]]){super(),this.type="function",this.functions=t}genValue(t,e=0){const i=this.findFunction(e);return i===-1?0:this.functions[i][0].genValue((e-this.getStartX(i))/(this.getEndX(i)-this.getStartX(i)))}toSVG(t,e){if(e<1)return"";let i=["M",0,this.functions[0][0].p[0]].join(" ");for(let s=1/e;s<=1;s+=1/e)i=[i,"L",s*t,this.genValue(void 0,s)].join(" ");return i}toJSON(){return{type:"PiecewiseBezier",functions:this.functions.map(([t,e])=>({function:t.toJSON(),start:e}))}}static fromJSON(t){return new kt(t.functions.map(e=>[yt.fromJSON(e.function),e.start]))}clone(){return new kt(this.functions.map(([t,e])=>[t.clone(),e]))}startGen(t){}}function N(c){switch(c.type){case"ConstantValue":return P.fromJSON(c);case"IntervalValue":return xt.fromJSON(c);case"PiecewiseBezier":return kt.fromJSON(c);default:return new P(0)}}class Lt{constructor(){this.indexCount=0,this.type="rotation"}startGen(t){this.indexCount=t.length,t.push(new E);let e,i,s,r,n,o;do e=Math.random()*2-1,i=Math.random()*2-1,s=e*e+i*i;while(s>1);do r=Math.random()*2-1,n=Math.random()*2-1,o=r*r+n*n;while(o>1);const a=Math.sqrt((1-s)/o);t[this.indexCount].set(e,i,a*r,a*n)}genValue(t,e,i,s){return this.indexCount===-1&&this.startGen(t),e.copy(t[this.indexCount]),e}toJSON(){return{type:"RandomQuat"}}static fromJSON(t){return new Lt}clone(){return new Lt}}class Dt{constructor(t,e){this.axis=t,this.angle=e,this.type="rotation"}startGen(t){this.angle.startGen(t)}genValue(t,e,i,s){return e.setFromAxisAngle(this.axis,this.angle.genValue(t,s)*i)}toJSON(){return{type:"AxisAngle",axis:{x:this.axis.x,y:this.axis.y,z:this.axis.z},angle:this.angle.toJSON()}}static fromJSON(t){return new Dt(new S(t.axis.x,t.axis.y,t.axis.z),N(t.angle))}clone(){return new Dt(this.axis.clone(),this.angle.clone())}}class we{constructor(t,e,i,s){this.angleX=t,this.angleY=e,this.angleZ=i,this.type="rotation",this.eular=new Vt(0,0,0,s)}startGen(t){this.angleX.startGen(t),this.angleY.startGen(t),this.angleZ.startGen(t)}genValue(t,e,i,s){return this.eular.set(this.angleX.genValue(t,s)*i,this.angleY.genValue(t,s)*i,this.angleZ.genValue(t,s)*i),e.setFromEuler(this.eular)}toJSON(){return{type:"Euler",angleX:this.angleX.toJSON(),angleY:this.angleY.toJSON(),angleZ:this.angleZ.toJSON(),eulerOrder:this.eular.order}}static fromJSON(t){return new we(N(t.angleX),N(t.angleY),N(t.angleZ),t.eulerOrder)}clone(){return new we(this.angleX,this.angleY,this.angleZ,this.eular.order)}}function Mi(c){switch(c.type){case"AxisAngle":return Dt.fromJSON(c);case"Euler":return we.fromJSON(c);case"RandomQuat":return Lt.fromJSON(c);default:return new Lt}}class vt{constructor(t,e,i){this.x=t,this.y=e,this.z=i,this.type="vec3function"}startGen(t){this.x.startGen(t),this.y.startGen(t),this.z.startGen(t)}genValue(t,e,i){return e.set(this.x.genValue(t,i),this.y.genValue(t,i),this.z.genValue(t,i))}toJSON(){return{type:"Vector3Function",x:this.x.toJSON(),y:this.y.toJSON(),z:this.z.toJSON()}}static fromJSON(t){return new vt(N(t.x),N(t.y),N(t.z))}clone(){return new vt(this.x,this.y,this.z)}}function es(c){switch(c.type){case"Vector3Function":return vt.fromJSON(c);default:return new vt(new P(0),new P(0),new P(0))}}function ze(c){switch(c.type){case"ConstantValue":case"IntervalValue":case"PiecewiseBezier":return N(c);case"AxisAngle":case"RandomQuat":case"Euler":return Mi(c);case"Vector3Function":return es(c);default:return new P(0)}}class Gt{constructor(t={}){var e,i,s,r,n,o,a;this.type="cone",this.currentValue=0,this.radius=(e=t.radius)!==null&&e!==void 0?e:10,this.arc=(i=t.arc)!==null&&i!==void 0?i:2*Math.PI,this.thickness=(s=t.thickness)!==null&&s!==void 0?s:1,this.angle=(r=t.angle)!==null&&r!==void 0?r:Math.PI/6,this.mode=(n=t.mode)!==null&&n!==void 0?n:L.Random,this.spread=(o=t.spread)!==null&&o!==void 0?o:0,this.speed=(a=t.speed)!==null&&a!==void 0?a:new P(1),this.memory=[]}update(t,e){L.Random!=this.mode&&(this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e)}initialize(t,e){const i=pe(this.mode,this.currentValue,this.spread,e),s=Tt.lerp(1-this.thickness,1,Math.random()),r=i*this.arc,n=Math.sqrt(s),o=Math.sin(r),a=Math.cos(r);t.position.x=n*a,t.position.y=n*o,t.position.z=0;const l=this.angle*n;t.velocity.set(0,0,Math.cos(l)).addScaledVector(t.position,Math.sin(l)).multiplyScalar(t.startSpeed),t.position.multiplyScalar(this.radius)}toJSON(){return{type:"cone",radius:this.radius,arc:this.arc,thickness:this.thickness,angle:this.angle,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new Gt({radius:t.radius,arc:t.arc,thickness:t.thickness,angle:t.angle,mode:t.mode,speed:t.speed?N(t.speed):void 0,spread:t.spread})}clone(){return new Gt({radius:this.radius,arc:this.arc,thickness:this.thickness,angle:this.angle,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}class Xt{constructor(t={}){var e,i,s,r,n,o;this.type="circle",this.currentValue=0,this.radius=(e=t.radius)!==null&&e!==void 0?e:10,this.arc=(i=t.arc)!==null&&i!==void 0?i:2*Math.PI,this.thickness=(s=t.thickness)!==null&&s!==void 0?s:1,this.mode=(r=t.mode)!==null&&r!==void 0?r:L.Random,this.spread=(n=t.spread)!==null&&n!==void 0?n:0,this.speed=(o=t.speed)!==null&&o!==void 0?o:new P(1),this.memory=[]}update(t,e){this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e}initialize(t,e){const i=pe(this.mode,this.currentValue,this.spread,e),s=Tt.lerp(1-this.thickness,1,Math.random()),r=i*this.arc;t.position.x=Math.cos(r),t.position.y=Math.sin(r),t.position.z=0,t.velocity.copy(t.position).multiplyScalar(t.startSpeed),t.position.multiplyScalar(this.radius*s)}toJSON(){return{type:"circle",radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new Xt({radius:t.radius,arc:t.arc,thickness:t.thickness,mode:t.mode,speed:t.speed?N(t.speed):void 0,spread:t.spread})}clone(){return new Xt({radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}function ve(c,t){return Math.floor(Math.random()*(t-c))+c}const Te=new S(0,1,0),Ne=new S(0,0,0),is=new S(1,1,1),di=new S(0,0,1);class qt{constructor(t={}){var e,i,s,r,n,o,a;this.type="donut",this.currentValue=0,this.radius=(e=t.radius)!==null&&e!==void 0?e:10,this.arc=(i=t.arc)!==null&&i!==void 0?i:2*Math.PI,this.thickness=(s=t.thickness)!==null&&s!==void 0?s:1,this.donutRadius=(r=t.donutRadius)!==null&&r!==void 0?r:this.radius*.2,this.mode=(n=t.mode)!==null&&n!==void 0?n:L.Random,this.spread=(o=t.spread)!==null&&o!==void 0?o:0,this.speed=(a=t.speed)!==null&&a!==void 0?a:new P(1),this.memory=[],this._m1=new nt}update(t,e){L.Random!=this.mode&&(this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e)}initialize(t,e){const i=pe(this.mode,this.currentValue,this.spread,e),s=Math.random(),r=Tt.lerp(1-this.thickness,1,Math.random()),n=i*this.arc,o=s*Math.PI*2,a=Math.sin(n),l=Math.cos(n);t.position.x=this.radius*l,t.position.y=this.radius*a,t.position.z=0,t.velocity.z=this.donutRadius*r*Math.sin(o),t.velocity.x=this.donutRadius*r*Math.cos(o)*l,t.velocity.y=this.donutRadius*r*Math.cos(o)*a,t.position.add(t.velocity),t.velocity.normalize().multiplyScalar(t.startSpeed),t.rotation instanceof E&&(this._m1.lookAt(Ne,t.velocity,Te),t.rotation.setFromRotationMatrix(this._m1))}toJSON(){return{type:"donut",radius:this.radius,arc:this.arc,thickness:this.thickness,donutRadius:this.donutRadius,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new qt({radius:t.radius,arc:t.arc,thickness:t.thickness,donutRadius:t.donutRadius,mode:t.mode,speed:t.speed?N(t.speed):void 0,spread:t.spread})}clone(){return new qt({radius:this.radius,arc:this.arc,thickness:this.thickness,donutRadius:this.donutRadius,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}class Yt{constructor(){this.type="point",this._m1=new nt}update(t,e){}initialize(t){const e=Math.random(),i=Math.random(),s=e*Math.PI*2,r=Math.acos(2*i-1),n=Math.cbrt(Math.random()),o=Math.sin(s),a=Math.cos(s),l=Math.sin(r),h=Math.cos(r);t.velocity.x=n*l*a,t.velocity.y=n*l*o,t.velocity.z=n*h,t.velocity.multiplyScalar(t.startSpeed),t.position.setScalar(0),t.rotation instanceof E&&(this._m1.lookAt(Ne,t.position,Te),t.rotation.setFromRotationMatrix(this._m1))}toJSON(){return{type:"point"}}static fromJSON(t){return new Yt}clone(){return new Yt}}class bt{constructor(t={}){var e,i,s,r,n,o;this.type="sphere",this.currentValue=0,this.radius=(e=t.radius)!==null&&e!==void 0?e:10,this.arc=(i=t.arc)!==null&&i!==void 0?i:2*Math.PI,this.thickness=(s=t.thickness)!==null&&s!==void 0?s:1,this.mode=(r=t.mode)!==null&&r!==void 0?r:L.Random,this.spread=(n=t.spread)!==null&&n!==void 0?n:0,this.speed=(o=t.speed)!==null&&o!==void 0?o:new P(1),this.memory=[],this._m1=new nt}update(t,e){L.Random!=this.mode&&(this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e)}initialize(t,e){const i=pe(this.mode,this.currentValue,this.spread,e),s=Math.random(),r=Tt.lerp(1-this.thickness,1,Math.random()),n=i*this.arc,o=Math.acos(2*s-1),a=Math.sin(n),l=Math.cos(n),h=Math.sin(o),u=Math.cos(o);t.position.x=h*l,t.position.y=h*a,t.position.z=u,t.velocity.copy(t.position).multiplyScalar(t.startSpeed),t.position.multiplyScalar(this.radius*r),t.rotation instanceof E&&(this._m1.lookAt(Ne,t.position,Te),t.rotation.setFromRotationMatrix(this._m1))}toJSON(){return{type:"sphere",radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new bt({radius:t.radius,arc:t.arc,thickness:t.thickness,mode:t.mode,speed:t.speed?N(t.speed):void 0,spread:t.spread})}clone(){return new bt({radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}class Zt{constructor(t={}){var e,i,s,r,n,o;this.type="sphere",this.currentValue=0,this.radius=(e=t.radius)!==null&&e!==void 0?e:10,this.arc=(i=t.arc)!==null&&i!==void 0?i:2*Math.PI,this.thickness=(s=t.thickness)!==null&&s!==void 0?s:1,this.mode=(r=t.mode)!==null&&r!==void 0?r:L.Random,this.spread=(n=t.spread)!==null&&n!==void 0?n:0,this.speed=(o=t.speed)!==null&&o!==void 0?o:new P(1),this.memory=[],this._m1=new nt}update(t,e){L.Random!=this.mode&&(this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e)}initialize(t,e){const i=pe(this.mode,this.currentValue,this.spread,e),s=Math.random(),r=Tt.lerp(1-this.thickness,1,Math.random()),n=i*this.arc,o=Math.acos(s),a=Math.sin(n),l=Math.cos(n),h=Math.sin(o),u=Math.cos(o);t.position.x=h*l,t.position.y=h*a,t.position.z=u,t.velocity.copy(t.position).multiplyScalar(t.startSpeed),t.position.multiplyScalar(this.radius*r),t.rotation instanceof E&&(this._m1.lookAt(Ne,t.position,Te),t.rotation.setFromRotationMatrix(this._m1))}toJSON(){return{type:"hemisphere",radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new Zt({radius:t.radius,arc:t.arc,thickness:t.thickness,mode:t.mode,speed:t.speed?N(t.speed):void 0,spread:t.spread})}clone(){return new Zt({radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}class Ht{constructor(t={}){var e,i,s,r;this.type="grid",this.width=(e=t.width)!==null&&e!==void 0?e:1,this.height=(i=t.height)!==null&&i!==void 0?i:1,this.column=(s=t.column)!==null&&s!==void 0?s:10,this.row=(r=t.row)!==null&&r!==void 0?r:10}initialize(t){const e=Math.floor(Math.random()*this.row),i=Math.floor(Math.random()*this.column);t.position.x=i*this.width/this.column-this.width/2,t.position.y=e*this.height/this.row-this.height/2,t.position.z=0,t.velocity.set(0,0,t.startSpeed)}toJSON(){return{type:"grid",width:this.width,height:this.height,column:this.column,row:this.row}}static fromJSON(t){return new Ht(t)}clone(){return new Ht({width:this.width,height:this.height,column:this.column,row:this.row})}update(t,e){}}const Ke={circle:{type:"circle",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc"]]],constructor:Xt,loadJSON:Xt.fromJSON},cone:{type:"cone",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["angle",["radian"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc"]]],constructor:Gt,loadJSON:Gt.fromJSON},donut:{type:"donut",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["donutRadius",["number"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc"]]],constructor:qt,loadJSON:qt.fromJSON},point:{type:"point",params:[],constructor:Yt,loadJSON:Yt.fromJSON},sphere:{type:"sphere",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["angle",["radian"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc"]]],constructor:bt,loadJSON:bt.fromJSON},hemisphere:{type:"hemisphere",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["angle",["radian"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc"]]],constructor:Zt,loadJSON:Zt.fromJSON},grid:{type:"grid",params:[["width",["number"]],["height",["number"]],["rows",["number"]],["column",["number"]]],constructor:Ht,loadJSON:Ht.fromJSON}};function ss(c,t){return Ke[c.type].loadJSON(c,t)}class Wt{constructor(t){this.color=t,this.type="ColorOverLife"}initialize(t){this.color.startGen(t.memory)}update(t,e){this.color.genColor(t.memory,t.color,t.age/t.life),t.color.x*=t.startColor.x,t.color.y*=t.startColor.y,t.color.z*=t.startColor.z,t.color.w*=t.startColor.w}frameUpdate(t){}toJSON(){return{type:this.type,color:this.color.toJSON()}}static fromJSON(t){return new Wt(ei(t.color))}clone(){return new Wt(this.color.clone())}reset(){}}class Qt{constructor(t){this.angularVelocity=t,this.type="RotationOverLife"}initialize(t){typeof t.rotation=="number"&&this.angularVelocity.startGen(t.memory)}update(t,e){typeof t.rotation=="number"&&(t.rotation+=e*this.angularVelocity.genValue(t.memory,t.age/t.life))}toJSON(){return{type:this.type,angularVelocity:this.angularVelocity.toJSON()}}static fromJSON(t){return new Qt(N(t.angularVelocity))}frameUpdate(t){}clone(){return new Qt(this.angularVelocity.clone())}reset(){}}class Kt{constructor(t){this.angularVelocity=t,this.type="Rotation3DOverLife",this.tempQuat=new E,this.tempQuat2=new E}initialize(t){t.rotation instanceof E&&(t.angularVelocity=new E,this.angularVelocity.startGen(t.memory))}update(t,e){t.rotation instanceof E&&(this.angularVelocity.genValue(t.memory,this.tempQuat,e,t.age/t.life),t.rotation.multiply(this.tempQuat))}toJSON(){return{type:this.type,angularVelocity:this.angularVelocity.toJSON()}}static fromJSON(t){return new Kt(Mi(t.angularVelocity))}frameUpdate(t){}clone(){return new Kt(this.angularVelocity.clone())}reset(){}}class $t{initialize(t,e){this.ps=e,this.x.startGen(t.memory),this.y.startGen(t.memory),this.z.startGen(t.memory)}constructor(t,e,i){this.x=t,this.y=e,this.z=i,this.type="ForceOverLife",this._temp=new S,this._tempScale=new S,this._tempQ=new E}update(t,e){this._temp.set(this.x.genValue(t.memory,t.age/t.life),this.y.genValue(t.memory,t.age/t.life),this.z.genValue(t.memory,t.age/t.life)),this.ps.worldSpace?t.velocity.addScaledVector(this._temp,e):(this._temp.multiply(this._tempScale).applyQuaternion(this._tempQ),t.velocity.addScaledVector(this._temp,e))}toJSON(){return{type:this.type,x:this.x.toJSON(),y:this.y.toJSON(),z:this.z.toJSON()}}static fromJSON(t){return new $t(N(t.x),N(t.y),N(t.z))}frameUpdate(t){if(this.ps&&!this.ps.worldSpace){const e=this._temp,i=this._tempQ,s=this._tempScale;this.ps.emitter.matrixWorld.decompose(e,i,s),i.invert(),s.set(1/s.x,1/s.y,1/s.z)}}clone(){return new $t(this.x.clone(),this.y.clone(),this.z.clone())}reset(){}}class jt{initialize(t){this.size.startGen(t.memory)}constructor(t){this.size=t,this.type="SizeOverLife"}update(t){this.size instanceof vt?this.size.genValue(t.memory,t.size,t.age/t.life).multiply(t.startSize):t.size.copy(t.startSize).multiplyScalar(this.size.genValue(t.memory,t.age/t.life))}toJSON(){return{type:this.type,size:this.size.toJSON()}}static fromJSON(t){return new jt(ze(t.size))}frameUpdate(t){}clone(){return new jt(this.size.clone())}reset(){}}class te{initialize(t){this.speed.startGen(t.memory)}constructor(t){this.speed=t,this.type="SpeedOverLife"}update(t){t.speedModifier=this.speed.genValue(t.memory,t.age/t.life)}toJSON(){return{type:this.type,speed:this.speed.toJSON()}}static fromJSON(t){return new te(N(t.speed))}frameUpdate(t){}clone(){return new te(this.speed.clone())}reset(){}}class ee{constructor(t){this.frame=t,this.type="FrameOverLife"}initialize(t){this.frame.startGen(t.memory)}update(t,e){this.frame instanceof kt&&(t.uvTile=this.frame.genValue(t.memory,t.age/t.life))}frameUpdate(t){}toJSON(){return{type:this.type,frame:this.frame.toJSON()}}static fromJSON(t){return new ee(N(t.frame))}clone(){return new ee(this.frame.clone())}reset(){}}class ie{constructor(t,e=new S(0,1,0)){this.orbitSpeed=t,this.axis=e,this.type="OrbitOverLife",this.temp=new S,this.rotation=new E}initialize(t){this.orbitSpeed.startGen(t.memory)}update(t,e){this.temp.copy(t.position).projectOnVector(this.axis),this.rotation.setFromAxisAngle(this.axis,this.orbitSpeed.genValue(t.memory,t.age/t.life)*e),t.position.sub(this.temp),t.position.applyQuaternion(this.rotation),t.position.add(this.temp)}frameUpdate(t){}toJSON(){return{type:this.type,orbitSpeed:this.orbitSpeed.toJSON(),axis:[this.axis.x,this.axis.y,this.axis.z]}}static fromJSON(t){return new ie(N(t.orbitSpeed),t.axis?new S(t.axis[0],t.axis[1],t.axis[2]):void 0)}clone(){return new ie(this.orbitSpeed.clone())}reset(){}}class qe{constructor(t){this.data=t,this.next=null,this.prev=null}hasPrev(){return this.prev!==null}hasNext(){return this.next!==null}}class rs{constructor(){this.length=0,this.head=this.tail=null}isEmpty(){return this.head===null}clear(){this.length=0,this.head=this.tail=null}front(){return this.head===null?null:this.head.data}back(){return this.tail===null?null:this.tail.data}dequeue(){if(this.head){const t=this.head.data;return this.head=this.head.next,this.head?this.head.prev=null:this.tail=null,this.length--,t}}pop(){if(this.tail){const t=this.tail.data;return this.tail=this.tail.prev,this.tail?this.tail.next=null:this.head=null,this.length--,t}}queue(t){const e=new qe(t);this.tail||(this.tail=e),this.head&&(this.head.prev=e,e.next=this.head),this.head=e,this.length++}push(t){const e=new qe(t);this.head||(this.head=e),this.tail&&(this.tail.next=e,e.prev=this.tail),this.tail=e,this.length++}insertBefore(t,e){const i=new qe(e);i.next=t,i.prev=t.prev,i.prev!==null&&(i.prev.next=i),i.next.prev=i,t==this.head&&(this.head=i),this.length++}remove(t){if(this.head===null||this.tail===null)return;let e=this.head;for(t===this.head.data&&(this.head=this.head.next),t===this.tail.data&&(this.tail=this.tail.prev);e.next!==null&&e.data!==t;)e=e.next;e.data===t&&(e.prev!==null&&(e.prev.next=e.next),e.next!==null&&(e.next.prev=e.prev),this.length--)}*values(){let t=this.head;for(;t!==null;)yield t.data,t=t.next}}class ns{constructor(){this.startSpeed=0,this.startColor=new G,this.startSize=new S(1,1,1),this.position=new S,this.velocity=new S,this.age=0,this.life=1,this.size=new S(1,1,1),this.speedModifier=1,this.rotation=0,this.color=new G,this.uvTile=0,this.memory=[]}get died(){return this.age>=this.life}reset(){this.memory.length=0}}class as{constructor(t,e,i){this.position=t,this.size=e,this.color=i}}class $e{constructor(){this.startSpeed=0,this.startColor=new G,this.startSize=new S(1,1,1),this.position=new S,this.velocity=new S,this.age=0,this.life=1,this.size=new S(1,1,1),this.length=100,this.speedModifier=1,this.color=new G,this.previous=new rs,this.uvTile=0,this.memory=[]}update(){for(this.age<=this.life?this.previous.push(new as(this.position.clone(),this.size.x,this.color.clone())):this.previous.length>0&&this.previous.dequeue();this.previous.length>this.length;)this.previous.dequeue()}get died(){return this.age>=this.life}reset(){this.memory.length=0,this.previous.clear()}}class se{initialize(t){this.width.startGen(t.memory)}constructor(t){this.width=t,this.type="WidthOverLength"}update(t){if(t instanceof $e){const e=t.previous.values();for(let i=0;i<t.previous.length;i++){const s=e.next();s.value.size=this.width.genValue(t.memory,(t.previous.length-i)/t.length)}}}frameUpdate(t){}toJSON(){return{type:this.type,width:this.width.toJSON()}}static fromJSON(t){return new se(N(t.width))}clone(){return new se(this.width.clone())}reset(){}}class re{constructor(t,e){this.direction=t,this.magnitude=e,this.type="ApplyForce",this.memory={data:[],dataCount:0},this.magnitudeValue=this.magnitude.genValue(this.memory)}initialize(t){}update(t,e){t.velocity.addScaledVector(this.direction,this.magnitudeValue*e)}frameUpdate(t){this.magnitudeValue=this.magnitude.genValue(this.memory)}toJSON(){return{type:this.type,direction:[this.direction.x,this.direction.y,this.direction.z],magnitude:this.magnitude.toJSON()}}static fromJSON(t){var e;return new re(new S(t.direction[0],t.direction[1],t.direction[2]),N((e=t.magnitude)!==null&&e!==void 0?e:t.force))}clone(){return new re(this.direction.clone(),this.magnitude.clone())}reset(){}}class ne{constructor(t,e){this.center=t,this.magnitude=e,this.type="GravityForce",this.temp=new S}initialize(t){}update(t,e){this.temp.copy(this.center).sub(t.position).normalize(),t.velocity.addScaledVector(this.temp,this.magnitude/t.position.distanceToSquared(this.center)*e)}frameUpdate(t){}toJSON(){return{type:this.type,center:[this.center.x,this.center.y,this.center.z],magnitude:this.magnitude}}static fromJSON(t){return new ne(new S(t.center[0],t.center[1],t.center[2]),t.magnitude)}clone(){return new ne(this.center.clone(),this.magnitude)}reset(){}}class ae{constructor(t){this.angle=t,this.type="ChangeEmitDirection",this._temp=new S,this._q=new E,this.memory={data:[],dataCount:0}}initialize(t){const e=t.velocity.length();e!=0&&(t.velocity.normalize(),t.velocity.x===0&&t.velocity.y===0?this._temp.set(0,t.velocity.z,0):this._temp.set(-t.velocity.y,t.velocity.x,0),this.angle.startGen(this.memory),this._q.setFromAxisAngle(this._temp.normalize(),this.angle.genValue(this.memory)),this._temp.copy(t.velocity),t.velocity.applyQuaternion(this._q),this._q.setFromAxisAngle(this._temp,Math.random()*Math.PI*2),t.velocity.applyQuaternion(this._q),t.velocity.setLength(e))}update(t,e){}frameUpdate(t){}toJSON(){return{type:this.type,angle:this.angle.toJSON()}}static fromJSON(t){return new ae(N(t.angle))}clone(){return new ae(this.angle)}reset(){}}var Mt;(function(c){c[c.Death=0]="Death",c[c.Birth=1]="Birth",c[c.Frame=2]="Frame"})(Mt||(Mt={}));class oe{constructor(t,e,i,s=Mt.Frame,r=1){this.particleSystem=t,this.useVelocityAsBasis=e,this.subParticleSystem=i,this.mode=s,this.emitProbability=r,this.type="EmitSubParticleSystem",this.q_=new E,this.v_=new S,this.v2_=new S,this.subEmissions=new Array,this.subParticleSystem&&this.subParticleSystem.system&&(this.subParticleSystem.system.onlyUsedByOther=!0)}initialize(t){}update(t,e){this.mode===Mt.Frame?this.emit(t,e):this.mode===Mt.Birth&&t.age===0?this.emit(t,e):this.mode===Mt.Death&&t.age+e>=t.life&&this.emit(t,e)}emit(t,e){if(!this.subParticleSystem||Math.random()>this.emitProbability)return;const i=new nt;this.setMatrixFromParticle(i,t),this.subEmissions.push({burstParticleCount:0,burstParticleIndex:0,isBursting:!1,burstIndex:0,burstWaveIndex:0,time:0,waitEmiting:0,matrix:i,travelDistance:0,particle:t})}frameUpdate(t){if(this.subParticleSystem)for(let e=0;e<this.subEmissions.length;e++)if(this.subEmissions[e].time>=this.subParticleSystem.system.duration)this.subEmissions[e]=this.subEmissions[this.subEmissions.length-1],this.subEmissions.length=this.subEmissions.length-1,e--;else{const i=this.subEmissions[e];i.particle&&i.particle.age<i.particle.life?this.setMatrixFromParticle(i.matrix,i.particle):i.particle=void 0,this.subParticleSystem.system.emit(t,i,i.matrix)}}toJSON(){return{type:this.type,subParticleSystem:this.subParticleSystem?this.subParticleSystem.uuid:"",useVelocityAsBasis:this.useVelocityAsBasis,mode:this.mode,emitProbability:this.emitProbability}}static fromJSON(t,e){return new oe(e,t.useVelocityAsBasis,t.subParticleSystem,t.mode,t.emitProbability)}clone(){return new oe(this.particleSystem,this.useVelocityAsBasis,this.subParticleSystem,this.mode,this.emitProbability)}reset(){}setMatrixFromParticle(t,e){let i;if(e.rotation===void 0||this.useVelocityAsBasis)if(e.velocity.x===0&&e.velocity.y===0&&(e.velocity.z===1||e.velocity.z===0))t.set(1,0,0,e.position.x,0,1,0,e.position.y,0,0,1,e.position.z,0,0,0,1);else{this.v_.copy(di).cross(e.velocity),this.v2_.copy(e.velocity).cross(this.v_);const s=this.v_.length(),r=this.v2_.length();t.set(this.v_.x/s,this.v2_.x/r,e.velocity.x,e.position.x,this.v_.y/s,this.v2_.y/r,e.velocity.y,e.position.y,this.v_.z/s,this.v2_.z/r,e.velocity.z,e.position.z,0,0,0,1)}else e.rotation instanceof E?i=e.rotation:(this.q_.setFromAxisAngle(di,e.rotation),i=this.q_),t.compose(e.position,i,is);this.particleSystem.worldSpace||t.multiplyMatrices(this.particleSystem.emitter.matrixWorld,t)}}const os=.5*(Math.sqrt(3)-1),Ft=(3-Math.sqrt(3))/6,hs=1/3,et=1/6,ls=(Math.sqrt(5)-1)/4,I=(5-Math.sqrt(5))/20,V=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),R=new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]);class Si{constructor(t=Math.random){const e=typeof t=="function"?t:us(t);this.p=cs(e),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(let i=0;i<512;i++)this.perm[i]=this.p[i&255],this.permMod12[i]=this.perm[i]%12}noise2D(t,e){const i=this.permMod12,s=this.perm;let r=0,n=0,o=0;const a=(t+e)*os,l=Math.floor(t+a),h=Math.floor(e+a),u=(l+h)*Ft,m=l-u,d=h-u,f=t-m,p=e-d;let x,g;f>p?(x=1,g=0):(x=0,g=1);const b=f-x+Ft,z=p-g+Ft,w=f-1+2*Ft,y=p-1+2*Ft,M=l&255,_=h&255;let T=.5-f*f-p*p;if(T>=0){const U=i[M+s[_]]*3;T*=T,r=T*T*(V[U]*f+V[U+1]*p)}let O=.5-b*b-z*z;if(O>=0){const U=i[M+x+s[_+g]]*3;O*=O,n=O*O*(V[U]*b+V[U+1]*z)}let A=.5-w*w-y*y;if(A>=0){const U=i[M+1+s[_+1]]*3;A*=A,o=A*A*(V[U]*w+V[U+1]*y)}return 70*(r+n+o)}noise3D(t,e,i){const s=this.permMod12,r=this.perm;let n,o,a,l;const h=(t+e+i)*hs,u=Math.floor(t+h),m=Math.floor(e+h),d=Math.floor(i+h),f=(u+m+d)*et,p=u-f,x=m-f,g=d-f,b=t-p,z=e-x,w=i-g;let y,M,_,T,O,A;b>=z?z>=w?(y=1,M=0,_=0,T=1,O=1,A=0):b>=w?(y=1,M=0,_=0,T=1,O=0,A=1):(y=0,M=0,_=1,T=1,O=0,A=1):z<w?(y=0,M=0,_=1,T=0,O=1,A=1):b<w?(y=0,M=1,_=0,T=0,O=1,A=1):(y=0,M=1,_=0,T=1,O=1,A=0);const U=b-y+et,B=z-M+et,Y=w-_+et,Z=b-T+2*et,H=z-O+2*et,W=w-A+2*et,Q=b-1+3*et,K=z-1+3*et,$=w-1+3*et,X=u&255,q=m&255,ft=d&255;let ht=.6-b*b-z*z-w*w;if(ht<0)n=0;else{const F=s[X+r[q+r[ft]]]*3;ht*=ht,n=ht*ht*(V[F]*b+V[F+1]*z+V[F+2]*w)}let lt=.6-U*U-B*B-Y*Y;if(lt<0)o=0;else{const F=s[X+y+r[q+M+r[ft+_]]]*3;lt*=lt,o=lt*lt*(V[F]*U+V[F+1]*B+V[F+2]*Y)}let at=.6-Z*Z-H*H-W*W;if(at<0)a=0;else{const F=s[X+T+r[q+O+r[ft+A]]]*3;at*=at,a=at*at*(V[F]*Z+V[F+1]*H+V[F+2]*W)}let ot=.6-Q*Q-K*K-$*$;if(ot<0)l=0;else{const F=s[X+1+r[q+1+r[ft+1]]]*3;ot*=ot,l=ot*ot*(V[F]*Q+V[F+1]*K+V[F+2]*$)}return 32*(n+o+a+l)}noise4D(t,e,i,s){const r=this.perm;let n,o,a,l,h;const u=(t+e+i+s)*ls,m=Math.floor(t+u),d=Math.floor(e+u),f=Math.floor(i+u),p=Math.floor(s+u),x=(m+d+f+p)*I,g=m-x,b=d-x,z=f-x,w=p-x,y=t-g,M=e-b,_=i-z,T=s-w;let O=0,A=0,U=0,B=0;y>M?O++:A++,y>_?O++:U++,y>T?O++:B++,M>_?A++:U++,M>T?A++:B++,_>T?U++:B++;const Y=O>=3?1:0,Z=A>=3?1:0,H=U>=3?1:0,W=B>=3?1:0,Q=O>=2?1:0,K=A>=2?1:0,$=U>=2?1:0,X=B>=2?1:0,q=O>=1?1:0,ft=A>=1?1:0,ht=U>=1?1:0,lt=B>=1?1:0,at=y-Y+I,ot=M-Z+I,F=_-H+I,Oe=T-W+I,Ae=y-Q+2*I,Pe=M-K+2*I,Ee=_-$+2*I,Ue=T-X+2*I,Ce=y-q+3*I,Be=M-ft+3*I,Re=_-ht+3*I,Fe=T-lt+3*I,Ve=y-1+4*I,Ie=M-1+4*I,Je=_-1+4*I,ke=T-1+4*I,Nt=m&255,Ot=d&255,At=f&255,Pt=p&255;let Et=.6-y*y-M*M-_*_-T*T;if(Et<0)n=0;else{const C=r[Nt+r[Ot+r[At+r[Pt]]]]%32*4;Et*=Et,n=Et*Et*(R[C]*y+R[C+1]*M+R[C+2]*_+R[C+3]*T)}let Ut=.6-at*at-ot*ot-F*F-Oe*Oe;if(Ut<0)o=0;else{const C=r[Nt+Y+r[Ot+Z+r[At+H+r[Pt+W]]]]%32*4;Ut*=Ut,o=Ut*Ut*(R[C]*at+R[C+1]*ot+R[C+2]*F+R[C+3]*Oe)}let Ct=.6-Ae*Ae-Pe*Pe-Ee*Ee-Ue*Ue;if(Ct<0)a=0;else{const C=r[Nt+Q+r[Ot+K+r[At+$+r[Pt+X]]]]%32*4;Ct*=Ct,a=Ct*Ct*(R[C]*Ae+R[C+1]*Pe+R[C+2]*Ee+R[C+3]*Ue)}let Bt=.6-Ce*Ce-Be*Be-Re*Re-Fe*Fe;if(Bt<0)l=0;else{const C=r[Nt+q+r[Ot+ft+r[At+ht+r[Pt+lt]]]]%32*4;Bt*=Bt,l=Bt*Bt*(R[C]*Ce+R[C+1]*Be+R[C+2]*Re+R[C+3]*Fe)}let Rt=.6-Ve*Ve-Ie*Ie-Je*Je-ke*ke;if(Rt<0)h=0;else{const C=r[Nt+1+r[Ot+1+r[At+1+r[Pt+1]]]]%32*4;Rt*=Rt,h=Rt*Rt*(R[C]*Ve+R[C+1]*Ie+R[C+2]*Je+R[C+3]*ke)}return 27*(n+o+a+l+h)}}function cs(c){const t=new Uint8Array(256);for(let e=0;e<256;e++)t[e]=e;for(let e=0;e<255;e++){const i=e+~~(c()*(256-e)),s=t[e];t[e]=t[i],t[i]=s}return t}function us(c){let t=0,e=0,i=0,s=1;const r=ds();return t=r(" "),e=r(" "),i=r(" "),t-=r(c),t<0&&(t+=1),e-=r(c),e<0&&(e+=1),i-=r(c),i<0&&(i+=1),function(){const n=2091639*t+s*23283064365386963e-26;return t=e,e=i,i=n-(s=n|0)}}function ds(){let c=4022871197;return function(t){t=t.toString();for(let e=0;e<t.length;e++){c+=t.charCodeAt(e);let i=.02519603282416938*c;c=i>>>0,i-=c,i*=c,c=i>>>0,i-=c,c+=i*4294967296}return(c>>>0)*23283064365386963e-26}}class he{constructor(t,e,i,s){this.scale=t,this.octaves=e,this.velocityMultiplier=i,this.timeScale=s,this.type="TurbulenceField",this.generator=new Si,this.timeOffset=new S,this.temp=new S,this.temp2=new S,this.timeOffset.x=Math.random()/this.scale.x*this.timeScale.x,this.timeOffset.y=Math.random()/this.scale.y*this.timeScale.y,this.timeOffset.z=Math.random()/this.scale.z*this.timeScale.z}initialize(t){}update(t,e){const i=t.position.x/this.scale.x,s=t.position.y/this.scale.y,r=t.position.z/this.scale.z;this.temp.set(0,0,0);let n=1;for(let o=0;o<this.octaves;o++)this.temp2.set(this.generator.noise4D(i*n,s*n,r*n,this.timeOffset.x*n)/n,this.generator.noise4D(i*n,s*n,r*n,this.timeOffset.y*n)/n,this.generator.noise4D(i*n,s*n,r*n,this.timeOffset.z*n)/n),this.temp.add(this.temp2),n*=2;this.temp.multiply(this.velocityMultiplier),t.velocity.addScaledVector(this.temp,e)}toJSON(){return{type:this.type,scale:[this.scale.x,this.scale.y,this.scale.z],octaves:this.octaves,velocityMultiplier:[this.velocityMultiplier.x,this.velocityMultiplier.y,this.velocityMultiplier.z],timeScale:[this.timeScale.x,this.timeScale.y,this.timeScale.z]}}frameUpdate(t){this.timeOffset.x+=t*this.timeScale.x,this.timeOffset.y+=t*this.timeScale.y,this.timeOffset.z+=t*this.timeScale.z}static fromJSON(t){return new he(new S(t.scale[0],t.scale[1],t.scale[2]),t.octaves,new S(t.velocityMultiplier[0],t.velocityMultiplier[1],t.velocityMultiplier[2]),new S(t.timeScale[0],t.timeScale[1],t.timeScale[2]))}clone(){return new he(this.scale.clone(),this.octaves,this.velocityMultiplier.clone(),this.timeScale.clone())}reset(){}}const it=[],Ye=new S,Ze=new E;class le{constructor(t,e,i=new P(1),s=new P(0)){if(this.frequency=t,this.power=e,this.positionAmount=i,this.rotationAmount=s,this.type="Noise",this.duration=0,it.length===0)for(let r=0;r<100;r++)it.push(new Si)}initialize(t){t.lastPosNoise=new S,typeof t.rotation=="number"?t.lastRotNoise=0:t.lastRotNoise=new E,t.generatorIndex=[ve(0,100),ve(0,100),ve(0,100),ve(0,100)],this.positionAmount.startGen(t.memory),this.rotationAmount.startGen(t.memory),this.frequency.startGen(t.memory),this.power.startGen(t.memory)}update(t,e){let i=this.frequency.genValue(t.memory,t.age/t.life),s=this.power.genValue(t.memory,t.age/t.life),r=this.positionAmount.genValue(t.memory,t.age/t.life),n=this.rotationAmount.genValue(t.memory,t.age/t.life);r>0&&t.lastPosNoise!==void 0&&(t.position.sub(t.lastPosNoise),Ye.set(it[t.generatorIndex[0]].noise2D(0,t.age*i)*s*r,it[t.generatorIndex[1]].noise2D(0,t.age*i)*s*r,it[t.generatorIndex[2]].noise2D(0,t.age*i)*s*r),t.position.add(Ye),t.lastPosNoise.copy(Ye)),n>0&&t.lastRotNoise!==void 0&&(typeof t.rotation=="number"?(t.rotation-=t.lastRotNoise,t.rotation+=it[t.generatorIndex[3]].noise2D(0,t.age*i)*Math.PI*s*n):(t.lastRotNoise.invert(),t.rotation.multiply(t.lastRotNoise),Ze.set(it[t.generatorIndex[0]].noise2D(0,t.age*i)*s*n,it[t.generatorIndex[1]].noise2D(0,t.age*i)*s*n,it[t.generatorIndex[2]].noise2D(0,t.age*i)*s*n,it[t.generatorIndex[3]].noise2D(0,t.age*i)*s*n).normalize(),t.rotation.multiply(Ze),t.lastRotNoise.copy(Ze)))}toJSON(){return{type:this.type,frequency:this.frequency.toJSON(),power:this.power.toJSON(),positionAmount:this.positionAmount.toJSON(),rotationAmount:this.rotationAmount.toJSON()}}frameUpdate(t){this.duration+=t}static fromJSON(t){return new le(N(t.frequency),N(t.power),N(t.positionAmount),N(t.rotationAmount))}clone(){return new le(this.frequency.clone(),this.power.clone(),this.positionAmount.clone(),this.rotationAmount.clone())}reset(){}}class ce{constructor(t,e){this.color=t,this.speedRange=e,this.type="ColorBySpeed"}initialize(t){this.color.startGen(t.memory)}update(t,e){const i=(t.startSpeed-this.speedRange.a)/(this.speedRange.b-this.speedRange.a);this.color.genColor(t.memory,t.color,i),t.color.x*=t.startColor.x,t.color.y*=t.startColor.y,t.color.z*=t.startColor.z,t.color.w*=t.startColor.w}frameUpdate(t){}toJSON(){return{type:this.type,color:this.color.toJSON(),speedRange:this.speedRange.toJSON()}}static fromJSON(t){return new ce(ei(t.color),xt.fromJSON(t.speedRange))}clone(){return new ce(this.color.clone(),this.speedRange.clone())}reset(){}}class ue{initialize(t){this.size.startGen(t.memory)}constructor(t,e){this.size=t,this.speedRange=e,this.type="SizeBySpeed"}update(t){const e=(t.startSpeed-this.speedRange.a)/(this.speedRange.b-this.speedRange.a);this.size instanceof vt?this.size.genValue(t.memory,t.size,e).multiply(t.startSize):t.size.copy(t.startSize).multiplyScalar(this.size.genValue(t.memory,e))}toJSON(){return{type:this.type,size:this.size.toJSON(),speedRange:this.speedRange.toJSON()}}static fromJSON(t){return new ue(ze(t.size),xt.fromJSON(t.speedRange))}frameUpdate(t){}clone(){return new ue(this.size.clone(),this.speedRange.clone())}reset(){}}class de{constructor(t,e){this.angularVelocity=t,this.speedRange=e,this.type="RotationBySpeed",this.tempQuat=new E}initialize(t){typeof t.rotation=="number"&&this.angularVelocity.startGen(t.memory)}update(t,e){if(typeof t.rotation=="number"){const i=(t.startSpeed-this.speedRange.a)/(this.speedRange.b-this.speedRange.a);t.rotation+=e*this.angularVelocity.genValue(t.memory,i)}}toJSON(){return{type:this.type,angularVelocity:this.angularVelocity.toJSON(),speedRange:this.speedRange.toJSON()}}static fromJSON(t){return new de(N(t.angularVelocity),xt.fromJSON(t.speedRange))}frameUpdate(t){}clone(){return new de(this.angularVelocity.clone(),this.speedRange.clone())}reset(){}}class me{initialize(t){this.speed.startGen(t.memory)}constructor(t,e){this.speed=t,this.dampen=e,this.type="LimitSpeedOverLife"}update(t,e){let i=t.velocity.length(),s=this.speed.genValue(t.memory,t.age/t.life);if(i>s){const r=(i-s)/i;t.velocity.multiplyScalar(1-r*this.dampen*e*20)}}toJSON(){return{type:this.type,speed:this.speed.toJSON(),dampen:this.dampen}}static fromJSON(t){return new me(N(t.speed),t.dampen)}frameUpdate(t){}clone(){return new me(this.speed.clone(),this.dampen)}reset(){}}const be={ApplyForce:{type:"ApplyForce",constructor:re,params:[["direction",["vec3"]],["magnitude",["value"]]],loadJSON:re.fromJSON},Noise:{type:"Noise",constructor:le,params:[["frequency",["value"]],["power",["value"]],["positionAmount",["value"]],["rotationAmount",["value"]]],loadJSON:le.fromJSON},TurbulenceField:{type:"TurbulenceField",constructor:he,params:[["scale",["vec3"]],["octaves",["number"]],["velocityMultiplier",["vec3"]],["timeScale",["vec3"]]],loadJSON:he.fromJSON},GravityForce:{type:"GravityForce",constructor:ne,params:[["center",["vec3"]],["magnitude",["number"]]],loadJSON:ne.fromJSON},ColorOverLife:{type:"ColorOverLife",constructor:Wt,params:[["color",["colorFunc"]]],loadJSON:Wt.fromJSON},RotationOverLife:{type:"RotationOverLife",constructor:Qt,params:[["angularVelocity",["value","valueFunc"]]],loadJSON:Qt.fromJSON},Rotation3DOverLife:{type:"Rotation3DOverLife",constructor:Kt,params:[["angularVelocity",["rotationFunc"]]],loadJSON:Kt.fromJSON},SizeOverLife:{type:"SizeOverLife",constructor:jt,params:[["size",["value","valueFunc","vec3Func"]]],loadJSON:jt.fromJSON},ColorBySpeed:{type:"ColorBySpeed",constructor:ce,params:[["color",["colorFunc"]],["speedRange",["range"]]],loadJSON:ce.fromJSON},RotationBySpeed:{type:"RotationBySpeed",constructor:de,params:[["angularVelocity",["value","valueFunc"]],["speedRange",["range"]]],loadJSON:de.fromJSON},SizeBySpeed:{type:"SizeBySpeed",constructor:ue,params:[["size",["value","valueFunc","vec3Func"]],["speedRange",["range"]]],loadJSON:ue.fromJSON},SpeedOverLife:{type:"SpeedOverLife",constructor:te,params:[["speed",["value","valueFunc"]]],loadJSON:te.fromJSON},FrameOverLife:{type:"FrameOverLife",constructor:ee,params:[["frame",["value","valueFunc"]]],loadJSON:ee.fromJSON},ForceOverLife:{type:"ForceOverLife",constructor:$t,params:[["x",["value","valueFunc"]],["y",["value","valueFunc"]],["z",["value","valueFunc"]]],loadJSON:$t.fromJSON},OrbitOverLife:{type:"OrbitOverLife",constructor:ie,params:[["orbitSpeed",["value","valueFunc"]],["axis",["vec3"]]],loadJSON:ie.fromJSON},WidthOverLength:{type:"WidthOverLength",constructor:se,params:[["width",["value","valueFunc"]]],loadJSON:se.fromJSON},ChangeEmitDirection:{type:"ChangeEmitDirection",constructor:ae,params:[["angle",["value"]]],loadJSON:ae.fromJSON},EmitSubParticleSystem:{type:"EmitSubParticleSystem",constructor:oe,params:[["particleSystem",["self"]],["useVelocityAsBasis",["boolean"]],["subParticleSystem",["particleSystem"]],["mode",["number"]],["emitProbability",["number"]]],loadJSON:oe.fromJSON},LimitSpeedOverLife:{type:"LimitSpeedOverLife",constructor:me,params:[["speed",["value","valueFunc"]],["dampen",["number"]]],loadJSON:me.fromJSON}};function ms(c,t){return be[c.type]?be[c.type].loadJSON(c,t):null}const fs=[];function ps(c){if(!fs.find(e=>e.id===c.id)){for(const e of c.emitterShapes)Ke[e.type]||(Ke[e.type]=e);for(const e of c.behaviors)be[e.type]||(be[e.type]=e)}}var ys=`
#ifdef SOFT_PARTICLES

    /* #ifdef LOGDEPTH
    float distSample = linearize_depth_log(sampleDepth, near, far);
    #else
    float distSample = ortho ? linearize_depth_ortho(sampleDepth, near, far) : linearize_depth(sampleDepth, near, far);
    #endif */

    vec2 p2 = projPosition.xy / projPosition.w;
    
    p2 = 0.5 * p2 + 0.5;

    float readDepth = texture2D(depthTexture, p2.xy).r;
    float viewDepth = linearize_depth(readDepth);

    float softParticlesFade = saturate(SOFT_INV_FADE_DISTANCE * ((viewDepth - SOFT_NEAR_FADE) - linearDepth));
    
    gl_FragColor *= softParticlesFade;

    //gl_FragColor = vec4(softParticlesFade , 0, 0, 1);
#endif
`,gs=`
#ifdef SOFT_PARTICLES

    uniform sampler2D depthTexture;
    uniform vec4 projParams;
    uniform vec2 softParams;

    varying vec4 projPosition;
    varying float linearDepth;

    #define SOFT_NEAR_FADE softParams.x
    #define SOFT_INV_FADE_DISTANCE softParams.y

    #define zNear projParams.x
    #define zFar projParams.y

    float linearize_depth(float d)
    {
        return (zFar * zNear) / (zFar - d * (zFar - zNear));
    }

#endif
`,xs=`
#ifdef SOFT_PARTICLES
    varying vec4 projPosition;
    varying float linearDepth;
#endif
`,vs=`
#ifdef SOFT_PARTICLES
    projPosition = gl_Position;
    linearDepth = -mvPosition.z;
#endif
`,_s=`
#ifdef USE_MAP
    vec4 texelColor = texture2D( map, vUv);
    #ifdef TILE_BLEND
        texelColor = mix( texelColor, texture2D( map, vUvNext ), vUvBlend );
    #endif
    diffuseColor *= texelColor;
#endif
`,Ms=`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;
#ifdef TILE_BLEND
    varying vec2 vUvNext;
    varying float vUvBlend;
#endif

#endif
#ifdef USE_MAP

	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#ifdef TILE_BLEND
    varying vec2 vMapUvNext;
#endif

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

#endif
`,Ss=`
#ifdef UV_TILE
    attribute float uvTile;
    uniform vec2 tileCount;
    
    mat3 makeTileTransform(float uvTile) {
        float col = mod(uvTile, tileCount.x);
        float row = (tileCount.y - floor(uvTile / tileCount.x) - 1.0);
        
        return mat3(
          1.0 / tileCount.x, 0.0, 0.0,
          0.0, 1.0 / tileCount.y, 0.0, 
          col / tileCount.x, row / tileCount.y, 1.0);
    }
#else
    mat3 makeTileTransform(float uvTile) {
        return mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
    }
#endif

#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;
#ifdef TILE_BLEND
    varying vec2 vUvNext;
    varying float vUvBlend;
#endif

#endif
#ifdef USE_MAP

	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#ifdef TILE_BLEND
    varying vec2 vMapUvNext;
#endif

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

#endif
`,ws=`
#ifdef UV_TILE
    mat3 tileTransform = makeTileTransform(floor(uvTile));
    #ifdef TILE_BLEND
        mat3 nextTileTransform = makeTileTransform(ceil(uvTile));
        vUvBlend = fract(uvTile);
    #endif
#else
    mat3 tileTransform = makeTileTransform(0.0);
#endif

#if defined( USE_UV ) || defined( USE_ANISOTROPY )

vUv = (tileTransform *vec3( uv, 1 )).xy;
#if defined( TILE_BLEND ) && defined( UV_TILE )
    vUvNext = (nextTileTransform *vec3( uv, 1 )).xy;
#endif

#endif
#ifdef USE_MAP

vMapUv = ( tileTransform * (mapTransform * vec3( MAP_UV, 1 ) )).xy;
#if defined( TILE_BLEND ) && defined( UV_TILE )
    vMapUvNext = (nextTileTransform * (mapTransform * vec3( MAP_UV, 1 ))).xy;
#endif

#endif
#ifdef USE_ALPHAMAP

vAlphaMapUv = ( tileTransform * (alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) )).xy;
    
#endif
#ifdef USE_LIGHTMAP

vLightMapUv = ( tileTransform * (lightMapTransform * vec3( LIGHTMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_AOMAP

vAoMapUv = ( tileTransform * (aoMapTransform * vec3( AOMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_BUMPMAP

vBumpMapUv = ( tileTransform * (bumpMapTransform * vec3( BUMPMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_NORMALMAP

vNormalMapUv = ( tileTransform * (normalMapTransform * vec3( NORMALMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_DISPLACEMENTMAP

vDisplacementMapUv = ( tileTransform * (displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_EMISSIVEMAP

vEmissiveMapUv = ( tileTransform * (emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_METALNESSMAP

vMetalnessMapUv = ( tileTransform * (metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_ROUGHNESSMAP

vRoughnessMapUv = ( tileTransform * (roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_ANISOTROPYMAP

vAnisotropyMapUv = ( tileTransform * (anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_CLEARCOATMAP

vClearcoatMapUv = ( tileTransform * (clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

vClearcoatNormalMapUv = ( tileTransform * (clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

vClearcoatRoughnessMapUv = ( tileTransform * (clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_IRIDESCENCEMAP

vIridescenceMapUv = ( tileTransform * (iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

vIridescenceThicknessMapUv = ( tileTransform * (iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SHEEN_COLORMAP

vSheenColorMapUv = ( tileTransform * (sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

vSheenRoughnessMapUv = ( tileTransform * (sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SPECULARMAP

vSpecularMapUv = ( tileTransform * (specularMapTransform * vec3( SPECULARMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SPECULAR_COLORMAP

vSpecularColorMapUv = ( tileTransform * (specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

vSpecularIntensityMapUv = ( tileTransform * (specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_TRANSMISSIONMAP

vTransmissionMapUv = ( tileTransform * transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_THICKNESSMAP

vThicknessMapUv = ( tileTransform * thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) )).xy;

#endif

`;const dt=Ai;function zs(){dt.tile_pars_vertex=Ss,dt.tile_vertex=ws,dt.tile_pars_fragment=Ms,dt.tile_fragment=_s,dt.soft_pars_vertex=xs,dt.soft_vertex=vs,dt.soft_pars_fragment=gs,dt.soft_fragment=ys}class bs extends fi{constructor(t){super(),this.type="ParticleEmitter",this.system=t}clone(){const t=this.system.clone();return t.emitter.copy(this,!0),t.emitter}dispose(){}extractFromCache(t){const e=[];for(const i in t){const s=t[i];delete s.metadata,e.push(s)}return e}toJSON(t,e={}){const i=this.children;this.children=this.children.filter(r=>r.type!=="ParticleSystemPreview");const s=super.toJSON(t);return this.children=i,this.system!==null&&(s.object.ps=this.system.toJSON(t,e)),s}}var v;(function(c){c[c.BillBoard=0]="BillBoard",c[c.StretchedBillBoard=1]="StretchedBillBoard",c[c.Mesh=2]="Mesh",c[c.Trail=3]="Trail",c[c.HorizontalBillBoard=4]="HorizontalBillBoard",c[c.VerticalBillBoard=5]="VerticalBillBoard"})(v||(v={}));class wi extends Ti{constructor(t){super(),this.type="VFXBatch",this.maxParticles=1e3,this.systems=new Set;const e=new _e;e.mask=t.layers.mask;const i=t.material.clone();i.defines={},Object.assign(i.defines,t.material.defines),this.settings={instancingGeometry:t.instancingGeometry,renderMode:t.renderMode,renderOrder:t.renderOrder,material:i,uTileCount:t.uTileCount,vTileCount:t.vTileCount,blendTiles:t.blendTiles,softParticles:t.softParticles,softNearFade:t.softNearFade,softFarFade:t.softFarFade,layers:e},this.frustumCulled=!1,this.renderOrder=this.settings.renderOrder}addSystem(t){this.systems.add(t)}removeSystem(t){this.systems.delete(t)}applyDepthTexture(t){const e=this.material.uniforms.depthTexture;e&&e.value!==t&&(e.value=t,this.material.needsUpdate=!0)}}const Ts=new S(0,0,1),He=new E,Ns=new S,Os=new S;new S;const mi=60,As=new pi(1,1,1,1);let ks=class je{set time(t){this.emissionState.time=t}get time(){return this.emissionState.time}get layers(){return this.rendererSettings.layers}get texture(){return this.rendererSettings.material.map}set texture(t){this.rendererSettings.material.map=t,this.neededToUpdateRender=!0}get material(){return this.rendererSettings.material}set material(t){this.rendererSettings.material=t,this.neededToUpdateRender=!0}get uTileCount(){return this.rendererSettings.uTileCount}set uTileCount(t){this.rendererSettings.uTileCount=t,this.neededToUpdateRender=!0}get vTileCount(){return this.rendererSettings.vTileCount}set vTileCount(t){this.rendererSettings.vTileCount=t,this.neededToUpdateRender=!0}get blendTiles(){return this.rendererSettings.blendTiles}set blendTiles(t){this.rendererSettings.blendTiles=t,this.neededToUpdateRender=!0}get softParticles(){return this.rendererSettings.softParticles}set softParticles(t){this.rendererSettings.softParticles=t,this.neededToUpdateRender=!0}get softNearFade(){return this.rendererSettings.softNearFade}set softNearFade(t){this.rendererSettings.softNearFade=t,this.neededToUpdateRender=!0}get softFarFade(){return this.rendererSettings.softFarFade}set softFarFade(t){this.rendererSettings.softFarFade=t,this.neededToUpdateRender=!0}get instancingGeometry(){return this.rendererSettings.instancingGeometry}set instancingGeometry(t){this.restart(),this.particles.length=0,this.rendererSettings.instancingGeometry=t,this.neededToUpdateRender=!0}get renderMode(){return this.rendererSettings.renderMode}set renderMode(t){if((this.rendererSettings.renderMode!=v.Trail&&t===v.Trail||this.rendererSettings.renderMode==v.Trail&&t!==v.Trail)&&(this.restart(),this.particles.length=0),this.rendererSettings.renderMode!==t)switch(t){case v.Trail:this.rendererEmitterSettings={startLength:new P(30),followLocalOrigin:!1};break;case v.Mesh:this.rendererEmitterSettings={geometry:new pi(1,1)},this.startRotation=new Dt(new S(0,1,0),new P(0));break;case v.StretchedBillBoard:this.rendererEmitterSettings={speedFactor:0,lengthFactor:2},this.rendererSettings.renderMode===v.Mesh&&(this.startRotation=new P(0));break;case v.BillBoard:case v.VerticalBillBoard:case v.HorizontalBillBoard:this.rendererEmitterSettings={},this.rendererSettings.renderMode===v.Mesh&&(this.startRotation=new P(0));break}this.rendererSettings.renderMode=t,this.neededToUpdateRender=!0}get renderOrder(){return this.rendererSettings.renderOrder}set renderOrder(t){this.rendererSettings.renderOrder=t,this.neededToUpdateRender=!0}get blending(){return this.rendererSettings.material.blending}set blending(t){this.rendererSettings.material.blending=t,this.neededToUpdateRender=!0}constructor(t){var e,i,s,r,n,o,a,l,h,u,m,d,f,p,x,g,b,z,w,y,M,_,T,O,A,U;if(this.temp=new S,this.travelDistance=0,this.normalMatrix=new rt,this.memory=[],this.listeners={},this.firstTimeUpdate=!0,this.autoDestroy=t.autoDestroy===void 0?!1:t.autoDestroy,this.duration=(e=t.duration)!==null&&e!==void 0?e:1,this.looping=t.looping===void 0?!0:t.looping,this.prewarm=t.prewarm===void 0?!1:t.prewarm,this.startLife=(i=t.startLife)!==null&&i!==void 0?i:new P(5),this.startSpeed=(s=t.startSpeed)!==null&&s!==void 0?s:new P(0),this.startRotation=(r=t.startRotation)!==null&&r!==void 0?r:new P(0),this.startSize=(n=t.startSize)!==null&&n!==void 0?n:new P(1),this.startColor=(o=t.startColor)!==null&&o!==void 0?o:new zt(new G(1,1,1,1)),this.emissionOverTime=(a=t.emissionOverTime)!==null&&a!==void 0?a:new P(10),this.emissionOverDistance=(l=t.emissionOverDistance)!==null&&l!==void 0?l:new P(0),this.emissionBursts=(h=t.emissionBursts)!==null&&h!==void 0?h:[],this.onlyUsedByOther=(u=t.onlyUsedByOther)!==null&&u!==void 0?u:!1,this.emitterShape=(m=t.shape)!==null&&m!==void 0?m:new bt,this.behaviors=(d=t.behaviors)!==null&&d!==void 0?d:new Array,this.worldSpace=(f=t.worldSpace)!==null&&f!==void 0?f:!1,this.rendererEmitterSettings=(p=t.rendererEmitterSettings)!==null&&p!==void 0?p:{},t.renderMode===v.StretchedBillBoard){const B=this.rendererEmitterSettings;t.speedFactor!==void 0&&(B.speedFactor=t.speedFactor),B.speedFactor=(x=B.speedFactor)!==null&&x!==void 0?x:0,B.lengthFactor=(g=B.lengthFactor)!==null&&g!==void 0?g:0}this.rendererSettings={instancingGeometry:(b=t.instancingGeometry)!==null&&b!==void 0?b:As,renderMode:(z=t.renderMode)!==null&&z!==void 0?z:v.BillBoard,renderOrder:(w=t.renderOrder)!==null&&w!==void 0?w:0,material:t.material,uTileCount:(y=t.uTileCount)!==null&&y!==void 0?y:1,vTileCount:(M=t.vTileCount)!==null&&M!==void 0?M:1,blendTiles:(_=t.blendTiles)!==null&&_!==void 0?_:!1,softParticles:(T=t.softParticles)!==null&&T!==void 0?T:!1,softNearFade:(O=t.softNearFade)!==null&&O!==void 0?O:0,softFarFade:(A=t.softFarFade)!==null&&A!==void 0?A:0,layers:(U=t.layers)!==null&&U!==void 0?U:new _e},this.neededToUpdateRender=!0,this.particles=new Array,this.startTileIndex=t.startTileIndex||new P(0),this.emitter=new bs(this),this.paused=!1,this.particleNum=0,this.emissionState={isBursting:!1,burstParticleIndex:0,burstParticleCount:0,burstIndex:0,burstWaveIndex:0,time:0,waitEmiting:0,travelDistance:0},this.emissionBursts.forEach(B=>B.count.startGen(this.memory)),this.emissionOverDistance.startGen(this.memory),this.emitEnded=!1,this.markForDestroy=!1,this.prewarmed=!1}pause(){this.paused=!0}play(){this.paused=!1}stop(){this.restart(),this.pause()}spawn(t,e,i){He.setFromRotationMatrix(i);const s=Ns,r=He,n=Os;i.decompose(s,r,n);for(let o=0;o<t;o++){for(e.burstParticleIndex=o,this.particleNum++;this.particles.length<this.particleNum;)this.rendererSettings.renderMode===v.Trail?this.particles.push(new $e):this.particles.push(new ns);const a=this.particles[this.particleNum-1];if(a.reset(),a.speedModifier=1,this.startColor.startGen(a.memory),this.startColor.genColor(a.memory,a.startColor,this.emissionState.time),a.color.copy(a.startColor),this.startSpeed.startGen(a.memory),a.startSpeed=this.startSpeed.genValue(a.memory,e.time/this.duration),this.startLife.startGen(a.memory),a.life=this.startLife.genValue(a.memory,e.time/this.duration),a.age=0,this.startSize.startGen(a.memory),this.startSize.type==="vec3function")this.startSize.genValue(a.memory,a.startSize,e.time/this.duration);else{const l=this.startSize.genValue(a.memory,e.time/this.duration);a.startSize.set(l,l,l)}if(this.startTileIndex.startGen(a.memory),a.uvTile=this.startTileIndex.genValue(a.memory),a.size.copy(a.startSize),this.rendererSettings.renderMode===v.Mesh||this.rendererSettings.renderMode===v.BillBoard||this.rendererSettings.renderMode===v.VerticalBillBoard||this.rendererSettings.renderMode===v.HorizontalBillBoard||this.rendererSettings.renderMode===v.StretchedBillBoard){const l=a;this.startRotation.startGen(a.memory),this.rendererSettings.renderMode===v.Mesh?(l.rotation instanceof E||(l.rotation=new E),this.startRotation.type==="rotation"?this.startRotation.genValue(a.memory,l.rotation,1,e.time/this.duration):l.rotation.setFromAxisAngle(Ts,this.startRotation.genValue(l.memory,e.time/this.duration))):this.startRotation.type==="rotation"?l.rotation=0:l.rotation=this.startRotation.genValue(l.memory,e.time/this.duration)}else if(this.rendererSettings.renderMode===v.Trail){const l=a;this.rendererEmitterSettings.startLength.startGen(l.memory),l.length=this.rendererEmitterSettings.startLength.genValue(l.memory,e.time/this.duration)}if(this.emitterShape.initialize(a,e),this.rendererSettings.renderMode===v.Trail&&this.rendererEmitterSettings.followLocalOrigin){const l=a;l.localPosition=new S().copy(l.position)}this.worldSpace?(a.position.applyMatrix4(i),a.startSize.multiply(n).abs(),a.size.copy(a.startSize),a.velocity.multiply(n).applyMatrix3(this.normalMatrix),a.rotation&&a.rotation instanceof E&&a.rotation.multiplyQuaternions(He,a.rotation)):this.onlyUsedByOther&&(a.parentMatrix=i);for(let l=0;l<this.behaviors.length;l++)this.behaviors[l].initialize(a,this)}}endEmit(){this.emitEnded=!0,this.autoDestroy&&(this.markForDestroy=!0),this.fire({type:"emitEnd",particleSystem:this})}dispose(){this._renderer&&this._renderer.deleteSystem(this),this.emitter.dispose(),this.emitter.parent&&this.emitter.parent.remove(this.emitter),this.fire({type:"destroy",particleSystem:this})}restart(){this.memory.length=0,this.paused=!1,this.particleNum=0,this.emissionState.isBursting=!1,this.emissionState.burstIndex=0,this.emissionState.burstWaveIndex=0,this.emissionState.time=0,this.emissionState.waitEmiting=0,this.behaviors.forEach(t=>{t.reset()}),this.emitEnded=!1,this.markForDestroy=!1,this.prewarmed=!1,this.emissionBursts.forEach(t=>t.count.startGen(this.memory)),this.emissionOverDistance.startGen(this.memory)}update(t){if(this.paused)return;let e=this.emitter;for(;e.parent;)e=e.parent;if(e.type!=="Scene"){this.dispose();return}if(this.firstTimeUpdate&&(this.firstTimeUpdate=!1,this.emitter.updateWorldMatrix(!0,!1)),this.emitEnded&&this.particleNum===0){this.markForDestroy&&this.emitter.parent&&this.dispose();return}if(this.looping&&this.prewarm&&!this.prewarmed){this.prewarmed=!0;for(let i=0;i<this.duration*mi;i++)this.update(1/mi)}t>.1&&(t=.1),this.neededToUpdateRender&&(this._renderer&&this._renderer.updateSystem(this),this.neededToUpdateRender=!1),this.onlyUsedByOther||this.emit(t,this.emissionState,this.emitter.matrixWorld),this.emitterShape.update(this,t);for(let i=0;i<this.behaviors.length;i++){this.behaviors[i].frameUpdate(t);for(let s=0;s<this.particleNum;s++)this.particles[s].died||this.behaviors[i].update(this.particles[s],t)}for(let i=0;i<this.particleNum;i++)this.rendererEmitterSettings.followLocalOrigin&&this.particles[i].localPosition?(this.particles[i].position.copy(this.particles[i].localPosition),this.particles[i].parentMatrix?this.particles[i].position.applyMatrix4(this.particles[i].parentMatrix):this.particles[i].position.applyMatrix4(this.emitter.matrixWorld)):this.particles[i].position.addScaledVector(this.particles[i].velocity,t*this.particles[i].speedModifier),this.particles[i].age+=t;if(this.rendererSettings.renderMode===v.Trail)for(let i=0;i<this.particleNum;i++)this.particles[i].update();for(let i=0;i<this.particleNum;i++){const s=this.particles[i];s.died&&(!(s instanceof $e)||s.previous.length===0)&&(this.particles[i]=this.particles[this.particleNum-1],this.particles[this.particleNum-1]=s,this.particleNum--,i--,this.fire({type:"particleDied",particleSystem:this,particle:s}))}}emit(t,e,i){e.time>this.duration&&(this.looping?(e.time-=this.duration,e.burstIndex=0,this.behaviors.forEach(r=>{r.reset()})):!this.emitEnded&&!this.onlyUsedByOther&&this.endEmit()),this.normalMatrix.getNormalMatrix(i);const s=Math.ceil(e.waitEmiting);for(this.spawn(s,e,i),e.waitEmiting-=s;e.burstIndex<this.emissionBursts.length&&this.emissionBursts[e.burstIndex].time<=e.time;){if(Math.random()<this.emissionBursts[e.burstIndex].probability){const r=this.emissionBursts[e.burstIndex].count.genValue(this.memory,this.time);e.isBursting=!0,e.burstParticleCount=r,this.spawn(r,e,i),e.isBursting=!1}e.burstIndex++}if(!this.emitEnded&&(e.waitEmiting+=t*this.emissionOverTime.genValue(this.memory,e.time/this.duration),e.previousWorldPos!=null)){this.temp.set(i.elements[12],i.elements[13],i.elements[14]),e.travelDistance+=e.previousWorldPos.distanceTo(this.temp);const r=this.emissionOverDistance.genValue(this.memory,e.time/this.duration);if(e.travelDistance*r>0){const n=Math.floor(e.travelDistance*r);e.travelDistance-=n/r,e.waitEmiting+=n}}e.previousWorldPos===void 0&&(e.previousWorldPos=new S),e.previousWorldPos.set(i.elements[12],i.elements[13],i.elements[14]),e.time+=t}toJSON(t,e={}){var i;if((t===void 0||typeof t=="string")&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}}),t.materials[this.rendererSettings.material.uuid]=this.rendererSettings.material.toJSON(t),e.useUrlForImage&&((i=this.texture)===null||i===void 0?void 0:i.source)!==void 0){const o=this.texture.source;t.images[o.uuid]={uuid:o.uuid,url:this.texture.image.url}}let r;this.renderMode===v.Trail?r={startLength:this.rendererEmitterSettings.startLength.toJSON(),followLocalOrigin:this.rendererEmitterSettings.followLocalOrigin}:this.renderMode===v.Mesh?r={}:this.renderMode===v.StretchedBillBoard?r={speedFactor:this.rendererEmitterSettings.speedFactor,lengthFactor:this.rendererEmitterSettings.lengthFactor}:r={};const n=this.rendererSettings.instancingGeometry;return t.geometries&&!t.geometries[n.uuid]&&(t.geometries[n.uuid]=n.toJSON()),{version:"3.0",autoDestroy:this.autoDestroy,looping:this.looping,prewarm:this.prewarm,duration:this.duration,shape:this.emitterShape.toJSON(),startLife:this.startLife.toJSON(),startSpeed:this.startSpeed.toJSON(),startRotation:this.startRotation.toJSON(),startSize:this.startSize.toJSON(),startColor:this.startColor.toJSON(),emissionOverTime:this.emissionOverTime.toJSON(),emissionOverDistance:this.emissionOverDistance.toJSON(),emissionBursts:this.emissionBursts.map(o=>({time:o.time,count:o.count.toJSON(),probability:o.probability,interval:o.interval,cycle:o.cycle})),onlyUsedByOther:this.onlyUsedByOther,instancingGeometry:this.rendererSettings.instancingGeometry.uuid,renderOrder:this.renderOrder,renderMode:this.renderMode,rendererEmitterSettings:r,material:this.rendererSettings.material.uuid,layers:this.layers.mask,startTileIndex:this.startTileIndex.toJSON(),uTileCount:this.uTileCount,vTileCount:this.vTileCount,blendTiles:this.blendTiles,softParticles:this.rendererSettings.softParticles,softFarFade:this.rendererSettings.softFarFade,softNearFade:this.rendererSettings.softNearFade,behaviors:this.behaviors.map(o=>o.toJSON()),worldSpace:this.worldSpace}}static fromJSON(t,e,i){var s,r;const n=ss(t.shape,e);let o;if(t.renderMode===v.Trail){const h=t.rendererEmitterSettings;o={startLength:h.startLength!=null?N(h.startLength):new P(30),followLocalOrigin:h.followLocalOrigin}}else t.renderMode===v.Mesh?o={}:t.renderMode===v.StretchedBillBoard?(o=t.rendererEmitterSettings,t.speedFactor!=null&&(o.speedFactor=t.speedFactor)):o={};const a=new _e;t.layers&&(a.mask=t.layers);const l=new je({autoDestroy:t.autoDestroy,looping:t.looping,prewarm:t.prewarm,duration:t.duration,shape:n,startLife:N(t.startLife),startSpeed:N(t.startSpeed),startRotation:ze(t.startRotation),startSize:ze(t.startSize),startColor:ei(t.startColor),emissionOverTime:N(t.emissionOverTime),emissionOverDistance:N(t.emissionOverDistance),emissionBursts:(s=t.emissionBursts)===null||s===void 0?void 0:s.map(h=>{var u,m,d;return{time:h.time,count:typeof h.count=="number"?new P(h.count):N(h.count),probability:(u=h.probability)!==null&&u!==void 0?u:1,interval:(m=h.interval)!==null&&m!==void 0?m:.1,cycle:(d=h.cycle)!==null&&d!==void 0?d:1}}),onlyUsedByOther:t.onlyUsedByOther,instancingGeometry:e.geometries[t.instancingGeometry],renderMode:t.renderMode,rendererEmitterSettings:o,renderOrder:t.renderOrder,layers:a,material:t.material?e.materials[t.material]:t.texture?new ni({map:e.textures[t.texture],transparent:(r=t.transparent)!==null&&r!==void 0?r:!0,blending:t.blending,side:ai}):new ni({color:16777215,transparent:!0,blending:yi,side:ai}),startTileIndex:typeof t.startTileIndex=="number"?new P(t.startTileIndex):N(t.startTileIndex),uTileCount:t.uTileCount,vTileCount:t.vTileCount,blendTiles:t.blendTiles,softParticles:t.softParticles,softFarFade:t.softFarFade,softNearFade:t.softNearFade,behaviors:[],worldSpace:t.worldSpace});return l.behaviors=t.behaviors.map(h=>{const u=ms(h,l);return u.type==="EmitSubParticleSystem"&&(i[h.subParticleSystem]=u),u}),l}addBehavior(t){this.behaviors.push(t)}getRendererSettings(){return this.rendererSettings}addEventListener(t,e){this.listeners[t]||(this.listeners[t]=[]),this.listeners[t].push(e)}removeAllEventListeners(t){this.listeners[t]&&(this.listeners[t]=[])}removeEventListener(t,e){if(this.listeners[t]){const i=this.listeners[t].indexOf(e);i!==-1&&this.listeners[t].splice(i,1)}}fire(t){this.listeners[t.type]&&this.listeners[t.type].forEach(e=>e(t))}clone(){const t=[];for(const r of this.emissionBursts){const n={};Object.assign(n,r),t.push(n)}const e=[];for(const r of this.behaviors)e.push(r.clone());let i;this.renderMode===v.Trail?i={startLength:this.rendererEmitterSettings.startLength.clone(),followLocalOrigin:this.rendererEmitterSettings.followLocalOrigin}:this.renderMode===v.StretchedBillBoard?i={lengthFactor:this.rendererEmitterSettings.lengthFactor,speedFactor:this.rendererEmitterSettings.speedFactor}:i={};const s=new _e;return s.mask=this.layers.mask,new je({autoDestroy:this.autoDestroy,looping:this.looping,duration:this.duration,shape:this.emitterShape.clone(),startLife:this.startLife.clone(),startSpeed:this.startSpeed.clone(),startRotation:this.startRotation.clone(),startSize:this.startSize.clone(),startColor:this.startColor.clone(),emissionOverTime:this.emissionOverTime.clone(),emissionOverDistance:this.emissionOverDistance.clone(),emissionBursts:t,onlyUsedByOther:this.onlyUsedByOther,instancingGeometry:this.rendererSettings.instancingGeometry,renderMode:this.renderMode,renderOrder:this.renderOrder,rendererEmitterSettings:i,material:this.rendererSettings.material,startTileIndex:this.startTileIndex,uTileCount:this.uTileCount,vTileCount:this.vTileCount,blendTiles:this.blendTiles,softParticles:this.softParticles,softFarFade:this.softFarFade,softNearFade:this.softNearFade,behaviors:e,worldSpace:this.worldSpace,layers:s})}};var We=`

#include <common>
#include <color_pars_fragment>
#include <map_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <alphatest_pars_fragment>

#include <tile_pars_fragment>
#include <soft_pars_fragment>

void main() {

    #include <clipping_planes_fragment>
    
    vec3 outgoingLight = vec3( 0.0 );
    vec4 diffuseColor = vColor;
    
    #include <logdepthbuf_fragment>
    
    #include <tile_fragment>
    #include <alphatest_fragment>

    outgoingLight = diffuseColor.rgb;
    
    #ifdef USE_COLOR_AS_ALPHA
    gl_FragColor = vec4( outgoingLight, diffuseColor.r );
    #else
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
    #endif
    
    #include <soft_fragment>
    #include <tonemapping_fragment>
}
`,ii=`
#define STANDARD

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
#include <packing>
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

// accumulation
#include <lights_physical_fragment>
#include <lights_fragment_begin>
#include <lights_fragment_maps>
#include <lights_fragment_end>

// modulation
#include <aomap_fragment>

vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

#include <transmission_fragment>

vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

#ifdef USE_SHEEN

// Sheen energy compensation approximation calculation can be found at the end of
// https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );

outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;

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
}`,Ps=`
#include <common>
#include <color_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#include <tile_pars_vertex>
#include <soft_pars_vertex>

attribute vec3 offset;
attribute float rotation;
attribute vec3 size;

void main() {
	
    vec2 alignedPosition = position.xy * size.xy;
    
    vec2 rotatedPosition;
    rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
    rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
#ifdef HORIZONTAL
    vec4 mvPosition = modelMatrix * vec4( offset, 1.0 );
    mvPosition.x += rotatedPosition.x;
    mvPosition.z -= rotatedPosition.y;
    mvPosition = viewMatrix * mvPosition;
#elif defined(VERTICAL)
    vec4 mvPosition = modelMatrix * vec4( offset, 1.0 );
    mvPosition.y += rotatedPosition.y;
    mvPosition = viewMatrix * mvPosition;
    mvPosition.x += rotatedPosition.x;
#else
    vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
    mvPosition.xy += rotatedPosition;
#endif

	vColor = color;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>

	#include <clipping_planes_vertex>

	#include <tile_vertex>
	#include <soft_vertex>
}
`,Es=`
#include <common>
#include <color_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#include <tile_pars_vertex>
#include <soft_pars_vertex>

attribute vec3 offset;
attribute vec4 rotation;
attribute vec3 size;
// attribute vec4 color;

void main() {

    float x2 = rotation.x + rotation.x, y2 = rotation.y + rotation.y, z2 = rotation.z + rotation.z;
    float xx = rotation.x * x2, xy = rotation.x * y2, xz = rotation.x * z2;
    float yy = rotation.y * y2, yz = rotation.y * z2, zz = rotation.z * z2;
    float wx = rotation.w * x2, wy = rotation.w * y2, wz = rotation.w * z2;
    float sx = size.x, sy = size.y, sz = size.z;
    
    mat4 matrix = mat4(( 1.0 - ( yy + zz ) ) * sx, ( xy + wz ) * sx, ( xz - wy ) * sx, 0.0,  // 1. column
                      ( xy - wz ) * sy, ( 1.0 - ( xx + zz ) ) * sy, ( yz + wx ) * sy, 0.0,  // 2. column
                      ( xz + wy ) * sz, ( yz - wx ) * sz, ( 1.0 - ( xx + yy ) ) * sz, 0.0,  // 3. column
                      offset.x, offset.y, offset.z, 1.0);
    
    vec4 mvPosition = modelViewMatrix * (matrix * vec4( position, 1.0 ));

	vColor = color;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
    #include <tile_vertex>
    #include <soft_vertex>
}
`,si=`
#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>

attribute vec3 offset;
attribute vec4 rotation;
attribute vec3 size;
#include <tile_pars_vertex>
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

    #include <tile_vertex>
    float x2 = rotation.x + rotation.x, y2 = rotation.y + rotation.y, z2 = rotation.z + rotation.z;
    float xx = rotation.x * x2, xy = rotation.x * y2, xz = rotation.x * z2;
    float yy = rotation.y * y2, yz = rotation.y * z2, zz = rotation.z * z2;
    float wx = rotation.w * x2, wy = rotation.w * y2, wz = rotation.w * z2;
    float sx = size.x, sy = size.y, sz = size.z;

    mat4 particleMatrix = mat4(( 1.0 - ( yy + zz ) ) * sx, ( xy + wz ) * sx, ( xz - wy ) * sx, 0.0,  // 1. column
                      ( xy - wz ) * sy, ( 1.0 - ( xx + zz ) ) * sy, ( yz + wx ) * sy, 0.0,  // 2. column
                      ( xz + wy ) * sz, ( yz - wx ) * sz, ( 1.0 - ( xx + yy ) ) * sz, 0.0,  // 3. column
                      offset.x, offset.y, offset.z, 1.0);

#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <batching_vertex>

#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>

	// replace defaultnormal_vertex
	vec3 transformedNormal = objectNormal;
    mat3 m = mat3( particleMatrix );
    transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
    transformedNormal = m * transformedNormal;
    transformedNormal = normalMatrix * transformedNormal;
    #ifdef FLIP_SIDED
        transformedNormal = - transformedNormal;
    #endif
    #ifdef USE_TANGENT
        vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
        #ifdef FLIP_SIDED
        transformedTangent = - transformedTangent;
        #endif
    #endif

	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>

	// replace include <project_vertex>
  vec4 mvPosition = vec4( transformed, 1.0 );
  mvPosition = modelViewMatrix * (particleMatrix * mvPosition);
	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	
	vViewPosition = - mvPosition.xyz;
	
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
    vWorldPosition = worldPosition.xyz;
#endif
}
`,Us=`
#include <common>
#include <color_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#include <tile_pars_vertex>
#include <soft_pars_vertex>

attribute vec3 offset;
attribute float rotation;
attribute vec3 size;
attribute vec4 velocity;

uniform float speedFactor;

void main() {
    float lengthFactor = velocity.w;
    float avgSize = (size.x + size.y) * 0.5;
#ifdef USE_SKEW
    vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
    vec3 viewVelocity = normalMatrix * velocity.xyz;

    vec3 scaledPos = vec3(position.xy * size.xy, position.z);
    float vlength = length(viewVelocity);
    vec3 projVelocity =  dot(scaledPos, viewVelocity) * viewVelocity / vlength;
    mvPosition.xyz += scaledPos + projVelocity * (speedFactor / avgSize + lengthFactor / vlength);
#else
    vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
    vec3 viewVelocity = normalMatrix * velocity.xyz;
    float vlength = length(viewVelocity); 
    mvPosition.xyz += position.y * normalize(cross(mvPosition.xyz, viewVelocity)) * avgSize; // switch the cross to  match unity implementation
    mvPosition.xyz -= (position.x + 0.5) * viewVelocity * (1.0 + lengthFactor / vlength) * avgSize; // minus position.x to match unity implementation
#endif
	vColor = color;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <tile_vertex>
	#include <soft_vertex>
}
`;function ti(c){return c===0?"uv":`uv${c}`}class Cs extends Ni{constructor(t){super(t)}onBeforeCompile(t,e){super.onBeforeCompile(t,e),t.vertexShader=si,t.fragmentShader=ii}}class Bs extends Oi{constructor(t){super(t)}onBeforeCompile(t,e){super.onBeforeCompile(t,e),t.vertexShader=si,t.fragmentShader=ii}}class Rs extends wi{constructor(t){super(t),this.vector_=new S,this.vector2_=new S,this.vector3_=new S,this.quaternion_=new E,this.quaternion2_=new E,this.quaternion3_=new E,this.rotationMat_=new rt,this.rotationMat2_=new rt,this.maxParticles=1e3,this.setupBuffers(),this.rebuildMaterial()}buildExpandableBuffers(){this.offsetBuffer=new pt(new Float32Array(this.maxParticles*3),3),this.offsetBuffer.setUsage(k),this.geometry.setAttribute("offset",this.offsetBuffer),this.colorBuffer=new pt(new Float32Array(this.maxParticles*4),4),this.colorBuffer.setUsage(k),this.geometry.setAttribute("color",this.colorBuffer),this.settings.renderMode===v.Mesh?(this.rotationBuffer=new pt(new Float32Array(this.maxParticles*4),4),this.rotationBuffer.setUsage(k),this.geometry.setAttribute("rotation",this.rotationBuffer)):(this.settings.renderMode===v.BillBoard||this.settings.renderMode===v.HorizontalBillBoard||this.settings.renderMode===v.VerticalBillBoard||this.settings.renderMode===v.StretchedBillBoard)&&(this.rotationBuffer=new pt(new Float32Array(this.maxParticles),1),this.rotationBuffer.setUsage(k),this.geometry.setAttribute("rotation",this.rotationBuffer)),this.sizeBuffer=new pt(new Float32Array(this.maxParticles*3),3),this.sizeBuffer.setUsage(k),this.geometry.setAttribute("size",this.sizeBuffer),this.uvTileBuffer=new pt(new Float32Array(this.maxParticles),1),this.uvTileBuffer.setUsage(k),this.geometry.setAttribute("uvTile",this.uvTileBuffer),this.settings.renderMode===v.StretchedBillBoard&&(this.velocityBuffer=new pt(new Float32Array(this.maxParticles*4),4),this.velocityBuffer.setUsage(k),this.geometry.setAttribute("velocity",this.velocityBuffer))}setupBuffers(){this.geometry&&this.geometry.dispose(),this.geometry=new zi,this.geometry.setIndex(this.settings.instancingGeometry.getIndex()),this.settings.instancingGeometry.hasAttribute("normal")&&this.geometry.setAttribute("normal",this.settings.instancingGeometry.getAttribute("normal")),this.geometry.setAttribute("position",this.settings.instancingGeometry.getAttribute("position")),this.geometry.setAttribute("uv",this.settings.instancingGeometry.getAttribute("uv")),this.buildExpandableBuffers()}expandBuffers(t){for(;t>=this.maxParticles;)this.maxParticles*=2;this.setupBuffers()}rebuildMaterial(){this.layers.mask=this.settings.layers.mask;const t={},e={};this.settings.material.type!=="MeshStandardMaterial"&&this.settings.material.type!=="MeshPhysicalMaterial"&&(t.map=new tt(this.settings.material.map)),this.settings.material.alphaTest&&(e.USE_ALPHATEST="",t.alphaTest=new tt(this.settings.material.alphaTest)),e.USE_UV="";const i=this.settings.uTileCount,s=this.settings.vTileCount;(i>1||s>1)&&(e.UV_TILE="",t.tileCount=new tt(new St(i,s))),this.settings.material.defines&&this.settings.material.defines.USE_COLOR_AS_ALPHA!==void 0&&(e.USE_COLOR_AS_ALPHA=""),this.settings.material.normalMap&&(e.USE_NORMALMAP="",e.NORMALMAP_UV=ti(this.settings.material.normalMap.channel),t.normalMapTransform=new tt(new rt().copy(this.settings.material.normalMap.matrix))),this.settings.material.map&&(e.USE_MAP="",this.settings.blendTiles&&(e.TILE_BLEND=""),e.MAP_UV=ti(this.settings.material.map.channel),t.mapTransform=new tt(new rt().copy(this.settings.material.map.matrix))),e.USE_COLOR_ALPHA="";let r;if(this.settings.softParticles){e.SOFT_PARTICLES="";const o=this.settings.softNearFade,a=1/(this.settings.softFarFade-this.settings.softNearFade);t.softParams=new tt(new St(o,a)),t.depthTexture=new tt(null);const l=t.projParams=new tt(new G);r=(h,u,m)=>{l.value.set(m.near,m.far,0,0)}}let n=!1;if(this.settings.renderMode===v.BillBoard||this.settings.renderMode===v.VerticalBillBoard||this.settings.renderMode===v.HorizontalBillBoard||this.settings.renderMode===v.Mesh){let o,a;this.settings.renderMode===v.Mesh?this.settings.material.type==="MeshStandardMaterial"||this.settings.material.type==="MeshPhysicalMaterial"?(e.USE_COLOR="",o=si,a=ii,n=!0):(o=Es,a=We):(o=Ps,a=We),this.settings.renderMode===v.VerticalBillBoard?e.VERTICAL="":this.settings.renderMode===v.HorizontalBillBoard&&(e.HORIZONTAL="");let l=!1;this.settings.renderMode===v.Mesh&&(this.settings.material.type==="MeshStandardMaterial"?(this.material=new Cs({}),this.material.copy(this.settings.material),this.material.uniforms=t,this.material.defines=e,l=!0):this.settings.material.type==="MeshPhysicalMaterial"&&(this.material=new Bs({}),this.material.copy(this.settings.material),this.material.uniforms=t,this.material.defines=e,l=!0)),l||(this.material=new Qe({uniforms:t,defines:e,vertexShader:o,fragmentShader:a,transparent:this.settings.material.transparent,depthWrite:!this.settings.material.transparent,blending:this.settings.material.blending,blendDst:this.settings.material.blendDst,blendSrc:this.settings.material.blendSrc,blendEquation:this.settings.material.blendEquation,premultipliedAlpha:this.settings.material.premultipliedAlpha,side:this.settings.material.side,alphaTest:this.settings.material.alphaTest,depthTest:this.settings.material.depthTest,lights:n}))}else if(this.settings.renderMode===v.StretchedBillBoard)t.speedFactor=new tt(1),this.material=new Qe({uniforms:t,defines:e,vertexShader:Us,fragmentShader:We,transparent:this.settings.material.transparent,depthWrite:!this.settings.material.transparent,blending:this.settings.material.blending,blendDst:this.settings.material.blendDst,blendSrc:this.settings.material.blendSrc,blendEquation:this.settings.material.blendEquation,premultipliedAlpha:this.settings.material.premultipliedAlpha,side:this.settings.material.side,alphaTest:this.settings.material.alphaTest,depthTest:this.settings.material.depthTest});else throw new Error("render mode unavailable");this.material&&r&&(this.material.onBeforeRender=r)}update(){let t=0,e=0;this.systems.forEach(i=>{e+=i.particleNum}),e>this.maxParticles&&this.expandBuffers(e),this.systems.forEach(i=>{i.emitter.updateMatrixWorld&&(i.emitter.updateWorldMatrix(!0,!1),i.emitter.updateMatrixWorld(!0));const s=i.particles,r=i.particleNum,n=this.quaternion2_,o=this.vector2_,a=this.vector3_;i.emitter.matrixWorld.decompose(o,n,a),this.rotationMat_.setFromMatrix4(i.emitter.matrixWorld);for(let l=0;l<r;l++,t++){const h=s[l];if(this.settings.renderMode===v.Mesh){let m;if(i.worldSpace)m=h.rotation;else{let d;h.parentMatrix?d=this.quaternion3_.setFromRotationMatrix(h.parentMatrix):d=n,m=this.quaternion_,m.copy(d).multiply(h.rotation)}this.rotationBuffer.setXYZW(t,m.x,m.y,m.z,m.w)}else(this.settings.renderMode===v.StretchedBillBoard||this.settings.renderMode===v.VerticalBillBoard||this.settings.renderMode===v.HorizontalBillBoard||this.settings.renderMode===v.BillBoard)&&this.rotationBuffer.setX(t,h.rotation);let u;if(i.worldSpace?u=h.position:(u=this.vector_,h.parentMatrix?u.copy(h.position).applyMatrix4(h.parentMatrix):u.copy(h.position).applyMatrix4(i.emitter.matrixWorld)),this.offsetBuffer.setXYZ(t,u.x,u.y,u.z),this.colorBuffer.setXYZW(t,h.color.x,h.color.y,h.color.z,h.color.w),i.worldSpace?this.sizeBuffer.setXYZ(t,h.size.x,h.size.y,h.size.z):h.parentMatrix?this.sizeBuffer.setXYZ(t,h.size.x,h.size.y,h.size.z):this.sizeBuffer.setXYZ(t,h.size.x*Math.abs(a.x),h.size.y*Math.abs(a.y),h.size.z*Math.abs(a.z)),this.uvTileBuffer.setX(t,h.uvTile),this.settings.renderMode===v.StretchedBillBoard&&this.velocityBuffer){let m=i.rendererEmitterSettings.speedFactor;m===0&&(m=.001);const d=i.rendererEmitterSettings.lengthFactor;let f;i.worldSpace?f=h.velocity:(f=this.vector_,h.parentMatrix?(this.rotationMat2_.setFromMatrix4(h.parentMatrix),f.copy(h.velocity).applyMatrix3(this.rotationMat2_)):f.copy(h.velocity).applyMatrix3(this.rotationMat_)),this.velocityBuffer.setXYZW(t,f.x*m,f.y*m,f.z*m,d)}}}),this.geometry.instanceCount=t,t>0&&(this.offsetBuffer.clearUpdateRanges(),this.offsetBuffer.addUpdateRange(0,t*3),this.offsetBuffer.needsUpdate=!0,this.sizeBuffer.clearUpdateRanges(),this.sizeBuffer.addUpdateRange(0,t*3),this.sizeBuffer.needsUpdate=!0,this.colorBuffer.clearUpdateRanges(),this.colorBuffer.addUpdateRange(0,t*4),this.colorBuffer.needsUpdate=!0,this.uvTileBuffer.clearUpdateRanges(),this.uvTileBuffer.addUpdateRange(0,t),this.uvTileBuffer.needsUpdate=!0,this.settings.renderMode===v.StretchedBillBoard&&this.velocityBuffer&&(this.velocityBuffer.clearUpdateRanges(),this.velocityBuffer.addUpdateRange(0,t*4),this.velocityBuffer.needsUpdate=!0),this.settings.renderMode===v.Mesh?(this.rotationBuffer.clearUpdateRanges(),this.rotationBuffer.addUpdateRange(0,t*4),this.rotationBuffer.needsUpdate=!0):(this.settings.renderMode===v.StretchedBillBoard||this.settings.renderMode===v.HorizontalBillBoard||this.settings.renderMode===v.VerticalBillBoard||this.settings.renderMode===v.BillBoard)&&(this.rotationBuffer.clearUpdateRanges(),this.rotationBuffer.addUpdateRange(0,t),this.rotationBuffer.needsUpdate=!0))}dispose(){this.geometry.dispose()}}var Fs=`

#include <common>
#include <tile_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform sampler2D alphaMap;
uniform float useAlphaMap;
uniform float visibility;
uniform float alphaTest;

varying vec4 vColor;
    
void main() {
    #include <clipping_planes_fragment>
    #include <logdepthbuf_fragment>

    vec4 diffuseColor = vColor;
    
    #ifdef USE_MAP
    #include <tile_fragment>
    #ifndef USE_COLOR_AS_ALPHA
    #endif
    #endif
    if( useAlphaMap == 1. ) diffuseColor.a *= texture2D( alphaMap, vUv).a;
    if( diffuseColor.a < alphaTest ) discard;
    gl_FragColor = diffuseColor;

    #include <fog_fragment>
    #include <tonemapping_fragment>
}`,Vs=`
#include <common>
#include <tile_pars_vertex>
#include <color_pars_vertex>
#include <clipping_planes_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <fog_pars_vertex>

attribute vec3 previous;
attribute vec3 next;
attribute float side;
attribute float width;

uniform vec2 resolution;
uniform float lineWidth;
uniform float sizeAttenuation;
    
vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
}
    
void main() {

    #include <tile_vertex>
    
    float aspect = resolution.x / resolution.y;

    vColor = color;

    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4( position, 1.0 );
    vec4 prevPos = m * vec4( previous, 1.0 );
    vec4 nextPos = m * vec4( next, 1.0 );

    vec2 currentP = fix( finalPosition, aspect );
    vec2 prevP = fix( prevPos, aspect );
    vec2 nextP = fix( nextPos, aspect );

    float w = lineWidth * width;

    vec2 dir;
    if( nextP == currentP ) dir = normalize( currentP - prevP );
    else if( prevP == currentP ) dir = normalize( nextP - currentP );
    else {
        vec2 dir1 = normalize( currentP - prevP );
        vec2 dir2 = normalize( nextP - currentP );
        dir = normalize( dir1 + dir2 );

        vec2 perp = vec2( -dir1.y, dir1.x );
        vec2 miter = vec2( -dir.y, dir.x );
        //w = clamp( w / dot( miter, perp ), 0., 4., * lineWidth * width );

    }

    //vec2 normal = ( cross( vec3( dir, 0. ) vec3( 0., 0., 1. ) ) ).xy;
    vec4 normal = vec4( -dir.y, dir.x, 0., 1. );
    normal.xy *= .5 * w;
    normal *= projectionMatrix;
    if( sizeAttenuation == 0. ) {
        normal.xy *= finalPosition.w;
        normal.xy /= ( vec4( resolution, 0., 1. ) * projectionMatrix ).xy;
    }

    finalPosition.xy += normal.xy * side;

    gl_Position = finalPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    
	#include <fog_vertex>
}`;class Is extends wi{constructor(t){super(t),this.vector_=new S,this.vector2_=new S,this.vector3_=new S,this.quaternion_=new E,this.maxParticles=1e4,this.setupBuffers(),this.rebuildMaterial()}setupBuffers(){this.geometry&&this.geometry.dispose(),this.geometry=new bi,this.indexBuffer=new ct(new Uint32Array(this.maxParticles*6),1),this.indexBuffer.setUsage(k),this.geometry.setIndex(this.indexBuffer),this.positionBuffer=new ct(new Float32Array(this.maxParticles*6),3),this.positionBuffer.setUsage(k),this.geometry.setAttribute("position",this.positionBuffer),this.previousBuffer=new ct(new Float32Array(this.maxParticles*6),3),this.previousBuffer.setUsage(k),this.geometry.setAttribute("previous",this.previousBuffer),this.nextBuffer=new ct(new Float32Array(this.maxParticles*6),3),this.nextBuffer.setUsage(k),this.geometry.setAttribute("next",this.nextBuffer),this.widthBuffer=new ct(new Float32Array(this.maxParticles*2),1),this.widthBuffer.setUsage(k),this.geometry.setAttribute("width",this.widthBuffer),this.sideBuffer=new ct(new Float32Array(this.maxParticles*2),1),this.sideBuffer.setUsage(k),this.geometry.setAttribute("side",this.sideBuffer),this.uvBuffer=new ct(new Float32Array(this.maxParticles*4),2),this.uvBuffer.setUsage(k),this.geometry.setAttribute("uv",this.uvBuffer),this.colorBuffer=new ct(new Float32Array(this.maxParticles*8),4),this.colorBuffer.setUsage(k),this.geometry.setAttribute("color",this.colorBuffer)}expandBuffers(t){for(;t>=this.maxParticles;)this.maxParticles*=2;this.setupBuffers()}rebuildMaterial(){this.layers.mask=this.settings.layers.mask;const t={lineWidth:{value:1},map:{value:null},useMap:{value:0},alphaMap:{value:null},useAlphaMap:{value:0},resolution:{value:new St(1,1)},sizeAttenuation:{value:1},visibility:{value:1},alphaTest:{value:0}},e={};if(e.USE_UV="",e.USE_COLOR_ALPHA="",this.settings.material.map&&(e.USE_MAP="",e.MAP_UV=ti(this.settings.material.map.channel),t.map=new tt(this.settings.material.map),t.mapTransform=new tt(new rt().copy(this.settings.material.map.matrix))),this.settings.material.defines&&this.settings.material.defines.USE_COLOR_AS_ALPHA!==void 0&&(e.USE_COLOR_AS_ALPHA=""),this.settings.renderMode===v.Trail)this.material=new Qe({uniforms:t,defines:e,vertexShader:Vs,fragmentShader:Fs,transparent:this.settings.material.transparent,depthWrite:!this.settings.material.transparent,side:this.settings.material.side,blending:this.settings.material.blending||yi,blendDst:this.settings.material.blendDst,blendSrc:this.settings.material.blendSrc,blendEquation:this.settings.material.blendEquation,premultipliedAlpha:this.settings.material.premultipliedAlpha});else throw new Error("render mode unavailable")}update(){let t=0,e=0,i=0;this.systems.forEach(s=>{for(let r=0;r<s.particleNum;r++)i+=s.particles[r].previous.length*2}),i>this.maxParticles&&this.expandBuffers(i),this.systems.forEach(s=>{s.emitter.updateMatrixWorld&&(s.emitter.updateWorldMatrix(!0,!1),s.emitter.updateMatrixWorld(!0));const r=this.quaternion_,n=this.vector2_,o=this.vector3_;s.emitter.matrixWorld.decompose(n,r,o);const a=s.particles,l=s.particleNum,h=this.settings.uTileCount,u=this.settings.vTileCount,m=1/h,d=1/u;for(let f=0;f<l;f++){const p=a[f],x=p.uvTile%u,g=Math.floor(p.uvTile/u+.001),b=p.previous.values();let z=b.next(),w=z.value,y=w;z.done||(z=b.next());let M;z.value!==void 0?M=z.value:M=y;for(let _=0;_<p.previous.length;_++,t+=2){if(this.positionBuffer.setXYZ(t,y.position.x,y.position.y,y.position.z),this.positionBuffer.setXYZ(t+1,y.position.x,y.position.y,y.position.z),s.worldSpace?(this.positionBuffer.setXYZ(t,y.position.x,y.position.y,y.position.z),this.positionBuffer.setXYZ(t+1,y.position.x,y.position.y,y.position.z)):(p.parentMatrix?this.vector_.copy(y.position).applyMatrix4(p.parentMatrix):this.vector_.copy(y.position).applyMatrix4(s.emitter.matrixWorld),this.positionBuffer.setXYZ(t,this.vector_.x,this.vector_.y,this.vector_.z),this.positionBuffer.setXYZ(t+1,this.vector_.x,this.vector_.y,this.vector_.z)),s.worldSpace?(this.previousBuffer.setXYZ(t,w.position.x,w.position.y,w.position.z),this.previousBuffer.setXYZ(t+1,w.position.x,w.position.y,w.position.z)):(p.parentMatrix?this.vector_.copy(w.position).applyMatrix4(p.parentMatrix):this.vector_.copy(w.position).applyMatrix4(s.emitter.matrixWorld),this.previousBuffer.setXYZ(t,this.vector_.x,this.vector_.y,this.vector_.z),this.previousBuffer.setXYZ(t+1,this.vector_.x,this.vector_.y,this.vector_.z)),s.worldSpace?(this.nextBuffer.setXYZ(t,M.position.x,M.position.y,M.position.z),this.nextBuffer.setXYZ(t+1,M.position.x,M.position.y,M.position.z)):(p.parentMatrix?this.vector_.copy(M.position).applyMatrix4(p.parentMatrix):this.vector_.copy(M.position).applyMatrix4(s.emitter.matrixWorld),this.nextBuffer.setXYZ(t,this.vector_.x,this.vector_.y,this.vector_.z),this.nextBuffer.setXYZ(t+1,this.vector_.x,this.vector_.y,this.vector_.z)),this.sideBuffer.setX(t,-1),this.sideBuffer.setX(t+1,1),s.worldSpace)this.widthBuffer.setX(t,y.size),this.widthBuffer.setX(t+1,y.size);else if(p.parentMatrix)this.widthBuffer.setX(t,y.size),this.widthBuffer.setX(t+1,y.size);else{const T=(Math.abs(o.x)+Math.abs(o.y)+Math.abs(o.z))/3;this.widthBuffer.setX(t,y.size*T),this.widthBuffer.setX(t+1,y.size*T)}this.uvBuffer.setXY(t,(_/p.previous.length+x)*m,(u-g-1)*d),this.uvBuffer.setXY(t+1,(_/p.previous.length+x)*m,(u-g)*d),this.colorBuffer.setXYZW(t,y.color.x,y.color.y,y.color.z,y.color.w),this.colorBuffer.setXYZW(t+1,y.color.x,y.color.y,y.color.z,y.color.w),_+1<p.previous.length&&(this.indexBuffer.setX(e*3,t),this.indexBuffer.setX(e*3+1,t+1),this.indexBuffer.setX(e*3+2,t+2),e++,this.indexBuffer.setX(e*3,t+2),this.indexBuffer.setX(e*3+1,t+1),this.indexBuffer.setX(e*3+2,t+3),e++),w=y,y=M,z.done||(z=b.next(),z.value!==void 0&&(M=z.value))}}}),this.positionBuffer.clearUpdateRanges(),this.positionBuffer.addUpdateRange(0,t*3),this.positionBuffer.needsUpdate=!0,this.previousBuffer.clearUpdateRanges(),this.previousBuffer.addUpdateRange(0,t*3),this.previousBuffer.needsUpdate=!0,this.nextBuffer.clearUpdateRanges(),this.nextBuffer.addUpdateRange(0,t*3),this.nextBuffer.needsUpdate=!0,this.sideBuffer.clearUpdateRanges(),this.sideBuffer.addUpdateRange(0,t),this.sideBuffer.needsUpdate=!0,this.widthBuffer.clearUpdateRanges(),this.widthBuffer.addUpdateRange(0,t),this.widthBuffer.needsUpdate=!0,this.uvBuffer.clearUpdateRanges(),this.uvBuffer.addUpdateRange(0,t*2),this.uvBuffer.needsUpdate=!0,this.colorBuffer.clearUpdateRanges(),this.colorBuffer.addUpdateRange(0,t*4),this.colorBuffer.needsUpdate=!0,this.indexBuffer.clearUpdateRanges(),this.indexBuffer.addUpdateRange(0,e*3),this.indexBuffer.needsUpdate=!0,this.geometry.setDrawRange(0,e*3)}dispose(){this.geometry.dispose()}}class fe{get geometry(){return this._geometry}set geometry(t){if(this._geometry=t,t===void 0||typeof t=="string")return;const e=new Pi;this._triangleIndexToArea.length=0;let i=0;if(!t.getIndex())return;const s=t.getIndex().array,r=s.length/3;this._triangleIndexToArea.push(0);for(let n=0;n<r;n++)e.setFromAttributeAndIndices(t.getAttribute("position"),s[n*3],s[n*3+1],s[n*3+2]),i+=e.getArea(),this._triangleIndexToArea.push(i);t.userData.triangleIndexToArea=this._triangleIndexToArea}constructor(t){this.type="mesh_surface",this._triangleIndexToArea=[],this._tempA=new Le,this._tempB=new Le,this._tempC=new Le,t&&(this.geometry=t)}initialize(t){const e=this._geometry;if(!e||e.getIndex()===null){t.position.set(0,0,0),t.velocity.set(0,0,1).multiplyScalar(t.startSpeed);return}const i=this._triangleIndexToArea.length-1;let s=0,r=i;const n=Math.random()*this._triangleIndexToArea[i];for(;s+1<r;){const d=Math.floor((s+r)/2);n<this._triangleIndexToArea[d]?r=d:s=d}let o=Math.random(),a=Math.random();o+a>1&&(o=1-o,a=1-a);const l=e.getIndex().array[s*3],h=e.getIndex().array[s*3+1],u=e.getIndex().array[s*3+2],m=e.getAttribute("position");this._tempA.fromBufferAttribute(m,l),this._tempB.fromBufferAttribute(m,h),this._tempC.fromBufferAttribute(m,u),this._tempB.sub(this._tempA),this._tempC.sub(this._tempA),this._tempA.addScaledVector(this._tempB,o).addScaledVector(this._tempC,a),t.position.copy(this._tempA),this._tempA.copy(this._tempB).cross(this._tempC).normalize(),t.velocity.copy(this._tempA).normalize().multiplyScalar(t.startSpeed)}toJSON(){return{type:"mesh_surface",mesh:this._geometry?this._geometry.uuid:""}}static fromJSON(t,e){return new fe(e.geometries[t.geometry])}clone(){return new fe(this._geometry)}update(t,e){}}ps({id:"three.quarks",emitterShapes:[{type:"mesh_surface",params:[["geometry",["geometry"]]],constructor:fe,loadJSON:fe.fromJSON}],behaviors:[]});class ri extends fi{constructor(){super(),this.batches=[],this.systemToBatchIndex=new Map,this.type="BatchedRenderer",this.depthTexture=null}static equals(t,e){return t.material.side===e.material.side&&t.material.blending===e.material.blending&&t.material.blendSrc===e.material.blendSrc&&t.material.blendDst===e.material.blendDst&&t.material.blendEquation===e.material.blendEquation&&t.material.premultipliedAlpha===e.material.premultipliedAlpha&&t.material.transparent===e.material.transparent&&t.material.depthTest===e.material.depthTest&&t.material.type===e.material.type&&t.material.alphaTest===e.material.alphaTest&&t.material.map===e.material.map&&t.renderMode===e.renderMode&&t.blendTiles===e.blendTiles&&t.softParticles===e.softParticles&&t.softFarFade===e.softFarFade&&t.softNearFade===e.softNearFade&&t.uTileCount===e.uTileCount&&t.vTileCount===e.vTileCount&&t.instancingGeometry===e.instancingGeometry&&t.renderOrder===e.renderOrder&&t.layers.mask===e.layers.mask}addSystem(t){t._renderer=this;const e=t.getRendererSettings();for(let s=0;s<this.batches.length;s++)if(ri.equals(this.batches[s].settings,e)){this.batches[s].addSystem(t),this.systemToBatchIndex.set(t,s);return}let i;switch(e.renderMode){case v.Trail:i=new Is(e);break;case v.Mesh:case v.BillBoard:case v.VerticalBillBoard:case v.HorizontalBillBoard:case v.StretchedBillBoard:i=new Rs(e);break}this.depthTexture&&i.applyDepthTexture(this.depthTexture),i.addSystem(t),this.batches.push(i),this.systemToBatchIndex.set(t,this.batches.length-1),this.add(i)}deleteSystem(t){const e=this.systemToBatchIndex.get(t);e!=null&&(this.batches[e].removeSystem(t),this.systemToBatchIndex.delete(t))}setDepthTexture(t){this.depthTexture=t;for(const e of this.batches)e.applyDepthTexture(t)}updateSystem(t){this.deleteSystem(t),this.addSystem(t)}update(t){this.systemToBatchIndex.forEach((e,i)=>{i.update(t)});for(let e=0;e<this.batches.length;e++)this.batches[e].update()}}const Ls=ri;zs();export{Ls as B,zt as C,nt as M,ks as P,v as R,$e as T,G as V,P as a};
