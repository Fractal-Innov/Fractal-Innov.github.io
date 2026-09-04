import{G as Bt,P as _t,I as St,N as Mt,M as U,a as X,i as Ot,b as Lt,T as Wt,g as qt,c as Ut,B as st,d as Xt,C as Gt,O as Yt,S as jt,e as Zt,L as Kt}from"./MeshBVH.DYJApbfm.js";import{A as tn,f as en,h as nn,j as on,E as sn,k as rn,l as an,m as cn,n as ln,o as dn}from"./MeshBVH.DYJApbfm.js";import{x as P,b0 as Dt,a as I,ai as E,bc as $t,a4 as Jt,Y as Qt,M as te,O as ee,e as Y,B as M,g as D,a0 as Pt,a2 as Et,a1 as Nt,a3 as Ft,aj as ne,bX as ie,b5 as oe,aF as V,bY as q,bT as k,aG as tt,J as S,aB as rt,bZ as se,b_ as at,b$ as re,aA as G,bn as et,bm as Ht,bl as ae,az as ce,ay as le,bd as de,V as nt}from"./three@0.169.19.js";const ct=new P,R=new Dt,lt=new _t(()=>new $t),Z=new I,dt=new I,ut=new E,ht=["getX","getY","getZ"];class ue extends Bt{get primitiveStride(){return 2}writePrimitiveBounds(t,e,n){const i=this._indirectBuffer,{geometry:o,primitiveStride:a}=this,c=o.attributes.position,r=o.index,d=r?r.count:c.count;let l=(i?i[t]:t)*a,h=(l+1)%d;r&&(l=r.getX(l),h=r.getX(h));for(let f=0;f<3;f++){const p=c[ht[f]](l),m=c[ht[f]](h),y=p<m?p:m,v=p>m?p:m;e[n+f]=y,e[n+f+3]=v}return e}shapecast(t){const e=lt.getPrimitive(),n=super.shapecast({...t,intersectsPrimitive:t.intersectsLine,scratchPrimitive:e,iterate:fe});return lt.releasePrimitive(e),n}raycastObject3D(t,e,n=[]){const{matrixWorld:i}=t,{firstHitOnly:o}=e;ct.copy(i).invert(),R.copy(e.ray).applyMatrix4(ct);const c=e.params.Line.threshold/((t.scale.x+t.scale.y+t.scale.z)/3),r=c*c;let d=null,u=1/0;return this.shapecast({boundsTraverseOrder:l=>l.distanceToPoint(R.origin),intersectsBounds:l=>(ut.copy(l).expandByScalar(Math.abs(c)),R.intersectsBox(ut)?St:Mt),intersectsLine:(l,h)=>{if(R.distanceSqToSegment(l.start,l.end,Z,dt)>r)return;Z.applyMatrix4(t.matrixWorld);const p=e.ray.origin.distanceTo(Z);p<e.near||p>e.far||o&&p>=u||(u=p,h=this.resolvePrimitiveIndex(h),d={distance:p,point:dt.clone().applyMatrix4(i),index:h*this.primitiveStride,face:null,faceIndex:null,barycoord:null,object:t},o||n.push(d))}}),o&&d&&n.push(d),n}}class he extends ue{get primitiveStride(){return 1}constructor(t,e={}){e={...e,indirect:!0},super(t,e)}}class Fe extends he{getRootRanges(...t){const e=super.getRootRanges(...t);return e.forEach(n=>n.count--),e}}function fe(s,t,e,n,i,o,a){const{geometry:c,primitiveStride:r}=e,{index:d}=c,u=c.attributes.position,l=d?d.count:u.count;for(let h=s,f=t+s;h<f;h++){let m=e.resolvePrimitiveIndex(h)*r,y=(m+1)%l;if(d&&(m=d.getX(m),y=d.getX(y)),a.start.fromBufferAttribute(u,m),a.end.fromBufferAttribute(u,y),n(a,h,i,o))return!0}return!1}const ft=new P,F=new Dt,pt=new _t(()=>new I),mt=new E;class He extends Bt{get primitiveStride(){return 1}writePrimitiveBounds(t,e,n){const i=this._indirectBuffer,{geometry:o}=this,a=o.attributes.position,c=o.index;let r=i?i[t]:t;c&&(r=c.getX(r));const d=a.getX(r),u=a.getY(r),l=a.getZ(r);return e[n+0]=d,e[n+1]=u,e[n+2]=l,e[n+3]=d,e[n+4]=u,e[n+5]=l,e}shapecast(t){const e=pt.getPrimitive(),n=super.shapecast({...t,intersectsPrimitive:t.intersectsPoint,scratchPrimitive:e,iterate:pe});return pt.releasePrimitive(e),n}raycastObject3D(t,e,n=[]){const{geometry:i}=this,{matrixWorld:o}=t,{firstHitOnly:a}=e;ft.copy(o).invert(),F.copy(e.ray).applyMatrix4(ft);const r=e.params.Points.threshold/((t.scale.x+t.scale.y+t.scale.z)/3),d=r*r;let u=null,l=1/0;return this.shapecast({boundsTraverseOrder:h=>h.distanceToPoint(F.origin),intersectsBounds:h=>(mt.copy(h).expandByScalar(Math.abs(r)),F.intersectsBox(mt)?St:Mt),intersectsPoint:(h,f)=>{const p=F.distanceSqToPoint(h);if(p<d){const m=new I;F.closestPointToPoint(h,m),m.applyMatrix4(o);const y=e.ray.origin.distanceTo(m);if(y<e.near||y>e.far||a&&y>=l)return;l=y,f=this.resolvePrimitiveIndex(f),u={distance:y,distanceToRay:Math.sqrt(p),point:m,index:i.index?i.index.getX(f):f,face:null,faceIndex:null,barycoord:null,object:t},a||n.push(u)}}}),a&&u&&n.push(u),n}}function pe(s,t,e,n,i,o,a){const{geometry:c}=e,{index:r}=c,d=c.attributes.position;for(let u=s,l=t+s;u<l;u++){const h=e.resolvePrimitiveIndex(u),f=r?r.array[h]:h;if(a.fromBufferAttribute(d,f),n(a,u,i,o))return!0}return!1}const yt=new E,vt=new P,K=new I;class me extends ee{get isMesh(){return!this.displayEdges}get isLineSegments(){return this.displayEdges}get isLine(){return this.displayEdges}getVertexPosition(...t){return Y.prototype.getVertexPosition.call(this,...t)}constructor(t,e,n=10,i=0){super(),this.material=e,this.geometry=new M,this.name="BVHRootHelper",this.depth=n,this.displayParents=!1,this.bvh=t,this.displayEdges=!0,this._group=i}raycast(){}update(){const t=this.bvh;this.geometry.dispose(),this.visible=!1,t&&(this.geometry=this.getGeometry(t),this.visible=!0)}getGeometry(t){const e=this._group;let n=null;if(e!==-1)n=this.getBVHBoundPositions(t,e);else{const a=t._roots.map((d,u)=>this.getBVHBoundPositions(t,u)),c=a.reduce((d,u)=>d+u.length,0);n=new Float32Array(c);let r=0;a.forEach(d=>{n.set(d,r),r+=d.length})}const i=this.getBVHBoundIndices(n),o=new M;return o.setIndex(new D(i,1,!1)),o.setAttribute("position",new D(n,3,!1)),o}getBVHBoundIndices(t){const e=t.length/24;let n,i;this.displayEdges?i=new Uint8Array([0,4,1,5,2,6,3,7,0,2,1,3,4,6,5,7,0,1,2,3,4,5,6,7]):i=new Uint8Array([0,1,2,2,1,3,4,6,5,6,7,5,1,4,5,0,4,1,2,3,6,3,7,6,0,2,4,2,6,4,1,5,3,3,5,7]),t.length>65535?n=new Uint32Array(i.length*e):n=new Uint16Array(i.length*e);const o=i.length;for(let a=0;a<e;a++){const c=a*8,r=a*o;for(let d=0;d<o;d++)n[r+d]=c+i[d]}return n}getBVHBoundPositions(t,e=0,n=null){const i=this.depth-1,o=this.displayParents;let a=0;t.traverse((d,u)=>{if(d>=i||u)return a++,!0;o&&a++},e);let c=0;const r=new Float32Array(8*3*a);return t.traverse((d,u,l)=>{const h=d>=i||u;if(h||o){X(0,l,yt);const{min:f,max:p}=yt;for(let m=-1;m<=1;m+=2){const y=m<0?f.x:p.x;for(let v=-1;v<=1;v+=2){const b=v<0?f.y:p.y;for(let x=-1;x<=1;x+=2){const j=x<0?f.z:p.z;K.set(y,b,j),n&&K.applyMatrix4(n),K.toArray(r,c),c+=3}}}return h}},e),r}}class it extends Jt{get color(){return this.edgeMaterial.color}get opacity(){return this.edgeMaterial.opacity}set opacity(t){this.edgeMaterial.opacity=t,this.meshMaterial.opacity=t}get objectIndex(){return console.warn('BVHHelper: "objectIndex" has been renamed "instanceId".'),this.instanceId}set objectIndex(t){console.warn('BVHHelper: "objectIndex" has been renamed "instanceId".'),this.instanceId=t}constructor(t=null,e=null,n=10){t instanceof U&&(n=e||10,e=t,t=null),typeof e=="number"&&(n=e,e=null),super(),this.name="BVHHelper",this.depth=n,this.mesh=t,this.bvh=e,this.displayParents=!1,this.displayEdges=!0,this.instanceId=0,this._roots=[];const i=new Qt({color:65416,transparent:!0,opacity:.3,depthWrite:!1}),o=new te({color:65416,transparent:!0,opacity:.3,depthWrite:!1});o.color=i.color,this.edgeMaterial=i,this.meshMaterial=o,this.update()}update(){const t=this.mesh,e=this.instanceId;let n=this.bvh||t.geometry.boundsTree||null;if(t&&t.isBatchedMesh&&t.boundsTrees&&!n&&e>=0){const o=t._drawInfo[e];o&&(n=t.boundsTrees[o.geometryIndex]||n)}const i=n?n._roots.length:0;for(;this._roots.length>i;){const o=this._roots.pop();o.geometry.dispose(),this.remove(o)}for(let o=0;o<i;o++){const{depth:a,edgeMaterial:c,meshMaterial:r,displayParents:d,displayEdges:u}=this;if(o>=this._roots.length){const h=new me(n,c,a,o);this.add(h),this._roots.push(h)}const l=this._roots[o];l.bvh=n,l.depth=a,l.displayParents=d,l.displayEdges=u,l.material=u?c:r,l.update()}}updateMatrixWorld(...t){const e=this.mesh,n=this.parent,i=this.instanceId;e!==null&&(e.updateWorldMatrix(!0,!1),n?this.matrix.copy(n.matrixWorld).invert().multiply(e.matrixWorld):this.matrix.copy(e.matrixWorld),(e.isInstancedMesh||e.isBatchedMesh)&&i>=0&&(e.getMatrixAt(i,vt),this.matrix.multiply(vt)),this.matrix.decompose(this.position,this.quaternion,this.scale)),super.updateMatrixWorld(...t)}copy(t){this.depth=t.depth,this.mesh=t.mesh,this.bvh=t.bvh,this.opacity=t.opacity,this.color.copy(t.color)}clone(){return new it().copy(this)}dispose(){this.edgeMaterial.dispose(),this.meshMaterial.dispose();const t=this.children;for(let e=0,n=t.length;e<n;e++)t[e].geometry.dispose()}}class ze extends it{constructor(...t){console.warn("MeshBVHHelper: Class has been deprecated. Use BVHHelper instead."),super(...t)}}const $=new E,H=new E;function xt(s){switch(typeof s){case"number":return 8;case"string":return s.length*2;case"boolean":return 4;default:return 0}}function ye(s){return/(Uint|Int|Float)(8|16|32)Array/.test(s.constructor.name)}function ve(s,t){const e={nodeCount:0,leafNodeCount:0,depth:{min:1/0,max:-1/0},primitives:{min:1/0,max:-1/0},splits:[0,0,0],surfaceAreaScore:0};return s.traverse((n,i,o,a,c)=>{const r=o[3]-o[0],d=o[4]-o[1],u=o[5]-o[2],l=2*(r*d+d*u+u*r);e.nodeCount++,i?(e.leafNodeCount++,e.depth.min=Math.min(n,e.depth.min),e.depth.max=Math.max(n,e.depth.max),e.primitives.min=Math.min(c,e.primitives.min),e.primitives.max=Math.max(c,e.primitives.max),e.surfaceAreaScore+=l*Lt*c):(e.splits[a]++,e.surfaceAreaScore+=l*Wt)},t),e.primitives.min===1/0&&(e.primitives.min=0,e.primitives.max=0),e.depth.min===1/0&&(e.depth.min=0,e.depth.max=0),e}function Ce(s){return s._roots.map((t,e)=>ve(s,e))}function Ve(s){const t=new Set,e=[s];let n=0;for(;e.length;){const i=e.pop();if(!t.has(i)){t.add(i);for(let o in i){if(!Object.hasOwn(i,o))continue;n+=xt(o);const a=i[o];a&&(typeof a=="object"||typeof a=="function")?ye(a)||Ot()&&a instanceof SharedArrayBuffer||a instanceof ArrayBuffer?n+=a.byteLength:e.push(a):n+=xt(a)}}}return n}function ke(s){const t=[],e=new Float32Array(6);let n=!0;return s.traverse((i,o,a,c,r)=>{const d={depth:i,isLeaf:o,boundingData:a,offset:c,count:r};t[i]=d,X(0,a,$);const u=t[i-1];if(o){s.writePrimitiveRangeBounds(c,r,e,0),H.min.set(e[0],e[1],e[2]),H.max.set(e[3],e[4],e[5]);const l=$.containsBox(H);console.assert(l,"Leaf bounds does not fully contain primitives."),n=n&&l}if(u){X(0,u.boundingData,H);const l=H.containsBox($);console.assert(l,"Parent bounds does not fully contain child."),n=n&&l}}),n}function Re(s){const t=[];return s.traverse((e,n,i,o,a)=>{const c={bounds:X(0,i,new E)};n?(c.count=a,c.offset=o):(c.left=null,c.right=null),t[e]=c;const r=t[e-1];r&&(r.left===null?r.left=c:r.right=c)}),t[0]}const xe=parseInt(oe)>=166,_={Mesh:Y.prototype.raycast,Line:Nt.prototype.raycast,LineSegments:Pt.prototype.raycast,LineLoop:Et.prototype.raycast,Points:Ft.prototype.raycast,BatchedMesh:ie.prototype.raycast},g=new Y,O=[];function Oe(s,t){if(this.isBatchedMesh)be.call(this,s,t);else{const{geometry:e}=this;if(e.boundsTree)e.boundsTree.raycastObject3D(this,s,t);else{let n;if(this instanceof Y)n=_.Mesh;else if(this instanceof Pt)n=_.LineSegments;else if(this instanceof Et)n=_.LineLoop;else if(this instanceof Nt)n=_.Line;else if(this instanceof Ft)n=_.Points;else throw new Error("BVH: Fallback raycast function not found.");n.call(this,s,t)}}}function be(s,t){if(this.boundsTrees){const e=this.boundsTrees,n=this._drawInfo||this._instanceInfo,i=this._drawRanges||this._geometryInfo,o=this.matrixWorld;g.material=this.material,g.geometry=this.geometry;const a=g.geometry.boundsTree,c=g.geometry.drawRange;g.geometry.boundingSphere===null&&(g.geometry.boundingSphere=new ne);for(let r=0,d=n.length;r<d;r++){if(!this.getVisibleAt(r))continue;const u=n[r].geometryIndex;if(g.geometry.boundsTree=e[u],this.getMatrixAt(r,g.matrixWorld).premultiply(o),!g.geometry.boundsTree){this.getBoundingBoxAt(u,g.geometry.boundingBox),this.getBoundingSphereAt(u,g.geometry.boundingSphere);const l=i[u];g.geometry.setDrawRange(l.start,l.count)}g.raycast(s,O);for(let l=0,h=O.length;l<h;l++){const f=O[l];f.object=this,f.batchId=r,t.push(f)}O.length=0}g.geometry.boundsTree=a,g.geometry.drawRange=c,g.material=null,g.geometry=null}else _.BatchedMesh.call(this,s,t)}function Le(s={}){const{type:t=U}=s;return this.boundsTree=new t(this,s),this.boundsTree}function We(){this.boundsTree=null}function qe(s=-1,t={}){if(!xe)throw new Error("BatchedMesh: Three r166+ is required to compute bounds trees.");t={...t,range:null};const e=this._drawRanges||this._geometryInfo,n=this._geometryCount;this.boundsTrees||(this.boundsTrees=new Array(n).fill(null));const i=this.boundsTrees;for(;i.length<n;)i.push(null);if(s<0){for(let o=0;o<n;o++)t.range=e[o],i[o]=new U(this.geometry,t);return i}else return s<e.length&&(t.range=e[s],i[s]=new U(this.geometry,t)),i[s]||null}function Ue(s=-1){s<0?this.boundsTrees.fill(null):s<this.boundsTrees.length&&(this.boundsTrees[s]=null)}function ge(s){switch(s){case 1:return"R";case 2:return"RG";case 3:return"RGBA";case 4:return"RGBA"}throw new Error}function Ie(s){switch(s){case 1:return le;case 2:return ce;case 3:return G;case 4:return G}}function bt(s){switch(s){case 1:return ae;case 2:return Ht;case 3:return et;case 4:return et}}class ot extends tt{constructor(){super(),this.minFilter=S,this.magFilter=S,this.generateMipmaps=!1,this.overrideItemSize=null,this._forcedType=null}updateFrom(t){const e=this.overrideItemSize,n=t.itemSize,i=t.count;if(e!==null){if(n*i%e!==0)throw new Error("VertexAttributeTexture: overrideItemSize must divide evenly into buffer length.");t.itemSize=e,t.count=i*n/e}const o=t.itemSize,a=t.count,c=t.normalized,r=t.array.constructor,d=r.BYTES_PER_ELEMENT;let u=this._forcedType,l=o;if(u===null)switch(r){case Float32Array:u=V;break;case Uint8Array:case Uint16Array:case Uint32Array:u=k;break;case Int8Array:case Int16Array:case Int32Array:u=q;break}let h,f,p,m,y=ge(o);switch(u){case V:p=1,f=Ie(o),c&&d===1?(m=r,y+="8",r===Uint8Array?h=rt:(h=at,y+="_SNORM")):(m=Float32Array,y+="32F",h=V);break;case q:y+=d*8+"I",p=c?Math.pow(2,r.BYTES_PER_ELEMENT*8-1):1,f=bt(o),d===1?(m=Int8Array,h=at):d===2?(m=Int16Array,h=re):(m=Int32Array,h=q);break;case k:y+=d*8+"UI",p=c?Math.pow(2,r.BYTES_PER_ELEMENT*8-1):1,f=bt(o),d===1?(m=Uint8Array,h=rt):d===2?(m=Uint16Array,h=se):(m=Uint32Array,h=k);break}l===3&&(f===G||f===et)&&(l=4);const v=Math.ceil(Math.sqrt(a))||1,b=l*v*v,x=new m(b),j=t.normalized;t.normalized=!1;for(let w=0;w<a;w++){const N=l*w;x[N]=t.getX(w)/p,o>=2&&(x[N+1]=t.getY(w)/p),o>=3&&(x[N+2]=t.getZ(w)/p,l===4&&(x[N+3]=1)),o>=4&&(x[N+3]=t.getW(w)/p)}t.normalized=j,this.internalFormat=y,this.format=f,this.type=h,this.image.width=v,this.image.height=v,this.image.data=x,this.needsUpdate=!0,this.dispose(),t.itemSize=n,t.count=i}}class we extends ot{constructor(){super(),this._forcedType=k}}class Xe extends ot{constructor(){super(),this._forcedType=q}}class Ae extends ot{constructor(){super(),this._forcedType=V}}class Ge{constructor(){this.index=new we,this.position=new Ae,this.bvhBounds=new tt,this.bvhContents=new tt,this._cachedIndexAttr=null,this.index.overrideItemSize=3}updateFrom(t){const{geometry:e}=t;if(Be(t,this.bvhBounds,this.bvhContents),this.position.updateFrom(e.attributes.position),t.indirect){const n=t._indirectBuffer;if(this._cachedIndexAttr===null||this._cachedIndexAttr.count!==n.length)if(e.index)this._cachedIndexAttr=e.index.clone();else{const i=qt(Ut(e));this._cachedIndexAttr=new D(i,1,!1)}Te(e,n,this._cachedIndexAttr),this.index.updateFrom(this._cachedIndexAttr)}else this.index.updateFrom(e.index)}dispose(){const{index:t,position:e,bvhBounds:n,bvhContents:i}=this;t&&t.dispose(),e&&e.dispose(),n&&n.dispose(),i&&i.dispose()}}function Te(s,t,e){const n=e.array,i=s.index?s.index.array:null;for(let o=0,a=t.length;o<a;o++){const c=3*o,r=3*t[o];for(let d=0;d<3;d++)n[c+d]=i?i[r+d]:r+d}}function Be(s,t,e){const n=s._roots;if(n.length!==1)throw new Error("MeshBVHUniformStruct: Multi-root BVHs not supported.");const i=n[0],o=new Uint16Array(i),a=new Uint32Array(i),c=new Float32Array(i),r=i.byteLength/st,d=2*Math.ceil(Math.sqrt(r/2)),u=new Float32Array(4*d*d),l=Math.ceil(Math.sqrt(r)),h=new Uint32Array(2*l*l);for(let f=0;f<r;f++){const p=f*st/4,m=p*2,y=Zt(p);for(let v=0;v<3;v++)u[8*f+0+v]=c[y+0+v],u[8*f+4+v]=c[y+3+v];if(Xt(m,o)){const v=Gt(m,o),b=Yt(p,a),x=Kt|v;h[f*2+0]=x,h[f*2+1]=b}else{const v=a[p+6],b=jt(p,a);h[f*2+0]=b,h[f*2+1]=v}}t.image.data=u,t.image.width=d,t.image.height=d,t.format=G,t.type=V,t.internalFormat="RGBA32F",t.minFilter=S,t.magFilter=S,t.generateMipmaps=!1,t.needsUpdate=!0,t.dispose(),e.image.data=h,e.image.width=l,e.image.height=l,e.format=Ht,e.type=k,e.internalFormat="RG32UI",e.minFilter=S,e.magFilter=S,e.generateMipmaps=!1,e.needsUpdate=!0,e.dispose()}const A=new I,T=new I,B=new I,gt=new nt,L=new I,J=new I,It=new nt,wt=new nt,W=new P,At=new P;function z(s,t){if(!s&&!t)return;const e=s.count===t.count,n=s.normalized===t.normalized,i=s.array.constructor===t.array.constructor,o=s.itemSize===t.itemSize;if(!e||!n||!i||!o)throw new Error}function C(s,t=null){const e=s.array.constructor,n=s.normalized,i=s.itemSize,o=t===null?s.count:t;return new D(new e(i*o),i,n)}function zt(s,t,e=0){if(s.isInterleavedBufferAttribute){const n=s.itemSize;for(let i=0,o=s.count;i<o;i++){const a=i+e;t.setX(a,s.getX(i)),n>=2&&t.setY(a,s.getY(i)),n>=3&&t.setZ(a,s.getZ(i)),n>=4&&t.setW(a,s.getW(i))}}else{const n=t.array,i=n.constructor,o=n.BYTES_PER_ELEMENT*s.itemSize*e;new i(n.buffer,o,s.array.length).set(s.array)}}function _e(s,t,e){const n=s.elements,i=t.elements;for(let o=0,a=i.length;o<a;o++)n[o]+=i[o]*e}function Tt(s,t,e){const n=s.skeleton,i=s.geometry,o=n.bones,a=n.boneInverses;It.fromBufferAttribute(i.attributes.skinIndex,t),wt.fromBufferAttribute(i.attributes.skinWeight,t),W.elements.fill(0);for(let c=0;c<4;c++){const r=wt.getComponent(c);if(r!==0){const d=It.getComponent(c);At.multiplyMatrices(o[d].matrixWorld,a[d]),_e(W,At,r)}}return W.multiply(s.bindMatrix).premultiply(s.bindMatrixInverse),e.transformDirection(W),e}function Q(s,t,e,n,i){L.set(0,0,0);for(let o=0,a=s.length;o<a;o++){const c=t[o],r=s[o];c!==0&&(J.fromBufferAttribute(r,n),e?L.addScaledVector(J,c):L.addScaledVector(J.sub(i),c))}i.add(L)}function Se(s,t={useGroups:!1,updateIndex:!1,skipAttributes:[]},e=new M){const n=s[0].index!==null,{useGroups:i=!1,updateIndex:o=!1,skipAttributes:a=[]}=t,c=new Set(Object.keys(s[0].attributes)),r={};let d=0;e.clearGroups();for(let u=0;u<s.length;++u){const l=s[u];let h=0;if(n!==(l.index!==null))throw new Error("StaticGeometryGenerator: All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");for(const f in l.attributes){if(!c.has(f))throw new Error('StaticGeometryGenerator: All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.');r[f]===void 0&&(r[f]=[]),r[f].push(l.attributes[f]),h++}if(h!==c.size)throw new Error("StaticGeometryGenerator: Make sure all geometries have the same number of attributes.");if(i){let f;if(n)f=l.index.count;else if(l.attributes.position!==void 0)f=l.attributes.position.count;else throw new Error("StaticGeometryGenerator: The geometry must have either an index or a position attribute");e.addGroup(d,f,u),d+=f}}if(n){let u=!1;if(!e.index){let l=0;for(let h=0;h<s.length;++h)l+=s[h].index.count;e.setIndex(new D(new Uint32Array(l),1,!1)),u=!0}if(o||u){const l=e.index;let h=0,f=0;for(let p=0;p<s.length;++p){const m=s[p],y=m.index;if(a[p]!==!0)for(let v=0;v<y.count;++v)l.setX(h,y.getX(v)+f),h++;f+=m.attributes.position.count}}}for(const u in r){const l=r[u];if(!(u in e.attributes)){let p=0;for(const m in l)p+=l[m].count;e.setAttribute(u,C(r[u][0],p))}const h=e.attributes[u];let f=0;for(let p=0,m=l.length;p<m;p++){const y=l[p];a[p]!==!0&&zt(y,h,f),f+=y.count}}return e}function Me(s,t){if(s===null||t===null)return s===t;if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function De(s){const{index:t,attributes:e}=s;if(t)for(let n=0,i=t.count;n<i;n+=3){const o=t.getX(n),a=t.getX(n+2);t.setX(n,a),t.setX(n+2,o)}else for(const n in e){const i=e[n],o=i.itemSize;for(let a=0,c=i.count;a<c;a+=3)for(let r=0;r<o;r++){const d=i.getComponent(a,r),u=i.getComponent(a+2,r);i.setComponent(a,r,u),i.setComponent(a+2,r,d)}}return s}class Pe{constructor(t){this.matrixWorld=new P,this.geometryHash=null,this.boneMatrices=null,this.primitiveCount=-1,this.mesh=t,this.update()}update(){const t=this.mesh,e=t.geometry,n=t.skeleton,i=(e.index?e.index.count:e.attributes.position.count)/3;if(this.matrixWorld.copy(t.matrixWorld),this.geometryHash=e.attributes.position.version,this.primitiveCount=i,n){n.boneTexture||n.computeBoneTexture(),n.update();const o=n.boneMatrices;!this.boneMatrices||this.boneMatrices.length!==o.length?this.boneMatrices=o.slice():this.boneMatrices.set(o)}else this.boneMatrices=null}didChange(){const t=this.mesh,e=t.geometry,n=(e.index?e.index.count:e.attributes.position.count)/3;return!(this.matrixWorld.equals(t.matrixWorld)&&this.geometryHash===e.attributes.position.version&&Me(t.skeleton&&t.skeleton.boneMatrices||null,this.boneMatrices)&&this.primitiveCount===n)}}class Ye{constructor(t){Array.isArray(t)||(t=[t]);const e=[];t.forEach(n=>{n.traverseVisible(i=>{i.isMesh&&e.push(i)})}),this.meshes=e,this.useGroups=!0,this.applyWorldTransforms=!0,this.attributes=["position","normal","color","tangent","uv","uv2"],this._intermediateGeometry=new Array(e.length).fill().map(()=>new M),this._diffMap=new WeakMap}getMaterials(){const t=[];return this.meshes.forEach(e=>{Array.isArray(e.material)?t.push(...e.material):t.push(e.material)}),t}generate(t=new M){let e=[];const{meshes:n,useGroups:i,_intermediateGeometry:o,_diffMap:a}=this;for(let c=0,r=n.length;c<r;c++){const d=n[c],u=o[c],l=a.get(d);!l||l.didChange(d)?(this._convertToStaticGeometry(d,u),e.push(!1),l?l.update():a.set(d,new Pe(d))):e.push(!0)}if(o.length===0){t.setIndex(null);const c=t.attributes;for(const r in c)t.deleteAttribute(r);for(const r in this.attributes)t.setAttribute(this.attributes[r],new D(new Float32Array(0),4,!1))}else Se(o,{useGroups:i,skipAttributes:e},t);for(const c in t.attributes)t.attributes[c].needsUpdate=!0;return t}_convertToStaticGeometry(t,e=new M){const n=t.geometry,i=this.applyWorldTransforms,o=this.attributes.includes("normal"),a=this.attributes.includes("tangent"),c=n.attributes,r=e.attributes;!e.index&&n.index&&(e.index=n.index.clone()),r.position||e.setAttribute("position",C(c.position)),o&&!r.normal&&c.normal&&e.setAttribute("normal",C(c.normal)),a&&!r.tangent&&c.tangent&&e.setAttribute("tangent",C(c.tangent)),z(n.index,e.index),z(c.position,r.position),o&&z(c.normal,r.normal),a&&z(c.tangent,r.tangent);const d=c.position,u=o?c.normal:null,l=a?c.tangent:null,h=n.morphAttributes.position,f=n.morphAttributes.normal,p=n.morphAttributes.tangent,m=n.morphTargetsRelative,y=t.morphTargetInfluences,v=new de;v.getNormalMatrix(t.matrixWorld),n.index&&e.index.array.set(n.index.array);for(let b=0,x=c.position.count;b<x;b++)A.fromBufferAttribute(d,b),u&&T.fromBufferAttribute(u,b),l&&(gt.fromBufferAttribute(l,b),B.fromBufferAttribute(l,b)),y&&(h&&Q(h,y,m,b,A),f&&Q(f,y,m,b,T),p&&Q(p,y,m,b,B)),t.isSkinnedMesh&&(t.applyBoneTransform(b,A),u&&Tt(t,b,T),l&&Tt(t,b,B)),i&&A.applyMatrix4(t.matrixWorld),r.position.setXYZ(b,A.x,A.y,A.z),u&&(i&&T.applyNormalMatrix(v),r.normal.setXYZ(b,T.x,T.y,T.z)),l&&(i&&B.transformDirection(t.matrixWorld),r.tangent.setXYZW(b,B.x,B.y,B.z,gt.w));for(const b in this.attributes){const x=this.attributes[b];x==="position"||x==="tangent"||x==="normal"||!(x in c)||(r[x]||e.setAttribute(x,C(c[x])),z(c[x],r[x]),zt(c[x],r[x]))}return t.matrixWorld.determinant()<0&&De(e),e}}const Ct=`

// A stack of uint32 indices can can store the indices for
// a perfectly balanced tree with a depth up to 31. Lower stack
// depth gets higher performance.
//
// However not all trees are balanced. Best value to set this to
// is the trees max depth.
#ifndef BVH_STACK_DEPTH
#define BVH_STACK_DEPTH 60
#endif

#ifndef INFINITY
#define INFINITY 1e20
#endif

// Utilities
uvec4 uTexelFetch1D( usampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

ivec4 iTexelFetch1D( isampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 texelFetch1D( sampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 textureSampleBarycoord( sampler2D tex, vec3 barycoord, uvec3 faceIndices ) {

	return
		barycoord.x * texelFetch1D( tex, faceIndices.x ) +
		barycoord.y * texelFetch1D( tex, faceIndices.y ) +
		barycoord.z * texelFetch1D( tex, faceIndices.z );

}

void ndcToCameraRay(
	vec2 coord, mat4 cameraWorld, mat4 invProjectionMatrix,
	out vec3 rayOrigin, out vec3 rayDirection
) {

	// get camera look direction and near plane for camera clipping
	vec4 lookDirection = cameraWorld * vec4( 0.0, 0.0, - 1.0, 0.0 );
	vec4 nearVector = invProjectionMatrix * vec4( 0.0, 0.0, - 1.0, 1.0 );
	float near = abs( nearVector.z / nearVector.w );

	// get the camera direction and position from camera matrices
	vec4 origin = cameraWorld * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec4 direction = invProjectionMatrix * vec4( coord, 0.5, 1.0 );
	direction /= direction.w;
	direction = cameraWorld * direction - origin;

	// slide the origin along the ray until it sits at the near clip plane position
	origin.xyz += direction.xyz * near / dot( direction, lookDirection );

	rayOrigin = origin.xyz;
	rayDirection = direction.xyz;

}
`,Vt=`

float dot2( vec3 v ) {

	return dot( v, v );

}

// https://www.shadertoy.com/view/ttfGWl
vec3 closestPointToTriangle( vec3 p, vec3 v0, vec3 v1, vec3 v2, out vec3 barycoord ) {

    vec3 v10 = v1 - v0;
    vec3 v21 = v2 - v1;
    vec3 v02 = v0 - v2;

	vec3 p0 = p - v0;
	vec3 p1 = p - v1;
	vec3 p2 = p - v2;

    vec3 nor = cross( v10, v02 );

    // method 2, in barycentric space
    vec3  q = cross( nor, p0 );
    float d = 1.0 / dot2( nor );
    float u = d * dot( q, v02 );
    float v = d * dot( q, v10 );
    float w = 1.0 - u - v;

	if( u < 0.0 ) {

		w = clamp( dot( p2, v02 ) / dot2( v02 ), 0.0, 1.0 );
		u = 0.0;
		v = 1.0 - w;

	} else if( v < 0.0 ) {

		u = clamp( dot( p0, v10 ) / dot2( v10 ), 0.0, 1.0 );
		v = 0.0;
		w = 1.0 - u;

	} else if( w < 0.0 ) {

		v = clamp( dot( p1, v21 ) / dot2( v21 ), 0.0, 1.0 );
		w = 0.0;
		u = 1.0 - v;

	}

	barycoord = vec3( u, v, w );
    return u * v1 + v * v2 + w * v0;

}

float distanceToTriangles(
	// geometry info and triangle range
	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,

	// point and cut off range
	vec3 point, float closestDistanceSquared,

	// outputs
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord, inout float side, inout vec3 outPoint
) {

	bool found = false;
	vec3 localBarycoord;
	for ( uint i = offset, l = offset + count; i < l; i ++ ) {

		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;
		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;
		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;
		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;

		// get the closest point and barycoord
		vec3 closestPoint = closestPointToTriangle( point, a, b, c, localBarycoord );
		vec3 delta = point - closestPoint;
		float sqDist = dot2( delta );
		if ( sqDist < closestDistanceSquared ) {

			// set the output results
			closestDistanceSquared = sqDist;
			faceIndices = uvec4( indices.xyz, i );
			faceNormal = normalize( cross( a - b, b - c ) );
			barycoord = localBarycoord;
			outPoint = closestPoint;
			side = sign( dot( faceNormal, delta ) );

		}

	}

	return closestDistanceSquared;

}

float distanceSqToBounds( vec3 point, vec3 boundsMin, vec3 boundsMax ) {

	vec3 clampedPoint = clamp( point, boundsMin, boundsMax );
	vec3 delta = point - clampedPoint;
	return dot( delta, delta );

}

float distanceSqToBVHNodeBoundsPoint( vec3 point, sampler2D bvhBounds, uint currNodeIndex ) {

	uint cni2 = currNodeIndex * 2u;
	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;
	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;
	return distanceSqToBounds( point, boundsMin, boundsMax );

}

// use a macro to hide the fact that we need to expand the struct into separate fields
#define	bvhClosestPointToPoint(		bvh,		point, maxDistance, faceIndices, faceNormal, barycoord, side, outPoint	)	_bvhClosestPointToPoint(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		point, maxDistance, faceIndices, faceNormal, barycoord, side, outPoint	)

float _bvhClosestPointToPoint(
	// bvh info
	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,

	// point to check
	vec3 point, float maxDistance,

	// output variables
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout vec3 outPoint
 ) {

	// stack needs to be twice as long as the deepest tree we expect because
	// we push both the left and right child onto the stack every traversal
	int pointer = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	float closestDistanceSquared = maxDistance * maxDistance;
	bool found = false;
	while ( pointer > - 1 && pointer < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ pointer ];
		pointer --;

		// check if we intersect the current bounds
		float boundsHitDistance = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, currNodeIndex );
		if ( boundsHitDistance > closestDistanceSquared ) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );
		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;
			closestDistanceSquared = distanceToTriangles(
				bvh_position, bvh_index, offset, count, point, closestDistanceSquared,

				// outputs
				faceIndices, faceNormal, barycoord, side, outPoint
			);

		} else {

			uint leftIndex = currNodeIndex + 1u;
			uint splitAxis = boundsInfo.x & 0x0000ffffu;
			uint rightIndex = currNodeIndex + boundsInfo.y;
			bool leftToRight = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, leftIndex ) < distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, rightIndex );//rayDirection[ splitAxis ] >= 0.0;
			uint c1 = leftToRight ? leftIndex : rightIndex;
			uint c2 = leftToRight ? rightIndex : leftIndex;

			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in
			// the stack while we traverse. The second pointer added is the one that will be
			// traversed first
			pointer ++;
			stack[ pointer ] = c2;
			pointer ++;
			stack[ pointer ] = c1;

		}

	}

	return sqrt( closestDistanceSquared );

}
`,kt=`

#ifndef TRI_INTERSECT_EPSILON
#define TRI_INTERSECT_EPSILON 1e-5
#endif

// Raycasting
bool intersectsBounds( vec3 rayOrigin, vec3 rayDirection, vec3 boundsMin, vec3 boundsMax, out float dist ) {

	// https://www.reddit.com/r/opengl/comments/8ntzz5/fast_glsl_ray_box_intersection/
	// https://tavianator.com/2011/ray_box.html
	vec3 invDir = 1.0 / rayDirection;

	// find intersection distances for each plane
	vec3 tMinPlane = invDir * ( boundsMin - rayOrigin );
	vec3 tMaxPlane = invDir * ( boundsMax - rayOrigin );

	// get the min and max distances from each intersection
	vec3 tMinHit = min( tMaxPlane, tMinPlane );
	vec3 tMaxHit = max( tMaxPlane, tMinPlane );

	// get the furthest hit distance
	vec2 t = max( tMinHit.xx, tMinHit.yz );
	float t0 = max( t.x, t.y );

	// get the minimum hit distance
	t = min( tMaxHit.xx, tMaxHit.yz );
	float t1 = min( t.x, t.y );

	// set distance to 0.0 if the ray starts inside the box
	dist = max( t0, 0.0 );

	return t1 >= dist;

}

bool intersectsTriangle(
	vec3 rayOrigin, vec3 rayDirection, vec3 a, vec3 b, vec3 c,
	out vec3 barycoord, out vec3 norm, out float dist, out float side
) {

	// https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d
	vec3 edge1 = b - a;
	vec3 edge2 = c - a;
	norm = cross( edge1, edge2 );

	float det = - dot( rayDirection, norm );
	float invdet = 1.0 / det;

	vec3 AO = rayOrigin - a;
	vec3 DAO = cross( AO, rayDirection );

	vec4 uvt;
	uvt.x = dot( edge2, DAO ) * invdet;
	uvt.y = - dot( edge1, DAO ) * invdet;
	uvt.z = dot( AO, norm ) * invdet;
	uvt.w = 1.0 - uvt.x - uvt.y;

	// set the hit information
	barycoord = uvt.wxy; // arranged in A, B, C order
	dist = uvt.z;
	side = sign( det );
	norm = side * normalize( norm );

	// add an epsilon to avoid misses between triangles
	uvt += vec4( TRI_INTERSECT_EPSILON );

	return all( greaterThanEqual( uvt, vec4( 0.0 ) ) );

}

bool intersectTriangles(
	// geometry info and triangle range
	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// outputs
	inout float minDistance, inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	bool found = false;
	vec3 localBarycoord, localNormal;
	float localDist, localSide;
	for ( uint i = offset, l = offset + count; i < l; i ++ ) {

		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;
		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;
		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;
		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;

		if (
			intersectsTriangle( rayOrigin, rayDirection, a, b, c, localBarycoord, localNormal, localDist, localSide )
			&& localDist < minDistance
		) {

			found = true;
			minDistance = localDist;

			faceIndices = uvec4( indices.xyz, i );
			faceNormal = localNormal;

			side = localSide;
			barycoord = localBarycoord;
			dist = localDist;

		}

	}

	return found;

}

bool intersectsBVHNodeBounds( vec3 rayOrigin, vec3 rayDirection, sampler2D bvhBounds, uint currNodeIndex, out float dist ) {

	uint cni2 = currNodeIndex * 2u;
	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;
	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;
	return intersectsBounds( rayOrigin, rayDirection, boundsMin, boundsMax, dist );

}

// use a macro to hide the fact that we need to expand the struct into separate fields
#define	bvhIntersectFirstHit(		bvh,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)	_bvhIntersectFirstHit(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)

bool _bvhIntersectFirstHit(
	// bvh info
	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// output variables split into separate variables due to output precision
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	// stack needs to be twice as long as the deepest tree we expect because
	// we push both the left and right child onto the stack every traversal
	int pointer = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	float triangleDistance = INFINITY;
	bool found = false;
	while ( pointer > - 1 && pointer < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ pointer ];
		pointer --;

		// check if we intersect the current bounds
		float boundsHitDistance;
		if (
			! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh_bvhBounds, currNodeIndex, boundsHitDistance )
			|| boundsHitDistance > triangleDistance
		) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );

		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;

			found = intersectTriangles(
				bvh_position, bvh_index, offset, count,
				rayOrigin, rayDirection, triangleDistance,
				faceIndices, faceNormal, barycoord, side, dist
			) || found;

		} else {

			uint leftIndex = currNodeIndex + 1u;
			uint splitAxis = boundsInfo.x & 0x0000ffffu;
			uint rightIndex = currNodeIndex + boundsInfo.y;

			bool leftToRight = rayDirection[ splitAxis ] >= 0.0;
			uint c1 = leftToRight ? leftIndex : rightIndex;
			uint c2 = leftToRight ? rightIndex : leftIndex;

			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in
			// the stack while we traverse. The second pointer added is the one that will be
			// traversed first
			pointer ++;
			stack[ pointer ] = c2;

			pointer ++;
			stack[ pointer ] = c1;

		}

	}

	return found;

}
`,Rt=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,je=Object.freeze(Object.defineProperty({__proto__:null,bvh_distance_functions:Vt,bvh_ray_functions:kt,bvh_struct_definitions:Rt,common_functions:Ct},Symbol.toStringTag,{value:"Module"})),Ze=Rt,Ke=Vt,$e=`
	${Ct}
	${kt}
`;export{tn as AVERAGE,en as BVH,it as BVHHelper,je as BVHShaderGLSL,nn as CENTER,on as CONTAINED,sn as ExtendedTriangle,Ae as FloatVertexAttributeTexture,Bt as GeometryBVH,St as INTERSECTED,Xe as IntVertexAttributeTexture,Fe as LineBVH,he as LineLoopBVH,ue as LineSegmentsBVH,U as MeshBVH,ze as MeshBVHHelper,Ge as MeshBVHUniformStruct,Mt as NOT_INTERSECTED,rn as OrientedBox,He as PointsBVH,an as SAH,cn as SKIP_GENERATION,Ye as StaticGeometryGenerator,we as UIntVertexAttributeTexture,ot as VertexAttributeTexture,Oe as acceleratedRaycast,qe as computeBatchedBoundsTree,Le as computeBoundsTree,Ue as disposeBatchedBoundsTree,We as disposeBoundsTree,Ve as estimateMemoryInBytes,ln as generateIndirectBuffer,Ce as getBVHExtremes,Re as getJSONStructure,dn as getTriangleHitPointInfo,Ke as shaderDistanceFunction,$e as shaderIntersectFunction,Ze as shaderStructs,ke as validateBounds};
