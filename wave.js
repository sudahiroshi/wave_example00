document.addEventListener("DOMContentLoaded", function (event)
{
	var canvas1 = document.querySelector( "#canvas" );
	var wave1 = new wave( canvas1, canvas1.width, canvas1.height );
});

class wave {
	constructor( canvas1, width, height ) {
		this.canvas1 = canvas1;
		this.ctx1 = canvas1.getContext("2d");
		this.width = width;
		this.height = height;

		this.future = new Array( width * height );
		this.now = new Array( width * height );
		this.past = new Array( width * height );

		//this.image = this.ctx1.getImageData( 0, 0, width, height );
		this.image = this.ctx1.createImageData(  width, height );

		this.h = 0.01;
		this.c = 0.01;
	}

	calc() {
		let h = this.h;
		let c = this.c;
		for( let y=1; y<this.height-1; y++ ) {
			for( let x=0; x<this.width; x++ ) {
				this.future[ y * this.width + x ] = 2.0 * h + c * (
					this.now[ y * this.width + x + 1 ] +
					this.now[ y * this.width + x - 1 ] +
					this.now[ ( y + 1 ) * this.width + x ] +
					this.now[ ( y - 1 ) * this.width + x ] - 4.0 * h ) -
					this.past[ y * this.width + x ];
			}
		}

		for( let y=0; y<this.height; y++ ) {
			for( let x=0; x<this.width; x++ ) {
				this.past[ y * this.width + x ] = this.now[ y * this.width + x ];
				this.now[ y * this.width + x ] = this.future[ y * this.width + x ];
			}
		}
	}

	draw() {
		for( let y=0; y<this.height; y++ ) {
			for( let x=0; x<this.width; x++ ) {
				this.image.data[ ( y * this.width + x ) * 4 ] = this.now[ y * this.width + x ] + 128.0;
			}
		}
		this.ctx1.putImageData( this.image, 0, 0 );
	}

	init() {
		for( let y=0; y<this.height; y++ ) {
			for( let x=0; x<this.width; x++ ) {
				let idx = y * this.width + x;
				this.now[ idx ] = 0.0;
				this.past[ idx ] = 0.0;
				this.future[ idx ] = 0.0;
				this.image.data[ idx * 4 ] = 128;
				this.image.data[ idx * 4 + 1] = 0;
				this.image.data[ idx * 4 + 2] = 0;
				this.image.data[ idx * 4 + 3] = 255;
			}
		}
	}

	push() {
		let idx = this.width / 2 * this.width + 100;
		for( let x=100; x<this.width - 100; x++ ) {
			this.now[ idx ] = -100.0;
			this.past[ idx++ ] = -100.0;
		}
	}

	getCtx() {
		return this.ctx1;
	}
	getImage() {
		return this.image;
	}
}
