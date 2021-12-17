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
export function createTextSprite(text,opts) {
    var canvas=getTextCanvas(text,opts);
    var texture=new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var size=opts.size||10;
    var sprite;
    if (opts.floating) {
	var color=new THREE.Color(opts.color || 0x0000ff);
	//console.log( texture.image.width, texture.image.height );
	var options={
	    map: texture,
	    vertexColors: THREE.VertexColors,
	    size:size*(opts.scale||1),
	    transparent:true,
	    //alphaTest:0.01,
	    //useScreenCoordinates: true,
	};
	if (opts.alphaTest !== undefined) {options.alphaTest=opts.alphaTest};
	var material = new THREE.PointsMaterial(options);
	var geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position',new THREE.Float32BufferAttribute(
	    new THREE.Vector3(opts.x,opts.y,opts.z).toArray(),3));
	geometry.setAttribute('color',new THREE.Float32BufferAttribute([1,1,1],3));
	geometry.setAttribute('alpha',new THREE.Float32BufferAttribute([1],1));
	var sizes = new Float32Array(1);
	sizes[0]=1;
	modifyShaders(geometry,material, sizes);
	sprite = new THREE.Points(geometry, material);
	sprite.width=canvas.width;
	sprite.height=canvas.height;
    } else {
	var options={
	    map: texture,
	    //needsUpdate:true,
	    //useScreenCoordinates: false,
	    sizeAttenuation:opts.sizeAttenuation||true,
	    //alphaTest:0.01,
	    transparent: true,
	};
	if (opts.alphaTest !== undefined) {options.alphaTest=opts.alphaTest};
	var material = new THREE.SpriteMaterial(options);
	sprite = new THREE.Sprite(material);
	sprite.width=canvas.width;
	sprite.height=canvas.height;
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
	sprite.name=opts.name || "text";
    };
    return sprite;
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

