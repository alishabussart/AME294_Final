var ENV = {
	device: {
		iOS: null,
		iPhone: null,
		iPad: null,
		android: null,
		mouse: null,
		touch: null
	},
	screen: {
		height: null,
		width: null,
		big: null,
		small: null
	},
	initialize: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.indexOf('iphone') >=0 || ua.indexOf('ipad') >=0 ){
			ENV.device.iOS = true;
			if(ua.indexOf('iphone') >=0) {
				ENV.device.iPhone = true;
				ENV.device.iPad = false;
			}
			else {
				ENV.device.iPhone = false;
				ENV.device.iPad = true;				
			}

		} 
		else {
			ENV.device.iOS = false;	
			ENV.device.iPhone = false;
			ENV.device.iPad = false;		
		}
		
		
		if(ua.indexOf('android') >=0) {
			ENV.device.android = true;			
		}
		else {
			ENV.device.android = false;			
		}
		
		if(ENV.device.iOS || ENV.device.android) {
			ENV.device.touch = true;
			ENV.device.mouse = false;
		}
		else {
			ENV.device.touch = false;
			ENV.device.mouse = true;
		}
		
		if(!ENV.device.android) {
			ENV.screen.height = $(window).height();
			ENV.screen.width = $(window).width();
		}
		else {
			ENV.screen.height = window.innerHeight;
			ENV.screen.width = window.innerWidth;
		}
		if(ENV.screen.width > 1024) {
			ENV.screen.big = true;
			ENV.screen.small = false;
		}
		else {
			ENV.screen.big = false;
			ENV.screen.small = true;
		}
		
		var docClassName = "";
		if(ENV.screen.big) {
			docClassName = docClassName + "big";
		}
		else {
			docClassName = docClassName + "small";
		}
		if(ENV.device.touch) {
			docClassName = docClassName + " touch";
		}
		else {
			docClassName = docClassName + " mouse";
		}
		document.getElementsByTagName("html")[0].className = docClassName;
	}
}

function load() {
	ENV.initialize();
    loadRSS("./ex.rss",formatRSS);
}

var rssFeed = [];

function formatRSS(data) {
   rssFeed = JSON.parse(data).feed.entry; 
   var output = "";
   for(var i = 0; i < rssFeed.length; i++) {
       output = output + "<div class='list-item' id='item" + i + "' onclick='javascript:itemSelected(" + i + ")'>";
       output = output +  "<img class='image' src=" + rssFeed[i]["im:image"][2].label + ">";
       output = output + "<p class='title'>" + rssFeed[i]["im:name"].label + "</p>";
       output = output + "<div class='price'>" + rssFeed[i]["im:price"].label + " USD" + "</div>";
       output = output + "</div>";
       output = output + "<hr>";
   }
    document.getElementById('list').innerHTML = output;
    if(ENV.screen.big) { 
        itemSelected(0); 
    }
}

function itemSelected(i) {
    $("#list div").removeClass("selected");
    $("#item" + i).addClass("selected");
    
    var listItem = rssFeed[i];
    var output = "";
    output = output + "<img class='image' src=" + rssFeed[i]["im:image"][2].label + ">"; // icon/image
    output = output + "<div class='title'>" + rssFeed[i]["im:name"].label + "</div>"; // App title
    output = output + "<div class='artist'>By " + "<a 'more' href=" + rssFeed[i]["im:artist"].attributes.href + ">" + rssFeed[i]["im:artist"].label + "</a>" + "</div>"; // author
    output = output + "<div class='category'>" + rssFeed[i].category.attributes.label + "</div>"; // genre/category
    output = output + "<div class='release'>" + rssFeed[i]["im:releaseDate"].attributes.label + "</div>"; // date released
    output = output + "<div class='rights'>" + rssFeed[i].rights.label + "</div>"; // rights holder
    output = output + "<br>"
    output = output + "<div class='place-links'>"
    output = output + "<div class='price'>" + rssFeed[i]["im:price"].label + " USD" + "</div>"; // price
    output = output + "<a class='download' target='_blank' href=" + rssFeed[i].link.attributes.href + ">" + "View on iTunes" + "</a>"; // link to purchase
    var link = rssFeed[i].link.attributes.href;
    output = output + "<a class='share' target='_blank' href='https://www.facebook.com/sharer/sharer.php?u=" + link + "' >" + "Share on Facebook" + "</a>";
    output = output + "<a class='share' target='_blank' href='https://twitter.com/home?status=" + link + "' >" + "Share on Twitter" + "</a>";
    output = output + "</div>"
    
    output = output + "<div class='desc'>" + rssFeed[i].summary.label + "</div>"; // App summary/description
    
    if(ENV.screen.small) {
			document.getElementById("details").style.display = "block";
            document.getElementById("list").style.display = "none"
            output = output + "<a class='back-button' href='javascript:backToList()'>back</a>";
    }
    
    var contents = document.getElementById("details").innerHTML = output; // places output into vew variable
    var replace = contents.replace(/\n/gi, "<br>"); // replaces \n in rss file with line breaks
    document.getElementById("details").innerHTML = replace; // puts new output into container div
}


function backToList() {
    document.getElementById("details").style.display = "none";
    document.getElementById("list").style.display = "block"
    document.getElementById("details").innerHTML = "";
    $("#list div").removeClass("selected");
}