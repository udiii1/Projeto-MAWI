var Debug = {
    out:  'debug',
    
    pos: function(obj)
    {
        document.getElementById('debug').innerHTML = 
            'Px,Py = (' + obj.m[4] + ',' + obj.m[5] + ')<br>' +
            'dire��oX = ' + obj.body.direction[0] + '<br>' +
            'dire��oY = ' + obj.body.direction[1] + '<br>' +
            'velocidadeX = ' + obj.body.velx + '<br>' +
            'velocidadeY = ' + obj.body.vely + '<br>' +
            'marioColidindo = ' + obj.body.colliding + '<br>' ;
    }
}