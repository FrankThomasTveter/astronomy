/**
 * @module ol/layer/WebGLPointsLayer
 */
/////import Layer from './Layer.js';
import Layer from 'ol/layer/Layer.js';
/////import WebGLPointsLayerRenderer from '../renderer/webgl/PointsLayer.js';
import WebGLPointsLayerRenderer from './WebGLPointsRenderer.js';
////import { assign } from '../obj.js';
import { assign } from 'ol/obj.js';
/////import { parseLiteralStyle } from '../webgl/ShaderBuilder.js';
import { parseLiteralStyle } from './ShaderBuilder.js';



var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



/**
 * @typedef {Object} Options
 * @property {import('../style/LiteralStyle.js').LiteralStyle} style Literal style to apply to the layer features.
 * @property {string} [className='ol-layer'] A CSS class name to set to the layer element.
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
 * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
 * method was used.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
 * visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
 * be visible.
 * @property {number} [minZoom] The minimum view zoom level (exclusive) above which this layer will be
 * visible.
 * @property {number} [maxZoom] The maximum view zoom level (inclusive) at which this layer will
 * be visible.
 * @property {import("../source/Vector.js").default} [source] Source.
 * @property {boolean} [disableHitDetection=false] Setting this to true will provide a slight performance boost, but will
 * prevent all hit detection on the layer.
 */
/**
 * @classdesc
 * Layer optimized for rendering large point datasets. Takes a `style` property which
 * is a serializable JSON object describing how the layer should be rendered.
 *
 * Here are a few samples of literal style objects:
 * ```js
 * const style = {
 *   symbol: {
 *     symbolType: 'circle',
 *     size: 8,
 *     color: '#33AAFF',
 *     opacity: 0.9
 *   }
 * }
 * ```
 *
 * ```js
 * const style = {
 *   symbol: {
 *     symbolType: 'image',
 *     offset: [0, 12],
 *     size: [4, 8],
 *     src: '../static/exclamation-mark.png'
 *   }
 * }
 * ```
 *
 * **Important: a `WebGLPoints` layer must be manually disposed when removed, otherwise the underlying WebGL context
 * will not be garbage collected.**
 *
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @fires import("../render/Event.js").RenderEvent
 */
var WebGLPointsLayer = /** @class */ (function (_super) {
    __extends(WebGLPointsLayer, _super);
    /**
     * @param {Options} options Options.
     */
    function WebGLPointsLayer(options) {
        var _this = this;
        var baseOptions = assign({}, options);
        _this = _super.call(this, baseOptions) || this;
        /**
         * @private
         * @type {import('../webgl/ShaderBuilder.js').StyleParseResult}
         */
        _this.parseResult_ = parseLiteralStyle(options.style);
        /**
         * @private
         * @type {boolean}
         */
        _this.hitDetectionDisabled_ = !!options.disableHitDetection;
        return _this;
    }
    /**
     * Create a renderer for this layer.
     * @return {WebGLPointsLayerRenderer} A layer renderer.
     */
    WebGLPointsLayer.prototype.createRenderer = function () {
        return new WebGLPointsLayerRenderer(this, {
            className: this.getClassName(),
            vertexShader: this.parseResult_.builder.getSymbolVertexShader(),
            fragmentShader: this.parseResult_.builder.getSymbolFragmentShader(),
            hitVertexShader: !this.hitDetectionDisabled_ &&
                this.parseResult_.builder.getSymbolVertexShader(true),
            hitFragmentShader: !this.hitDetectionDisabled_ &&
                this.parseResult_.builder.getSymbolFragmentShader(true),
            uniforms: this.parseResult_.uniforms,
            attributes: this.parseResult_.attributes,
        });
    };
    /**
     * Clean up.
     */
    WebGLPointsLayer.prototype.disposeInternal = function () {
        this.getRenderer().disposeInternal();
        _super.prototype.disposeInternal.call(this);
    };
    return WebGLPointsLayer;
}(Layer));
export default WebGLPointsLayer;
//# sourceMappingURL=WebGLPoints.js.map
