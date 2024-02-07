import { Application, Sprite, Text, Container, DisplayObject, Graphics, Texture, Ticker } from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js';
import * as particles from '@pixi/particle-emitter'

const app = new Application<HTMLCanvasElement>({
	width: window.innerWidth,
	height: window.innerHeight,
	antialias: true,
	backgroundColor: 0x1099bb,
});

app.renderer.view.style.position = 'absolute';

document.body.appendChild(app.view);

const fpsText = new Text('FPS: 0', { fill: 'white', fontSize: 12 });
fpsText.position.set(5, 0);
app.stage.addChild(fpsText);


app.ticker.add(() => {
	TWEEN.update();
	fpsText.text = `FPS: ${Math.round(Ticker.shared.FPS)}`;
})


// CARD DEMO
let cardDemo = new Container();
const cardButton = new Text('Cards Demo', { fill: 'white' });
cardButton.position.set(20, 20);
cardButton.eventMode = 'static';
cardButton.cursor = 'pointer';
cardButton.on('pointerdown', () => {
	hideAllDemos();
	cardDemo.visible = true;

	const stackSize = 144;
	const stackWidth = 50;

	const stack1 = new Container();
	const stack2 = new Container();
	app.stage.addChild(stack1, stack2);

	for (let i = 0; i < stackSize; i++) {
		const sprite = Sprite.from('card.jpg'); // Replace with your texture
		sprite.position.set(250, 300 - i * 2);
		sprite.width = stackWidth;
		sprite.height = stackWidth;
		stack1.addChild(sprite);
	}

	function animateMovement(sprite: DisplayObject, targetX: number, targetY: number, duration: number | undefined) {
		new TWEEN.Tween(sprite)
			.to({ x: targetX, y: targetY }, duration)
			.start();
	}

	function moveTopCard() {
		if (stack1.children.length > 0) {
			const topCard = stack1.getChildAt(stack1.children.length - 1);
			stack1.removeChild(topCard);
			stack2.addChild(topCard);

			animateMovement(topCard, 325, 25 + (stackSize - stack2.children.length) * 2, 2000);
		}
	}

	setInterval(moveTopCard, 1000);
});

app.stage.addChild(cardButton);

cardButton.addChild(cardDemo);

// TEXT DEMO
const textDemo = new Container();
const textButton = new Text('Text Demo', { fill: 'white' });
textButton.position.set(20, 120);
textButton.eventMode = 'static';
textButton.cursor = 'pointer';
textButton.on('pointerdown', () => {
	hideAllDemos();
	textDemo.visible = true;

	const texts = ['Hello', 'Random Text', 'Eros', 'Game dev'];
	const images = ['😃', '💬', '🚀', '$'];

	function getRandomElement(array: string | any[]) {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}

	function insertImageIntoText(text: string, image: string) {
		const randomIndex = Math.floor(Math.random() * (text.length + 1));
		return text.slice(0, randomIndex) + image + text.slice(randomIndex);
	}

	function createRandomTextWithImage() {
		const randomText = getRandomElement(texts);
		const randomImage = getRandomElement(images);

		const modifiedText = insertImageIntoText(randomText, randomImage);

		const text = new Text(modifiedText, {
			fontSize: Math.floor(Math.random() * 36) + 16,
			fill: 'white',
		});

		text.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height);
		app.stage.addChild(text);
	}

	function generateRandomConfiguration() {
		createRandomTextWithImage();
	}

	setInterval(generateRandomConfiguration, 2000);
});

app.stage.addChild(textButton);

textButton.addChild(textDemo);


// PARTICLES DEMO
const particlesDemo = new Container();
const particlesButton = new Text('Particles Demo', { fill: 'white' });
particlesButton.position.set(20, 240);
particlesButton.eventMode = 'static';
particlesButton.cursor = 'pointer';
particlesButton.on('pointerdown', () => {
	hideAllDemos();
	particlesDemo.visible = true;
	// Create a container for the fire effect
	const fireContainer = new Container();
	app.stage.addChild(fireContainer);

	// Create a graphics object for the fire effect
	const fireGraphics = new Graphics();
	fireContainer.addChild(fireGraphics);

	// Create a particle emitter for the fire effect
	const fireEmitter = new particles.Emitter(
		fireContainer,
		{
			lifetime: {
				min: 0.5,
				max: 0.5
			},
			frequency: 0.001,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 350,
			pos: {
				x: 0,
				y: 0
			},
			addAtBack: false,
			behaviors: [
				{
					type: 'alpha',
					config: {
						alpha: {
							list: [
								{
									value: 1,
									time: 0
								},
								{
									value: 0,
									time: 1
								}
							],
						},
					}
				},
				{
					type: 'scale',
					config: {
						scale: {
							list: [
								{
									value: 0.5,
									time: 0
								},
								{
									value: 0.25,
									time: 1
								}
							],
						},
					}
				},
				{
					type: 'color',
					config: {
						color: {
							list: [
								{
									value: "ff7300",
									time: 0
								},
								{
									value: "ffff00",
									time: 1
								}
							],
						},
					}
				},
				{
					type: 'moveSpeed',
					config: {
						speed: {
							list: [
								{
									value: 200,
									time: 0
								},
								{
									value: 50,
									time: 1
								}
							],
							isStepped: false
						},
					}
				},
				{
					type: 'rotationStatic',
					config: {
						min: 180,
						max: 360
					}
				},
				{
					type: 'spawShape',
					config: {
						type: 'rect',
						data: {
							x: 0,
							y: 0,
							w: 50,
							h: 10
						}
					}
				},
				{
					type: 'textureSingle',
					config: {
						texture: Texture.from('Fire.png')
					}
				}
			],
		});

	// Position the fire effect
	fireContainer.position.set(app.screen.width / 2, app.screen.height - 50);


	// Schedule the movement every second
	var elapsed = Date.now();

	// Update function every frame
	var update = function () {

		// Update the next frame
		requestAnimationFrame(update);

		var now = Date.now();

		// The emitter requires the elapsed
		// number of seconds since the last update
		fireEmitter.update((now - elapsed) * 0.001);
		elapsed = now;
	};

	// Start emitting
	fireEmitter.emit = true;

	// Start the update
	update();

});

app.stage.addChild(particlesButton);

particlesButton.addChild(particlesDemo);


function hideAllDemos() {
	for (var i = app.stage.children.length - 1; i >= 0; i--) {
		if (app.stage.children[i] != cardButton && app.stage.children[i] != textButton && app.stage.children[i] != particlesButton) {
			app.stage.removeChild(app.stage.children[i]);
		}
	};
}

hideAllDemos();
