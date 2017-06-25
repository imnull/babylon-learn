!function(BABYLON, host){

host = host || {};

if(typeof(exports) != 'undefined'){
	host = exports;
}

function objectPropertyReflector(serial = '', context, level = 0){
	if(!serial.length) return context || undefined;
	if(level < 1 && typeof(context) == 'undefined'){
		context = this;
	}
	if(!context) return undefined;

	let idx = serial.indexOf('.');
	if(idx < 0){
		return context[serial];
	} else {
		return objectPropertyReflector(serial.substr(idx + 1), context[serial.substr(0, idx)], level + 1);
	}
}
function ObjectReflector(type, args = [], isClass = true){
	this.type = type;
	this.isClass = isClass;
	this.args = args;
}
ObjectReflector.prototype = {
	invoke: function(){
		let m = objectPropertyReflector(this.type);
		if(typeof(m) == 'function'){
			return this.isClass ? new m(...this.args) : m(...this.args);
		} else {
			return m;
		}
	}
};

function DhChart3d(domCanvas, configure = {}){
	this.canvas =
		typeof(domCanvas) == 'string'
		? document.querySelector(domCanvas)
		: domCanvas
		;
	this.configure = Object.assign({
		antiAlias: true,
		cameraPosition: [1,1,12],
		cameraTargetPosition: [0,0,0]
	}, configure);

	this.idCounter = 0;
	this.init();
}
DhChart3d.prototype = {
	init(){
		this.id = 0;
		this.engine = new BABYLON.Engine(this.canvas, this.configure.antiAlias);
		this.scene = new BABYLON.Scene(this.engine);
		this.engine.runRenderLoop(function(){
			this.scene.render();
		}.bind(this));

		// // create a FreeCamera, and set its position to v3CameraPosition
		// this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(...this.configure.cameraPosition), this.scene);
		// // target the camera to scene origin
		// this.camera.setTarget(new BABYLON.Vector3(...this.configure.cameraTargetPosition));

		// Create a camera
		this.camera = new BABYLON.ArcRotateCamera("Camera"
			, ...this.configure.cameraPosition
			, new BABYLON.Vector3(...this.configure.cameraTargetPosition)
			, this.scene
			);

		// Attach camera to canvas
		this.camera.attachControl(this.canvas, false);

		// attach the camera to the canvas
		this.camera.attachControl(this.canvas, false);

		window.addEventListener('resize', function() {
			this.engine.resize();
		}.bind(this));
	},
	getId(prefix){ return prefix + ++this.idCounter; },

	createColor3(r, g, b){
		return new BABYLON.Color3(r, g, b);
	},
	createStandardMaterial(r = 1, g = 1, b = 1){
		let m = new BABYLON.StandardMaterial(this.getId('std'), this.scene);
		m.diffuseColor = this.createColor3(r, g, b);
		return m;
	},
	createHemisphericLight(x = 0, y = 1, z = 0){
		// create a basic light, aiming 0,1,0 - meaning, to the sky
		return new BABYLON.HemisphericLight(
			this.getId('light')
			, new BABYLON.Vector3(x, y, z)
			, this.scene
			);
	},
	createSphere(subdivisions = 16, radius = 2){
		// create a built-in "sphere" shape; its constructor takes 4 params: name, subdivisions, radius, scene
		return BABYLON.Mesh.CreateSphere(
			this.getId('sphere')
			, subdivisions
			, radius
			, this.scene
			);
	},
	createGround(width = 6, height = 6, subdivisions = 2){
		// create a built-in "ground" shape; its constructor takes 5 params: name, width, height, subdivisions and scene
		return BABYLON.Mesh.CreateGround(
			this.getId('ground')
			, width
			, height
			, subdivisions
			, this.scene
			);
	},
	createBox(size = 1){
		return BABYLON.Mesh.CreateBox(
			this.getId('box')
			, size
			, this.scene
			);
	}
};

host.DhChart3d = DhChart3d;

}(BABYLON, this);