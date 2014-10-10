/* Main Engine : singleton*/
var Engine = {

    fps: 1000/60, /* taxa de fps desejada */
    debugfps: 250, /* de quanto em quanto tempo deve ser chamado o debug */
    debugfpsMultiplier: 0, /* auxiliar para ajudar na exibição dos fps */
    lastFrameTime: null,
    frame: 0, /* contagem dde frames */
    skipped:0, /* contagem de frames ignorados */
    ticks: 0, /* quantidade de ticks passados */
    canvas: null, /* canvas onde o motor atuará */
    ctx: null, /* contexto de renderização */
    loopHandle: null,
    running: false,
	music: null, /*musica de fundo*/
	shadows: true,
        
    init:function(idcanvas,w,h){
        Engine.canvas = $(idcanvas);
        Engine.canvas.width = w;
        Engine.canvas.height = h;
        Engine.ctx = Engine.canvas.getContext("2d");
    } ,
    run: function()
    {
        
        if(!Engine.ctx){
            alert('Sem canvas !!!');
            return;
        }
        
        if(!Engine.running){
            Engine.running = true;
            Engine.lastFrameTime = new Date().getTime();
            Engine.ticks = 0;
            Engine.loopHandle = setInterval(Engine.mainLoop, Engine.fps);
            Engine.debugfpsMultiplier = (1000/Engine.debugfps);
            setInterval(Engine.countFrames, Engine.debugfps); // DESCOMENTAR PARA DEBUG
		
			if(Engine.music){
				Engine.music.preload = 'auto';
				Engine.music.load();
				Engine.music.volume = 0.25;
				Engine.music.loop = true;
				Engine.music.play();
			}
			
        }
    },
    
    stop: function(){
        Engine.running = false;
        clearInterval(Engine.loopHandle);
		Engine.music.pause();
    },
	
    /* função que realiza a animação estática e renderização - deve ser fornecida */        
    render: function(){
        Engine.ctx.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height); /*limpa tela*/
        SceneGraph.render(Engine.ctx, SceneGraph.root);
    },
    /* função que realiza a atualização dos corpos rígidos que possuem movimento - opcional */        
    physics: function(){
    },
	/*função para processar entrada do usuário, onkeypress, onkeyup, onclick, etc*/
	processInput: function(){
	},
    /* função que será chamada se o tempo decorrido ultrapassou o desejado - opcional */        	
    skip: function(){
    },
	
    countFrames: function(){
        if($('fps')) {$('fps').innerHTML = Engine.frame * Engine.debugfpsMultiplier;
        Engine.frame = 0;}
    },
	
	playSound: function(sound, volume) {
		var click = sound;//.cloneNode(true);
		click.volume = volume;
		click.play();
	},
	
    /* laço principal: aqui serão realizadas as chamadas dos comandos de renderização, física e colisão */
    mainLoop: function() {
        var dt = (new Date().getTime()) - Engine.lastFrameTime; /* tempo decorrido */
        var skip = Math.floor(dt/Engine.fps); /* quantas vezes o tempo decorrido é maior que o desejado ? */
        Engine.ticks++;		
        Engine.processInput();
		if(skip <= 1) {
            Engine.render();
            Engine.physics();
			
			NET.run();
            Engine.frame++;	
        }
        else {
            Engine.skip();
        }
		Engine.lastFrameTime = new Date().getTime();
    }
}


/********************************************************************************/
/* representa um objeto visível, 
 * iniciado com valores arbitrários dos atributos
 * desenha um quadrado 1x1 */
function Drawable(){
    this.m = [1,0,0,1,0,0]; /* matriz com posição, escala e rotação 2d */
    this.height = 1;
    this.width = 1;
    
    this.render = function(ctx){
        ctx.save();
        ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }
};

function Bloco(){
    this.body = new CPhysBody(),
    this.bb = null /*somente p objetos estaticos, senão devemos calcular*/
}
Bloco.prototype = new Drawable();

/* Animação*/

/* objeto de animação BASE 
 * 
 * O array frames é composto de 3 componentes:
 * Imagem: contém o arquivo com os desenhos das animações
 * [1]: vetor com len posições representando os len passos de animação. Cada posição possui uma quantidade de thicks que aquele quadro deve aceitar antes de mudar para o próximo
 * [2]: vetor com len posições representando os len passos de animação. Cada posição possui a posição da imagem no arquivo de desenhos das animações
 * 
 * O método run é responsável por desenhar a imagem de animação corrente e atualizar a posição da imagem no arquivo de desenhos das animações
 * */
