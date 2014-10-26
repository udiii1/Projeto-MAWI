var Debug = {
    out:  'debug',
    
    pos: function(obj)
    {
        document.getElementById('debug').innerHTML = 
            'Px,Py = (' + obj.m[4] + ',' + obj.m[5] + ')<br>' +
            'direçãoX = ' + obj.body.direction[0] + '<br>' +
            'direçãoY = ' + obj.body.direction[1] + '<br>' +
            'velocidadeX = ' + obj.body.velx + '<br>' +
            'velocidadeY = ' + obj.body.vely + '<br>' +
            'marioColidindo = ' + obj.body.colliding + '<br>' ;
    }
}