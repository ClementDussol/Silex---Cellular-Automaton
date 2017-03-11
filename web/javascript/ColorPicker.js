
let Utils = {
	hexToRgb : function (hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},
	rgbToHex : function (r, g, b) {
    	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
}

class ColorPicker {
	constructor(element, options){

		this.init(element, name, options);
		this.listening = false;
	}

	init(element, options){

		let opt = this.options = {

			spectrumWidth  : options ? options.spectrumWidth : 128,
			spectrumHeight : options ? options.spectrumHeight : 32,
			thumbWidth     : options ? options.thumbWidth : 32,
			thumbHeight    : options ? options.thumbHeight : 32,
		}

		/////////////////////////// 
		console.log(document)
		let style = document.createAttribute('style');
		style.value = 'display:none';
		element.setAttribute('style', style.value);
		this.input = element;
		
		///////////////////////////
		
		let cWidth = opt.spectrumWidth + opt.thumbWidth + 8;
		let cHeight = opt.spectrumHeight;
		
		///////////////////////////

		this.canvas = document.createElement('canvas');
		this.canvas.width = cWidth;
		this.canvas.height = cHeight;
		this.context = this.canvas.getContext('2d');

		///////////////////////////

		this.createSpectrum(opt.spectrumWidth, opt.spectrumHeight);
		if (element.hasAttribute('value')) {
			this.setColor(element.getAttribute('value'));
		}
		

		///////////////////////////
		
		this.canvas.addEventListener('mousedown', function(){
			this.listening = true;
		});

		this.canvas.addEventListener('mouseup', function(){
			this.listening = false;
		})

		// this.canvas.addEventListener('mouseleave', function(){
		// 	this.listening = false;
		// })

		let self = this;

		this.canvas.addEventListener('mousemove', function(e){
			if (this.listening) self.onUpdate(e);
		})

		///////////////////////////

		element.parentElement.insertBefore(this.canvas, element);
	}

	createSpectrum(){
		
		let canvas = this.canvas;
		let ctx = this.context;
		let width = this.options.spectrumWidth;
		let height = this.options.spectrumHeight;

		///////////////////////////
		
		var gradient = ctx.createLinearGradient(0, 0, width, 0);

		gradient.addColorStop(0,    "rgb(255,   0,   0)");
		gradient.addColorStop(0.15, "rgb(255,   0, 255)");
		gradient.addColorStop(0.33, "rgb(0,     0, 255)");
		gradient.addColorStop(0.49, "rgb(0,   255, 255)");
		gradient.addColorStop(0.67, "rgb(0,   255,   0)");
		gradient.addColorStop(0.84, "rgb(255, 255,   0)");
		gradient.addColorStop(1,    "rgb(255,   0,   0)");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);
		
		///////////////////////////

		gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0,   "rgba(128, 128, 128, 0)");
		gradient.addColorStop(1,   "rgba(128, 128, 128, 1)");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		///////////////////////////

		gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
		gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
		gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
		gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		ctx.drawImage(this.canvas, 0, 0);
	}
	
	onUpdate(e){

		let ctx = this.context;
		let x = e.clientX - this.canvas.getBoundingClientRect().left;
		let y = e.clientY - this.canvas.getBoundingClientRect().top;

		this.createSpectrum();
		this.drawCursor(x, y);
		
		let color = this.getColorFromPosition(x, y);
		
		this.updateThumbnail(color);
		this.input.setAttribute('value', color);

		console.log(x, y);
	}

	drawCursor(x,y){
		let ctx = this.context;
		ctx.fillStyle = 'white';
		ctx.fillRect(x-8, y, 8, 2);
		ctx.fillRect(x+1, y, 8, 2);
		ctx.fillRect(x, y-8, 2, 8);
		ctx.fillRect(x, y+1, 2, 8);
	}

	setColor(color){
		let rgb = Utils.hexToRgb(color);
		let pos = this.getPositionFromColor(rgb.r, rgb.g, rgb.b);
		console.log(pos);
		this.updateThumbnail(color);
		this.drawCursor(pos.x, pos.y);
	}

	updateThumbnail(color) {
		let ctx = this.context;
		let x = this.options.spectrumWidth + 8;
		let y = 0;
		let w = this.options.thumbWidth;
		let h = this.options.thumbHeight;
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	}

	getColorFromPosition(x, y) {
		let colorArray = this.context.getImageData(x,y,1, 1).data;
		return Utils.rgbToHex(colorArray[0],colorArray[1],colorArray[2])
	}

	getPositionFromColor(r, g, b){
		let data = this.context.getImageData(0, 0, this.options.spectrumWidth, this.options.spectrumHeight).data;
		let index = -1;
		for (var i = 0; i < data.length; i++) {
			index = (data[i] == r && data[i+1] == g && data[i+2] == b) ? i : index;

		}
		return {x:index/4 % this.options.spectrumWidth, y:Math.floor(index/4/this.options.spectrumWidth)};
	}
}
let colorPickers = document.querySelectorAll('.color_picker');
colorPickers.forEach(function(element){
	new ColorPicker(element);
});

