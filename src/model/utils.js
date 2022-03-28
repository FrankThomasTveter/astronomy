import * as TWEEN from 'es6-tween';
import * as THREE from 'three';

export function coordinatesToPosition(coordinates, radius) {
    const [lat, long] = coordinates;
    const phi = (lat * Math.PI) / 180;
    const theta = ((long - 180) * Math.PI) / 180;
    const x = -radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);
    return [x, y, z];
}
export function getMarkerCoordinatesKey(marker) {
    return marker.coordinates.toString();
}
export function maxValue(array, callback) {
    let maxValue = 0;
    array.forEach(item => {
        if (callback(item) > maxValue) {
            maxValue = callback(item);
        }
    });
    return maxValue;
}
export function minValue(array, callback) {
    let minValue = Infinity;
    array.forEach(item => {
        if (callback(item) < minValue) {
            minValue = callback(item);
        }
    });
    return minValue;
}
export function tween(from, to, animationDuration, easingFunction, onUpdate, onEnd) {
    new TWEEN.Tween(from)
        .to(to, animationDuration)
        .easing(TWEEN.Easing[easingFunction[0]][easingFunction[1]])
        .on('update', onUpdate)
        .on('complete', onEnd)
        .start();
}

export function getURL(file) {
    return process.env.PUBLIC_URL+file; //"/media/stars/flare.png"
}

export function createSprite(opts) {
    var texture,canvas;
    if (opts.text !== undefined) {
	canvas=getTextCanvas(opts.text,opts);
	texture=new THREE.Texture(canvas);
    };
    if (texture !== undefined) {texture.needsUpdate = true;};
    var size=opts.size||10;
    var sprite;
    var options={
	sizeAttenuation:true,
	transparent: true,
	//alphaTest:0.01,
	//needsUpdate:true,
	//useScreenCoordinates: false,
    };
    if (texture !== undefined)              { options.map= texture;};
    if (opts.sizeAttenuation !== undefined) { options.sizeAttenuation=opts.sizeAttenuation ;}
    if (opts.alphaTest !== undefined)       { options.alphaTest=opts.alphaTest};
    var material = new THREE.SpriteMaterial(options);
    if (opts.path !== undefined) {this.addTextureMap(material,opts.path);};
    sprite = new THREE.Sprite(material);
    if (sprite !== undefined) {
	//console.log("Sprite:",opts,options,sprite);
	sprite.size=size/100;
	if (canvas !== undefined) {
	    sprite.width=canvas.width;
	    sprite.height=canvas.height;
	} else {
	    sprite.width=20;
	    sprite.height=20;
	};
	if (opts.size !== undefined) {
	    sprite.scale.set(sprite.width*sprite.size,sprite.height*sprite.size,sprite.height*sprite.size);
	};
	if (opts.cx !== undefined && opts.cy !== undefined) {
	    sprite.center.set(opts.cx,opts.cy);
	};
	if (opts.x !== undefined && opts.y !== undefined && opts.z !== undefined) {
	    sprite.position.set(opts.x,opts.y,opts.z);
	};
	sprite.name=opts.name || "text";
    } else {
	console.log("Unable to create sprite for ",JSON.stringify(opts));
    };
    return sprite;
};

export function createPoints(opts) {
    // get sun position
    //https://jsfiddle.net/prisoner849/z3yfw208/
    var material = new THREE.PointsMaterial({ color:0x000000, vertexColors: THREE.VertexColors, transparent:true, alphaTest:0.01 }); //   alphaTest: 0.99
    //var material = new THREE.SpriteMaterial({ vertexColors: THREE.VertexColors, alphaTest: 0.99}); //  
    //this.addTextureMap(material,this.fullStarsURL + "ball.png");
    this.addTextureMap(material,opts.path);
    var geometry = new THREE.InstancedBufferGeometry();
    //var geometry = new THREE.BufferGeometry();
    var ll=this.starList.length;
    var positions = new Float32Array(ll*3);
    var colors = new Float32Array(ll*3);
    var sizes = new Float32Array(ll);
    var alphas = new Float32Array(ll);
    for (let i = 0; i < ll; i++) {
	let ss=this.starList[i];
	//console.log("ss:",ss);
        positions[i * 3 + 0] = ss.x * this.parscale;
        positions[i * 3 + 1] = ss.y * this.parscale;
        positions[i * 3 + 2] = ss.z * this.parscale;
        colors[i * 3 + 0] = ss.color.r/255;
        colors[i * 3 + 1] = ss.color.g/255;
        colors[i * 3 + 2] = ss.color.b/255;
	var dist=Math.sqrt(ss.x*ss.x+ss.y*ss.y+ss.z*ss.z); // dist is in parsec
	var amag=Math.max(-30,Math.min(10,ss.mag - 5.0*this.log10(dist) + 5.0));  // dist is in parsec
        sizes[i] = this.parscale*10*Math.pow(10,-amag/5.0);
	//alphas[i] = 1;
    }
    this.modifyShaders(geometry,material,sizes);
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    //geometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
    var points = new THREE.Points( geometry, material );
    //var points = new THREE.Sprite( geometry, material );
    points.name       = "stars";
    this.replaceStarsBackdrop(points);
    return points	
};

export function getTextCanvas(text,opts) {
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
    // if (opts.floating) {
    // 	var twidth=width;
    // 	var theight=height;
    // 	if (opts.cx !== undefined) {
    // 	    twidth=(width*2);
    // 	};
    // 	if (opts.cy !== undefined) {
    // 	    theight=(height*2);
    // 	};
    // 	var block=Math.max(theight,twidth);
    // 	canvas.height=block;
    // 	canvas.width=block;
    // 	if (opts.cx !== undefined) {
    // 	    dx=(canvas.width*0.5)-width;
    // 	};
    // 	if (opts.cy !== undefined) {
    // 	    dy=(canvas.height*0.5)-height;
    // 	};
    // 	opts.scale=canvas.height/lheight
    // 	//console.log("Canvas:",text,canvas,opts.scale);
    // };
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

export function addTextureMap(material,map) {
    if (map !== undefined) {
	const textureLoader=new THREE.TextureLoader();
	textureLoader.load(
	    map,
	    function(mapTexture) {
		mapTexture.name=map;
		mapTexture.center.setScalar(0.5);
		//mapTexture.rotation= -Math.PI * 0.5;
		material.map=mapTexture;
		material.size=2000.0;
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
export function modifyShaders(geometry,material, sizes) {
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


// utility function
export function sceneTraverse(obj, fn){
    if (!obj) return
    fn(obj)
    if (obj.children && obj.children.length > 0) {
	obj.children.forEach(o => {
	    sceneTraverse(o, fn)
	})
    }
}
export function cleanScene(o) {
    if (o.geometry) {
        o.geometry.dispose()
        //console.log("dispose geometry ", o.geometry)                        
    }
    if (o.material) {
        if (o.material.length) {
            for (let i = 0; i < o.material.length; ++i) {
                o.material[i].dispose()
                //console.log("dispose material ", o.material[i])                                
            }
        }
        else {
            o.material.dispose()
            //console.log("dispose material ", o.material)                            
        }
    }
};

export function rgbToHex(r, g, b) {
    const componentToHex=function(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
    };
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
	r: parseInt(result[1], 16),
	g: parseInt(result[2], 16),
	b: parseInt(result[3], 16)
    } : null;
};
