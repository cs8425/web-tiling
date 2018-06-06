'use strict';

function updateIFrame() {
	var wins = $('.window')
	var screen = $('div.block.content')
	var count = wins.length - 1
	screen.css('column-count', count)

	//var title = $('div.window > div.header')

	var iframe = wins.find('iframe')
	var w = wins.width();
	var h = (w * 9.0 / 16.0);
	console.log('updateIFrame()', wins, count, w, h)
	iframe.width(w).height(h)
}

function vid2url(vid) {
	return 'https://www.youtube.com/embed/' + vid + '?autoplay=1'
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
		var vid = url.match(/v=([a-zA-Z0-9\-_]+)/)
		if (vid.length != 2) {
			return
		}
		vid = vid[1]
		console.log('goto()', e, this, url, vid)
		header.parent().find('iframe').attr('src', vid2url(vid))
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
		var vid = url.match(/v=([a-zA-Z0-9\-_]+)/)
		if (vid.length != 2) {
			return
		}
		vid = vid[1]
		input.val('')
		//console.log('open-tab()', e, this, url, vid)

		var tmpl = $('#tmpl > div.window').clone()
		tmpl.appendTo($('div.block.content'))
		tmpl.find('iframe').attr('src', vid2url(vid))
		tmpl.find('input.url').val(url)
		tmpl.find('span.go.btn').on('click', goUrl)
		tmpl.find('span.close.btn').on('click', closeTab)
		console.log('open-tab()', url, vid, vid2url(vid))

		updateIFrame()

	})

	$('.window > .header > span.go.btn').on('click', goUrl)
	$('.window > .header > span.close.btn').on('click', closeTab)
}

$(window).on('load', function(e) {
	init()
})

