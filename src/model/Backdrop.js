//import Vector3 from './Vector3Lib';
//import Vector2 from './Vector2Lib';
import * as THREE from 'three';

console.log("Loading Backdrop");

function Backdrop() { 
    this.debug=false;
    this.SCALE = 1.0e-15;
    this.X =          0;
    this.Y =          1;
    this.Z =          2;
    this.MAG =        3;
    this.SPECT =      4;
    this.RA =         5;
    this.DEC =        6;
    this.LABEL =      7;
    this.CLASS =      8;
    this.CONST =      9;
    this.CONSTID =    10;
    this.NAME =       11;
    this.BRIGHTNESS = 12;
    this.BRIGHTNLEV = 13;
    this.DIST = 5.0*Math.PI/180.0;
    this.NLAT=Math.ceil(Math.PI/this.DIST);
    this.NLON=2*this.NLAT;
    this.SMAG = 5;
    this.NMAG = 10;
    this.spectralColors = [
	0xfbf8ff,
	0xc8d5ff,
	0xd8e2ff,
	0xe6ecfc,
	0xfbf8ff,
	0xfff4e8,
	0xffeeda,
	0xfeead3,
	0xfccecb,
	0xebd3da,
	0xe7dbf3
    ];
    //this.sprites=["flare.png"];
    this.sprites=["flare.png"];
    this.fullStarsURL=process.env.PUBLIC_URL+"/media/stars/";
    this.constellations=[];
    this.stars = {
	'ZubenElschemali' : ['ZubenElgenubi','Brachium','gLibra'],
	'ZubenElgenubi'   : ['Brachium'],
	'gLibra'          : ['dLibra'],
	'Brachium'        : ['uLibra'],
	'Mesarthim'       : ['Sharatan'],
	'Sharatan'        : ['Hamal'],
	'Hamal'           : ['xAries'],
	'AsellusAustralis' : ['Acubens','Altarf','AsellusBorealis'],
	'AsellusBorealis' : ['CancerIota'],
	'Sadalsuud'       : ['Albali','Sadalmeilk'],
	'Sadalmeilk'      : ['Ancha','etaAqua'],
	'Ancha'           : ['iotaAqua'],
	'etaAqua'         : ['phiAqua'],
	'phiAqua'         : ['lambdaAqua'],
	'lambdaAqua'      : ['tau2Aqua'],
	'tau2Aqua'        : ['xAqua'],
	'Dabih'           : ['SecundaGiedi','psiCap','thetaCap'],
	'psiCap'          : ['omegaCap'],
	'omegaCap'        : ['zetaCap'],
	'DenebAlgedi'     : ['zetaCap','thetaCap'],
	'Alhena'          : ['Alzirr','TejatPosterior'],
	'TejatPosterior'  : ['Mebsuta'],
	'Castor'          : ['Mebsuta','Pollux'],
	'Wasat'           : ['Alhena','Pollux'],
	'Denebola'        : ['Zosma','Chort'],
	'Algeiba'         : ['Zosma','etaLeo','Adhafera'],
	'Adhafera'        : ['RasElasedBorealis'],
	'RasElasedBorealis' : ['RasElasedAustralis'],
	'Regulus'         : ['etaLeo','Chort'],
	'deltaPisces'     : ['nuPisces','iotaPisces'],
	'kappaPisces'     : ['gammaPisces','xPisces'],
	'iotaPisces'      : ['xPisces','thetaPisces'],
	'gammaPisces'     : ['thetaPisces'],
	//scorpius
	'Jabbah'          : ['Graffias'],
	'Dschubba'        : ['Graffias','piScorp','Antares'],
	'piScorp'         : ['rhoScorp'],
	'Antares'         : ['tauScorp'],
	'epsilonScorp'    : ['tauScorp','zeta2Scorp'],
	'etaScorp'        : ['Sargas','zeta2Scorp'],
	'Sargas'          : ['Shaula'],
	//virgo
	'Syrma'           : ['RijlAlAwwa','kappaVirgo'],
	'Spica'           : ['Heze','kappaVirgo','thetaVirgo'],
	'Porrima'         : ['Auva','Zaniah','thetaVirgo'],
	'Zavijah'         : ['Zaniah'],
	'Auva'            : ['Vindemiatrix','Heze'],
	'tauVirgo'        : ['8781','Heze'],
	//taurus
	'HyadumI'         : ['lambdaTaurus','HyadumII','Aldebaran'],
	'Ain'             : ['tauTaurus','HyadumII'],
	'AlNath'          : ['tauTaurus'],
	'zetaTaurus'      : ['Aldebaran'],
	'omicronTaurus'   : ['lambdaTaurus'],
	//sagittarius
	'Nash'            : ['KausMedia','7317'],
	'KausAustralis'   : ['KausMedia','etaSag'],
	'KausBorealis'    : ['phiSag','KausMedia','muSag'],
	'Nunki'           : ['phiSag','tauSag'],
	'Ascella'         : ['phiSag','tauSag'],
	'7320'            : ['tauSag','7336'],
	'theta1Sag'       : ['7336']
    };
    this.defaultSize = 0.1 * Math.tan( ( Math.PI / 180 ) * 45.0 / 2 );;
    this.descriptions=undefined;
    this.starsJson = 'data/stars.json'; // state.File.load will append full URL
    this.constJson = 'data/const.json';
    this.descrJson = 'data/descr.json';
    this.pxRatio = (window.devicePixelRatio || 1);
    //keys of the loaded array
    this.namedStars = {};
    this.starList=[];
    this.initialised=false;
    // workspace
    this.canvasWidth=undefined;
    this.canvasHeight=undefined;
    this.canvasData=undefined;
    this.ll = this.starList.length;
    this.fact=undefined;
    this.cnt=undefined;
    this.position=undefined;
    this.iw=undefined;
    this.ih=undefined;
    this.index=undefined;
    this.mf=undefined;
    this.r=undefined;
    this.g=undefined;
    this.b=undefined;
    this.a=undefined;
    this.ln10=Math.log(10);
    this.parsec= 3.08567758e13;// km 
    this.lightyear = 9.4605284e12; // km
    this.radius = 30000.0*this.lightyear*this.SCALE;
    this.cons=undefined;
    this.cpos=undefined;
    this.dist=undefined;
    this.ow=undefined;
    this.oh=undefined;
    this.period=5000.0;
    this.first=undefined;
    //
    this.prepareForRender=function(scene,camera) {
	var points=scene.getObjectByName("stars");
	if (points !== undefined) {
	    points.material.size = this.defaultSize / Math.tan( ( Math.PI / 180 ) * camera.fov / 2 );
	};
    };

    this.createStarsScene	= function(){
	var scene = new THREE.Scene();
	var stars=this.createStarsBackdrop();
	scene.add(stars);
	return scene;
    };
    this.createNavigationScene	= function(){
	var scene = new THREE.Scene();
	var nav=this.createNavigationBackdrop();
	scene.add(nav);
	return scene;
    };
    this.createStarsBackdrop	= function(){
	//https://jsfiddle.net/prisoner849/z3yfw208/
	var material = new THREE.PointsMaterial({ color:0x000000, vertexColors: THREE.VertexColors, transparent:true, alphaTest:0.01 }); //   alphaTest: 0.99
	//var material = new THREE.SpriteMaterial({ vertexColors: THREE.VertexColors, alphaTest: 0.99}); //  
	//this.addTextureMap(material,this.fullStarsURL + "ball.png");
	this.addTextureMap(material,this.fullStarsURL + this.sprites[0]);
	var geometry = new THREE.InstancedBufferGeometry();
	//var geometry = new THREE.BufferGeometry();
	var positions = new Float32Array(30000);
	var colors = new Float32Array(30000);
	var sizes = new Float32Array(10000);
	var alphas = new Float32Array(10000);
	for (let i = 0; i < 10000; i++) {
            let x = 2000 * Math.random() - 1000;
            let y = 2000 * Math.random() - 1000;
            let z = 2000 * Math.random() - 1000;
            positions[i * 3 + 0] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            colors[i * 3 + 0] = 0.5+0.5*Math.random();
            colors[i * 3 + 1] = 0.5+0.5*Math.random();
            colors[i * 3 + 2] = 0.5+0.5*Math.random();
            
            sizes[i] = 0*(Math.random() * 90) + 90;
            //alphas[i] = 1;
	}
	this.modifyShaders(geometry,material,sizes);
	geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
	//geometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
	var sprites = new THREE.Points( geometry, material );
	//var sprites = new THREE.Sprite( geometry, material );
	sprites.name       = "stars";
	return sprites	
    };
    this.createNavigationBackdrop=function() {
	var group=new THREE.Group();
	group.name="lines";
	var radius=1000.0;
	var dlat=10;
	var dlon=10;
	var look=new THREE.Vector3(0,0,1);
	var offset=new THREE.Vector3(0,0,0);
	let size=radius*0.05;
	let colorMinor=0x222222; let colorMinoh="#222222";
	let colorMajor=0x222266; let colorMajoh="#222266";
	let width=2;
	for (let ilat=-80;ilat<=80;ilat+=dlat) {
	    let hgt=radius * Math.sin(ilat*Math.PI/180.0);
	    offset=new THREE.Vector3(0,0,hgt);
	    let color=colorMinor;
	    let colorh=colorMinoh;
	    if (ilat === 0.0) {color=colorMajor;colorh=colorMajoh}
	    group.add(this.createCircleMesh(radius*Math.cos(ilat*Math.PI/180),look,offset,color,width));
	    //if (ilat%30 === 0.0) {
		let x=radius*Math.cos(ilat*Math.PI/180);
		let y=0;
		group.add(this.createTextSprite(""+ilat,{
		    font:'48px Arial',
		    //floating:true,
		    fillStyle:colorh,
		    size:size,
		    cx:1,cy:0,
		    x:x,y:y,z:offset.z,
		    //border:true,
		}));
		group.add(this.createTextSprite(""+ilat,{
		    font:'48px Arial',
		    //floating:true,
		    fillStyle:colorh,
		    size:size,
		    cx:1,cy:0,
		    x:-x,y:y,z:offset.z,
		    //border:true,
		}));
		group.add(this.createTextSprite(""+ilat,{
		    font:'48px Arial',
		    //floating:true,
		    fillStyle:colorh,
		    size:size,
		    cx:1,cy:0,
		    x:0,y:-x,z:offset.z,
		    //border:true,
		}));
		group.add(this.createTextSprite(""+ilat,{
		    font:'48px Arial',
		    //floating:true,
		    fillStyle:colorh,
		    size:size,
		    cx:1,cy:0,
		    x:0,y:x,z:offset.z,
		    //border:true,
		}));
	    //};
	};
	offset=new THREE.Vector3();
	for (let ilon=-90;ilon<=80;ilon+=dlon) {
	    look=new THREE.Vector3(Math.cos(ilon*Math.PI/180),Math.sin(ilon*Math.PI/180),0,0);
	    let color=colorMinor;
	    let colorh=colorMinoh;
	    if (ilon === -90.0 || ilon === 0.0) {color=colorMajor;colorh=colorMajoh}
	    group.add(this.createCircleMesh(radius,look,offset,color,width));
	    let x=radius*Math.cos(ilon*Math.PI/180);
	    let y=radius*Math.sin(ilon*Math.PI/180);
	    group.add(this.createTextSprite(""+(360+180-ilon)%360,{
		font:'48px Arial',
		//floating:true,
		fillStyle:colorh,
		size:size,
		cx:0,cy:0,
		x:x,y:y,z:0,
		//border:true,
	    }));
	    group.add(this.createTextSprite(""+(360-ilon)%360,{
		font:'48px Arial',
		//floating:true,
		fillStyle:colorh,
		size:size,
		cx:0,cy:0,
		x:-x,y:-y,z:0,
		//border:true,
	    }));
	};
	return group;
    }
    this.createCircleMesh=function(radius,look,offset,color,width) {
	if (radius===undefined) {radius=1000;};
	if (color===undefined) {color=0x222222;};
	if (width===undefined) {width=3;};
	var geometry=this.circleGeometry(radius,120);
	var material = new THREE.LineDashedMaterial( {color: color,
						      linewidth:width,
//						      dashSize: radius*0.009,
//						      gapSize: radius*0.001
						     } );
	var mesh = new THREE.LineLoop( geometry, material );
	if (offset !== undefined) {
	    mesh.position.set(offset.x,offset.y,offset.z);
	};
	if (look !== undefined) {
	    mesh.lookAt(look);
	};
//	mesh.computeLineDistances();
	return mesh
    };
    this.circleGeometry=function(radius,nn) {
	var geometry = new THREE.BufferGeometry();
	var positions = new Float32Array(3*nn);
	var dangle=(2*Math.PI/(nn-1));
	for (let i = 0; i < nn; i++) {
	    let angle=i*dangle;
            let x = radius*Math.sin(angle);
            let y = radius*Math.cos(angle);
            let z = 0.0;
            positions[i * 3 + 0] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
	};
	geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	return geometry;
    };
    this.getTextCanvas=function(text,opts) {
	var lines=text.split('\n');
	var longest = text.split('\n').sort(
	    function (a, b) {
		return b.length - a.length;
	    }
	)[0];
	var canvas = document.createElement('canvas');
	if (opts.width !== undefined) {canvas.width=opts.width;}
	if (opts.height !== undefined) {canvas.height=opts.height;}
	var context = canvas.getContext('2d');
	context.font         = opts.font         || "bold 48px Serif";
	context.fontSize     = opts.fontSize     || 48;
	context.textAlign    = opts.textAlign    || "left";
	context.textBaseline = opts.textBaseline || "top";//"top,hanging,middle,alphabetic,ideographic,bottom
	const metrics = context.measureText(longest);
	// this will reset the canvas...
	var width=Math.ceil(metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft+1+1);
	var lheight=Math.ceil(metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent+1);
	var height=lheight * lines.length;
	canvas.width=width;
	canvas.height=height;
	var dx=0,dy=0;
	if (opts.floating) {
	    var twidth=width;
	    var theight=height;
	    if (opts.cx !== undefined) {
		twidth=(width*2);
	    };
	    if (opts.cy !== undefined) {
		theight=(height*2);
	    };
	    var block=Math.max(theight,twidth);
	    canvas.height=block;
	    canvas.width=block;
	    if (opts.cx !== undefined) {
		dx=(canvas.width*0.5)-width;
	    };
	    if (opts.cy !== undefined) {
		dy=(canvas.height*0.5)-height;
	    };
	    opts.scale=canvas.height/lheight
	};
	//console.log( canvas.width, canvas.height );
	// final draw...
	if (opts.border) {
	    context.strokeStyle  = "#9999ff";
	    context.strokeRect(1, 1, canvas.width-2, canvas.height-2);
	};
	context.font         = opts.font         || "bold 48px Serif";
	context.fontSize     = opts.fontSize     || 48;
	context.textAlign    = opts.textAlign    || "left";
	context.textBaseline = opts.textBaseline || "top";
	context.fillStyle    = opts.fillStyle    || "#ff4444";
	var ox=0,oy=0;
	if (opts.cy !== undefined) {
	    oy=(canvas.height - height - 2*dy)*(opts.cy);
	    //console.log("Dy",dy,oy,height,canvas.height);
	};
	if (opts.cx !== undefined) {
	    ox=(canvas.width - width - 2*dx)*(1-opts.cx);
	}
	lines.forEach((ll,i) => {context.fillText(ll,ox+dx,oy+dy+i*lheight);});
	//context.fillText(text, 0, 0);
	return canvas;
    };
    this.createTextSprite=function(text,opts) {
	var canvas=this.getTextCanvas(text,opts);
	var texture=new THREE.Texture(canvas);
	texture.needsUpdate = true;
	var size=opts.size||10;
	var sprite;
	if (opts.floating) {
	    var color=new THREE.Color(opts.color || 0x0000ff);
	    //console.log( texture.image.width, texture.image.height );
	    var material = new THREE.PointsMaterial({
		map: texture,
		vertexColors: THREE.VertexColors,
		size:size*(opts.scale||1),
		transparent:true,
		//alphaTest:0.01,
		//useScreenCoordinates: false,
	    });
	    var geometry = new THREE.BufferGeometry();
	    geometry.setAttribute('position',new THREE.Float32BufferAttribute(
		new THREE.Vector3(opts.x,opts.y,opts.z).toArray(),3));
	    geometry.setAttribute('color',new THREE.Float32BufferAttribute([1,1,1],3));
	    geometry.setAttribute('alpha',new THREE.Float32BufferAttribute([1],1));
	    var sizes = new Float32Array(1);
	    sizes[0]=1;
	    this.modifyShaders(geometry,material, sizes);
	    sprite = new THREE.Points(geometry, material);
	} else {
	    var material = new THREE.SpriteMaterial({
		map: texture,
		//needsUpdate:true,
		//useScreenCoordinates: false,
		sizeAttenuation:opts.sizeAttenuation||true,
		transparent: true,
	    });
	    sprite = new THREE.Sprite(material);
	    if (opts.size !== undefined) {
		sprite.scale.set(canvas.width*size/100,canvas.height*size/100,canvas.height*size/100);
	    };
	    if (opts.cx !== undefined && opts.cy !== undefined) {
		sprite.center.set(opts.cx,opts.cy);
	    };
	}
	if (sprite !== undefined) {
	    if (opts.x !== undefined && opts.y !== undefined && opts.z !== undefined) {
		sprite.position.set(opts.x,opts.y,opts.z);
	    };
	    sprite.name="text";
	};
	//this.scene.add(sprite)
	return sprite;
    };
    this.addTextureMap=function(material,map) {
	if (map !== undefined) {
	    const textureLoader=new THREE.TextureLoader();
	    textureLoader.load(
		map,
		function(mapTexture) {
		    mapTexture.name=map;
		    mapTexture.center.setScalar(0.5);
		    //mapTexture.rotation= -Math.PI * 0.5;
		    material.map=mapTexture;
		    material.size=2.0;
		    material.color.setHex(0xffffff);
		    material.sizeAttenuation=true;
		    material.needsUpdate=true;
		},
		function ( xhr ) {
		    console.log( "Map:", (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		function ( xhr ) {
		    console.log( 'Map: An error happened '+map  );
		}
	    );
	};
	return material;
    };
    this.modifyShaders=function(geometry,material, sizes) {
	material.onBeforeCompile = shader => {
	    shader.vertexShader = `
    attribute float sizes;
    attribute vec3 offset;
    ` + shader.vertexShader;
	    //console.log(shader.vertexShader);
	    shader.vertexShader = shader.vertexShader.replace(
  		`#include <begin_vertex>`,
		`#include <begin_vertex>
    transformed += offset;
    `
	    )
	    shader.vertexShader = shader.vertexShader.replace(
  		`gl_PointSize = size;`,
		`gl_PointSize = size * sizes;`
	    )
	};

	var sumDisplacement =  [0, 0, 0, 0, 0, 0, 0, 0, 0];
	const sumDisp = new Float32Array(sumDisplacement);
	geometry.setAttribute( 'sizes', new THREE.BufferAttribute( sizes, 1 ) );
	geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(sumDisp, 3 ));
    };
    this.lightenDarkenColor = function (hex, amount) {
	var col = [hex >> 16, (hex >> 8) & 0x00FF,  hex & 0x0000FF];
	var mc=Math.max(1,Math.max(col[0],col[1],col[2]));
	var ma=Math.min(amount,255/mc);
	col[0]=Math.max(0,Math.min(255,col[0]*ma));
	col[1]=Math.max(0,Math.min(255,col[1]*ma));
	col[2]=Math.max(0,Math.min(255,col[2]*ma));
	return col;
    };
    this.numberWithCommas = function (x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };
    this.init = function(state) {
	this.starList=[];
	for (var imag=this.SMAG;imag < this.NMAG; imag++) {
	    this.starList[imag]=[];
	    for (var ilat=0;ilat < this.NLAT; ilat++) {	    
		this.starList[imag][ilat]=[];
		for (var ilon=0;ilon < this.NLON; ilon++) {	    
		    this.starList[imag][ilat][ilon]=[];
		}
	    }
	};
	var processStars=function(state,response,callbacks){this.generateStars(state,response,callbacks)}.bind(this);
	var processDescr=function(state,response,callbacks){this.generateDescr(state,response,callbacks)}.bind(this);
	var processConst=function(state,response,callbacks){this.generateConst(state,response,callbacks)}.bind(this);
	var loadStars=function(state,response,callbacks) {
	    state.File.load(state,this.starsJson,callbacks)}.bind(this);
	var loadDescr=function(state,response,callbacks) {
	    state.File.load(state,this.descrJson,callbacks)}.bind(this);
	var loadConst=function(state,response,callbacks) {
	    state.File.load(state,this.constJson,callbacks)}.bind(this);
	state.File.next(state,"",[loadStars,processStars,
				  loadDescr,processDescr,
				  loadConst,processConst,
				  function(state,response,callbacks) {
				      if (this.debug) {console.log("Done loading milkyway data...");}
				  }.bind(this)]);
    };
    this.cartesian2Spherical=function(vector,axis) {
	if (axis !== undefined) {
	    var xm = vector.x*axis.i.x + vector.y*axis.i.y + vector.z*axis.i.z;
	    var ym = vector.x*axis.j.x + vector.y*axis.j.y + vector.z*axis.j.z;
	    var zm = vector.x*axis.k.x + vector.y*axis.k.y + vector.z*axis.k.z;
   	    vector.r = Math.max(Math.sqrt(xm*xm+ym*ym+zm*zm),1e-10);
	    vector.lat = Math.asin(zm/vector.r);
	    if (Math.abs(xm) < 1e-7 && Math.abs(ym) < 1e-7) { 
		vector.lon = 0.0; 
	    } else { 
	        vector.lon = Math.atan2(ym,xm);
	    }
	} else {
   	    vector.r = Math.max(Math.sqrt(vector.x*vector.x+vector.y*vector.y+vector.z*vector.z),1e-10);
	    vector.lat = Math.asin(vector.z/vector.r);
	    if (Math.abs(vector.x) < 1e-7 && Math.abs(vector.y) < 1e-7) { 
		vector.lon = 0.0;
	    } else {
	        vector.lon = Math.atan2(vector.y,vector.x);
	    }
	    return vector;
	};
    };
    this.generateStars = function(state,json,callbacks) {
	var stars=[];
        try {
            var stars = JSON.parse(json);
        } catch (e) {
            //console.log("Stars response:",json);
            console.log("Invalid response:",this.dataURL+this.starsJson,json);
            alert("Stars '"+this.dataURL+this.starsJson+"' contains Invalid stars:"+e.name+":"+e.message);
        };
	var star;
	//var starVect;
	var mag;
	var name;
	var spectralType;
	var starColor;
	var cnt=0;
	var count = stars.length;
	if (this.debug) {console.log("Adding stars:",count);};
	for( var i=0; i<count; i++ ){
	    //if (i > 1000) {continue;};
	    star = stars[i];
	    //console.log("Looping:",i,star);
	    this.position = new THREE.Vector3(star[this.X], star[this.Y], star[this.Z]);
	    this.cartesian2Spherical(this.position);
	    //console.log("Looping:",i,star,this.position);
	    if(this.position.x === 0 && this.position.y === 0 && this.position.z === 0) continue;//dont add the sun
	    //this.position.multiplyScalar(9.4605284e9);//normalize().
	    this.position.multiplyScalar(this.parsec);// parsecs...
	    mag = this.position.mag = star[this.MAG];
	    name = star[this.NAME] || "";
	    spectralType = Math.round(star[this.SPECT]);
	    starColor  = this.spectralColors[spectralType] || this.spectralColors.F;
	    /**/
	    //this.position.size = Math.floor(10 * (2 + (1 / mag))) / 10;
	    var starRGB = this.lightenDarkenColor(starColor, Math.pow(10,-mag/2.5));
	    this.position.color = starRGB;
	    this.position.maxcolor=Math.max(starRGB[0],starRGB[1],starRGB[2]);
	    //console.log("Adding star:",starRGB,spectralType,mag);
	    if(name) {
		this.namedStars[name] = this.position;
		cnt++;
	    };
	    this.position.ra=star[this.RA];
	    this.position.dec=star[this.DEC];
	    this.position.lab=star[this.LABEL] || "";
	    this.position.cls=star[this.CLASS] || "";
	    this.position.con=star[this.CONST] || "";
	    this.position.cid=star[this.CONSTID];
	    this.position.name=name;
	    this.position.brt=star[this.BRIGHTNESS] || "";
	    this.position.lev=star[this.BRIGHTNLEV] || "";
	    this.position.imag = Math.min(this.NMAG-1,Math.max(this.SMAG,Math.floor(this.getIMag(this.position.mag))));
	    this.position.ilat = this.modulus(this.getILat(this.position.lat),this.NLAT);
	    this.position.ilon = this.modulus(this.getILon(this.position.lon),this.NLON);
	    this.position.phase=Math.random()*Math.PI*2.0;
	    var list = this.starList[this.position.imag][this.position.ilat][this.position.ilon];
	    list.push( this.position );
	};
	if (this.debug) {console.log("Stars with name:",cnt);};
	this.initialised=true;
	state.File.next(state,"",callbacks);
    }.bind(this);
    this.generateConst = function(state,json,callbacks) {
	var consts=[];
        try {
            consts = JSON.parse(json);
        } catch (e) {
            console.log("Invalid response:",this.dataURL+this.constJson,json);
            alert("Consts '"+this.dataURL+this.constJson+"' contains Invalid stars:"+e.name+":"+e.message);
        };
	for (var con in consts) {
	    var spos=new THREE.Vector3();
	    var xpos=new THREE.Vector3();
	    var scnt=0;
	    var smg=20;
	    var strokes=[];
	    var stks=consts[con];
	    var lenii = stks.length;
	    for( var ii=0; ii<lenii; ii++ ){
		var stk=stks[ii];
		var stroke=[];
		var lenjj=stk.length;
		for( var jj=0; jj<lenjj; jj++ ){
		    var pos=new THREE.Vector3(stk[jj][0],stk[jj][1],stk[jj][2]);
		    xpos.copy(pos).normalize();
		    var mg=stk[jj][3];
		    pos.brt=stk[jj][4];
		    pos.lev=stk[jj][5];
		    smg=Math.min(mg,smg);
		    this.cartesian2Spherical(pos);
		    pos.multiplyScalar(this.parsec);// parsecs...
		    spos.add(xpos);
		    scnt++;
		    stroke.push(pos);
		};
		strokes.push(stroke);
	    };
	    spos.divideScalar(Math.max(1,scnt));
	    spos.multiplyScalar(this.parsec);
	    this.constellations.push([spos,strokes,smg,con,
				       this.getConstellation(con),
				       this.getConstellationD(con)]);
	}
	if (this.debug){console.log("Adding constellations.");};
	state.File.next(state,"",callbacks);
    }.bind(this);
    this.generateDescr = function(state,json,callbacks) {
	var descr=[];
        try {
            descr = JSON.parse(json);
        } catch (e) {
            //console.log("Const response:",json);
            console.log("Invalid response:",this.dataURL+this.descrJson,json);
            alert("Descr '"+this.dataURL+this.descrJson+"' contains Invalid stars:"+e.name+":"+e.message);
        };
	this.descriptions=descr;
	if (this.debug) {console.log("Adding descriptions.");};
	state.File.next(state,"",callbacks);
    }.bind(this);
    this.componentToHex= function (c) {var hex = c.toString(16);return hex.length === 1 ? "0" + hex : hex;};
    this.rgbToHex = function (r, g, b) {
	return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);};
    this.drawStars = function(canvas,context,scene,camera){
	//var tnow=new Date().getTime();
	//var phase=(tnow/this.period)*Math.PI*2;
	if ( this.initialised) {
	    //context.setLineDash([1,0]);
	    context.textAlign="left";
	    context.fillStyle="#ff0000";
	    this.canvasWidth = canvas.width;
	    this.canvasHeight = canvas.height;
	    var limits=camera.getSphericalLimits();
	    //console.log("Width=",canvasWidth," height=",canvasHeight," stars=",ll);
	    this.fact=9/(camera.getFovX()*camera.getFovY());// background intensity measure, 3x3 pixels => full color
	    this.cnt=0;
	    limits.nlatmin=this.getILat(limits.latmin);
	    limits.nlatmax=this.getILat(limits.latmax);
	    limits.nlonmin=this.getILon(limits.lonmin);
	    limits.nlonmax=this.getILon(limits.lonmax);
	    limits.nmag = Math.min(this.NMAG,Math.max(this.SMAG+1,this.getIMag(-2.5*this.log10(50/(255*this.fact)))));
	    //console.log("Nmag:",this.NMAG,-2.5*this.log10(10/(255*this.fact)),10/(255*this.fact),limits.nmag);
	    this.tot=0;
	    this.cnt=0;
	    this.mag=0;
	    this.col=255;
	    var pos = new THREE.Vector3();
	    var observer=scene.observer;
	    var axis={i:new THREE.Vector3(),j:new THREE.Vector3(),k:new THREE.Vector3()};
	    axis.k.copy(observer.zenith);
	    axis.j.crossVectors(axis.k,observer.k);
	    axis.j.normalize();
	    axis.i.crossVectors(axis.j, axis.k);
	    for (var ilat = limits.nlatmin; ilat <= limits.nlatmax; ilat++) {
		for (var ilon = limits.nlonmin; ilon <= limits.nlonmax; ilon++) {
		    for (var imag = this.SMAG; imag < limits.nmag; imag++) {
			var list=this.starList[imag][this.modulus(ilat,this.NLAT)][this.modulus(ilon,this.NLON)];
			if (list === undefined) {
			    console.log("Missing starlist:",
					imag,
					this.modulus(ilat,this.NLAT),
					this.modulus(ilon,this.NLON));
			}
			this.ll = list.length;
			for (var ii = 0; ii < this.ll; ii++) { // LOOP OVER SECTOR STARS
			    this.position=list[ii];
			    this.tot=this.tot+1;
			    this.mf=Math.min(this.fact,255/this.position.maxcolor);
//			    var cc=this.position.maxcolor*(0.9 + 0.1*Math.sin(phase+this.position.phase));
//			    this.mf0=Math.min(this.fact,255/cc);
			    camera.vector2Angle(this.position);
			    camera.angle2Screen(this.position);
			    this.iw=Math.floor(this.position.w+0.5);
			    this.ih=Math.floor(this.position.h+0.5);
			    //console.log("Star:",ii,x,y,camera.screen.left,camera.screen.left+camera.screen.width,
			    //	    camera.screen.top,camera.screen.top + camera.screen.height);
			    if (this.iw >= camera.screen.left && this.iw <= camera.screen.left+camera.screen.width  &&
				this.ih >= camera.screen.top  && this.ih <= camera.screen.top + camera.screen.height) {
				this.cnt=this.cnt+1;
				this.mag=Math.max(this.mag,this.position.mag);
				this.col=Math.min(this.col,+this.mf*this.position.maxcolor);
				//this.canvasData = context.getImageData(this.iw, this.ih,1,1);
				// //this.index = (this.iw + this.ih * this.canvasWidth) * 4;
				// this.index=0;
				// this.mc=Math.max(this.position.color[0],this.position.color[1],this.position.color[2]);
				this.r = Math.ceil(Math.min(255,Math.max(0,this.mf*this.position.color[0])));
				this.g = Math.ceil(Math.min(255,Math.max(0,this.mf*this.position.color[1])));
				this.b = Math.ceil(Math.min(255,Math.max(0,this.mf*this.position.color[2])));
				this.a = 255;
				
				var dd=camera.getDiameter(this.position.mag);
				//var bb=Math.sqrt(Math.max(1,this.fact/this.mf));
				//console.log("Magnitude:",dd,bb);
				var col=this.rgbToHex(this.r,this.g,this.b);
				//console.log("Adding star:.",col,this.r,this.g,this.b,this.position.maxcolor*this.mf, this.position.color[0],this.position.color[1],this.position.color[2],"mf:",this.mf,this.fact);
				
				camera.drawAura(context,this.iw,this.ih,dd,col);
				this.drawText(context,this.iw,this.ih,dd,pos,axis);
			    }
			}
		    }
		}
	    }
	    //if (this.col < 2) {
		//console.log("Drew stars:",this.cnt," of ",this.tot," max(mag):",this.mag,limits.nmag," col:",this.col);
	    //}
	    // for (var ii = 0; ii < -ll; ii++) {
	    // 	this.position=this.starList[ii];
	    // 	camera.vector2Angle(position);
	    // 	camera.angle2Screen(position);
	    // 	var x=Math.floor(position.w+0.5);
	    // 	var y=Math.floor(position.h+0.5);
	    // 	if (x >= camera.screen.left && x <= camera.screen.left+ camera.screen.width  &&
	    // 	    y >= camera.screen.top  && y <= camera.screen.top + camera.screen.height) {
	    // 	    context.beginPath();
	    // 	    context.setLineDash([]);
	    // 	    context.arc(x,y,10, 0, 2*Math.PI);
	    // 	    context.stroke();
	    // 	};
	    // }
	};
    };
    this.drawText = function(context,ww,hh,dd,pos,axis,scene,camera){
	if (dd>2) {
	    context.fillStyle="#ff0000";
	    var posy=hh;
	    if (this.position.name) {
		context.font="30px Arial";
		context.fillText(" "+this.position.name,ww,posy);
	    };
	    posy=posy+20;
	    context.font="16px Arial";
	    if (dd > 10 ){
		if (this.position.lab) {
		    context.fillText("   "+this.position.lab,ww,posy);
		    posy+=20;
		}
		if (this.position.con) {
		    if (this.position.brt) {
			context.fillText("   "+this.getConstellation(this.position.con)+" ("
					 +this.getBrightness(this.position.brt) + this.position.lev+")",ww,posy);
			posy+=20;
		    } else {
			context.fillText("   "+this.getConstellation(this.position.con),ww,posy);
			posy+=20;
		    }
		}
		if (this.position.cls) {
		    context.fillText("   "+this.getClass(this.position.cls),ww,posy);
		    posy+=20;
		}
		posy+=5;
	    };
	    if (dd > 50  && scene.defined){
		pos.subVectors(this.position,camera.position);
		this.cartesian2Spherical(pos,axis);
		var dist=pos.length();
		var dparsec=this.numberWithCommas(Math.round(dist/this.parsec));
		var dlightyear=this.numberWithCommas(Math.round(dist/this.lightyear));
		context.fillText("   dis="+dparsec+" parsec ("+dlightyear+" ly)",ww,posy);
		posy+=20;
		context.fillText("   azi="+parseFloat((360.0-(pos.lon*180.0/Math.PI))%360.0).toFixed(3)+" deg",ww,posy);
		posy+=20;
		context.fillText("   ele="+parseFloat(pos.lat*180.0/Math.PI).toFixed(3)+" deg",ww,posy);
		posy+=20;
	    };
	    if (dd > 50){
		context.font="16px Arial";
		context.fillText("   ra ="+parseFloat(this.position.ra).toFixed(2)+" hrs",ww,posy);
		posy+=20;
		context.fillText("   dec="+parseFloat(this.position.dec).toFixed(2)+" deg",ww,posy);
		posy+=20;
	    };
	}
    };
    this.drawConstellations = function(state,canvas,context,scene,camera){
	var alpha=0;
	var tnow=new Date().getTime();
	var ftime=Math.max(0,Math.min(1.0,(tnow-state.Chain.consTime)/1000));
	if (state.Chain.consReq === 0) {
	    if (ftime === 1.0) { return;}
	    alpha=1-ftime;
	} else {
	    alpha=ftime;
	}
	var fact=10/(camera.getFovX()*camera.getFovY());
	var dd=Math.sqrt(Math.max(1,fact));
	if ( this.initialised) {
	    context.strokeStyle="#ff0000";
	    context.fillStyle="#ff0000";
	    context.font="60px Arial";
	    context.textAlign="center";
	    context.globalAlpha=alpha;
	    // determine "closest" constellation
	    var iimin=this.getCurrentConstellation(camera);
	    // plot "closest" constellation
	    var fnew=Math.max(0,Math.min(1.0,(tnow-state.Chain.lastTime)/1000));
	    if (iimin === state.Chain.lastCon) {
		state.Chain.lastTime=tnow;
		fnew=1.0;
	    } else if (fnew >= 1.0) {
		state.Chain.lastCon=iimin;
		state.Chain.lastTime=tnow;
		fnew=1.0;
	    };
	    if (fnew < 1.0) {
		context.globalAlpha=alpha*fnew;
		if (iimin >= 0) {
		    this.drawConstellation(canvas,context,scene,camera,iimin,dd);
		};
		context.globalAlpha=alpha*(1.0-fnew);
		if (state.Chain.lastCon >= 0) {
		    this.drawConstellation(canvas,context,scene,camera,state.Chain.lastCon,dd);
		};	
		context.globalAlpha=alpha;
	    } else {
		if (iimin >= 0) {
		    this.drawConstellation(canvas,context,scene,camera,iimin,dd);
		};
	    }
	    // draw all constellation names
	    this.drawConstellationNames(canvas,context,scene,camera,alpha,iimin,dd);
	    context.globalAlpha=1.0;
	    context.strokeStyle="#ffffff";
	}
    };
    this.getCurrentConstellation = function (state,camera) {
	var iimin=-1;
	var distmin=0;
	var first=true;
	var len = this.constellations.length;
	for (var ii = 0; ii < len; ii++) {
	    var cons=this.constellations[ii];
	    var cpos=cons[0];
	    camera.vector2Angle(cpos);
	    camera.angle2Screen(cpos);
	    if (cpos.k !== undefined) {
		var dist=(cpos.i*cpos.i+cpos.j*cpos.j);
		if (first || dist < distmin) {
		    first=false;
		    iimin=ii;
		    distmin=dist;
		};
	    }
	};
	return iimin;
    };  
    this.drawConstellation = function (state,canvas,context,scene,camera,iimin,dd) {
	var cons=this.constellations[iimin];
	//var cpos=cons[0];
	//var mg=Math.max(0,cons[2]);
	//var con=cons[3];
	var strokes=cons[1];
	var lens=strokes.length;
	var font="30px Arial";
	for (var jj = 0; jj < lens; jj++) {
	    this.stroke=strokes[jj];
	    this.lenx=this.stroke.length;
	    context.lineWidth=5;
	    this.first=true;
	    for (var pp = 0; pp < this.lenx; pp++) {
		this.pos=this.stroke[pp];
		camera.vector2Angle(this.pos);
		camera.angle2Screen(this.pos);
		this.v= camera.visible(this.pos);
		if (this.first) {
		    this.first=false;
		} else  {
		    context.beginPath();
		    context.moveTo(this.ow,this.oh);
		    context.lineTo(this.pos.w,this.pos.h);
		    context.stroke();
		};
		if (this.v) {
		    if (dd > 9 && dd < 50 && this.pos.brt && this.pos.brt !== "ID") {
			context.font=font;
			context.textAlign="right";
			if (this.pos.lev) {
			    context.fillText(this.getBrightness(this.pos.brt) + this.pos.lev,this.pos.w-10,this.pos.h);
			} else {
			    context.fillText(this.getBrightness(this.pos.brt),this.pos.w-10,this.pos.h);
			}
		    }
		};
		this.ow=this.pos.w;
		this.oh=this.pos.h;
	    };
	    context.lineWidth=1;
	}
    };
    this.drawConstellationNames = function (state,canvas,context,scene,camera,alpha,iimin,dd) {
	var len = this.constellations.length;
	//var px=Math.max(20,Math.min(60,Math.floor((camera.screen.width/5)*(0.1/camera.getFovX()))));
	var nfont="48px Arial";
	var dfont="30px Arial";
	//console.log("font n:",nfont," d:",dfont);
	for (var ii = 0; ii < len; ii++) {
	    var cons=this.constellations[ii];
	    var cpos=cons[0];
	    //var mg=Math.max(0,cons[2]);
	    //var con=cons[3]
	    var name=cons[4];
	    var descr=cons[5];
	    this.iw=Math.floor(cpos.w+0.5);
	    this.ih=Math.floor(cpos.h+0.5);
	    if (cpos.k !== undefined) {
		if (this.iw >= camera.screen.left && this.iw <= camera.screen.left+camera.screen.width  &&
		    this.ih >= camera.screen.top  && this.ih <= camera.screen.top + camera.screen.height) {
		    context.font=nfont;
		    context.textAlign="center";
		    // print name
		    //context.strokeStyle="#000022";
		    if (ii === iimin) {
			context.globalAlpha=Math.min(1,alpha+0.1);
			context.fillText(name,this.iw,this.ih);
			context.globalAlpha=alpha;
		    } else {
			context.globalAlpha=Math.max(0.1,alpha-0.3);
			context.fillText(name,this.iw,this.ih);
			context.globalAlpha=alpha;
		    }
		    if (dd>7) {
			context.font=dfont;
			context.fillText("("+descr+")",this.iw,this.ih+30);
			context.font="60px Arial";
		    }
		}
	    }
	}
    };
    this.setSectorLimits = function ( limits) {
	if (limits.latmin < 0 ) {
	    limits.latstart=Math.round( + 0.5 + (limits.latmin+Math.PI/2)/this.DIST);
	} else {
	    limits.latstart=Math.round( - 0.5 + (limits.latmin+Math.PI/2)/this.DIST);
	};
	if (limits.latmax < 0 ) {
	    limits.latstop=Math.round( + 0.5 + (limits.latmax+Math.PI/2)/this.DIST);
	} else {
	    limits.latstop=Math.round( - 0.5 + (limits.latmax+Math.PI/2)/this.DIST);
	};
	limits.lonstart=Math.floor(limits.lonmin/this.DIST);
	limits.lonstop=Math.floor(limits.lonmax/this.DIST);
    };
    this.getIMag = function (mag) {
	return Math.min(this.NMAG,Math.max(Math.round(mag),this.SMAG));
    };
    this.getILat = function (lat) {
	if (lat < 0 ) {
	    return Math.round( + 0.5 + (lat+Math.PI/2)/this.DIST);
	} else {
	    return Math.round( - 0.5 + (lat+Math.PI/2)/this.DIST);
	}
    };
    this.getILon = function (lon) {
	return Math.min(Math.floor(lon/this.DIST),this.NLON);
    };
    this.modulus = function (a,n) {
	return a - (n * Math.floor(a/n));
    };
    this.log10 = function (a) {
	return Math.log(a)/this.ln10;
    };
    this.getConstellation = function (con) {
	return this.descriptions["con"][con]["name"]||con;
    }.bind(this);
    this.getConstellationD = function (con) {
	return this.descriptions["con"][con]["descr"]||con;
    }.bind(this);
    this.getBrightness = function (brt) {
	if (this.descriptions["brt"][brt]) {
	    return String.fromCharCode(this.descriptions["brt"][brt]["code"]);
	} else {
	    return brt;
	}
    };
    this.getClass = function (cls) {
	return this.descriptions["class"][cls]||cls;
    }    
};
export default Backdrop;
    // this.createCircleMesh2=function() {
    // 	var geometry = new THREE.BufferGeometry();
    // 	var positions = new Float32Array(30);
    // 	for (let i = 0; i < 10; i++) {
    //         let x = 2000 * Math.random() - 1000;
    //         let y = 2000 * Math.random() - 1000;
    //         let z = 2000 * Math.random() - 1000;
    //         positions[i * 3 + 0] = x;
    //         positions[i * 3 + 1] = y;
    //         positions[i * 3 + 2] = z;
    // 	};
    // 	geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    // 	var material = new THREE.LineDashedMaterial( { color: 0xffffff, linewidth:3, dashSize: 10, gapSize: 5 } );
    // 	var mesh = new THREE.Line( geometry, material );
    // 	mesh.computeLineDistances();
    // 	return mesh
    // };



// function makeTextSprite( message, parameters )
//     {
//         if ( parameters === undefined ) parameters = {};
//         var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
//         var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
//         var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
//         var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
//         var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
//         var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

//         var canvas = document.createElement('canvas');
//         var context = canvas.getContext('2d');
//         context.font = "Bold " + fontsize + "px " + fontface;
//         var metrics = context.measureText( message );
//         var textWidth = metrics.width;

//         context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
//         context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

//         context.lineWidth = borderThickness;
//         roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

//         context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
//         context.fillText( message, borderThickness, fontsize + borderThickness);

//         var texture = new THREE.Texture(canvas) 
//         texture.needsUpdate = true;

//         var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
//         var sprite = new THREE.Sprite( spriteMaterial );
//         sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
//         return sprite;  
//     }




    // createPlane() {
    // 	//Create a plane that receives shadows (but does not cast them)
    // 	const planeGeometry = new THREE.PlaneGeometry( 2*this.Bodies.setup.sun.radius, 
    // 						       2*this.Bodies.setup.sun.radius, 
    // 						       32, 
    // 						       32);
    // 	const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x555555 } )
    // 	const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    // 	plane.position.set(0,-1*this.Bodies.setup.sun.radius,0);
    // 	plane.lookAt(0,1,0);
    // 	plane.receiveShadow = true;
    // 	return plane;
    // }