function CAnimation()
{
    this.tick = -1; /* ticks para controlar quanto tempo cada quadro ficará ativo*/
    this.frames = new Array();
    this.idx = 0; /* idx do quadro corrente */
    this.len = 0; /* qtd de quadros de animação */
    this.leftOffset = 0; /* deslocamento horizontal do desenho global para cair na imagem correta */
    this.topOffset = 0; /* deslocamento vertical do desenho global para cair na imagem correta */
    this.width = 226; /* largura do trecho de imagem */
    this.height = 240; /* altura do trecho de desenho */
    this.translate = [0,0]; /* deslocamento para ajustar o desenho ao centro do personagem. default 0,0 - opcional*/
    this.cont = true; /* se cont==true, a animação deve ser repetida recusirvamente até ser trocada */
    this.name = "default";
	this.horizontalSprites = true, /* sprites na horizontal ou vertical*/
    this.callback = null; /* callback com alguma função indicando uma ação a ser realizada ao término de cada iteração do laço de animação  */
    this.reset = function(){ 
        this.tick = 0;
        this.idx=0;
    }
    
    this.run = function(ctx, obj){
        ctx.save();
        ctx.transform(obj.m[0],obj.m[1],obj.m[2],obj.m[3],obj.m[4],obj.m[5]); /* leva o objeto ao seu lugar */
        ctx.translate(this.translate[0],this.translate[1]); /* translação de ajuste da imagem - opcional */
        
        
		if(this.horizontalSprites){
		
			/*
			 *drawImage args: -> horizontal img
				img	Specifies the image, canvas, or video element to use	 
				sx	Optional. The x coordinate where to start clipping	
				sy	Optional. The y coordinate where to start clipping	
				swidth	Optional. The width of the clipped image	
				sheight	Optional. The height of the clipped image	
				x	The x coordinate where to place the image on the canvas	
				y	The y coordinate where to place the image on the canvas	
				width	Optional. The width of the image to use (stretch or reduce the image)	
				height	Optional. The height of the image to use (stretch or reduce the image)
			
				obj.left diz se é a imagem com o personagem direcionado à esquerda ou seu espelho (direita)
				no caso da direita, é a próxima àdireita desta atual. Os desenhos sõa sempre na ordem imgesq,imgdir
			*/
			ctx.drawImage(this.frames[0], 
				obj.animation.width*(this.frames[2][this.idx]) + this.frames[2][this.idx] * obj.animation.leftOffset, 
				obj.left == 1? obj.animation.topOffset :  obj.animation.topOffset + obj.animation.height + obj.animation.leftOffset,
				obj.animation.width,
				obj.animation.height, 
				0, 0, obj.animation.width, obj.animation.height);   
			ctx.restore();
		}else{
		
			 /*
			 *drawImage args: ^ vertical img
				img	Specifies the image, canvas, or video element to use	 
				sx	Optional. The x coordinate where to start clipping	
				sy	Optional. The y coordinate where to start clipping	
				swidth	Optional. The width of the clipped image	
				sheight	Optional. The height of the clipped image	
				x	The x coordinate where to place the image on the canvas	
				y	The y coordinate where to place the image on the canvas	
				width	Optional. The width of the image to use (stretch or reduce the image)	
				height	Optional. The height of the image to use (stretch or reduce the image)
			
				obj.left diz se é a imagem com o personagem direcionado à esquerda ou seu espelho (direita)
				no caso da direita, é a próxima àdireita desta atual. Os desenhos sõa sempre na ordem imgesq,imgdir
			*/
			ctx.drawImage(this.frames[0], 
				obj.left == 1? obj.animation.leftOffset :  obj.animation.leftOffset + obj.animation.width  + obj.animation.topOffset,
				obj.animation.height*(this.frames[2][this.idx]) + this.frames[2][this.idx] * obj.animation.topOffset, 
				obj.animation.width,
				obj.animation.height, 0, 0, obj.animation.width, obj.animation.height);   
			ctx.restore();
		}
		
		
        
        return this.update(obj); /* continue animation ? */
        
    }
    /* atualiza imagem corrente da animação, e retorna se foi finalizada ou não */
    this.update = function(obj){
        var unfinished = true;
        this.tick++;
        
        if(this.tick == this.frames[1][this.idx]) /* hora de trocar para o próximo frame */
            this.idx++;

        if(!this.cont && (this.idx == this.len)){ /* se a animação é 1x e chegamos ao final */
            this.reset();
            unfinished = false;
        }        
        else if(this.idx == this.len){
            this.reset();
        }
        
        if(this.callback ){ /*execução do callback informado, se houver */
            this.callback(this, obj, unfinished);
        }
        
        return unfinished;
    }
}




