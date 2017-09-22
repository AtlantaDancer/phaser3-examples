var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var path;
var curve;
var points;
var graphics;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('dragcircle', 'assets/sprites/dragcircle.png', { frameWidth: 16 });
}

function create ()
{
    path = { t: 0, vec: new Phaser.Math.Vector2() };

    points = [];

    points.push(new Phaser.Math.Vector2(20, 550));
    points.push(new Phaser.Math.Vector2(260, 450));
    points.push(new Phaser.Math.Vector2(300, 250));
    points.push(new Phaser.Math.Vector2(550, 145));
    points.push(new Phaser.Math.Vector2(745, 256));

    curve = new Phaser.Curves.Spline(points);

    //  Create drag-handles for each point

    for (var i = 0; i < points.length; i++)
    {
        var point = points[i];

        var handle = this.add.image(point.x, point.y, 'dragcircle', 0).setInteractive();

        handle.data.set('vector', point);

        this.input.setDraggable(handle);
    }

    this.input.events.on('DRAG_START_EVENT', function (event) {

        event.gameObject.setFrame(1);

    });

    this.input.events.on('DRAG_EVENT', function (event) {

        event.gameObject.x = event.dragX;
        event.gameObject.y = event.dragY;

        event.gameObject.data.get('vector').set(event.dragX, event.dragY);

    });

    this.input.events.on('DRAG_END_EVENT', function (event) {

        event.gameObject.setFrame(0);

    });

    this.tweens.add({
        targets: path,
        t: 1,
        ease: 'Sine.easeInOut',
        duration: 2000,
        yoyo: true,
        repeat: -1
    });

    graphics = this.add.graphics();
}

function update ()
{
    graphics.clear();

    graphics.lineStyle(2, 0xffffff, 1);

    curve.draw(graphics, 64);

    curve.getPoint(path.t, path.vec);

    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(path.vec.x, path.vec.y, 8);
}
