/**
 * @module ol/renderer/webgl/WebGLSlideLayer
 */
import BaseVector from 'ol/layer/BaseVector.js';
import GeometryType from 'ol/geom/GeometryType.js';
import VectorEventType from 'ol/source/VectorEventType.js';
import ViewHint from 'ol/ViewHint.js';
import WebGLArrayBuffer from 'ol/webgl/Buffer.js';
import { assign } from 'ol/obj.js';
import * as mat4 from './m4.js';
import { createTransformString } from 'ol/render/canvas.js';
import CanvasLayerRenderer from 'ol/renderer/canvas/Layer.js';
import WebGLLayerRenderer, { WebGLWorkerMessageType, colorDecodeId, colorEncodeId, } from './WebGLRenderer.js'; // ol/renderer/webgl/Layer.js
import WebGLRenderTarget from 'ol/webgl/RenderTarget.js';
import { ARRAY_BUFFER, DYNAMIC_DRAW, ELEMENT_ARRAY_BUFFER } from 'ol/webgl.js';
import { AttributeType, DefaultUniform } from 'ol/webgl/Helper.js';
import { apply as applyTransform, create as createTransform, makeInverse as makeInverseTransform, multiply as multiplyTransform, compose as composeTransform, makeInverse, } from 'ol/transform.js';
import { assert } from 'ol/asserts.js';
import { buffer, createEmpty, equals, intersects, getIntersection, containsExtent, isEmpty } from 'ol/extent.js';
import { fromUserExtent } from 'ol/proj.js';
import { ENABLE_RASTER_REPROJECTION } from 'ol/reproj/common.js';
import { create as createWebGLWorker } from 'ol/worker/webgl.js';
import { getUid } from 'ol/util.js';
import { listen, unlistenByKey } from 'ol/events.js';

import * as util from './util';


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        function __() { this.constructor = d; }
        extendStatics(d, b);
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * @typedef {Object} CustomAttribute A description of a custom attribute to be passed on to the GPU, with a value different
 * for each slide.
 * @property {string} name Attribute name.
 * @property {function(import("../../Slide").default, Object<string, *>):number} callback This callback computes the numerical value of the
 * attribute for a given slide (properties are available as 2nd arg for quicker access).
 */
/**
 * @typedef {Object} SlideCacheItem Object that holds a reference to a slide, its geometry and properties. Used to optimize
 * rebuildBuffers by accessing these objects quicker.
 * @property {import("../../Slide").default} slide Slide
 * @property {Object<string, *>} properties Slide properties
 * @property {import("../../geom").Geometry} geometry Slide geometry
 */
/**
 * @typedef {Object} Options
 * @property {string} [className='ol-layer'] A CSS class name to set to the canvas element.
 * @property {Array<CustomAttribute>} [attributes] These attributes will be read from the slides in the source and then
 * passed to the GPU. The `name` property of each attribute will serve as its identifier:
 *  * In the vertex shader as an `attribute` by prefixing it with `a_`
 *  * In the fragment shader as a `varying` by prefixing it with `v_`
 * Please note that these can only be numerical values.
 * @property {string} vertexShader Vertex shader source, mandatory.
 * @property {string} fragmentShader Fragment shader source, mandatory.
 * @property {Object.<string,import("../../webgl/Helper").UniformValue>} [uniforms] Uniform definitions for the post process steps
 * Please note that `u_texture` is reserved for the main texture slot.
 * @property {Array<import("./Layer").PostProcessesOptions>} [postProcesses] Post-processes definitions
 */
/**
 * @classdesc
 * WebGL image renderer optimized for slide show.
 * All slides will be rendered as quads (two triangles forming a square). New data will be flushed to the GPU
 * every time the slide source changes.
 *
 * You need to provide vertex and fragment shaders for rendering. This can be done using
 * {@link module:ol/webgl/ShaderBuilder} utilities. These shaders shall expect a `a_position` attribute
 * containing the screen-space projected center of the quad, as well as a `a_index` attribute
 * whose value (0, 1, 2 or 3) indicates which quad vertex is currently getting processed (see structure below).
 *
 * To include variable attributes in the shaders, you need to declare them using the `attributes` property of
 * the options object like so:
 * ```js
 * new WebGLSlideLayerRenderer(layer, {
 *   attributes: [
 *     {
 *       name: 'size',
 *       callback: function(slide) {
 *         // compute something with the slide
 *       }
 *     },
 *     {
 *       name: 'weight',
 *       callback: function(slide) {
 *         // compute something with the slide
 *       }
 *     },
 *   ],
 *   vertexShader:
 *     // shader using attribute a_weight and a_size
 *   fragmentShader:
 *     // shader using varying v_weight and v_size
 * ```
 *
 * The following uniform is used for the main texture: `u_texture`.
 *
 * Please note that the main shader output should have premultiplied alpha, otherwise visual anomalies may occur.
 *
 * Slide are rendered as quads with the following structure:
 *
 * ```
 *   (u0, v1)      (u1, v1)
 *  [3]----------[2]
 *   |`           |
 *   |  `         |
 *   |    `       |
 *   |      `     |
 *   |        `   |
 *   |          ` |
 *  [0]----------[1]
 *   (u0, v0)      (u1, v0)
 *  ```
 *
 * This uses {@link module:ol/webgl/Helper~WebGLHelper} internally.
 *
 * @api
 */
