import kaboom from 'kaboom'

// Initialize Context
const k = kaboom()

// Load Gfx Assets
k.loadSprite('bird', 'sprites/bird.png');
k.loadSprite('bg', 'sprites/bg.png');
k.loadSprite('pipe', 'sprites/pipe.png');
// Load Sound Assets
k.loadSound('jump', 'sounds/jump.mp3');
k.loadSound('bruh', 'sounds/bruh.mp3');
k.loadSound('pass', 'sounds/pass.mp3');

let highScore = 0;

k.scene('game', () => {
	const PIPE_GAP = 140;
	let score = 0;
	k.setGravity(1600);

	k.add([
		k.sprite('bg', { width: k.width(), height: k.height() })
	]);

	const scoreText = k.add([k.text(score), k.pos(12, 12)]);
	const player = k.add([
		k.sprite('bird'),
		k.scale(1.2),
		k.pos(100, 50),
		k.area(),
		k.body(),
	]);

	function createPipes() {
		const offset = k.rand(-50, 50);
		// bottom pipe
		k.add([
			k.sprite('pipe'),
			k.pos(k.width(), k.height() / 2 + offset + PIPE_GAP / 2),
			'pipe',
			k.scale(2),
			k.area(),
			{ passed: false },
		]);
		// top pipe
		k.add([
			k.sprite('pipe', { flipY: true }),
			k.pos(k.width(), k.height() / 2 + offset - PIPE_GAP / 2),
			'pipe',
			k.anchor('botleft'),
			k.scale(2),
			k.area(),
		]);
	}

	k.loop(1.5, () => createPipes());

	k.onUpdate('pipe', (pipe) => {
		pipe.move(-300, 0);

		if (pipe.passed === false && pipe.pos.x < player.pos.x) {
			pipe.passed = true;
			score += 1;
			scoreText.text = score;
			k.play('pass');
		}
	});

	player.onCollide('pipe', () => {
		const ss = k.screenshot();
		k.go('gameover', score, ss);
	});

	player.onUpdate(() => {
		if (player.pos.y > k.height()) {
			const ss = k.screenshot();
			k.go('gameover', score, ss);
		}
	});

	k.onKeyPress('space', () => {
		k.play('jump');
		player.jump(400);
	});

	k.onClick(() => {
		k.play('jump');
		player.jump(400);
	});

	window.addEventListener('touchstart', () => {
		k.play('jump');
		player.jump(400);
	});

});


k.scene('gameover', (score, screenshot) => {
	if (score > highScore) highScore = score;
	
	k.play('bruh');

	k.loadSprite('gameOverScreen', screenshot);
	k.add([k.sprite('gameOverScreen', { width: k.width(), height: k.height() })]);
	k.add([
		k.text('gameover!\n' + 'score: ' + score + '\nhigh score: ' + highScore, { size: 45 }),
			k.pos(k.width() / 2, k.height() / 3),
	]);
	k.onKeyPress('space', () => {
		k.go('game');
	});
});

k.go('game');