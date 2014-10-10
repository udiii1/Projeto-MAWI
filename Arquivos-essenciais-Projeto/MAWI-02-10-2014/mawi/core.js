var ws = new WebService();
function WebService(blockScreen)
{
    this.req = null;
    this.async = true;
    this.block = blockScreen? blockScreen : true;
    

    this.get = function(url, callback)
    {
        this.createRequest();
        this.req.onreadystatechange = callback;
        if(this.block)
            this.bloqueiaFundo();
        this.req.open("GET", url, this.async);
        this.req.send(null);
    },

    this.post= function(url, callback)
    {
        this.createRequest();
        this.req.onreadystatechange = callback;
        if(this.block)
            this.bloqueiaFundo();
        this.req.open("POST", url, this.async);
        this.req.send(null);
    },

    this.asynchronous= function(yesno)
    {
        this.async = yesno;
    },

    this.createRequest= function()
    {
        if (typeof XMLHttpRequest != "undefined") {
            this.req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            this.req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        this.req.onerror = function(){
            //alert('Erro ao consultar WebService');
        };
    },

    this.isReady = function()
    {
        if(this.req.readyState == 4 && this.block)
            this.desbloqueiaFundo();
        return this.req.readyState == 4;
    },

    this.isOk = function()
    {
        return this.req.status == 200;
    },

    this.responseText = function()
    {
        return this.req.responseText;
    },

    this.XMLTagValue= function(tagName)
    {
        return this.req.responseXML.getElementsByTagName(tagName)[0].childNodes[0].nodeValue;
    },
	
	
	this.XMLTagValues = function(tagName)
    {
        return this.req.responseXML.getElementsByTagName(tagName);
    },
	

    this.responseXML= function()
    {
        return this.req.responseXML;
    },
    
    this.bloqueiaFundo = function ()
    {
     /*   var div = document.createElement("div");
        div.id = 'fundoWebService';
        div.innerHTML = ' ';
        AnimatedWindow.startFadeIn($('hourglass'));
        document.body.appendChild(div);
        return div;*/
    },

    this.desbloqueiaFundo = function()
    {
        /*destroiElemento('fundoWebService');
        AnimatedWindow.startFadeOut($('hourglass'));*/
    }
}


/* quick getElement reference */
function $(id) {
    return document.getElementById(id);
}

/* quick getElement reference */
function $name(name) {
    return document.getElementsByName(name);
}

function hide(id)
{
    $(id).style.display = 'none';
}

function show(id)
{
    $(id).style.display = 'block';
}

function identificaNavegador() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("opera") != -1) {
        return "opera";
    } else if (ua.indexOf("msie") != -1) {
        return "msie";
        
    } else if (ua.indexOf("safari") != -1) {
        return "safari";
    } else if (ua.indexOf("mozilla") != -1) {
        if (ua.indexOf("firefox") != -1) {
            return "firefox";
        } else {
            return "mozilla";
        }
    }
    return "desconhecido";
}