var WebGLSlideLayerRenderer = /** @class */ (function (_super) {
    __extends(WebGLSlideLayerRenderer, _super);
    /**
     * @param {import("../../layer/Layer.js").default} layer Layer.
     * @param {Options} options Options.
     */
    function WebGLSlideLayerRenderer(layer, options) {
        var _this = this;
        var uniforms = options.uniforms || {};
        var projectionMatrixTransform = createTransform();
        uniforms[DefaultUniform.PROJECTION_MATRIX] = projectionMatrixTransform;
        _this = _super.call(this, layer, {
            className: options.className,
            uniforms: uniforms,
            postProcesses: options.postProcesses,
        }) || this;
        _this.sourceRevision_ = -1;
        _this.verticesBuffer_ = new WebGLArrayBuffer(ARRAY_BUFFER, DYNAMIC_DRAW);
        _this.indicesBuffer_ = new WebGLArrayBuffer(ELEMENT_ARRAY_BUFFER, DYNAMIC_DRAW);
        _this.program_ = _this.helper.getProgram(options.fragmentShader, options.vertexShader);
        _this.frameBuffer=_this.helper.getGL().createFramebuffer();
	_this.fadeOpacity = 0.996; // how fast the particle trails fade on each frame
	_this.pixelTransform = createTransform();
	_this.inversePixelTransform = createTransform();
	_this.setupTextureProgram = _this.initTextureProgram();
        /**
         * @type {boolean}
         * @private
         */
        var customAttributes = options.attributes
            ? options.attributes.map(function (attribute) {
                return {
                    name: 'a_' + attribute.name,
                    size: 1,
                    type: AttributeType.FLOAT,
                };
            })
            : [];
        /**
         * A list of attributes used by the renderer. By default only the position and
         * index of the vertex (0 to 3) are required.
         * @type {Array<import('../../webgl/Helper.js').AttributeDescription>}
         */
        _this.attributes = [
            {
                name: 'a_position',
                size: 2,
                type: AttributeType.FLOAT,
            },
            {
                name: 'a_index',
                size: 1,
                type: AttributeType.FLOAT,
            },
        ].concat(customAttributes);
        _this.customAttributes = options.attributes ? options.attributes : [];
        _this.previousExtent_ = createEmpty();
        /**
         * This transform is updated on every frame and is the composition of:
         * - invert of the world->screen transform that was used when rebuilding buffers (see `this.renderTransform_`)
         * - current world->screen transform
         * @type {import("../../transform.js").Transform}
         * @private
         */
        _this.currentTransform_ = projectionMatrixTransform;
        /**
         * This transform is updated when buffers are rebuilt and converts world space coordinates to screen space
         * @type {import("../../transform.js").Transform}
         * @private
         */
        _this.renderTransform_ = createTransform();
        /**
         * @type {import("../../transform.js").Transform}
         * @private
         */
        _this.invertRenderTransform_ = createTransform();
        /**
         * @type {Float32Array}
         * @private
         */
        _this.renderInstructions_ = new Float32Array(0);
        _this.worker_ = createWebGLWorker();
        _this.worker_.addEventListener('message', 
        /**
         * @param {*} event Event.
         * @this {WebGLSlideLayerRenderer}
         */
        function (event) {
            var received = event.data;
            if (received.type === WebGLWorkerMessageType.GENERATE_BUFFERS) {
                var projectionTransform = received.projectionTransform;
                this.verticesBuffer_.fromArrayBuffer(received.vertexBuffer);
                this.helper.flushBufferData(this.verticesBuffer_);
                this.indicesBuffer_.fromArrayBuffer(received.indexBuffer);
                this.helper.flushBufferData(this.indicesBuffer_);
                this.renderTransform_ = projectionTransform;
                makeInverseTransform(this.invertRenderTransform_, this.renderTransform_);
                this.renderInstructions_ = new Float32Array(event.data.renderInstructions);
                this.getLayer().changed();
            }
        }.bind(_this));
        /**
         * This object will be updated when the slide source changes.
         * @type {Object<string, SlideCacheItem>}
         * @private
         */
        _this.slideCache_ = [];
        /**
         * Amount of slides in the cache.
         * @type {number}
         * @private
         */
        _this.slideCount_ = 0;
	var sources = _this.getLayer().get("slides")||[];
	console.log("WebGLSlideLayerRenderer  Number of sources:",sources.length);

	// *** LOAD SOURCES, CREATE IMAGE-TEXTURES AND STORE IN CACHE
    	sources.forEach(function (source) {
            this.slideCache_.push(source);//this.createSlide()
            this.slideCount_++;
         }.bind(_this));

	// Use the re-projection of the image done in canvasImageLayer ************

	
	// // setup GLSL program
	// var program = webglUtils.createProgramFromScripts(gl, ["drawImage-vertex-shader", "drawImage-fragment-shader"]);

	// // look up where the vertex data needs to go.
	// var positionLocation = gl.getAttribLocation(program, "a_position");
	// var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

	// // lookup uniforms
	// var matrixLocation = gl.getUniformLocation(program, "u_matrix");
	// var textureLocation = gl.getUniformLocation(program, "u_texture");

	// // Create a buffer.
	// var positionBuffer = gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 


	/**
         * This object will be updated when the source changes. Key is uid.
         * @type {Object<string, SlideCacheItem>}
         * @private
         */
        _this.featureCache_ = {};
        /**
         * Amount of slides in the cache.
         * @type {number}
         * @private
         */
        _this.featureCount_ = 0;
        var source = _this.getLayer().getSource();
        _this.sourceListenKeys_ = [
            listen(source, VectorEventType.ADDFEATURE, _this.handleSourceFeatureAdded_, _this),
            listen(source, VectorEventType.CHANGEFEATURE, _this.handleSourceFeatureChanged_, _this),
            listen(source, VectorEventType.REMOVEFEATURE, _this.handleSourceFeatureDelete_, _this),
            listen(source, VectorEventType.CLEAR, _this.handleSourceFeatureClear_, _this),
        ];
	source.forEachFeature(function (slide) {
            this.featureCache_[getUid(slide)] = {
                slide: slide,
                properties: slide.getProperties(),
                geometry: slide.getGeometry(),
            };
            this.featureCount_++;
        }.bind(_this));
        return _this;
    }
    /**
     * @param {import("../../source/Vector.js").VectorSourceEvent} event Event.
     * @private
     */
    WebGLSlideLayerRenderer.prototype.handleSourceFeatureAdded_ = function (event) {
        var slide = event.slide;
        this.featureCache_[getUid(slide)] = {
            slide: slide,
            properties: slide.getProperties(),
            geometry: slide.getGeometry(),
        };
        this.featureCount_++;
    };
    /**
     * @param {import("../../source/Vector.js").VectorSourceEvent} event Event.
     * @private
     */
    WebGLSlideLayerRenderer.prototype.handleSourceFeatureChanged_ = function (event) {
        var slide = event.slide;
        this.featureCache_[getUid(slide)] = {
            slide: slide,
            properties: slide.getProperties(),
            geometry: slide.getGeometry(),
        };
    };
    /**
     * @param {import("../../source/Vector.js").VectorSourceEvent} event Event.
     * @private
     */
    WebGLSlideLayerRenderer.prototype.handleSourceFeatureDelete_ = function (event) {
        var slide = event.slide;
        delete this.featureCache_[getUid(slide)];
        this.featureCount_--;
    };
    /**
     * @private
     */
    WebGLSlideLayerRenderer.prototype.handleSourceFeatureClear_ = function () {
        this.featureCache_ = {};
        this.featureCount_ = 0;
    };
    /**
     * Render the layer.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @return {HTMLElement} The rendered element.
     */
    WebGLSlideLayerRenderer.prototype.renderFrame = function (frameState) {
        this.preRender(frameState);
        var renderCount = this.indicesBuffer_.getSize();
        this.helper.drawElements(0, renderCount);
        this.helper.finalizeDraw(frameState);
        var canvas = this.helper.getCanvas();
        var layerState = frameState.layerStatesArray[frameState.layerIndex];
        var opacity = layerState.opacity;
        if (opacity !== parseFloat(canvas.style.opacity)) {
            canvas.style.opacity = String(opacity);
        }
        this.postRender(frameState);

	// *** INTERPOLATE AND RENDER WEBGL VIEWPORT TEXTURE
	
	// at this point we have the two viewport textures that the webgl can interpolate between...
	// webglUtils.resizeCanvasToDisplaySize(gl.canvas);
	// // Tell WebGL how to convert from clip space to pixels
	// gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	
	// gl.clear(gl.COLOR_BUFFER_BIT); // ...or fade out the background texture
	
	// drawInfos.forEach(function(drawInfo) {
	//     drawImage(
	// 	drawInfo.textureInfo.texture,
	// 	drawInfo.textureInfo.width,
	// 	drawInfo.textureInfo.height,
	// 	drawInfo.x,
	// 	drawInfo.y);
	// });


        var size = frameState.size;
        var image = this.image_;

	if (size === undefined || ! image) {return canvas;};
        var imageExtent = image.getExtent();
        var imageResolution = image.getResolution();
        var imagePixelRatio = image.getPixelRatio();
        var layerState = frameState.layerStatesArray[frameState.layerIndex];
        var pixelRatio = frameState.pixelRatio;
        var viewState = frameState.viewState;
        var viewCenter = viewState.center;
        var viewResolution = viewState.resolution;
	
        var scale = (pixelRatio * imageResolution) / (viewResolution * imagePixelRatio);
        var width = Math.round(size[0] * pixelRatio);
        var height = Math.round(size[1] * pixelRatio);
        var rotation = viewState.rotation;
        if (rotation) {
            var size_1 = Math.round(Math.sqrt(width * width + height * height));
            width = size_1;
            height = size_1;
        }
        // set forward and inverse pixel transforms
	//console.log(JSON.stringify(this.pixelTransform),pixelRatio,size,rotation,width,height);
        composeTransform(this.pixelTransform, frameState.size[0] / 2, frameState.size[1] / 2, 1 / pixelRatio, 1 / pixelRatio, rotation, -width / 2, -height / 2);
	//console.log("Pixeltransform:",JSON.stringify(frameState.size),pixelRatio, width, height);
        makeInverse(this.inversePixelTransform, this.pixelTransform);
        //var canvasTransform = createTransformString(this.pixelTransform);
        //this.useContainer(target, canvasTransform, layerState.opacity);
        // var context = this.context;
        // var canvas = context.canvas;
        // if (canvas.width != width || canvas.height != height) {
        //     canvas.width = width;
        //     canvas.height = height;
        // }
        //else if (!this.containerReused) {
        //    context.clearRect(0, 0, width, height);
        // }
        // clipped rendering if layer extent is set
        var clipped = false;
        if (layerState.extent) {
            var layerExtent = fromUserExtent(layerState.extent, viewState.projection);
            clipped =
                !containsExtent(layerExtent, frameState.extent) &&
                    intersects(layerExtent, frameState.extent);
            //if (clipped) {
            //    this.clipUnrotated(context, frameState, layerExtent);
            //}
        }
        var img = image.getImage();
	this.tempTransform = createTransform();
        var transform = composeTransform(this.tempTransform, width / 2, height / 2, scale, scale, 0, (imagePixelRatio * (imageExtent[0] - viewCenter[0])) / imageResolution, (imagePixelRatio * (viewCenter[1] - imageExtent[3])) / imageResolution);
        this.renderedResolution = (imageResolution * pixelRatio) / imagePixelRatio;

	//console.log("Transform:",width, height, scale, (imagePixelRatio * (imageExtent[0] - viewCenter[0])) / imageResolution, (imagePixelRatio * (viewCenter[1] - imageExtent[3])) / imageResolution);



	var dx = transform[4];
        var dy = transform[5];
        var dw = img.width * transform[0];
        var dh = img.height * transform[3];
        //assign(context, this.getLayer().getSource().getContextOptions());
        //this.preRender(context, frameState);
        if (dw >= 0.5 && dh >= 0.5) {
            var opacity = layerState.opacity;
            var previousAlpha = void 0;
            if (opacity !== 1) {
                //previousAlpha = this.context.globalAlpha;
                //this.context.globalAlpha = opacity;
            }
	    //88888888888888888888888888888888888888888888888888888888888888
            //var canvasTransform = createTransformString(this.pixelTransform);

	    // the mapping is simple and does not change as long as screen does not change
	    // ...since texture is already mapped to canvas.

	    //console.log(0, 0, +img.width, +img.height,
		//	Math.round(dx), Math.round(dy),
	    	//	Math.round(dw), Math.round(dh),
		//	JSON.stringify(this.pixelTransform));

	    var dw=+img.width;
	    var dh=+img.height;
	    var ix=Math.round(dx);
	    var iy=Math.round(dy);
	    var dx=Math.round(dw);
	    var dy=Math.round(dh);
	    // Find prev/next texture, and index-factor and put in uniforms
	    var indx=1.5;
	    var prev=Math.floor(indx);
	    var next=Math.ceil(indx);
	    var frac=indx-prev;
	    var prevSlide=this.getSlideIndex(prev);
	    var nextSlide=this.getSlideIndex(next);
	    // make program that interpolates and renders to screen
	    // this.runTextureProgram(frac,prevSlide,nextSlide,0,0,dw,dh,ix,iy,dx,dy);

	    
	    //this.context.drawImage(img, 0, 0, +img.width, +img.height, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
            //if (opacity !== 1) {
            //    this.context.globalAlpha = previousAlpha;
            //}
        }
        // this.postRender(context, frameState);
        // if (clipped) {
        //     context.restore();
        // }
        // if (canvasTransform !== canvas.style.transform) {
        //     canvas.style.transform = canvasTransform;
        // }
	
	return canvas;
    };



    /**
     * Determine whether render should be called.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @return {boolean} Layer is ready to be rendered.
     */
    WebGLSlideLayerRenderer.prototype.prepareFrame = function (frameState) {
        var layer = this.getLayer();
        var sourceObject = layer.getSource();
        var viewState = frameState.viewState;
        var viewNotMoving = !frameState.viewHints[ViewHint.ANIMATING] &&
            !frameState.viewHints[ViewHint.INTERACTING];
        var extentChanged = !equals(this.previousExtent_, frameState.extent);
        var sourceChanged = this.sourceRevision_ < sourceObject.getRevision();
        if (sourceChanged) {
            this.sourceRevision_ = sourceObject.getRevision();
        }
        if (viewNotMoving && (extentChanged || sourceChanged)) {
            var projection = viewState.projection;
            var resolution = viewState.resolution;
            var renderBuffer = layer instanceof BaseVector ? layer.getRenderBuffer() : 0;
            var extent = buffer(frameState.extent, renderBuffer * resolution);

	    console.log("Extent:",JSON.stringify(extent));
	    
	    // The next line updates "sourceObject.loadedExtentsRtree_" which is not used....	    
            //sourceObject.loadSlides(extent, resolution, projection);
            this.rebuildBuffers_(frameState);
            this.previousExtent_ = frameState.extent.slice();
	}
        // apply the current projection transform with the invert of the one used to fill buffers
        this.helper.makeProjectionTransform(frameState, this.currentTransform_);
        multiplyTransform(this.currentTransform_, this.invertRenderTransform_);

	// *** SHIFT OLD BACKGROUND TEXTURE IF TRANSFORM HAS CHANGED
	// this should be done in a program that takes...
	// ...old background texture and maps to new background texture
	

	// *** STORE NEW TRANSFORM
	// The particleLayer needs the old inverseTransform so that
	// background texture-pixels (effects) can be repositioned to new background texture:
	//     newBgPixPos=oldBgPixPos*oldInvertTransform*newTransform
	
	this.helper.useProgram(this.program_);
        this.helper.prepareDraw(frameState);
        // write new data to cache and bind buffers
        this.helper.bindBuffer(this.verticesBuffer_);
        this.helper.bindBuffer(this.indicesBuffer_);
	// attach attributes to buffer
        this.helper.enableAttributes(this.attributes);





	// loop over relevant slides and make sub-texture

	// check if we can do the image processing (this will re-project the image to current projection)
        var layerState = frameState.layerStatesArray[frameState.layerIndex];
        var pixelRatio = frameState.pixelRatio;
        var viewState = frameState.viewState;
        var viewResolution = viewState.resolution;
	//////var imageSource = this.getLayer().getSource();
        var hints = frameState.viewHints;
        var renderedExtent = frameState.extent;
        if (layerState.extent !== undefined) {
            renderedExtent = getIntersection(renderedExtent, fromUserExtent(layerState.extent, viewState.projection));
        }
	//console.log("Rendered:",JSON.stringify(renderedExtent));

        if (!hints[ViewHint.ANIMATING] &&
            !hints[ViewHint.INTERACTING] &&
            !isEmpty(renderedExtent)) {

	    this.slideCache_.forEach(function(slide) {
		var imageSource=this.getSlideSource(slide);
		if (imageSource) {
                    var projection = viewState.projection;
                    if (!ENABLE_RASTER_REPROJECTION) {
			var sourceProjection = imageSource.getProjection();
			if (sourceProjection) {
                            projection = sourceProjection;
			}
                    }
		    // Next we create a new 300x300 image that is reprojected to the current canvas...
		    // source/Image.getImage -> reprojectedImage-> source/ImageStatic.getImageInternal
		    // the re-projection is done in reproj/Image.js -> reproj.js (render())
                    var image = imageSource.getImage(renderedExtent, viewResolution, pixelRatio, projection);
		    //console.log(image);
                    if (image && this.loadImage(image)) {
			this.image_ = image;
			// check if renderedExtent has changed (what the screen is showing)...
			if (! this.oldRenderExtent || this.oldRenderExtent !== JSON.stringify(renderedExtent)) { 
			    this.oldRenderExtent = JSON.stringify(renderedExtent);
			    // this is where you would write the texture using the image if not already done...
			    var img=image.getImage();
			    slide.width=img.width;
			    slide.height=img.height;
			    var gl=this.helper.getGL();
			    slide.texture = gl.createTexture();
			    gl.bindTexture(gl.TEXTURE_2D, slide.texture);
			    //console.log("Image:",slide.width,slide.height,JSON.stringify(renderedExtent));
			    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);


			    // let's assume all images are not a power of 2
			    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 
			    
			    //console.log("Image:",JSON.stringify(image.extent));
			};
		    } else {
			//console.log("Image is NOT loaded...");
			slide.texture=undefined;
		    };
		} else {
                    this.image_ = null;
		}
	    }.bind(this));
	}
        //return !!this.image_;
	



	

	return true;
    };
    /**
     * Rebuild internal webgl buffers based on current view extent; costly, should not be called too much
     * @param {import("../../PluggableMap").FrameState} frameState Frame state.
     * @private
     */
    WebGLSlideLayerRenderer.prototype.rebuildBuffers_ = function (frameState) {
        // saves the projection transform for the current frame state
        var projectionTransform = createTransform();
        this.helper.makeProjectionTransform(frameState, projectionTransform);
        // here we anticipate the amount of render instructions that we well generate
        // this can be done since we know that for normal render we only have x, y as base instructions,
        // and we also know the amount of custom attributes to append to these
        var totalInstructionsCount = (2 + this.customAttributes.length) * this.featureCount_;
        if (!this.renderInstructions_ ||
            this.renderInstructions_.length !== totalInstructionsCount) {
            this.renderInstructions_ = new Float32Array(totalInstructionsCount);
        }
        // loop on slides to fill the buffer
        var slideCache, geometry;
        var tmpCoords = [];
        var tmpColor = [];
        var renderIndex = 0;
        for (var slideUid in this.featureCache_) {
            slideCache = this.featureCache_[slideUid];
            geometry = /** @type {import("../../geom").Point} */ (slideCache.geometry);
            if (!geometry || geometry.getType() !== GeometryType.POINT) {
                continue;
            }

	    // this is where latlon are transformed and stored in attribute-array

	    tmpCoords[0] = geometry.getFlatCoordinates()[0];
            tmpCoords[1] = geometry.getFlatCoordinates()[1];
            applyTransform(projectionTransform, tmpCoords);
            this.renderInstructions_[renderIndex++] = tmpCoords[0];
            this.renderInstructions_[renderIndex++] = tmpCoords[1];
            var value = void 0;
            for (var j = 0; j < this.customAttributes.length; j++) {
                value = this.customAttributes[j].callback(slideCache.slide, slideCache.properties);
                this.renderInstructions_[renderIndex++] = value;
            }
        }
        /** @type {import('./Layer').WebGLWorkerGenerateBuffersMessage} */
        var message = {
            type: WebGLWorkerMessageType.GENERATE_BUFFERS,
            renderInstructions: this.renderInstructions_.buffer,
            customAttributesCount: this.customAttributes.length,
        };
        // additional properties will be sent back as-is by the worker
        message['projectionTransform'] = projectionTransform;
        this.worker_.postMessage(message, [this.renderInstructions_.buffer]);
        this.renderInstructions_ = null;
        /** @type {import('./Layer').WebGLWorkerGenerateBuffersMessage} */









	// // *** HERE WE NEED TO APPLY THE TRANSFORMATION ON THE TWO CURRENT IMAGE TEXTURES,

	// // 1. identify the two current image textures...
	// var prevSlide=this.getSlideIndex(0);
	// var nextSlide=this.getSlideIndex(1);

	// // 2. creating new viewport textures: this.interpolateTexture()
	// // we need the display texture for later use in other layers...
	// var prevTexture=this.interpolateTexture(prevSlide,this.projectTransform);
	// var nextTexture=this.interpolateTexture(nextSlide,this.projectTransform);

    };
//     // // we got to prepare 2 slides, one before and one after...
//     // WebGLSlideLayerRenderer.prototype.prepareSlide = function (frameState) {
//     //     var layerState = frameState.layerStatesArray[frameState.layerIndex];
//     //     var pixelRatio = frameState.pixelRatio;
//     //     var viewState = frameState.viewState;
//     //     var viewResolution = viewState.resolution;
//     //     var imageSource = this.getLayer().getSource();// this aint gonna work: should be an function argument
//     //     var hints = frameState.viewHints;
//     //     var renderedExtent = frameState.extent;
//     //     if (layerState.extent !== undefined) {
//     //         renderedExtent = getIntersection(renderedExtent, fromUserExtent(layerState.extent, viewState.projection));
//     //     }
//     //     if (!hints[ViewHint.ANIMATING] &&
//     //         !hints[ViewHint.INTERACTING] &&
//     //         !isEmpty(renderedExtent)) {
//     //         if (imageSource) {
//     //             var projection = viewState.projection;
//     //             if (!ENABLE_RASTER_REPROJECTION) {
//     //                 var sourceProjection = imageSource.getProjection();
//     //                 if (sourceProjection) {
//     //                     projection = sourceProjection;
//     //                 }
//     //             }
//     //             var image = imageSource.getImage(renderedExtent, viewResolution, pixelRatio, projection);
//     //             if (image && this.loadImage(image)) {
//     //                 this.image_ = image;
//     //             }
//     //         }
//     //         else {
//     //             this.image_ = null;
//     //         }
//     //     }
//     //     return !!this.image_;
//     // };

//     //here we must re-project image to current frameState, and create the texture. No image-argument=>latlon texture

//     // // Unlike images, textures do not have a width and height associated
//     // // with them so we'll pass in the width and height of the texture
//     WebGLSlideLayerRenderer.prototype.drawImage=function(tex, texWidth, texHeight, dstX, dstY) {
// 	var gl=this.helper.getGL();
//     	gl.bindTexture(gl.TEXTURE_2D, tex);

// //***************************************************************************
// // 	this.fragprogram="
// // precision mediump float;

// // uniform sampler2D u_screen;
// // uniform float u_opacity;

// // varying vec2 v_tex_pos;

// // void main() {
// //     vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);
// //     // a hack to guarantee opacity fade out even with a value close to 1.0
// //     gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
// // }
// // ";
// //***************************************************************************
	
//     	// Tell WebGL to use our shader program pair
//     	gl.useProgram(program);

//     	// Setup the attributes to pull data from our buffers
//     	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//     	gl.enableVertexAttribArray(positionLocation);
//     	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
//     	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
//     	gl.enableVertexAttribArray(texcoordLocation);
//     	gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

//     	// this matrix will convert from pixels to clip space
//     	var matrix = mat4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

//     	// this matrix will translate our quad to dstX, dstY
//     	matrix = mat4.translate(matrix, dstX, dstY, 0);

//     	// this matrix will scale our 1 unit quad
//     	// from 1 unit to texWidth, texHeight units
//     	matrix = mat4.scale(matrix, texWidth, texHeight, 1);

//     	// Set the matrix.
//     	gl.uniformMatrix4fv(matrixLocation, false, matrix);

//     	// Tell the shader to get the texture from texture unit 0
//     	gl.uniform1i(textureLocation, 0);

//     	// draw the quad (2 triangles, 6 vertices)
//     	gl.drawArrays(gl.TRIANGLES, 0, 6);
//     }



    
//     // WebGLSlideLayerRenderer.prototype.createTexture = function (frameState,image) {
//     //     var imageExtent = image.getExtent();
//     //     var imageResolution = image.getResolution();
//     //     var imagePixelRatio = image.getPixelRatio();
//     //     var layerState = frameState.layerStatesArray[frameState.layerIndex];
//     //     var pixelRatio = frameState.pixelRatio;
//     //     var viewState = frameState.viewState;
//     //     var viewCenter = viewState.center;
//     //     var viewResolution = viewState.resolution;
//     //     var size = frameState.size;
//     //     var scale = (pixelRatio * imageResolution) / (viewResolution * imagePixelRatio);
//     //     var width = Math.round(size[0] * pixelRatio);
//     //     var height = Math.round(size[1] * pixelRatio);
//     //     var rotation = viewState.rotation;
//     //     if (rotation) {
//     //         var size_1 = Math.round(Math.sqrt(width * width + height * height));
//     //         width = size_1;
//     //         height = size_1;
//     //     }
//     //     // set forward and inverse pixel transforms
//     //     composeTransform(this.pixelTransform, frameState.size[0] / 2, frameState.size[1] / 2, 1 / pixelRatio, 1 / pixelRatio, rotation, -width / 2, -height / 2);
//     //     makeInverse(this.inversePixelTransform, this.pixelTransform);
//     //     var canvasTransform = createTransformString(this.pixelTransform);
//     //     this.useContainer(target, canvasTransform, layerState.opacity);
//     //     var context = this.context;
//     //     var canvas = context.canvas;
//     //     if (canvas.width != width || canvas.height != height) {
//     //         canvas.width = width;
//     //         canvas.height = height;
//     //     }
//     //     else if (!this.containerReused) {




//     // 	    context.clearRect(0, 0, width, height);
//     //     }
//     //     // clipped rendering if layer extent is set
//     //     var clipped = false;
//     //     if (layerState.extent) {
//     //         var layerExtent = fromUserExtent(layerState.extent, viewState.projection);
//     //         clipped =
//     //             !containsExtent(layerExtent, frameState.extent) &&
//     //                 intersects(layerExtent, frameState.extent);
//     //         if (clipped) {
//     //             this.clipUnrotated(context, frameState, layerExtent);
//     //         }
//     //     }
//     //     var img = image.getImage();
//     //     var transform = composeTransform(this.tempTransform, width / 2, height / 2, scale, scale, 0, (imagePixelRatio * (imageExtent[0] - viewCenter[0])) / imageResolution, (imagePixelRatio * (viewCenter[1] - imageExtent[3])) / imageResolution);
//     //     this.renderedResolution = (imageResolution * pixelRatio) / imagePixelRatio;
//     //     var dx = transform[4];
//     //     var dy = transform[5];
//     //     var dw = img.width * transform[0];
//     //     var dh = img.height * transform[3];
//     //     assign(context, this.getLayer().getSource().getContextOptions());


//     // 	// no need to pre-render context

//     // 	this.preRender(context, frameState);
//     //     if (dw >= 0.5 && dh >= 0.5) {
//     //         var opacity = layerState.opacity;
//     //         var previousAlpha = void 0;
//     //         if (opacity !== 1) {
//     //             previousAlpha = this.context.globalAlpha;
//     //             this.context.globalAlpha = opacity;
//     //         }

//     // 	    //make texture here

	    
//     //         this.context.drawImage(img, 0, 0, +img.width, +img.height, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
//     //         if (opacity !== 1) {
//     //             this.context.globalAlpha = previousAlpha;
//     //         }
//     //     }
//     //     this.postRender(context, frameState);
//     //     if (clipped) {
//     //         context.restore();
//     //     }
//     //     if (canvasTransform !== canvas.style.transform) {
//     //         canvas.style.transform = canvasTransform;
//     //     }
//     //     return this.container;
//     // };


    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @param {import("../vector.js").SlideCallback<T>} callback Slide callback.
     * @return {T|undefined} Callback result.
     * @template T
     */
    WebGLSlideLayerRenderer.prototype.forEachFeatureAtCoordinate = function () {
        return undefined;
    };
    /**
     * Render the hit detection data to the corresponding render target
     * @param {import("../../PluggableMap.js").FrameState} frameState current frame state
     */
    WebGLSlideLayerRenderer.prototype.renderHitDetection = function (frameState) {
        return;
    };
    /**
     * Clean up.
     */
    WebGLSlideLayerRenderer.prototype.disposeInternal = function () {
        this.worker_.terminate();
        this.layer_ = null;
        this.sourceListenKeys_.forEach(function (key) {
            unlistenByKey(key);
        });
        this.sourceListenKeys_ = null;
        _super.prototype.disposeInternal.call(this);
    };

    // /**
    //  * Create a slide { width: w, height: h, texture: tex, source: source... }
    //  * The texture will start with 1x1 pixels and be updated when the image has loaded
    //  */
    // WebGLSlideLayerRenderer.prototype.loadImageAndCreateSlide=function(source) {
    // 	var url=source.url;
    // 	var par = source.parameter;
    // 	var gl=this.helper.getGL();
    // 	var tex = gl.createTexture();
    // 	gl.bindTexture(gl.TEXTURE_2D, tex);
	
    // 	// let's assume all images are not a power of 2
    // 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	
    // 	var slide = {
    // 	    width: 1,   // we don't know the size until it loads
    // 	    height: 1,
    // 	    texture: tex,
    // 	    source: source,
    // 	    parameter: par,
    // 	};
    // 	var img = new Image();
    // 	img.addEventListener('load', function() {
    // 	    slide.width = img.width;
    // 	    slide.height = img.height;
    // 	    gl.bindTexture(gl.TEXTURE_2D, slide.texture);
    // 	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    // 	});	
    // 	return slide;
    // }
    // /** 
    //  * Interpolate texture and assign screen texture...
    //  */
    // WebGLSlideLayerRenderer.prototype.interpolateTexture = function (slide,transform) {
    // 	var gl=this.helper.getGL();
    // 	var texture=slide.texture;
    // 	var texWidth=slide.width;
    // 	var texHeight=slide.height;
    // 	var extent=slide.source.extent;
    // 	// get textures to draw to
    // 	const emptyPixels = this.getEmptyTexture(gl);
    //     this.backgroundTexture = this.getBgTexture(gl);
    //     this.screenTexture = this.getFgTexture(gl);
    // 	// navigate the slide on the screen texture...
    // 	var LLcoord=[extent[0],extent[1]]; //lng, lat
    // 	var URcoord=[extent[2],extent[3]];
    //     applyTransform(projectionTransform, LLcoord);
    //     applyTransform(projectionTransform, URcoord);
    // 	var texX=0;
    // 	var texY=0;
    // 	var texW=texWidth;
    // 	var texH=texHeight;
    // 	var dstX=LLcoord[0];
    // 	var dstY=LLcoord[1];
    // 	var dstW=URcoord[0]-LLcoord[0];
    // 	var dstH=URcoord[1]-LLcoord[1];
    // 	util.bindFramebuffer(gl, this.framebuffer, this.screenTexture);
    //     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);





    // 	this.drawTexture(gl, texture, texX, texY, texW, texH, dstX, dstY, dstW, dstH);

    // 	// // blend textures...
    //     // this.drawTexture(this.backgroundTexture, this.fadeOpacity);
    //     // gl.enable(gl.BLEND);
    //     // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //     // this.drawTexture(this.screenTexture, 1.0);
    //     // gl.disable(gl.BLEND);
    // 	// // save the current screen as the background for the next frame
    //     // const temp = this.backgroundTexture;
    //     // this.backgroundTexture = this.screenTexture;
    //     // this.screenTexture = temp;
    // 	// - make a frameBuffer the same size as the viewport
    // 	// - clear the frameBuffer
    // 	// - transform extent to display
    // 	// - write texture to frameBuffer with offset
    // 	// - return the frameBuffer-texture
    // }
    // WebGLSlideLayerRenderer.prototype.getBgTexture = function (gl) {
    // 	const emptyPixels = this.getEmptyTexture(gl);
    //     this.bgTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
    // 	return this.bgTexture;
    // };
    // WebGLSlideLayerRenderer.prototype.getFgTexture = function (gl) {
    // 	const emptyPixels = this.getEmptyTexture(gl);
    //     this.fgTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
    // 	return this.fgTexture;
    // };
 
    WebGLSlideLayerRenderer.prototype.initTextureProgram = function () {
	var setup={};
	var gl=this.helper.getGL();
	// VERTEX SHADER::::::::::::::
	var vertexSource=
	    "  attribute vec4 a_position;\n"+
	    "  attribute vec2 a_texcoord;\n"+
	    "  uniform mat4 u_matrix;\n"+
	    "  varying vec2 v_texcoord;\n"+
            "  void main() {\n"+
	    "      gl_Position = u_matrix * a_position;\n"+
	    "      v_texcoord = a_texcoord;\n"+
	    "  }";
	//  FRAGMENT SHADER::::::::::::
	var fragmentSource=
	    "  precision mediump float;\n"+
	    "  varying vec2 v_texcoord;\n"+
	    "  uniform sampler2D u_texture;\n"+
	    "  void main() {\n"+
	    "      gl_FragColor = texture2D(u_texture, v_texcoord);\n"+
	    "  }";
	// // setup GLSL program
	setup.program = gl.createProgram();
	console.log(vertexSource);
	const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
	gl.attachShader(setup.program, vertexShader);
	gl.attachShader(setup.program, fragmentShader);
	gl.linkProgram(setup.program);
	if (!gl.getProgramParameter(setup.program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(setup.program));
	}
	// look up where the vertex data needs to go.
	setup.positionLocation = gl.getAttribLocation(setup.program, "a_position");
	setup.texcoordLocation = gl.getAttribLocation(setup.program, "a_texcoord");
	
	// lookup uniforms
	setup.matrixLocation = gl.getUniformLocation(setup.program, "u_matrix");
	setup.textureLocation = gl.getUniformLocation(setup.program, "u_texture");
	
	// Create a buffer.
	setup.positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, setup.positionBuffer);
	
	// Put a unit quad in the buffer
	var positions = [
	  0, 0,
	  0, 1,
	  1, 0,
	  1, 0,
	  0, 1,
	  1, 1,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	return setup;
    };
    // here we simply draw a texture to the screen...
    WebGLSlideLayerRenderer.prototype.runTextureProgram = function (frac,prev,next,iw,ih,dw,dh,ix,iy,dx,dy) {
	var setup = this.setupTextureProgram;
	var prevTex=prev.texture;
	var nextTex=next.texture;
	var gl=this.helper.getGL();
	var prevUnit=0;
	var nextUnit=1;
	gl.activeTexture(gl.TEXTURE0 + prevUnit);
	gl.bindTexture(gl.TEXTURE_2D, prevTex);
	// Run GLSL program
	var matrix = mat4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
	// this matrix will translate our quad to dstX, dstY
	matrix = mat4.translate(matrix, ix, iy, 0);
	// this matrix will scale our 1 unit quad
	//from 1 unit to texWidth, texHeight units
	matrix = mat4.scale(matrix, dw, dh, 1);
	// Set the matrix.
	gl.uniformMatrix4fv(setup.matrixLocation, false, matrix);
	// Tell the shader to get the texture from texture unit 0
	gl.uniform1i(setup.textureLocation, prevUnit);	
	// draw the quad (2 triangles, 6 vertices)
	gl.drawArrays(gl.TRIANGLES, 0, 6);
     };


    WebGLSlideLayerRenderer.prototype.createShader=function(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
	}
	return shader;
    }


    
    WebGLSlideLayerRenderer.prototype.getSlideIndex = function (index) {
	var ll=this.slideCache_.length;
	var ind=Math.min(ll-1,Math.max(0,index));
	if (ll >= 0) {
	    return this.slideCache_[ind];
	} else {
	    return {};
	}
    };
    WebGLSlideLayerRenderer.prototype.getSlideSource = function (slide) {
	return slide;
    };
    return WebGLSlideLayerRenderer;
}(WebGLLayerRenderer));
export default WebGLSlideLayerRenderer;
//# sourceMappingURL=WebGLSlideLayer.js.map
