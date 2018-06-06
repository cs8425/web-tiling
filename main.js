'use strict';



function updateIFrame() {
	var wins = $('.window')
	var screen = $('div.block.content')
	var count = wins.length - 1

	var ww = window.innerWidth
	var wh = window.innerHeight
	if (ww > wh) {
		var lim = Math.sqrt(count)
		//if (count % 2 != 0) count += 1
		for (var i = Math.floor(lim); i>0; i--) {
//console.log(i, (count / i), (count % i))
			if((count % i) == 0) {
				count = count / i
				break
			}
		}
		screen.css('column-count', count)
		console.log('updateIFrame() p', lim, count)
	} else {
		screen.css('column-count', 1)
	}

	var iframe = wins.find('iframe')
	var w = wins.width();
	var h = (w * 9.0 / 16.0);
	console.log('updateIFrame()', ww, wh, wins, count, w, h)
	iframe.width(w).height(h)
}

function tryUrl(url) {
	var vid = url.match(/v=([a-zA-Z0-9\-_]+)/)
	if (url.match('youtube.com/') && (vid.length == 2)) {
		return 'https://www.youtube.com/embed/' + vid[1] + '?autoplay=1'
	}
	return url
}

function init(){
	// modal
	$('.modal > .content .close, .modal > .content .cancel.btn').on('click', function(e){
		$('.modal').css('display', 'none')
	})
	$('.modal').on('click', function(e){
		if(e.target == this) $('.modal').css('display', 'none')
	})

	var goUrl = function(e){
		var header = $(this).parent()
		var url = header.find('input.url').val()
		console.log('goto()', e, this, url)
		header.parent().find('iframe').attr('src', tryUrl(url))
	}
	var closeTab = function(e){
		var tab = $(this).parent().parent()
		console.log('closeTab()', e, this)
		tab.remove()
		updateIFrame()
	}

	$('#add-tab').on('click', function(e){
		$('#new-tab').css('display', 'block')
	})
	$('#open-tab').on('click', function(e){
		$('.modal').css('display', 'none')
		var input = $(this).parent().find('input')
		var url = input.val()
		input.val('')
		//console.log('open-tab()', e, this, url, vid)

		var tmpl = $('#tmpl > div.window').clone()
		tmpl.appendTo($('div.block.content'))
		tmpl.find('iframe').attr('src', tryUrl(url))
		tmpl.find('input.url').val(url)
		tmpl.find('span.go.btn').on('click', goUrl)
		tmpl.find('span.close.btn').on('click', closeTab)
		console.log('open-tab()', url, tryUrl(url))

		updateIFrame()

	})

	$('.window > .header > span.go.btn').on('click', goUrl)
	$('.window > .header > span.close.btn').on('click', closeTab)
	$(window).on('resize', updateIFrame)
}

$(window).on('load', function(e) {
	init()
	updateIFrame()
})

