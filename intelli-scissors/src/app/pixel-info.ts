export class PixelInfo {
	public x: number;
	public y: number;
	public stageX: number;
	public stageY: number;

	public data: Uint8ClampedArray;

	public constructor(x, y, stageX, stageY, data) {
		this.x = x;
		this.y = y;
		this.stageX = stageX;
		this.stageY = stageY;
		this.data = data;
	}
}