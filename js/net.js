/**
* NET Messages manager
* Ao adicionar objetos NetMessage n�o utilize �ndices num�ricos como: NET.messages.push(obj) ou NET.messages[0] = obj. (ao remover o hash reorganiza os �ndices)
* Utilize NET.messages['identificacao'] = obj.
*/
var NET = {
    messages: new Array(),
	run: function(){
	
		for(var m in NET.messages){
			var msg = NET.messages[m];
			if(!msg.started)
				msg.run(m);
		}
		
		for(var m in NET.messages){
			var msg = NET.messages[m];
			
			if(msg.stoped){
				clearInterval(msg.handle);
				NET.messages.pop(msg);
			}
		}
	}
}


/**
* url: url do webservice ou p�gina a ser invocado pelo objeto NetMessage
* repeat: quantidade de vezes que a mensagem deve ser repetida. -1 para infinitas vezes
* interval: intervalo entre a execu��o de uma mensagem e outra
* update: fun��o que ser� executada a cada chamada do objeto NetMessage (opcional)
* updateargs: argumentos da fun��o update (pode ser array)
* callback: fun��o que ser� executada ao t�rmino de cada chamada da invocacao da url (opcional)
* callbackargs: argumentos da fun��o callback (pode ser array)
*/
function NetMessage(url, repeat, interval, update, updateargs, callback, callbackargs, ws){

	this.handle = null; /*handle da funcao setInterval caso o n�mero de itera��es seja pr� definido*/
	this.repeat = repeat; /* quantidade de repeti��es, 0 para nenhuma, -1 para cont�nuamente*/
	this.interval = parseInt(interval,10); /*intervalo de repeti��o*/
	this.url = url;
	this.args = new Array(); /*argumentos da url chave=>valor*/
	this.stoped = false; // esta mensagem j� foi executada todas as vezes desejadas
	this.started = false; // j� foi iniciado o loop iterativo de execu��o desta mensagem
	this.ws = ws;

	this.run = function(idx){
		this.started = true;
		if(!repeat){
			ws.post(url + NetMessage.montaParametros(idx), function(){callback(callbackargs);});	

			if(update)
					update(updateargs);
			this.stoped=true;
			callback(callbackargs);
		}
		else
		{
		
		
		
			this.handle = 
			setInterval(
			function(){
				var obj = NET.messages[idx];
				
				ws.post(url + NetMessage.montaParametros(idx), function(){callback(callbackargs);});	
				
				if(update){
				
					update(updateargs);
					}
				
				if(--obj.repeat == 0){
					clearInterval(obj.handle);
					obj.stoped = true;
					callback(callbackargs);
				}
				
			}, this.interval);
		}
	}
	
	NetMessage.montaParametros = function(idx){
		
		var obj = NET.messages[idx];

		var par = "?idx="+idx;
		for (var i in obj.args){
			par += "&" + i + "=" + obj.args[i];
		}
		return par;
	}
	
	this.clearArgs = function(){
		this.args = new Array();
		this.args.length = 0;
	}
	
	this.addArg = function(chave,valor){
		this.args[chave] = valor;
		this.args.length++;
	}
}//NetMessage


