
define(['yotsuko'], function(yotsuko){
//var eq = assert.equal;
var image = new Image();
image.src = '../data/test.png';
describe('yotsuko', function(){
    it('test', function(){
        var data = yotsuko.process(image);
        var c = document.getElementById('test_canvas');
        var ctx = c.getContext("2d");
        c.width = image.width*2;
        ctx.drawImage(image, image.width, 0);
        ctx.beginPath();
        function draw(p1, p2){
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.stroke();
        }
        function center(p1, p2, c){
            return p1[c]+(p2[c]-p1[c])/2; }
        data.forEach(function(arr, i){
            draw(arr[0], arr[1]);
            draw(arr[0], arr[2]);
            draw(arr[1], arr[3]);
            draw(arr[2], arr[3]);
            ctx.fillText(i+1, center(arr[0], arr[2], 0)-5,
                center(arr[0], arr[1], 1)+3);
        });
    });
});
});
