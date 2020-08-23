'use strict';

function calc(count) {
	var lim = Math.sqrt(count)
	return Math.ceil(lim)
}

function updateIFrame() {
	var wins = $('.window')
	var screen = $('div.block.content')
	var count = wins.length - 1 // 1 is template
	var div = 1

	var ww = ($(document).width() >> 1) << 1 //window.innerWidth
	var wh = window.innerHeight
	if (ww > wh) {
		div = calc(count)
		$('body').css('height', '100vh')
	} else {
		$('body').css('height', '')
	}

	var space = 0 //Math.ceil(3840 / ww)
	var iframe = wins.find('iframe')
	var hdr = wins.find('.header')
	var wvw = Math.floor(ww / div) - (div*space*2)
	wins.width(wvw)

	var hdrh = (hdr.length)? hdr[0].offsetHeight : 0;
	var w = wvw
	var h2 = wh / Math.ceil(count / div)
	var h = (w * 9.0 / 16.0)
	var h1 = h + hdrh
	h = (h1 > h2)? h2 : h
	if (ww > wh) {
		iframe.height(h-hdrh - space)
	} else {
		iframe.height(h)
	}
	console.log('updateIFrame()', ww, wh, wins, count, div, w, h, wvw)
}

function saveTabs() {
	var wins = $('.window').toArray()
	wins.pop() // remove template

	var out = []
	while(wins.length) {
		var w = wins.shift()
		var e = $(w)
		var tab = {
			u: e.find('input.url').val(),
			s: e.find('iframe').attr('src'),
		}
		out.push(tab)
	}
	localStorage.setItem('tabs', JSON.stringify(out))
	return out
}

function loadTabs() {
	var str = localStorage.getItem('tabs')
	if (!str) return

	$('div.block.content').html('') // clear all tabs
	var tabs = JSON.parse(str)
	while(tabs.length) {
		var info = tabs.shift()
		addTabs(info.u, info.s)
	}
	updateIFrame()
}

function addTabs(url, src) {
	var tmpl = $('#tmpl > div.window').clone()
	tmpl.appendTo($('div.block.content'))
	tmpl.find('iframe').attr('src', src)
	tmpl.find('input.url').val(url)
	tmpl.find('span.go.btn').on('click', goUrl)
	tmpl.find('span.close.btn').on('click', closeTab)
	console.log('open-tab()', url, src)
}

function tryUrl(url) {
	switch (true) {
	case /youtube.com\//.test(url) :
		var vid = url.match(/v=([a-zA-Z0-9\-_]+)/)
		if (vid && vid.length == 2) {
			return 'https://www.youtube.com/embed/' + vid[1] + '?autoplay=1'
		}
		break;
	case /youtu.be\//.test(url) :
		var vid = url.match(/([a-zA-Z0-9\-_]+)/)
		if (vid && vid.length == 2) {
			return 'https://www.youtube.com/embed/' + vid[1] + '?autoplay=1'
		}
		break;
	case /twitch.tv\//.test(url) :
		var vid = url.match(/videos\/([0-9]+)/)
		if (vid && vid.length == 2) {
			return 'https://player.twitch.tv/?video=' + vid[1] + '&parent=' + location.hostname
		}

		var channel = url.match(/twitch.tv\/([a-zA-Z0-9\-_]+)/)
		if (channel && channel.length == 2) {
			return 'https://player.twitch.tv/?channel=' + channel[1] + '&parent=' + location.hostname
		}
		break;
	}
	return url
}

function goUrl(e){
	var header = $(this).parent()
	var url = header.find('input.url').val()
	console.log('goto()', e, this, url)
	header.parent().find('iframe').attr('src', tryUrl(url))
	saveTabs()
}
function closeTab(e){
	var tab = $(this).parent().parent()
	console.log('closeTab()', e, this)
	tab.remove()
	updateIFrame()
	saveTabs()
}

function init(){
	// modal
	$('.modal > .content .close, .modal > .content .cancel.btn').on('click', function(e){
		$('.modal').css('display', 'none')
	})
	$('.modal').on('click', function(e){
		if(e.target == this) $('.modal').css('display', 'none')
	})

	$('#add-tab').on('click', function(e){
		$('#new-tab').css('display', 'block')
		$('.param > div > input')[0].focus()
	})
	$('#open-tab').on('click', function(e){
		$('.modal').css('display', 'none')
		var input = $(this).parent().find('input')
		var url = input.val()
		input.val('')

		addTabs(url, tryUrl(url))

		updateIFrame()
		saveTabs()
	})

	$('.window > .header > span.go.btn').on('click', goUrl)
	$('.window > .header > span.close.btn').on('click', closeTab)
	$(window).on('resize', updateIFrame)
}

$(window).on('load', function(e) {
	init()
	loadTabs()
	updateIFrame()
})

