(function(){
    var script = {
 "mouseWheelEnabled": true,
 "start": "this.init()",
 "scrollBarWidth": 10,
 "id": "rootPlayer",
 "mobileMipmappingEnabled": false,
 "vrPolyfillScale": 0.5,
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "layout": "absolute",
 "backgroundPreloadEnabled": true,
 "children": [
  "this.MainViewer",
  "this.MapViewer"
 ],
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "desktopMipmappingEnabled": false,
 "minHeight": 20,
 "scripts": {
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "registerKey": function(key, value){  window[key] = value; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "unregisterKey": function(key){  delete window[key]; },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "existsKey": function(key){  return key in window; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getKey": function(key){  return window[key]; }
 },
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 20,
 "defaultVRPointer": "laser",
 "horizontalAlign": "left",
 "downloadEnabled": false,
 "gap": 10,
 "height": "100%",
 "paddingTop": 0,
 "shadow": false,
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "Player",
 "data": {
  "name": "Player435"
 },
 "overflow": "visible",
 "definitions": [{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_117BD0E2_0B4D_F687_418E_6DF683C77BC4",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_118EB172_0B4D_F787_4174_B50FDDBACC80",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_camera"
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_10FF626F_0B4D_F59D_4188_2BEF2F490F5D",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8",
 "thumbnailUrl": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_t.jpg",
 "label": "R2-A",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_1BBF2880_0B44_3683_4183_857423E07008",
  "this.overlay_1BBFD880_0B44_3683_41A6_5BD40E290E1E",
  "this.overlay_1BBFF880_0B44_3683_4178_8FD6231C07D0",
  "this.overlay_1BBF9880_0B44_3683_4191_DE2E4E32BA38",
  "this.overlay_1BBF8880_0B44_3683_4140_A8EE22D28180",
  "this.overlay_1BBFB880_0B44_3683_41A6_613BFC532ABC",
  "this.overlay_1BBE5880_0B44_3683_41A2_A2DBF7ECE090",
  "this.overlay_1BBE4880_0B44_3683_4195_9F5F0EC15FE4",
  "this.overlay_1BBE7880_0B44_3683_41A6_5E4A06F975F0",
  "this.overlay_1BBE6880_0B44_3683_41A0_FB29943FD048",
  "this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18",
  "this.overlay_1BBE0880_0B44_3683_4197_5F522143F9B8",
  "this.overlay_1BBE2880_0B44_3683_41A1_32594F196162",
  "this.overlay_1BBEC880_0B44_3683_418F_1D176A7841B8",
  "this.overlay_1BBEF880_0B44_3683_41A0_B78F4A512EA0",
  "this.overlay_1BBEE880_0B44_3683_414A_66171A20B580",
  "this.overlay_1BBE8880_0B44_3683_418A_1812F7549998",
  "this.overlay_1BBEB880_0B44_3683_41A0_05173F6D629A",
  "this.overlay_1BBEA880_0B44_3683_416C_678BD2C9D580",
  "this.overlay_1BBD5880_0B44_3683_412F_46414F466400",
  "this.overlay_1BBD4880_0B44_3683_41A0_E280EF92F128",
  "this.overlay_1BBD7880_0B44_3683_41A5_EF8454B664B8",
  "this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20",
  "this.overlay_1BBD0880_0B44_3683_4174_5E54A097A030",
  "this.overlay_1BBD3882_0B44_3687_4193_6FAB25D2EBA0",
  "this.overlay_1BBDD882_0B44_3687_4188_1486A943CED3",
  "this.overlay_1BBDF882_0B44_3687_41A4_62447BBCBCB8",
  "this.overlay_1BBDE882_0B44_3687_419F_83EFCB91B4ED",
  "this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1",
  "this.overlay_1BBD8882_0B44_3687_4187_304D13484A5A"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_10058241_0B4D_F585_41A0_C2A581D572E5"
},
{
 "hfovMax": 130,
 "class": "Panorama",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  }
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_t.jpg"
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "L1-A",
 "id": "panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5",
 "thumbnailUrl": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_1BC0F73B_0B44_1B85_4194_C5C0FEC147D7",
  "this.overlay_1BC0C73B_0B44_1B85_4186_36AFCA572AA6",
  "this.overlay_1BC0D73B_0B44_1B85_4182_AFE4AD0B0E43",
  "this.overlay_1BC0273B_0B44_1B85_4199_5C4A4F3053F9",
  "this.overlay_1BC0373B_0B44_1B85_417B_C7D35C5EC7BF",
  "this.overlay_1BC0073B_0B44_1B85_419F_355DCC1BB3AA",
  "this.overlay_1BC0173B_0B44_1B85_4184_0DE804FEDF8F",
  "this.overlay_1BC0773B_0B44_1B85_419C_45A8A1D768B4",
  "this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778",
  "this.overlay_1BC1873B_0B44_1B85_4183_8792AAAA9FE1",
  "this.overlay_1BC1973B_0B44_1B85_4173_DD9A724F85E7",
  "this.overlay_1BC1F73B_0B44_1B85_417D_20EB59B208E8",
  "this.overlay_1BC1D73B_0B44_1B85_418F_BAFAEDAB6196",
  "this.overlay_1BC1273B_0B44_1B85_4181_E704C43CAE13",
  "this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F",
  "this.overlay_1BC1073B_0B44_1B85_418D_3250CC8C68D0",
  "this.overlay_1BC1173B_0B44_1B85_41A0_0CAAAB614AB2",
  "this.overlay_1BC1673B_0B44_1B85_4189_0442DBA9CFFB",
  "this.overlay_1BC1473B_0B44_1B85_4183_4D901F6E1E08",
  "this.overlay_1BCEA73B_0B44_1B85_41A2_AE328DF34E70",
  "this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2",
  "this.overlay_1BCEF73B_0B44_1B85_41A1_4B3C32EF326B",
  "this.overlay_1BCEC73B_0B44_1B85_41A6_357EAE177507",
  "this.overlay_1BCE273B_0B44_1B85_4187_5964B76931AE",
  "this.overlay_1BC1873C_0B44_1B83_4170_D9970CA17DB7",
  "this.overlay_1BC1973C_0B44_1B83_4190_2379C124A4EE",
  "this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719",
  "this.overlay_1BC1C73C_0B44_1B83_41A1_AFEDFD93A0F8"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_1280F086_0B4D_F68F_41A1_9FABC143D872"
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_174C42B8_0B4D_FA83_419F_533CC1E3A788",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "media": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "media": "this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "media": "this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "media": "this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "media": "this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "media": "this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "media": "this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1AD21975_0B44_178D_419A_F21912320B19_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "media": "this.panorama_1AD21975_0B44_178D_419A_F21912320B19",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "media": "this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "class": "PhotoAlbumPlayListItem",
   "media": "this.album_E2A7D232_F814_2787_41C5_8B4B3B3E5CCE",
   "player": "this.MainViewerPhotoAlbumPlayer"
  },
  {
   "class": "Video360PlayListItem",
   "start": "this.MainViewerPanoramaPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 10, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerPanoramaPlayer); this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "media": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A",
   "camera": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "media": "this.panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 0)",
   "media": "this.panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "mainPlayList"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_170762E4_0B4D_FA83_419B_5B041ED67997"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_12FA8052_0B4D_F587_41A4_3A7CE14B4AAD, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_12FA8052_0B4D_F587_41A4_3A7CE14B4AAD, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "media": "this.video_ED4C97C5_F814_EC8C_41C3_679D56F23F45",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_12FA8052_0B4D_F587_41A4_3A7CE14B4AAD"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_10C2E267_0B4D_F58E_413A_4429D6D34102"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_12BF509A_0B4D_F687_41A5_BEDADAFFC2C0",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_10EE4278_0B4D_F583_4189_5FAA38A80A8C"
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_11C0A133_0B4D_F785_41A3_00129604BB09",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_12B670A4_0B4D_F682_41A2_E3E8C02557D6"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_177E62C0_0B4D_FA83_4190_BC32AFE73070",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_1043A1DC_0B4D_F683_41A1_F5DCC11A86D4"
},
{
 "class": "Photo",
 "duration": 5000,
 "id": "album_E2A7D232_F814_2787_41C5_8B4B3B3E5CCE_0",
 "thumbnailUrl": "media/album_E2A7D232_F814_2787_41C5_8B4B3B3E5CCE_0_t.png",
 "width": 2673,
 "label": "Glass-Window (2) (1)",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/album_E2A7D232_F814_2787_41C5_8B4B3B3E5CCE_0.png",
    "class": "ImageResourceLevel"
   }
  ]
 },
 "height": 1740
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0",
 "thumbnailUrl": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_t.jpg",
 "label": "M1-A",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_045A15B5_0B44_1E8D_4197_FB44A653F341",
  "this.overlay_045A25B5_0B44_1E8D_41A6_7DA84F0BCED3",
  "this.overlay_045A35B5_0B44_1E8D_41A6_7415AD5CF811",
  "this.overlay_0465C5B5_0B44_1E8D_4192_38118B60C05A",
  "this.overlay_0465E5B5_0B44_1E8D_418B_C9DE7706B18E",
  "this.overlay_0465F5B5_0B44_1E8D_41A0_F1D9A8AA4CC7",
  "this.overlay_046585B5_0B44_1E8D_4181_F7906CA2600E",
  "this.overlay_046595B5_0B44_1E8D_4178_593F80EF04B9",
  "this.overlay_0465A5B5_0B44_1E8D_4196_66CB6AD520B6",
  "this.overlay_0465B5B5_0B44_1E8D_419F_5A89E91E022C",
  "this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5",
  "this.overlay_046555B5_0B44_1E8D_4198_14A0493E101F",
  "this.overlay_046565B5_0B44_1E8D_4194_3276EC6AF321",
  "this.overlay_046575B5_0B44_1E8D_4181_1F45D5671574",
  "this.overlay_046505B5_0B44_1E8D_41A4_26980FEFABBF",
  "this.overlay_046515B5_0B44_1E8D_418C_5AE478F5D84B",
  "this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2",
  "this.overlay_046535B6_0B44_1E8F_4189_5AC3905CB625",
  "this.overlay_0464C5B6_0B44_1E8F_4190_B74629B59DC5",
  "this.overlay_0464E5B6_0B44_1E8F_417B_E193E4E1FEDC",
  "this.overlay_0464F5B6_0B44_1E8F_4199_7B8F51267A76",
  "this.overlay_046485B6_0B44_1E8F_4174_399A78C2CEA7",
  "this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7",
  "this.overlay_0464A5B6_0B44_1E8F_4182_2A66ED040F3C",
  "this.overlay_0464B5B6_0B44_1E8F_4195_BF628CC8338C",
  "this.overlay_046455B6_0B44_1E8F_417D_D4D6AE4238CD",
  "this.overlay_046465B6_0B44_1E8F_4199_3ADCE33E7A16",
  "this.overlay_046475B6_0B44_1E8F_41A0_D76E5A16DF8A",
  "this.overlay_046405B6_0B44_1E8F_4194_A0767A061219",
  "this.overlay_046415B6_0B44_1E8F_4168_473F89EFC81F",
  "this.overlay_046435B6_0B44_1E8F_4199_DDF509B87CB1",
  "this.overlay_0467C5B6_0B44_1E8F_4186_0051B110F40F",
  "this.overlay_0467D5B6_0B44_1E8F_41A4_E7FA2A7E1008",
  "this.overlay_0467E5B6_0B44_1E8F_416C_9446BBFD4B37",
  "this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70",
  "this.overlay_046505B7_0B44_1E8D_41A5_F78FF6D33D2C"
 ]
},
{
 "class": "PanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_18495474_0B44_7D83_419A_E00B5DBA73C3",
 "thumbnailUrl": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_t.jpg",
 "label": "R3-A",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_1848B474_0B44_7D83_4195_B1BD9F84FFAE",
  "this.overlay_1848F474_0B44_7D83_4190_282C05797969",
  "this.overlay_1848C474_0B44_7D83_41A0_D158CD5FB76F",
  "this.overlay_18483474_0B44_7D83_419E_24FABC3D4EC0",
  "this.overlay_18481474_0B44_7D83_419E_53F2B57FAC9A",
  "this.overlay_18480474_0B44_7D83_41A0_1A2AA403EF7B",
  "this.overlay_18484474_0B44_7D83_4196_F156A10BC8DC",
  "this.overlay_1857A474_0B44_7D83_41A2_6917A0D77367",
  "this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5",
  "this.overlay_1857F474_0B44_7D83_417F_8949BDA50E10",
  "this.overlay_1857C474_0B44_7D83_418C_9821954CBF3C",
  "this.overlay_18494474_0B44_7D83_418B_CF4BAD3333B8",
  "this.overlay_18489474_0B44_7D83_4193_CC56286AB13F",
  "this.overlay_1848F476_0B44_7D8F_419D_136DB0776FFA",
  "this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071",
  "this.overlay_1848D476_0B44_7D8F_41A0_714605F294FA",
  "this.overlay_18482476_0B44_7D8F_4188_96B9E9151A54",
  "this.overlay_18487476_0B44_7D8F_419F_50DC1D6EED62",
  "this.overlay_18486476_0B44_7D8F_4177_3E25F5C6B675",
  "this.overlay_18485476_0B44_7D8F_41A4_CD0564EE5C3F",
  "this.overlay_18484476_0B44_7D8F_41A5_082325240960",
  "this.overlay_1857B476_0B44_7D8F_41A4_20C84C100CD6",
  "this.overlay_18579476_0B44_7D8F_4161_44C176C71E55",
  "this.overlay_1857E476_0B44_7D8F_4192_BF407212228C",
  "this.overlay_18573476_0B44_7D8F_419D_3A8AE73485DB",
  "this.overlay_18570476_0B44_7D8F_41A0_1431A009117D",
  "this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D",
  "this.overlay_18575476_0B44_7D8F_4197_2976450970E1"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_1AD21975_0B44_178D_419A_F21912320B19_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_11EF0143_0B4D_F785_419E_E00E250A3145",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_camera"
},
{
 "class": "PhotoAlbum",
 "label": "Photo Album Glass-Window (2) (1)",
 "id": "album_E2A7D232_F814_2787_41C5_8B4B3B3E5CCE",
 "thumbnailUrl": "media/album_E2A7D232_F814_2787_41C5_8B4B3B3E5CCE_t.png",
 "playList": "this.album_E2A7D232_F814_2787_41C5_8B4B3B3E5CCE_AlbumPlayList"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1AD21975_0B44_178D_419A_F21912320B19"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1",
 "thumbnailUrl": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_t.jpg",
 "label": "M3-A",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_04C1FC25_0B47_ED8D_4178_814E8A285432",
  "this.overlay_04C1CC25_0B47_ED8D_419C_BFCBF6EC8247",
  "this.overlay_04C1DC25_0B47_ED8D_41A1_DCBEAD0EEFD9",
  "this.overlay_04C1AC25_0B47_ED8D_41A2_DFE9E5BA616F",
  "this.overlay_04C1BC25_0B47_ED8D_4195_86B28079966C",
  "this.overlay_04C19C25_0B47_ED8D_419C_8778BAC92B36",
  "this.overlay_04C17C25_0B47_ED8D_416E_0CA9410A0C0E",
  "this.overlay_04C14C25_0B47_ED8D_41A4_C704EC50FA28",
  "this.overlay_04C15C25_0B47_ED8D_4196_69D7AD6AD1E0",
  "this.overlay_04C12C25_0B47_ED8D_41A1_C32E472FDC29",
  "this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38",
  "this.overlay_04C10C25_0B47_ED8D_41A2_CA6A9014D379",
  "this.overlay_04C11C26_0B47_ED8F_4198_1088747F1370",
  "this.overlay_04C0EC26_0B47_ED8F_41A6_00AFCEA4C015",
  "this.overlay_04C0FC26_0B47_ED8F_41A2_8F8BE25C4232",
  "this.overlay_04C0CC26_0B47_ED8F_4197_A5D012ED7B24",
  "this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B",
  "this.overlay_04C0BC26_0B47_ED8F_41A4_6BEA191B4684",
  "this.overlay_04C08C26_0B47_ED8F_419F_FD8A0F4E98C1",
  "this.overlay_04C09C26_0B47_ED8F_4192_C39A3975CC2C",
  "this.overlay_04C06C26_0B47_ED8F_413B_CC6B5EC15A80",
  "this.overlay_04C1CC26_0B47_ED8F_41A1_04BB47C27FF4",
  "this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC",
  "this.overlay_04C1AC26_0B47_ED8F_4190_8EF55B87AED6",
  "this.overlay_04C1BC26_0B47_ED8F_41A5_3515CB067BFE",
  "this.overlay_04C18C26_0B47_ED8F_419E_E3A53610D88B",
  "this.overlay_04C16C26_0B47_ED8F_41A3_5480C5BE648E",
  "this.overlay_04C14C26_0B47_ED8F_418B_FBC18F7B2E0E",
  "this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A",
  "this.overlay_04C12C26_0B47_ED8F_419D_494C0B4D71FC",
  "this.overlay_04C13C27_0B47_ED8D_4185_724CB9C562C2",
  "this.overlay_04C10C27_0B47_ED8D_417C_4414BB05526F",
  "this.overlay_04C0EC27_0B47_ED8D_4182_865CB3D18243",
  "this.overlay_04C0FC27_0B47_ED8D_419F_46A4EEA5E646",
  "this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33",
  "this.overlay_04C0DC27_0B47_ED8D_4193_046A5ABE7EB0"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_105071C9_0B4D_F685_41A5_D1F98862346E",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_171A02D2_0B4D_FA87_41A2_EEE7BD59295E"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1AD21975_0B44_178D_419A_F21912320B19"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC",
 "thumbnailUrl": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_t.jpg",
 "label": "L2-A",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_1B90FBD9_0B44_6A85_4192_0C49F8BFDAD2",
  "this.overlay_1B90CBD9_0B44_6A85_41A1_E42CC5BE026A",
  "this.overlay_1B9F2BD9_0B44_6A85_41A5_F8DF4B81B731",
  "this.overlay_1B9F0BD9_0B44_6A85_4195_415C66F484D5",
  "this.overlay_1B9F1BD9_0B44_6A85_4198_37053C0DC389",
  "this.overlay_1B9F6BD9_0B44_6A85_4185_D41BEFBA2732",
  "this.overlay_1B9F7BD9_0B44_6A85_41A1_D86437408546",
  "this.overlay_1B9F5BD9_0B44_6A85_41A6_53BFC37027FB",
  "this.overlay_1B9FABD9_0B44_6A85_418C_604802B094DB",
  "this.overlay_1B9FBBD9_0B44_6A85_41A4_786B0A5E99A1",
  "this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2",
  "this.overlay_1B9FFBD9_0B44_6A85_4183_185BC234EB22",
  "this.overlay_1B9FCBD9_0B44_6A85_4180_E3D42929A63F",
  "this.overlay_1B9E2BD9_0B44_6A85_41A0_661F623E706D",
  "this.overlay_1B9E0BD9_0B44_6A85_41A2_8C0CCFA71A4D",
  "this.overlay_1B9E7BD9_0B44_6A85_4190_812B4D399C21",
  "this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E",
  "this.overlay_1B90DBD9_0B44_6A85_4194_1AFB30330DC2",
  "this.overlay_1B9F3BD9_0B44_6A85_4149_7339BCC46C34",
  "this.overlay_1B9F0BDB_0B44_6A86_41A2_2D0E43849C8C",
  "this.overlay_1B9F1BDB_0B44_6A86_41A2_0C54C57A2970",
  "this.overlay_1B9F6BDB_0B44_6A86_4199_E54FB34CBF56",
  "this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD",
  "this.overlay_1B9F5BDB_0B44_6A86_418B_08F4B96612F1",
  "this.overlay_1B9FABDB_0B44_6A86_41A4_87D5A293739E",
  "this.overlay_1B9FBBDB_0B44_6A86_4189_E690AB60AC94",
  "this.overlay_1B9F9BDB_0B44_6A86_41A6_8AD969554DA2",
  "this.overlay_1B9FFBDB_0B44_6A86_4185_5CC5D74E8AE8",
  "this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B",
  "this.overlay_1B9E2BDB_0B44_6A86_4197_34D0C8225875"
 ]
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_12FA6052_0B4D_F587_4190_43B044305127, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_12FA6052_0B4D_F587_4190_43B044305127, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "media": "this.video_E297D754_F834_2D83_41DA_21A74AD71847",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_12FA6052_0B4D_F587_4190_43B044305127"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_114C90D9_0B4D_F685_4181_502AF3B462E0",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "Video",
 "label": "TailGate",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_DDF7B047_F912_3EE6_41C6_A905D91A483D_t.jpg",
 "width": 1920,
 "loop": false,
 "id": "video_DDF7B047_F912_3EE6_41C6_A905D91A483D",
 "height": 1080,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_DDF7B047_F912_3EE6_41C6_A905D91A483D.mp4"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_1125B121_0B4D_F785_4198_ED1C854C6B00"
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_1294F075_0B4D_F58D_4177_D212991A985F",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "Video",
 "label": "03-Durability & Insulation_01",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16_t.jpg",
 "width": 1920,
 "loop": false,
 "id": "video_E60F718F_F81C_649C_41E1_1B361DFD2D16",
 "height": 1080,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_171582DB_0B4D_FA85_4175_9A62E977C059",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "player": "this.MainViewerPhotoAlbumPlayer",
   "class": "PhotoAlbumPlayListItem",
   "media": "this.album_E376AACD_F814_249C_41CD_ACBEA1B83814"
  }
 ],
 "id": "playList_12FA7052_0B4D_F587_4194_DA1BEE3D7B42"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_175242B0_0B4D_FA82_418A_F7476206A31C"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_1AD21975_0B44_178D_419A_F21912320B19",
 "thumbnailUrl": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_t.jpg",
 "label": "L3-A",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_1AD22975_0B44_178D_419D_EB278B52A346",
  "this.overlay_1AD24975_0B44_178D_4193_6BE425960D5A",
  "this.overlay_1AD25975_0B44_178D_4192_C7AA97F58622",
  "this.overlay_1AD26975_0B44_178D_41A5_46FB3AB4822A",
  "this.overlay_1AD27975_0B44_178D_41A2_1C86F41F9C84",
  "this.overlay_1AD18975_0B44_178D_419A_281713833B85",
  "this.overlay_1AD19975_0B44_178D_419A_F41F5227AB5C",
  "this.overlay_1AD1A975_0B44_178D_4179_C4A25ED05114",
  "this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6",
  "this.overlay_1AD1C975_0B44_178D_4196_6926D059F9F3",
  "this.overlay_1AD1D975_0B44_178D_4195_F638C2B46EA6",
  "this.overlay_1AD1E975_0B44_178D_4111_93713CF09F50",
  "this.overlay_1AD1F975_0B44_178D_4191_93833421CF6B",
  "this.overlay_1AD10975_0B44_178D_419A_BBDE3147F9BE",
  "this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201",
  "this.overlay_1AD12975_0B44_178D_41A5_96D2E307C15D",
  "this.overlay_1AD13975_0B44_178D_418C_2489CE5F9DAE",
  "this.overlay_1AD14975_0B44_178D_419E_103B3B87530C",
  "this.overlay_1AD2F975_0B44_178D_4170_8AF0EDFE3907",
  "this.overlay_1AD20975_0B44_178D_419B_842C923E756C",
  "this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA",
  "this.overlay_1AD22975_0B44_178D_41A1_9C43F426B030",
  "this.overlay_1AD24975_0B44_178D_4178_FC9D4DC89902",
  "this.overlay_1AD25975_0B44_178D_4196_ABD743FF3FD8",
  "this.overlay_1AD26975_0B44_178D_4193_1D3A45808E2B",
  "this.overlay_1AD27975_0B44_178D_4183_50918EC63AAF",
  "this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3",
  "this.overlay_1AD19975_0B44_178D_41A4_AF4B4A5E6F1B"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_11D6512B_0B4D_F785_417B_CC43A607FAB2"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_10A0D2A7_0B4D_FA8E_419A_E4FEF7AA005F"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_12FA4052_0B4D_F587_4181_AEBFD1015AD9, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_12FA4052_0B4D_F587_4181_AEBFD1015AD9, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "media": "this.video_E60F718F_F81C_649C_41E1_1B361DFD2D16",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_12FA4052_0B4D_F587_4181_AEBFD1015AD9"
},
{
 "class": "Video",
 "label": "04 - Sealing & Tracks-01",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C_t.jpg",
 "width": 1920,
 "loop": false,
 "id": "video_D835DB01_F8ED_E584_41E0_C65F5E1D702C",
 "height": 1080,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_1139A10F_0B4D_F79D_419D_501C57850CB3"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_111C60FE_0B4D_F67F_419C_D7D6CCB60626"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_112A5118_0B4D_F783_4199_624FA64F5A02"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC",
 "thumbnailUrl": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_t.jpg",
 "label": "R1-A",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_1959E00A_0B44_7587_419C_BAEF1AAFC278",
  "this.overlay_1959D00A_0B44_7587_419A_39CFE074BC5F",
  "this.overlay_1959C00A_0B44_7587_4196_24373B1621BA",
  "this.overlay_1966000A_0B44_7587_418D_EF73D571168C",
  "this.overlay_1966600A_0B44_7587_418F_53B7DD9A06FE",
  "this.overlay_1966400A_0B44_7587_4188_A6F8C5BAF5DC",
  "this.overlay_1966B00A_0B44_7587_41A5_22A77F8FD457",
  "this.overlay_1966800A_0B44_7587_418C_842CA13392D1",
  "this.overlay_1966F00A_0B44_7587_4190_F0697A52551E",
  "this.overlay_1959600A_0B44_7587_4190_9CAB84707581",
  "this.overlay_1959500A_0B44_7587_41A2_C1D878450BCC",
  "this.overlay_1959B00A_0B44_7587_419C_8D3DF5AC294C",
  "this.overlay_1959A00A_0B44_7587_417F_6DC37DD62D11",
  "this.overlay_1959800A_0B44_7587_41A5_38B8DD1EBFBC",
  "this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5",
  "this.overlay_1966300A_0B44_7587_4193_D63D8567615D",
  "this.overlay_1966200A_0B44_7587_41A6_46A24831F9BC",
  "this.overlay_1966000A_0B44_7587_4194_DC4EC9A10F6A",
  "this.overlay_1966500A_0B44_7587_4166_779FDA17B025",
  "this.overlay_1966400A_0B44_7587_4190_0F1C9650932F",
  "this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF",
  "this.overlay_1966800A_0B44_7587_416F_C7530C34A16C",
  "this.overlay_1966D00A_0B44_7587_4195_F15916CC4DCF",
  "this.overlay_1967200A_0B44_7587_418D_741B38C464A0",
  "this.overlay_1967400B_0B44_7585_4195_1E27FC2CDC4F",
  "this.overlay_1967B00B_0B44_7585_4197_B36D45E632D6",
  "this.overlay_1967900B_0B44_7585_417B_7160773F61C9",
  "this.overlay_1967F00B_0B44_7585_418C_DD969FDAA188"
 ]
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_1154D0D1_0B4D_F685_4195_D28469766BBD",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "VideoPlayer",
 "viewerArea": "this.MainViewer",
 "id": "MainViewerVideoPlayer",
 "displayPlaybackBar": true
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_176B12CA_0B4D_FA87_4195_7BE693D6AB55"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_1098F282_0B4D_FA87_4181_0B5DC6676726"
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_12A800AC_0B4D_F683_4198_6C2AEEAA4AC5",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_108A628B_0B4D_FA85_41A6_23F7E00A36D0"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_1008B232_0B4D_F586_41A5_47115DDE510B"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_camera"
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_106E5205_0B4D_F58D_4192_82162A42827A",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_117130EB_0B4D_F685_41A5_78F3E79CCC74",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_11A6A1B0_0B4D_F682_41A6_656B933A2FE9"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_1034B24C_0B4D_F583_4196_B016967A7263"
},
{
 "class": "Video",
 "label": "05-Control & Safety_01",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_E297D754_F834_2D83_41DA_21A74AD71847_t.jpg",
 "width": 1920,
 "loop": false,
 "id": "video_E297D754_F834_2D83_41DA_21A74AD71847",
 "height": 1080,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 }
},
{
 "class": "Video",
 "label": "01-Doors-01",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45_t.jpg",
 "width": 1920,
 "loop": false,
 "id": "video_ED4C97C5_F814_EC8C_41C3_679D56F23F45",
 "height": 1080,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_115C30C9_0B4D_F685_4158_BE3A56B303A3"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_11B5C19B_0B4D_F685_4195_6ABA0D01CB64"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_10215253_0B4D_F585_418A_011E988DE18F"
},
{
 "hfovMax": 130,
 "class": "Panorama",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  }
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_t.jpg"
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "Outdoor-Right-A",
 "id": "panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372",
 "thumbnailUrl": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_E2143EA3_FC01_5572_41EC_ED71B9AC48DE",
  "this.overlay_E36B5B5B_FC01_D3D2_4197_E9443ED69D9F"
 ]
},
{
 "class": "PhotoAlbum",
 "label": "Photo Album Glass-Window (2) (1)",
 "id": "album_E376AACD_F814_249C_41CD_ACBEA1B83814",
 "thumbnailUrl": "media/album_E376AACD_F814_249C_41CD_ACBEA1B83814_t.png",
 "playList": "this.album_E376AACD_F814_249C_41CD_ACBEA1B83814_AlbumPlayList"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_10D0725E_0B4D_F5BE_418A_C21FC7732B1A"
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_10846293_0B4D_FA85_41A4_4AA5FC6C0821",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "camera_1736D2ED_0B4D_FA9D_41A5_296BED597897",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_172122F7_0B4D_FA8D_4181_B54330C420F2"
},
{
 "class": "Photo",
 "duration": 5000,
 "id": "album_E376AACD_F814_249C_41CD_ACBEA1B83814_0",
 "thumbnailUrl": "media/album_E376AACD_F814_249C_41CD_ACBEA1B83814_0_t.png",
 "width": 2673,
 "label": "Glass-Window (2) (1)",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/album_E376AACD_F814_249C_41CD_ACBEA1B83814_0.png",
    "class": "ImageResourceLevel"
   }
  ]
 },
 "height": 1740
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_107C31F1_0B4D_F682_419A_0B572ED72E48"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_116350F4_0B4D_F683_4171_E03E2D547A54"
},
{
 "class": "PhotoAlbumPlayer",
 "viewerArea": "this.MainViewer",
 "id": "MainViewerPhotoAlbumPlayer"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_12FA9052_0B4D_F587_41A4_88ADF384D9CD, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_12FA9052_0B4D_F587_41A4_88ADF384D9CD, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "media": "this.video_DDF7B047_F912_3EE6_41C6_A905D91A483D",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_12FA9052_0B4D_F587_41A4_88ADF384D9CD"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_camera",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_12859091_0B4D_F685_41A6_25B9598579C2"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_1019A21F_0B4D_F5BE_41A1_385813F71F0F"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_12A2B0B5_0B4D_F68D_4194_60CA3414EDF4"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_12FA3052_0B4D_F587_4193_A39C0C29F68A, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_12FA3052_0B4D_F587_4193_A39C0C29F68A, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "media": "this.video_D835DB01_F8ED_E584_41E0_C65F5E1D702C",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_12FA3052_0B4D_F587_4193_A39C0C29F68A"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_115AE0BF_0B4D_F6FD_419E_78D331612DE4"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_11BBF187_0B4D_F68E_4199_3F6048300656"
},
{
 "hfovMax": 130,
 "class": "Panorama",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  }
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_t.jpg"
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "Outdoor-Left-A",
 "id": "panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9",
 "thumbnailUrl": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_E21C6E8D_FC03_7536_41E1_F2B426D5BBF3",
  "this.overlay_E219CA38_FC03_7D5E_41E5_0DACEEC1BA80"
 ]
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_camera",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "hfov": 120,
  "class": "RotationalCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_10B6B29D_0B4D_FABD_4178_45EF7EF70E72",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E"
  }
 ],
 "hfov": 360,
 "label": "Outdoor -V02 1",
 "hfovMin": 60,
 "id": "media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A",
 "thumbnailUrl": "media/media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_t.jpg",
 "partial": false,
 "loop": false,
 "pitch": 0,
 "hfovMax": 140,
 "class": "Video360",
 "vfov": 180,
 "overlays": [
  "this.overlay_E60F307D_FC07_CDD7_41E2_D9E0027B6315",
  "this.overlay_E1E02FC2_FC0F_D332_41EC_99615A3C0424",
  "this.overlay_E1F54768_FC00_F3FD_41AA_BB5CB4820CCA"
 ],
 "video": [
  {
   "width": 1920,
   "class": "Video360Resource",
   "framerate": 30,
   "url": "media/media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A.mp4",
   "bitrate": 2394,
   "posterURL": "media/media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_poster.jpg",
   "type": "video/mp4",
   "height": 1080
  }
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1AD21975_0B44_178D_419A_F21912320B19"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0"
  }
 ],
 "hfov": 360,
 "label": "M2-A",
 "id": "panorama_054C47A7_0B44_7A8D_4190_A81955A5705E",
 "thumbnailUrl": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_054CE7A7_0B44_7A8D_4172_5759A8F5ADBE",
  "this.overlay_054F37A7_0B44_7A8D_4190_26ABDCACE833",
  "this.overlay_054F27A7_0B44_7A8D_419A_7AA5AD1DEED3",
  "this.overlay_054F17A7_0B44_7A8D_4187_FBDF00862FA2",
  "this.overlay_054F07A7_0B44_7A8D_416D_712A01451393",
  "this.overlay_054F77A7_0B44_7A8D_4194_D9D555855D1E",
  "this.overlay_054F57A7_0B44_7A8D_4189_B391D763DC4E",
  "this.overlay_054FB7A7_0B44_7A8D_419E_5FF43EEB84F7",
  "this.overlay_054FA7A7_0B44_7A8D_41A5_CF9975DA0618",
  "this.overlay_054F97A7_0B44_7A8D_418B_33F33E7A3C16",
  "this.overlay_054F87A7_0B44_7A8D_4199_3E1838804155",
  "this.overlay_054FE7A7_0B44_7A8D_41A5_AAF4817D782A",
  "this.overlay_054FC7A7_0B44_7A8D_41A6_759926EEC8A4",
  "this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415",
  "this.overlay_054E27A8_0B44_7A83_4198_03DEBE908DCB",
  "this.overlay_054CA7A8_0B44_7A83_4187_5FF0627E65DE",
  "this.overlay_054C97A8_0B44_7A83_41A2_011BA609A134",
  "this.overlay_054C87A8_0B44_7A83_4191_75A9EF3E96B4",
  "this.overlay_054CF7A8_0B44_7A83_41A0_554B6DFBE264",
  "this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12",
  "this.overlay_054CC7A8_0B44_7A83_41A4_0ADEF619E0B7",
  "this.overlay_054F37A8_0B44_7A83_41A5_58A5C5D2B5CC",
  "this.overlay_054F17A8_0B44_7A83_41A5_45DD79CEF73A",
  "this.overlay_054F07A8_0B44_7A83_41A0_A6138E6B0AFE",
  "this.overlay_054F77A8_0B44_7A83_419F_EFA55282625F",
  "this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796",
  "this.overlay_054F57A8_0B44_7A83_41A2_75219AA77DCB",
  "this.overlay_054F47A8_0B44_7A83_419D_3DADBED40658",
  "this.overlay_054FB7A8_0B44_7A83_418A_7B507B9CA5AC",
  "this.overlay_054FA7A8_0B44_7A83_4196_35869C98EBD6",
  "this.overlay_054F97A8_0B44_7A83_41A0_28E6C7B2C794",
  "this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023",
  "this.overlay_054FE7A8_0B44_7A83_41A1_AACBB4DBC0A5",
  "this.overlay_054FC7A8_0B44_7A83_4169_11658F6760B8",
  "this.overlay_054E37A8_0B44_7A83_41A0_F51E84FDBC77",
  "this.overlay_054E27A8_0B44_7A83_41A3_15ADF28AC904",
  "this.overlay_054E17A8_0B44_7A83_419B_C214D618B765",
  "this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD",
  "this.overlay_054E67A8_0B44_7A83_4176_BEEC0F791ED6"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_1289D07E_0B4D_F67F_41A2_4692FFC2EC69",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_11F2913B_0B4D_F785_41A6_9870F50E5437",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_119D9159_0B4D_F785_4185_86287DC077F0"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 0,
 "automaticRotationSpeed": 56,
 "id": "camera_110E6106_0B4D_F78F_417E_2C8195988072",
 "manualRotationSpeed": 1835,
 "initialPosition": {
  "hfov": 117,
  "class": "PanoramaCameraPosition",
  "yaw": 2.27,
  "pitch": 17.02
 }
},
{
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 5,
 "paddingLeft": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "width": "100%",
 "minHeight": 50,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "minWidth": 100,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "height": "100%",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "shadow": false,
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "paddingRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressRight": 0,
 "borderSize": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "playbackBarHeadHeight": 15,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "transitionDuration": 500,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "MapViewer",
 "left": "0%",
 "playbackBarBottom": 0,
 "paddingLeft": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "width": "40%",
 "minHeight": 1,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "minWidth": 1,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "height": "30%",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "shadow": false,
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "paddingRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressRight": 0,
 "borderSize": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "top": "0%",
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "transitionDuration": 500,
 "data": {
  "name": "MapViewer"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_12859091_0B4D_F685_41A6_25B9598579C2, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8); this.startPanoramaWithCamera(this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, this.camera_12859091_0B4D_F685_41A6_25B9598579C2); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 13.83,
   "image": "this.AnimatedImageResource_1303F8DA_0B44_1687_4195_9BB0F8A0FD4F",
   "pitch": -12.02,
   "yaw": 174.37,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BBF2880_0B44_3683_4183_857423E07008",
 "maps": [
  {
   "hfov": 13.83,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 174.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -12.02
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1280F086_0B4D_F68F_41A1_9FABC143D872, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8); this.startPanoramaWithCamera(this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, this.camera_1280F086_0B4D_F68F_41A1_9FABC143D872); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.62,
   "image": "this.AnimatedImageResource_130208DA_0B44_1687_414A_937D1E8ACC68",
   "pitch": -18.06,
   "yaw": -2.51,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BBFD880_0B44_3683_41A6_5BD40E290E1E",
 "maps": [
  {
   "hfov": 11.62,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -2.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -18.06
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_12A2B0B5_0B4D_F68D_4194_60CA3414EDF4, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8); this.startPanoramaWithCamera(this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, this.camera_12A2B0B5_0B4D_F68D_4194_60CA3414EDF4); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 12.06,
   "image": "this.AnimatedImageResource_1302A8DA_0B44_1687_41A3_D6945EAAFC3A",
   "pitch": -9.32,
   "yaw": -62.29,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BBFF880_0B44_3683_4178_8FD6231C07D0",
 "maps": [
  {
   "hfov": 12.06,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -62.29,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -9.32
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_12BF509A_0B4D_F687_41A5_BEDADAFFC2C0, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_12BF509A_0B4D_F687_41A5_BEDADAFFC2C0); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.95,
   "image": "this.AnimatedImageResource_1302E8DA_0B44_1687_41A1_B070F1BFAC97",
   "pitch": -12.06,
   "yaw": -94.55,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BBF9880_0B44_3683_4191_DE2E4E32BA38",
 "maps": [
  {
   "hfov": 11.95,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -94.55,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -12.06
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_12B670A4_0B4D_F682_41A2_E3E8C02557D6, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8); this.startPanoramaWithCamera(this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, this.camera_12B670A4_0B4D_F682_41A2_E3E8C02557D6); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 12,
   "image": "this.AnimatedImageResource_130118DA_0B44_1687_41A2_7B49715A3C0A",
   "pitch": -10.9,
   "yaw": -133.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BBF8880_0B44_3683_4140_A8EE22D28180",
 "maps": [
  {
   "hfov": 12,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -133.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_9_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -10.9
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'play'); this.setOverlayBehaviour(this.overlay_1BBE8880_0B44_3683_418A_1812F7549998, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.setOverlayBehaviour(this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.setOverlayBehaviour(this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.overlay_1BBE4880_0B44_3683_4195_9F5F0EC15FE4.set('enabled', true); this.overlay_1BBE7880_0B44_3683_41A6_5E4A06F975F0.set('enabled', true); this.overlay_1BBE6880_0B44_3683_41A0_FB29943FD048.set('enabled', true); this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18.set('enabled', true); this.overlay_1BBEC880_0B44_3683_418F_1D176A7841B8.set('enabled', false); this.overlay_1BBEF880_0B44_3683_41A0_B78F4A512EA0.set('enabled', false); this.overlay_1BBEE880_0B44_3683_414A_66171A20B580.set('enabled', false); this.overlay_1BBE8880_0B44_3683_418A_1812F7549998.set('enabled', false); this.overlay_1BBD5880_0B44_3683_412F_46414F466400.set('enabled', false); this.overlay_1BBD4880_0B44_3683_41A0_E280EF92F128.set('enabled', false); this.overlay_1BBD7880_0B44_3683_41A5_EF8454B664B8.set('enabled', false); this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20.set('enabled', false); this.overlay_1BBDD882_0B44_3687_4188_1486A943CED3.set('enabled', false); this.overlay_1BBDF882_0B44_3687_41A4_62447BBCBCB8.set('enabled', false); this.overlay_1BBDE882_0B44_3687_419F_83EFCB91B4ED.set('enabled', false); this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.3,
   "image": "this.AnimatedImageResource_130148DA_0B44_1687_4191_6DE4FD6FC4D7",
   "pitch": 8.42,
   "yaw": 14.7,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BBFB880_0B44_3683_41A6_613BFC532ABC",
 "maps": [
  {
   "hfov": 2.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 14.7,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_10_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 8.42
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_11_0.png",
      "class": "ImageResourceLevel",
      "width": 184,
      "height": 100
     }
    ]
   },
   "pitch": 10.9,
   "yaw": 15.03,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBE5880_0B44_3683_41A2_A2DBF7ECE090",
 "data": {
  "label": "Door"
 },
 "maps": [
  {
   "hfov": 5.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 15.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_11_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": 10.9
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_12_0.png",
      "class": "ImageResourceLevel",
      "width": 1444,
      "height": 1156
     }
    ]
   },
   "pitch": 0.75,
   "yaw": -26.78
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBE4880_0B44_3683_4195_9F5F0EC15FE4",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_12_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_13_0.png",
      "class": "ImageResourceLevel",
      "width": 1160,
      "height": 129
     }
    ]
   },
   "pitch": -1.88,
   "yaw": -27.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBE7880_0B44_3683_41A6_5E4A06F975F0",
 "data": {
  "label": "Multi \u2013 directional configuration with a tail gate"
 },
 "maps": [
  {
   "hfov": 35.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_13_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -1.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_14_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 404
     }
    ]
   },
   "pitch": -8.81,
   "yaw": -28.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBE6880_0B44_3683_41A0_FB29943FD048",
 "data": {
  "label": "\u2022 Door Dimensions \u2013 46400 mm (CW) X 9000 mm (CH)\u000d\u000d\u2022 6 Independent Operation Leaves (every leaf has a motor for individual operations)\u000d\u000d\u2022 4 Pedestrian Access with Safety System Sensors (Wicket Doors  - 4 Leaves)\u000d\u000d"
 },
 "maps": [
  {
   "hfov": 35.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_14_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": -8.81
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 },
 "hfov": 31.12,
 "autoplay": false,
 "id": "overlay_1BBE1880_0B44_3683_419E_A583226D8E18",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1BBE1880_0B44_3683_419E_A583226D8E18_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.68,
 "useHandCursor": true,
 "roll": -1.13,
 "yaw": -26.47,
 "rotationY": 4.39,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.99,
 "click": "this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.37,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1BBE8880_0B44_3683_418A_1812F7549998, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'play'); this.setOverlayBehaviour(this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.setOverlayBehaviour(this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.setOverlayBehaviour(this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.overlay_1BBEC880_0B44_3683_418F_1D176A7841B8.set('enabled', true); this.overlay_1BBEF880_0B44_3683_41A0_B78F4A512EA0.set('enabled', true); this.overlay_1BBEE880_0B44_3683_414A_66171A20B580.set('enabled', true); this.overlay_1BBE8880_0B44_3683_418A_1812F7549998.set('enabled', true); this.overlay_1BBE4880_0B44_3683_4195_9F5F0EC15FE4.set('enabled', false); this.overlay_1BBE7880_0B44_3683_41A6_5E4A06F975F0.set('enabled', false); this.overlay_1BBE6880_0B44_3683_41A0_FB29943FD048.set('enabled', false); this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18.set('enabled', false); this.overlay_1BBD5880_0B44_3683_412F_46414F466400.set('enabled', false); this.overlay_1BBD4880_0B44_3683_41A0_E280EF92F128.set('enabled', false); this.overlay_1BBD7880_0B44_3683_41A5_EF8454B664B8.set('enabled', false); this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20.set('enabled', false); this.overlay_1BBDD882_0B44_3687_4188_1486A943CED3.set('enabled', false); this.overlay_1BBDF882_0B44_3687_41A4_62447BBCBCB8.set('enabled', false); this.overlay_1BBDE882_0B44_3687_419F_83EFCB91B4ED.set('enabled', false); this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1.set('enabled', false)"
  }
 ],
 "data": {
  "label": "ControlSystem"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.06,
   "image": "this.AnimatedImageResource_130098DC_0B44_1683_4196_9017E8C2608D",
   "pitch": 1.65,
   "yaw": -0.07,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BBE0880_0B44_3683_4197_5F522143F9B8",
 "maps": [
  {
   "hfov": 3.06,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -0.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_15_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.65
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 20.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_16_0.png",
      "class": "ImageResourceLevel",
      "width": 688,
      "height": 108
     }
    ]
   },
   "pitch": 4.08,
   "yaw": 2.29,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBE2880_0B44_3683_41A1_32594F196162",
 "data": {
  "label": "Door Control System"
 },
 "maps": [
  {
   "hfov": 20.76,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.29,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_16_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 101,
      "height": 16
     }
    ]
   },
   "pitch": 4.08
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_17_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBEC880_0B44_3683_418F_1D176A7841B8",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_17_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_18_0.png",
      "class": "ImageResourceLevel",
      "width": 1169,
      "height": 158
     }
    ]
   },
   "pitch": -1.57,
   "yaw": 43.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBEF880_0B44_3683_41A0_B78F4A512EA0",
 "data": {
  "label": "Door Control System Safety & Warning Devices"
 },
 "maps": [
  {
   "hfov": 35.4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_18_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 118,
      "height": 16
     }
    ]
   },
   "pitch": -1.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_19_0.png",
      "class": "ImageResourceLevel",
      "width": 1248,
      "height": 562
     }
    ]
   },
   "pitch": -10.05,
   "yaw": 43.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBEE880_0B44_3683_414A_66171A20B580",
 "data": {
  "label": "\u2022 In compliance with EN 12453:2001 (Safety in use of power operated doors)\u000d\u2022 Pendant Push Button Controls for Movement, Closing and Emergency Stop\u000d\u2022 Can be integrated with the BMS (Building Management System) & Fire Detection System\u000d\u2022 Each Leaf is fitted with audible and a visual alarm for alerting the personal while door in operations\u000d\u2022 Safety Edge System\u000d\u2022 Anti-collision Sensors\u000d"
 },
 "maps": [
  {
   "hfov": 37.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_19_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 35,
      "height": 16
     }
    ]
   },
   "pitch": -10.05
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 },
 "hfov": 32.1,
 "autoplay": false,
 "id": "overlay_1BBE8880_0B44_3683_418A_1812F7549998",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1BBE8880_0B44_3683_418A_1812F7549998_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.73,
 "useHandCursor": true,
 "roll": 0.59,
 "yaw": 42.9,
 "rotationY": 2.51,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.87,
 "click": "this.overlay_1BBE8880_0B44_3683_418A_1812F7549998.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'play'); this.setOverlayBehaviour(this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.setOverlayBehaviour(this.overlay_1BBE8880_0B44_3683_418A_1812F7549998, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.setOverlayBehaviour(this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.overlay_1BBD5880_0B44_3683_412F_46414F466400.set('enabled', true); this.overlay_1BBD4880_0B44_3683_41A0_E280EF92F128.set('enabled', true); this.overlay_1BBD7880_0B44_3683_41A5_EF8454B664B8.set('enabled', true); this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20.set('enabled', true); this.overlay_1BBE4880_0B44_3683_4195_9F5F0EC15FE4.set('enabled', false); this.overlay_1BBE7880_0B44_3683_41A6_5E4A06F975F0.set('enabled', false); this.overlay_1BBE6880_0B44_3683_41A0_FB29943FD048.set('enabled', false); this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18.set('enabled', false); this.overlay_1BBEC880_0B44_3683_418F_1D176A7841B8.set('enabled', false); this.overlay_1BBEF880_0B44_3683_41A0_B78F4A512EA0.set('enabled', false); this.overlay_1BBEE880_0B44_3683_414A_66171A20B580.set('enabled', false); this.overlay_1BBE8880_0B44_3683_418A_1812F7549998.set('enabled', false); this.overlay_1BBDD882_0B44_3687_4188_1486A943CED3.set('enabled', false); this.overlay_1BBDF882_0B44_3687_41A4_62447BBCBCB8.set('enabled', false); this.overlay_1BBDE882_0B44_3687_419F_83EFCB91B4ED.set('enabled', false); this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorCladding Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.29,
   "image": "this.AnimatedImageResource_131FF8DC_0B44_1683_419F_29E03E3380CD",
   "pitch": 7.83,
   "yaw": -15.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BBEB880_0B44_3683_41A0_05173F6D629A",
 "maps": [
  {
   "hfov": 2.29,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -15.42,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_20_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 7.83
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_21_0.png",
      "class": "ImageResourceLevel",
      "width": 432,
      "height": 120
     }
    ]
   },
   "pitch": 9.98,
   "yaw": -14.83,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBEA880_0B44_3683_416C_678BD2C9D580",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 12.9,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -14.83,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_21_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 57,
      "height": 16
     }
    ]
   },
   "pitch": 9.98
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_22_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBD5880_0B44_3683_412F_46414F466400",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_22_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_23_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 362
     }
    ]
   },
   "pitch": -10.29,
   "yaw": 42.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBD4880_0B44_3683_41A0_E280EF92F128",
 "data": {
  "label": "\u2022 Insulated PUF Panel ensuring thermal & sound insulation\u000d\u2022 Double Glazed Window Sections"
 },
 "maps": [
  {
   "hfov": 35.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_23_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": -10.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_24_0.png",
      "class": "ImageResourceLevel",
      "width": 1160,
      "height": 129
     }
    ]
   },
   "pitch": -1.34,
   "yaw": 43.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBD7880_0B44_3683_41A5_EF8454B664B8",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 35.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_24_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -1.34
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 },
 "hfov": 32.3,
 "autoplay": false,
 "id": "overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.77,
 "useHandCursor": true,
 "roll": -1.16,
 "yaw": 42.95,
 "rotationY": 3.66,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.19,
 "click": "this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'play'); this.setOverlayBehaviour(this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.setOverlayBehaviour(this.overlay_1BBE8880_0B44_3683_418A_1812F7549998, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.setOverlayBehaviour(this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, 'stop'); this.overlay_1BBDD882_0B44_3687_4188_1486A943CED3.set('enabled', true); this.overlay_1BBDF882_0B44_3687_41A4_62447BBCBCB8.set('enabled', true); this.overlay_1BBDE882_0B44_3687_419F_83EFCB91B4ED.set('enabled', true); this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1.set('enabled', true); this.overlay_1BBE4880_0B44_3683_4195_9F5F0EC15FE4.set('enabled', false); this.overlay_1BBE7880_0B44_3683_41A6_5E4A06F975F0.set('enabled', false); this.overlay_1BBE6880_0B44_3683_41A0_FB29943FD048.set('enabled', false); this.overlay_1BBE1880_0B44_3683_419E_A583226D8E18.set('enabled', false); this.overlay_1BBEC880_0B44_3683_418F_1D176A7841B8.set('enabled', false); this.overlay_1BBEF880_0B44_3683_41A0_B78F4A512EA0.set('enabled', false); this.overlay_1BBEE880_0B44_3683_414A_66171A20B580.set('enabled', false); this.overlay_1BBE8880_0B44_3683_418A_1812F7549998.set('enabled', false); this.overlay_1BBD5880_0B44_3683_412F_46414F466400.set('enabled', false); this.overlay_1BBD4880_0B44_3683_41A0_E280EF92F128.set('enabled', false); this.overlay_1BBD7880_0B44_3683_41A5_EF8454B664B8.set('enabled', false); this.overlay_1BBD6880_0B44_3683_417E_CB8B9A25AD20.set('enabled', false)"
  }
 ],
 "data": {
  "label": "Sealing Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.49,
   "image": "this.AnimatedImageResource_131D28DC_0B44_1683_41A3_EC7341481E04",
   "pitch": 13.7,
   "yaw": -0.97,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BBD0880_0B44_3683_4174_5E54A097A030",
 "maps": [
  {
   "hfov": 2.49,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -0.97,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_25_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 13.7
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_26_0.png",
      "class": "ImageResourceLevel",
      "width": 383,
      "height": 103
     }
    ]
   },
   "pitch": 16.47,
   "yaw": -0.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBD3882_0B44_3687_4193_6FAB25D2EBA0",
 "data": {
  "label": "Seal System"
 },
 "maps": [
  {
   "hfov": 11.14,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -0.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_26_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 59,
      "height": 15
     }
    ]
   },
   "pitch": 16.47
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_27_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1066
     }
    ]
   },
   "pitch": 0.41,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBDD882_0B44_3687_4188_1486A943CED3",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_27_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": 0.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_28_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 388
     }
    ]
   },
   "pitch": -11.96,
   "yaw": 42.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBDF882_0B44_3687_41A4_62447BBCBCB8",
 "data": {
  "label": "\u2022 Vertical joints between on Leaves are fitted with twin tapered EPDM wiper seals\u000d\u000d\u2022 The bottom of each leaf is fitted with a heavy-duty nylon brush seal"
 },
 "maps": [
  {
   "hfov": 35.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_28_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 49,
      "height": 16
     }
    ]
   },
   "pitch": -11.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_29_0.png",
      "class": "ImageResourceLevel",
      "width": 1160,
      "height": 129
     }
    ]
   },
   "pitch": -5.31,
   "yaw": 43.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BBDE882_0B44_3687_419F_83EFCB91B4ED",
 "data": {
  "label": "Weather Seal System"
 },
 "maps": [
  {
   "hfov": 35.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_29_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -5.31
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 },
 "hfov": 32.6,
 "autoplay": false,
 "id": "overlay_1BBD9882_0B44_3687_4198_55DDB93160D1",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1BBD9882_0B44_3687_4198_55DDB93160D1_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 5.8,
 "useHandCursor": true,
 "roll": -0.18,
 "yaw": 42.6,
 "rotationY": -4.04,
 "class": "VideoPanoramaOverlay",
 "rotationX": -3.17,
 "click": "this.overlay_1BBD9882_0B44_3687_4198_55DDB93160D1.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.7,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_12A800AC_0B4D_F683_4198_6C2AEEAA4AC5, this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_12A800AC_0B4D_F683_4198_6C2AEEAA4AC5); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.58,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_30_0.png",
      "class": "ImageResourceLevel",
      "width": 217,
      "height": 61
     }
    ]
   },
   "pitch": 0.75,
   "yaw": 15.45
  }
 ],
 "id": "overlay_1BBD8882_0B44_3687_4187_304D13484A5A",
 "maps": [
  {
   "hfov": 6.58,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 15.45,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_30_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 56,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_115C30C9_0B4D_F685_4158_BE3A56B303A3, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5); this.startPanoramaWithCamera(this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, this.camera_115C30C9_0B4D_F685_4158_BE3A56B303A3); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.48,
   "image": "this.AnimatedImageResource_1370D8D5_0B44_168D_418A_E466CDD79948",
   "pitch": -19.98,
   "yaw": -176.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BC0F73B_0B44_1B85_4194_C5C0FEC147D7",
 "maps": [
  {
   "hfov": 11.48,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -176.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -19.98
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_115AE0BF_0B4D_F6FD_419E_78D331612DE4, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5); this.startPanoramaWithCamera(this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, this.camera_115AE0BF_0B4D_F6FD_419E_78D331612DE4); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.84,
   "image": "this.AnimatedImageResource_130F68D5_0B44_168D_418E_ECDC85CBB4B1",
   "pitch": -14.26,
   "yaw": 68.12,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BC0C73B_0B44_1B85_4186_36AFCA572AA6",
 "maps": [
  {
   "hfov": 11.84,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 68.12,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -14.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_114C90D9_0B4D_F685_4181_502AF3B462E0, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_114C90D9_0B4D_F685_4181_502AF3B462E0); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.81,
   "image": "this.AnimatedImageResource_130FB8D6_0B44_168F_4193_CC9FB8BAE22B",
   "pitch": -14.88,
   "yaw": 112.12,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BC0D73B_0B44_1B85_4182_AFE4AD0B0E43",
 "maps": [
  {
   "hfov": 11.81,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 112.12,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -14.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'play'); this.setOverlayBehaviour(this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.setOverlayBehaviour(this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.setOverlayBehaviour(this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.overlay_1BC0073B_0B44_1B85_419F_355DCC1BB3AA.set('enabled', true); this.overlay_1BC0173B_0B44_1B85_4184_0DE804FEDF8F.set('enabled', true); this.overlay_1BC0773B_0B44_1B85_419C_45A8A1D768B4.set('enabled', true); this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778.set('enabled', true); this.overlay_1BC1F73B_0B44_1B85_417D_20EB59B208E8.set('enabled', false); this.overlay_1BC1D73B_0B44_1B85_418F_BAFAEDAB6196.set('enabled', false); this.overlay_1BC1273B_0B44_1B85_4181_E704C43CAE13.set('enabled', false); this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F.set('enabled', false); this.overlay_1BC1673B_0B44_1B85_4189_0442DBA9CFFB.set('enabled', false); this.overlay_1BC1473B_0B44_1B85_4183_4D901F6E1E08.set('enabled', false); this.overlay_1BCEA73B_0B44_1B85_41A2_AE328DF34E70.set('enabled', false); this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2.set('enabled', false); this.overlay_1BCE273B_0B44_1B85_4187_5964B76931AE.set('enabled', false); this.overlay_1BC1873C_0B44_1B83_4170_D9970CA17DB7.set('enabled', false); this.overlay_1BC1973C_0B44_1B83_4190_2379C124A4EE.set('enabled', false); this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.26,
   "image": "this.AnimatedImageResource_130FF8D6_0B44_168F_4176_9561B9C36F11",
   "pitch": 13.69,
   "yaw": 22.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BC0273B_0B44_1B85_4199_5C4A4F3053F9",
 "maps": [
  {
   "hfov": 2.26,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 22.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 13.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_9_0.png",
      "class": "ImageResourceLevel",
      "width": 184,
      "height": 101
     }
    ]
   },
   "pitch": 16.45,
   "yaw": 21.32,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC0373B_0B44_1B85_417B_C7D35C5EC7BF",
 "data": {
  "label": "Door"
 },
 "maps": [
  {
   "hfov": 5.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 21.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_9_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": 16.45
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_10_0.png",
      "class": "ImageResourceLevel",
      "width": 1444,
      "height": 1156
     }
    ]
   },
   "pitch": 0.75,
   "yaw": -26.78
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC0073B_0B44_1B85_419F_355DCC1BB3AA",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_10_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_11_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 130
     }
    ]
   },
   "pitch": -1.88,
   "yaw": -27.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC0173B_0B44_1B85_4184_0DE804FEDF8F",
 "data": {
  "label": "Multi \u2013 directional configuration with a tail gate"
 },
 "maps": [
  {
   "hfov": 35.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_11_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -1.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_12_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 404
     }
    ]
   },
   "pitch": -8.81,
   "yaw": -28.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC0773B_0B44_1B85_419C_45A8A1D768B4",
 "data": {
  "label": "\u2022 Door Dimensions \u2013 46400 mm (CW) X 9000 mm (CH)\u000d\u000d\u2022 6 Independent Operation Leaves (every leaf has a motor for individual operations)\u000d\u000d\u2022 4 Pedestrian Access with Safety System Sensors (Wicket Doors  - 4 Leaves)\u000d\u000d"
 },
 "maps": [
  {
   "hfov": 35.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_12_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": -8.81
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 },
 "hfov": 31.12,
 "autoplay": false,
 "id": "overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.66,
 "useHandCursor": true,
 "roll": -1.13,
 "yaw": -26.42,
 "rotationY": 4.39,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.97,
 "click": "this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.37,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'play'); this.setOverlayBehaviour(this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.setOverlayBehaviour(this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.setOverlayBehaviour(this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.overlay_1BC1F73B_0B44_1B85_417D_20EB59B208E8.set('enabled', true); this.overlay_1BC1D73B_0B44_1B85_418F_BAFAEDAB6196.set('enabled', true); this.overlay_1BC1273B_0B44_1B85_4181_E704C43CAE13.set('enabled', true); this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F.set('enabled', true); this.overlay_1BC0073B_0B44_1B85_419F_355DCC1BB3AA.set('enabled', false); this.overlay_1BC0173B_0B44_1B85_4184_0DE804FEDF8F.set('enabled', false); this.overlay_1BC0773B_0B44_1B85_419C_45A8A1D768B4.set('enabled', false); this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778.set('enabled', false); this.overlay_1BC1673B_0B44_1B85_4189_0442DBA9CFFB.set('enabled', false); this.overlay_1BC1473B_0B44_1B85_4183_4D901F6E1E08.set('enabled', false); this.overlay_1BCEA73B_0B44_1B85_41A2_AE328DF34E70.set('enabled', false); this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2.set('enabled', false); this.overlay_1BCE273B_0B44_1B85_4187_5964B76931AE.set('enabled', false); this.overlay_1BC1873C_0B44_1B83_4170_D9970CA17DB7.set('enabled', false); this.overlay_1BC1973C_0B44_1B83_4190_2379C124A4EE.set('enabled', false); this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719.set('enabled', false)"
  }
 ],
 "data": {
  "label": "ControlSystem"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.06,
   "image": "this.AnimatedImageResource_130D08D7_0B44_168D_4187_E51352FE77EC",
   "pitch": 1.76,
   "yaw": 2.3,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BC1873B_0B44_1B85_4183_8792AAAA9FE1",
 "maps": [
  {
   "hfov": 3.06,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_13_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.76
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 20.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_14_0.png",
      "class": "ImageResourceLevel",
      "width": 689,
      "height": 108
     }
    ]
   },
   "pitch": 5.13,
   "yaw": 4.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC1973B_0B44_1B85_4173_DD9A724F85E7",
 "data": {
  "label": "Door Control System"
 },
 "maps": [
  {
   "hfov": 20.78,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 4.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_14_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 102,
      "height": 16
     }
    ]
   },
   "pitch": 5.13
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_15_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC1F73B_0B44_1B85_417D_20EB59B208E8",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_15_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_16_0.png",
      "class": "ImageResourceLevel",
      "width": 1169,
      "height": 158
     }
    ]
   },
   "pitch": -1.57,
   "yaw": 43.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC1D73B_0B44_1B85_418F_BAFAEDAB6196",
 "data": {
  "label": "Door Control System Safety & Warning Devices"
 },
 "maps": [
  {
   "hfov": 35.4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_16_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 118,
      "height": 16
     }
    ]
   },
   "pitch": -1.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_17_0.png",
      "class": "ImageResourceLevel",
      "width": 1248,
      "height": 562
     }
    ]
   },
   "pitch": -10.05,
   "yaw": 43.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC1273B_0B44_1B85_4181_E704C43CAE13",
 "data": {
  "label": "\u2022 In compliance with EN 12453:2001 (Safety in use of power operated doors)\u000d\u2022 Pendant Push Button Controls for Movement, Closing and Emergency Stop\u000d\u2022 Can be integrated with the BMS (Building Management System) & Fire Detection System\u000d\u2022 Each Leaf is fitted with audible and a visual alarm for alerting the personal while door in operations\u000d\u2022 Safety Edge System\u000d\u2022 Anti-collision Sensors\u000d"
 },
 "maps": [
  {
   "hfov": 37.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_17_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 35,
      "height": 16
     }
    ]
   },
   "pitch": -10.05
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 },
 "hfov": 32.11,
 "autoplay": false,
 "id": "overlay_1BC1373B_0B44_1B85_4197_893912ED064F",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1BC1373B_0B44_1B85_4197_893912ED064F_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.68,
 "useHandCursor": true,
 "roll": 0.59,
 "yaw": 42.87,
 "rotationY": 2.52,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.82,
 "click": "this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'play'); this.setOverlayBehaviour(this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.setOverlayBehaviour(this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.setOverlayBehaviour(this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.overlay_1BC1673B_0B44_1B85_4189_0442DBA9CFFB.set('enabled', true); this.overlay_1BC1473B_0B44_1B85_4183_4D901F6E1E08.set('enabled', true); this.overlay_1BCEA73B_0B44_1B85_41A2_AE328DF34E70.set('enabled', true); this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2.set('enabled', true); this.overlay_1BC0073B_0B44_1B85_419F_355DCC1BB3AA.set('enabled', false); this.overlay_1BC0173B_0B44_1B85_4184_0DE804FEDF8F.set('enabled', false); this.overlay_1BC0773B_0B44_1B85_419C_45A8A1D768B4.set('enabled', false); this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778.set('enabled', false); this.overlay_1BC1F73B_0B44_1B85_417D_20EB59B208E8.set('enabled', false); this.overlay_1BC1D73B_0B44_1B85_418F_BAFAEDAB6196.set('enabled', false); this.overlay_1BC1273B_0B44_1B85_4181_E704C43CAE13.set('enabled', false); this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F.set('enabled', false); this.overlay_1BCE273B_0B44_1B85_4187_5964B76931AE.set('enabled', false); this.overlay_1BC1873C_0B44_1B83_4170_D9970CA17DB7.set('enabled', false); this.overlay_1BC1973C_0B44_1B83_4190_2379C124A4EE.set('enabled', false); this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorCladding Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.26,
   "image": "this.AnimatedImageResource_130C48D7_0B44_168D_41A3_576FBD8374CC",
   "pitch": 12.72,
   "yaw": -16.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BC1073B_0B44_1B85_418D_3250CC8C68D0",
 "maps": [
  {
   "hfov": 2.26,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -16.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_18_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 12.72
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_19_0.png",
      "class": "ImageResourceLevel",
      "width": 433,
      "height": 119
     }
    ]
   },
   "pitch": 15.33,
   "yaw": -14.59,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC1173B_0B44_1B85_41A0_0CAAAB614AB2",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 12.64,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -14.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_19_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 58,
      "height": 16
     }
    ]
   },
   "pitch": 15.33
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_20_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC1673B_0B44_1B85_4189_0442DBA9CFFB",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_20_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_21_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 362
     }
    ]
   },
   "pitch": -10.29,
   "yaw": 42.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC1473B_0B44_1B85_4183_4D901F6E1E08",
 "data": {
  "label": "\u2022 Insulated PUF Panel ensuring thermal & sound insulation\u000d\u2022 Double Glazed Window Sections"
 },
 "maps": [
  {
   "hfov": 35.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_21_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": -10.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_22_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 130
     }
    ]
   },
   "pitch": -1.34,
   "yaw": 43.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BCEA73B_0B44_1B85_41A2_AE328DF34E70",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 35.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_22_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -1.34
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 },
 "hfov": 32.3,
 "autoplay": false,
 "id": "overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.77,
 "useHandCursor": true,
 "roll": -1.16,
 "yaw": 43.01,
 "rotationY": 3.66,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.2,
 "click": "this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'play'); this.setOverlayBehaviour(this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.setOverlayBehaviour(this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.setOverlayBehaviour(this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, 'stop'); this.overlay_1BCE273B_0B44_1B85_4187_5964B76931AE.set('enabled', true); this.overlay_1BC1873C_0B44_1B83_4170_D9970CA17DB7.set('enabled', true); this.overlay_1BC1973C_0B44_1B83_4190_2379C124A4EE.set('enabled', true); this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719.set('enabled', true); this.overlay_1BC0073B_0B44_1B85_419F_355DCC1BB3AA.set('enabled', false); this.overlay_1BC0173B_0B44_1B85_4184_0DE804FEDF8F.set('enabled', false); this.overlay_1BC0773B_0B44_1B85_419C_45A8A1D768B4.set('enabled', false); this.overlay_1BC1B73B_0B44_1B85_4192_6C901CC3E778.set('enabled', false); this.overlay_1BC1F73B_0B44_1B85_417D_20EB59B208E8.set('enabled', false); this.overlay_1BC1D73B_0B44_1B85_418F_BAFAEDAB6196.set('enabled', false); this.overlay_1BC1273B_0B44_1B85_4181_E704C43CAE13.set('enabled', false); this.overlay_1BC1373B_0B44_1B85_4197_893912ED064F.set('enabled', false); this.overlay_1BC1673B_0B44_1B85_4189_0442DBA9CFFB.set('enabled', false); this.overlay_1BC1473B_0B44_1B85_4183_4D901F6E1E08.set('enabled', false); this.overlay_1BCEA73B_0B44_1B85_41A2_AE328DF34E70.set('enabled', false); this.overlay_1BCEB73B_0B44_1B85_41A3_0933F32CF6B2.set('enabled', false)"
  }
 ],
 "data": {
  "label": "Sealing Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.36,
   "image": "this.AnimatedImageResource_130BA8D7_0B44_168D_419E_6EF8129E02E9",
   "pitch": 23.12,
   "yaw": 4.94,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BCEF73B_0B44_1B85_41A1_4B3C32EF326B",
 "maps": [
  {
   "hfov": 2.36,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 4.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_23_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 23.12
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_24_0.png",
      "class": "ImageResourceLevel",
      "width": 384,
      "height": 104
     }
    ]
   },
   "pitch": 26.58,
   "yaw": 5.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BCEC73B_0B44_1B85_41A6_357EAE177507",
 "data": {
  "label": "Seal System"
 },
 "maps": [
  {
   "hfov": 10.41,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_24_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 59,
      "height": 16
     }
    ]
   },
   "pitch": 26.58
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_25_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1066
     }
    ]
   },
   "pitch": 0.41,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BCE273B_0B44_1B85_4187_5964B76931AE",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_25_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": 0.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_26_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 388
     }
    ]
   },
   "pitch": -11.96,
   "yaw": 42.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC1873C_0B44_1B83_4170_D9970CA17DB7",
 "data": {
  "label": "\u2022 Vertical joints between on Leaves are fitted with twin tapered EPDM wiper seals\u000d\u000d\u2022 The bottom of each leaf is fitted with a heavy-duty nylon brush seal"
 },
 "maps": [
  {
   "hfov": 35.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_26_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 49,
      "height": 16
     }
    ]
   },
   "pitch": -11.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_27_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 130
     }
    ]
   },
   "pitch": -5.31,
   "yaw": 43.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1BC1973C_0B44_1B83_4190_2379C124A4EE",
 "data": {
  "label": "Weather Seal System"
 },
 "maps": [
  {
   "hfov": 35.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_27_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -5.31
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 },
 "hfov": 32.6,
 "autoplay": false,
 "id": "overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 5.79,
 "useHandCursor": true,
 "roll": -0.18,
 "yaw": 42.58,
 "rotationY": -4.04,
 "class": "VideoPanoramaOverlay",
 "rotationX": -3.16,
 "click": "this.overlay_1BC1E73C_0B44_1B83_4189_9217B9C6A719.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.7,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1154D0D1_0B4D_F685_4195_D28469766BBD, this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_1154D0D1_0B4D_F685_4195_D28469766BBD); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.33,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_28_0.png",
      "class": "ImageResourceLevel",
      "width": 242,
      "height": 67
     }
    ]
   },
   "pitch": -0.03,
   "yaw": 18.4
  }
 ],
 "id": "overlay_1BC1C73C_0B44_1B83_41A1_AFEDFD93A0F8",
 "maps": [
  {
   "hfov": 7.33,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 18.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_28_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 57,
      "height": 16
     }
    ]
   },
   "pitch": -0.03
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_171582DB_0B4D_FA85_4175_9A62E977C059, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_171582DB_0B4D_FA85_4175_9A62E977C059); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 9.48,
   "image": "this.AnimatedImageResource_136318CD_0B44_169D_419E_8A5A269615B4",
   "pitch": -18.95,
   "yaw": -173.41,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_045A15B5_0B44_1E8D_4197_FB44A653F341",
 "maps": [
  {
   "hfov": 9.48,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -173.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_9_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -18.95
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_172122F7_0B4D_FA8D_4181_B54330C420F2, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0); this.startPanoramaWithCamera(this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, this.camera_172122F7_0B4D_FA8D_4181_B54330C420F2); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 10.98,
   "image": "this.AnimatedImageResource_136358CD_0B44_169D_4190_6708EF4FDE63",
   "pitch": -9.25,
   "yaw": -74.02,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_045A25B5_0B44_1E8D_41A6_7DA84F0BCED3",
 "maps": [
  {
   "hfov": 10.98,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -74.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_10_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -9.25
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_176B12CA_0B4D_FA87_4195_7BE693D6AB55, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0); this.startPanoramaWithCamera(this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, this.camera_176B12CA_0B4D_FA87_4195_7BE693D6AB55); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 12.12,
   "image": "this.AnimatedImageResource_136398CD_0B44_169D_4160_BA67DC202141",
   "pitch": -7.35,
   "yaw": 82.06,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_045A35B5_0B44_1E8D_41A6_7415AD5CF811",
 "maps": [
  {
   "hfov": 12.12,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 82.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_11_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -7.35
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_170762E4_0B4D_FA83_419B_5B041ED67997, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0); this.startPanoramaWithCamera(this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, this.camera_170762E4_0B4D_FA83_419B_5B041ED67997); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 12.04,
   "image": "this.AnimatedImageResource_136208CD_0B44_169D_4165_31FD93F16662",
   "pitch": -9.88,
   "yaw": -107.04,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_0465C5B5_0B44_1E8D_4192_38118B60C05A",
 "maps": [
  {
   "hfov": 12.04,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -107.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_12_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -9.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_171A02D2_0B4D_FA87_41A2_EEE7BD59295E, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0); this.startPanoramaWithCamera(this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, this.camera_171A02D2_0B4D_FA87_41A2_EEE7BD59295E); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 12.05,
   "image": "this.AnimatedImageResource_1364C8CD_0B44_169D_4175_8BF4488BF693",
   "pitch": -9.62,
   "yaw": 116.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_0465E5B5_0B44_1E8D_418B_C9DE7706B18E",
 "maps": [
  {
   "hfov": 12.05,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 116.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_13_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -9.62
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.overlay_046595B5_0B44_1E8D_4178_593F80EF04B9.set('enabled', true); this.overlay_0465A5B5_0B44_1E8D_4196_66CB6AD520B6.set('enabled', true); this.overlay_0465B5B5_0B44_1E8D_419F_5A89E91E022C.set('enabled', true); this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5.set('enabled', true); this.overlay_046575B5_0B44_1E8D_4181_1F45D5671574.set('enabled', false); this.overlay_046505B5_0B44_1E8D_41A4_26980FEFABBF.set('enabled', false); this.overlay_046515B5_0B44_1E8D_418C_5AE478F5D84B.set('enabled', false); this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2.set('enabled', false); this.overlay_0464E5B6_0B44_1E8F_417B_E193E4E1FEDC.set('enabled', false); this.overlay_0464F5B6_0B44_1E8F_4199_7B8F51267A76.set('enabled', false); this.overlay_046485B6_0B44_1E8F_4174_399A78C2CEA7.set('enabled', false); this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7.set('enabled', false); this.overlay_046455B6_0B44_1E8F_417D_D4D6AE4238CD.set('enabled', false); this.overlay_046465B6_0B44_1E8F_4199_3ADCE33E7A16.set('enabled', false); this.overlay_046475B6_0B44_1E8F_41A0_D76E5A16DF8A.set('enabled', false); this.overlay_046405B6_0B44_1E8F_4194_A0767A061219.set('enabled', false); this.overlay_0467C5B6_0B44_1E8F_4186_0051B110F40F.set('enabled', false); this.overlay_0467D5B6_0B44_1E8F_41A4_E7FA2A7E1008.set('enabled', false); this.overlay_0467E5B6_0B44_1E8F_416C_9446BBFD4B37.set('enabled', false); this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70.set('enabled', false); this.setOverlayBehaviour(this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'play'); this.setOverlayBehaviour(this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046405B6_0B44_1E8F_4194_A0767A061219, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop')"
  }
 ],
 "data": {
  "label": "TailButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.25,
   "image": "this.AnimatedImageResource_136318CF_0B44_169E_417D_B9A709C503E2",
   "pitch": 33.68,
   "yaw": 5.01,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_0465F5B5_0B44_1E8D_41A0_F1D9A8AA4CC7",
 "maps": [
  {
   "hfov": 3.25,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_14_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 33.68
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_15_0.png",
      "class": "ImageResourceLevel",
      "width": 370,
      "height": 138
     }
    ]
   },
   "pitch": 37.38,
   "yaw": 6.25,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046585B5_0B44_1E8D_4181_F7906CA2600E",
 "data": {
  "label": "Tail Gate"
 },
 "maps": [
  {
   "hfov": 8.9,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_15_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 42,
      "height": 16
     }
    ]
   },
   "pitch": 37.38
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.38,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_16_0.png",
      "class": "ImageResourceLevel",
      "width": 1434,
      "height": 1155
     }
    ]
   },
   "pitch": 0.63,
   "yaw": -26.67
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046595B5_0B44_1E8D_4178_593F80EF04B9",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.67,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_16_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.63
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_17_0.png",
      "class": "ImageResourceLevel",
      "width": 1227,
      "height": 112
     }
    ]
   },
   "pitch": -1.69,
   "yaw": -27.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0465A5B5_0B44_1E8D_4196_66CB6AD520B6",
 "data": {
  "label": "Tail Gate integrated with insulated rolling shutter"
 },
 "maps": [
  {
   "hfov": 37.15,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_17_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 175,
      "height": 16
     }
    ]
   },
   "pitch": -1.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 38.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_18_0.png",
      "class": "ImageResourceLevel",
      "width": 1276,
      "height": 425
     }
    ]
   },
   "pitch": -8.93,
   "yaw": -27.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0465B5B5_0B44_1E8D_419F_5A89E91E022C",
 "data": {
  "label": "\u2022 Motorised Rolling Shutter Dimensions \u2013 3000 mm (W) X 4000 mm (H) \u000d\u000d\u2022 Simple push button operation\u000d\u000d\u2022 Backed by manual operation in case of emergency and power failure\u000d"
 },
 "maps": [
  {
   "hfov": 38.16,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_18_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 48,
      "height": 15
     }
    ]
   },
   "pitch": -8.93
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_DDF7B047_F912_3EE6_41C6_A905D91A483D.mp4"
 },
 "hfov": 30.43,
 "autoplay": false,
 "id": "overlay_046545B5_0B44_1E8D_4184_98D71431CAE5",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_046545B5_0B44_1E8D_4184_98D71431CAE5_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.56,
 "useHandCursor": true,
 "roll": 0.19,
 "yaw": -26.65,
 "rotationY": 0.05,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.86,
 "click": "this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.41,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'play'); this.setOverlayBehaviour(this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046405B6_0B44_1E8F_4194_A0767A061219, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.overlay_046575B5_0B44_1E8D_4181_1F45D5671574.set('enabled', true); this.overlay_046505B5_0B44_1E8D_41A4_26980FEFABBF.set('enabled', true); this.overlay_046515B5_0B44_1E8D_418C_5AE478F5D84B.set('enabled', true); this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2.set('enabled', true); this.overlay_046595B5_0B44_1E8D_4178_593F80EF04B9.set('enabled', false); this.overlay_0465A5B5_0B44_1E8D_4196_66CB6AD520B6.set('enabled', false); this.overlay_0465B5B5_0B44_1E8D_419F_5A89E91E022C.set('enabled', false); this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5.set('enabled', false); this.overlay_0464E5B6_0B44_1E8F_417B_E193E4E1FEDC.set('enabled', false); this.overlay_0464F5B6_0B44_1E8F_4199_7B8F51267A76.set('enabled', false); this.overlay_046485B6_0B44_1E8F_4174_399A78C2CEA7.set('enabled', false); this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7.set('enabled', false); this.overlay_046455B6_0B44_1E8F_417D_D4D6AE4238CD.set('enabled', false); this.overlay_046465B6_0B44_1E8F_4199_3ADCE33E7A16.set('enabled', false); this.overlay_046475B6_0B44_1E8F_41A0_D76E5A16DF8A.set('enabled', false); this.overlay_046405B6_0B44_1E8F_4194_A0767A061219.set('enabled', false); this.overlay_0467C5B6_0B44_1E8F_4186_0051B110F40F.set('enabled', false); this.overlay_0467D5B6_0B44_1E8F_41A4_E7FA2A7E1008.set('enabled', false); this.overlay_0467E5B6_0B44_1E8F_416C_9446BBFD4B37.set('enabled', false); this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.48,
   "image": "this.AnimatedImageResource_136248CF_0B44_169E_419F_A3C00504E369",
   "pitch": 12.5,
   "yaw": 25.99,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_046555B5_0B44_1E8D_4198_14A0493E101F",
 "maps": [
  {
   "hfov": 3.48,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 25.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_19_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 12.5
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_20_0.png",
      "class": "ImageResourceLevel",
      "width": 325,
      "height": 154
     }
    ]
   },
   "pitch": 15,
   "yaw": 28.17,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046565B5_0B44_1E8D_4194_3276EC6AF321",
 "data": {
  "label": "Door"
 },
 "maps": [
  {
   "hfov": 9.5,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 28.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_20_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 33,
      "height": 16
     }
    ]
   },
   "pitch": 15
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_21_0.png",
      "class": "ImageResourceLevel",
      "width": 1444,
      "height": 1156
     }
    ]
   },
   "pitch": 0.75,
   "yaw": -26.78
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046575B5_0B44_1E8D_4181_1F45D5671574",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_21_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_22_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 129
     }
    ]
   },
   "pitch": -1.88,
   "yaw": -27.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046505B5_0B44_1E8D_41A4_26980FEFABBF",
 "data": {
  "label": "Multi \u2013 directional configuration with a tail gate"
 },
 "maps": [
  {
   "hfov": 35.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_22_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 144,
      "height": 16
     }
    ]
   },
   "pitch": -1.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_23_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 403
     }
    ]
   },
   "pitch": -8.81,
   "yaw": -28.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046515B5_0B44_1E8D_418C_5AE478F5D84B",
 "data": {
  "label": "\u2022 Door Dimensions \u2013 46400 mm (CW) X 9000 mm (CH)\u000d\u000d\u2022 6 Independent Operation Leaves (every leaf has a motor for individual operations)\u000d\u000d\u2022 4 Pedestrian Access with Safety System Sensors (Wicket Doors  - 4 Leaves)\u000d\u000d"
 },
 "maps": [
  {
   "hfov": 35.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_23_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": -8.81
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 },
 "hfov": 31.12,
 "autoplay": false,
 "id": "overlay_046525B5_0B44_1E8D_4151_B995A70B24F2",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_046525B5_0B44_1E8D_4151_B995A70B24F2_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.65,
 "useHandCursor": true,
 "roll": -1.13,
 "yaw": -26.44,
 "rotationY": 4.39,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.97,
 "click": "this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.37,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'play'); this.setOverlayBehaviour(this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046405B6_0B44_1E8F_4194_A0767A061219, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.overlay_0464E5B6_0B44_1E8F_417B_E193E4E1FEDC.set('enabled', true); this.overlay_0464F5B6_0B44_1E8F_4199_7B8F51267A76.set('enabled', true); this.overlay_046485B6_0B44_1E8F_4174_399A78C2CEA7.set('enabled', true); this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7.set('enabled', true); this.overlay_046595B5_0B44_1E8D_4178_593F80EF04B9.set('enabled', false); this.overlay_0465A5B5_0B44_1E8D_4196_66CB6AD520B6.set('enabled', false); this.overlay_0465B5B5_0B44_1E8D_419F_5A89E91E022C.set('enabled', false); this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5.set('enabled', false); this.overlay_046575B5_0B44_1E8D_4181_1F45D5671574.set('enabled', false); this.overlay_046505B5_0B44_1E8D_41A4_26980FEFABBF.set('enabled', false); this.overlay_046515B5_0B44_1E8D_418C_5AE478F5D84B.set('enabled', false); this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2.set('enabled', false); this.overlay_046455B6_0B44_1E8F_417D_D4D6AE4238CD.set('enabled', false); this.overlay_046465B6_0B44_1E8F_4199_3ADCE33E7A16.set('enabled', false); this.overlay_046475B6_0B44_1E8F_41A0_D76E5A16DF8A.set('enabled', false); this.overlay_046405B6_0B44_1E8F_4194_A0767A061219.set('enabled', false); this.overlay_0467C5B6_0B44_1E8F_4186_0051B110F40F.set('enabled', false); this.overlay_0467D5B6_0B44_1E8F_41A4_E7FA2A7E1008.set('enabled', false); this.overlay_0467E5B6_0B44_1E8F_416C_9446BBFD4B37.set('enabled', false); this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70.set('enabled', false)"
  }
 ],
 "data": {
  "label": "ControlSystem"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.75,
   "image": "this.AnimatedImageResource_136188CF_0B44_169E_41A5_C520E07858D6",
   "pitch": 2.91,
   "yaw": 5.73,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_046535B6_0B44_1E8F_4189_5AC3905CB625",
 "maps": [
  {
   "hfov": 3.75,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_24_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 2.91
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 21.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_25_0.png",
      "class": "ImageResourceLevel",
      "width": 701,
      "height": 149
     }
    ]
   },
   "pitch": 7.06,
   "yaw": 6.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0464C5B6_0B44_1E8F_4190_B74629B59DC5",
 "data": {
  "label": "Door Control System"
 },
 "maps": [
  {
   "hfov": 21.07,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_25_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 75,
      "height": 16
     }
    ]
   },
   "pitch": 7.06
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_26_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0464E5B6_0B44_1E8F_417B_E193E4E1FEDC",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_26_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_27_0.png",
      "class": "ImageResourceLevel",
      "width": 1169,
      "height": 158
     }
    ]
   },
   "pitch": -1.57,
   "yaw": 43.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0464F5B6_0B44_1E8F_4199_7B8F51267A76",
 "data": {
  "label": "Door Control System Safety & Warning Devices"
 },
 "maps": [
  {
   "hfov": 35.4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_27_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 118,
      "height": 16
     }
    ]
   },
   "pitch": -1.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_28_0.png",
      "class": "ImageResourceLevel",
      "width": 1248,
      "height": 561
     }
    ]
   },
   "pitch": -10.05,
   "yaw": 43.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046485B6_0B44_1E8F_4174_399A78C2CEA7",
 "data": {
  "label": "\u2022 In compliance with EN 12453:2001 (Safety in use of power operated doors)\u000d\u2022 Pendant Push Button Controls for Movement, Closing and Emergency Stop\u000d\u2022 Can be integrated with the BMS (Building Management System) & Fire Detection System\u000d\u2022 Each Leaf is fitted with audible and a visual alarm for alerting the personal while door in operations\u000d\u2022 Safety Edge System\u000d\u2022 Anti-collision Sensors\u000d"
 },
 "maps": [
  {
   "hfov": 37.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_28_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 35,
      "height": 15
     }
    ]
   },
   "pitch": -10.05
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 },
 "hfov": 32.11,
 "autoplay": false,
 "id": "overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.7,
 "useHandCursor": true,
 "roll": 0.59,
 "yaw": 42.85,
 "rotationY": 2.52,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.84,
 "click": "this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_046405B6_0B44_1E8F_4194_A0767A061219, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'play'); this.setOverlayBehaviour(this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.overlay_046455B6_0B44_1E8F_417D_D4D6AE4238CD.set('enabled', true); this.overlay_046465B6_0B44_1E8F_4199_3ADCE33E7A16.set('enabled', true); this.overlay_046475B6_0B44_1E8F_41A0_D76E5A16DF8A.set('enabled', true); this.overlay_046405B6_0B44_1E8F_4194_A0767A061219.set('enabled', true); this.overlay_046595B5_0B44_1E8D_4178_593F80EF04B9.set('enabled', false); this.overlay_0465A5B5_0B44_1E8D_4196_66CB6AD520B6.set('enabled', false); this.overlay_0465B5B5_0B44_1E8D_419F_5A89E91E022C.set('enabled', false); this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5.set('enabled', false); this.overlay_046575B5_0B44_1E8D_4181_1F45D5671574.set('enabled', false); this.overlay_046505B5_0B44_1E8D_41A4_26980FEFABBF.set('enabled', false); this.overlay_046515B5_0B44_1E8D_418C_5AE478F5D84B.set('enabled', false); this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2.set('enabled', false); this.overlay_0464E5B6_0B44_1E8F_417B_E193E4E1FEDC.set('enabled', false); this.overlay_0464F5B6_0B44_1E8F_4199_7B8F51267A76.set('enabled', false); this.overlay_046485B6_0B44_1E8F_4174_399A78C2CEA7.set('enabled', false); this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7.set('enabled', false); this.overlay_0467C5B6_0B44_1E8F_4186_0051B110F40F.set('enabled', false); this.overlay_0467D5B6_0B44_1E8F_41A4_E7FA2A7E1008.set('enabled', false); this.overlay_0467E5B6_0B44_1E8F_416C_9446BBFD4B37.set('enabled', false); this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorCladding Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.69,
   "image": "this.AnimatedImageResource_1360F8CF_0B44_169E_41A2_E48FACCF12B6",
   "pitch": 10.72,
   "yaw": -17.73,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_0464A5B6_0B44_1E8F_4182_2A66ED040F3C",
 "maps": [
  {
   "hfov": 3.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -17.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_29_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 10.72
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_30_0.png",
      "class": "ImageResourceLevel",
      "width": 428,
      "height": 123
     }
    ]
   },
   "pitch": 14.3,
   "yaw": -16.88,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0464B5B6_0B44_1E8F_4195_BF628CC8338C",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 12.59,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -16.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_30_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 55,
      "height": 16
     }
    ]
   },
   "pitch": 14.3
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_31_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046455B6_0B44_1E8F_417D_D4D6AE4238CD",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_31_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_32_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 362
     }
    ]
   },
   "pitch": -10.29,
   "yaw": 42.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046465B6_0B44_1E8F_4199_3ADCE33E7A16",
 "data": {
  "label": "\u2022 Insulated PUF Panel ensuring thermal & sound insulation\u000d\u2022 Double Glazed Window Sections"
 },
 "maps": [
  {
   "hfov": 35.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_32_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": -10.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_33_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 129
     }
    ]
   },
   "pitch": -1.34,
   "yaw": 43.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046475B6_0B44_1E8F_41A0_D76E5A16DF8A",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 35.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_33_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 144,
      "height": 16
     }
    ]
   },
   "pitch": -1.34
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 },
 "hfov": 32.3,
 "autoplay": false,
 "id": "overlay_046405B6_0B44_1E8F_4194_A0767A061219",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_046405B6_0B44_1E8F_4194_A0767A061219_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.78,
 "useHandCursor": true,
 "roll": -1.16,
 "yaw": 42.98,
 "rotationY": 3.67,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.21,
 "click": "this.overlay_046405B6_0B44_1E8F_4194_A0767A061219.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'play'); this.setOverlayBehaviour(this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.setOverlayBehaviour(this.overlay_046405B6_0B44_1E8F_4194_A0767A061219, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, 'stop'); this.overlay_0467C5B6_0B44_1E8F_4186_0051B110F40F.set('enabled', true); this.overlay_0467D5B6_0B44_1E8F_41A4_E7FA2A7E1008.set('enabled', true); this.overlay_0467E5B6_0B44_1E8F_416C_9446BBFD4B37.set('enabled', true); this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70.set('enabled', true); this.overlay_046595B5_0B44_1E8D_4178_593F80EF04B9.set('enabled', false); this.overlay_0465A5B5_0B44_1E8D_4196_66CB6AD520B6.set('enabled', false); this.overlay_0465B5B5_0B44_1E8D_419F_5A89E91E022C.set('enabled', false); this.overlay_046545B5_0B44_1E8D_4184_98D71431CAE5.set('enabled', false); this.overlay_046575B5_0B44_1E8D_4181_1F45D5671574.set('enabled', false); this.overlay_046505B5_0B44_1E8D_41A4_26980FEFABBF.set('enabled', false); this.overlay_046515B5_0B44_1E8D_418C_5AE478F5D84B.set('enabled', false); this.overlay_046525B5_0B44_1E8D_4151_B995A70B24F2.set('enabled', false); this.overlay_0464E5B6_0B44_1E8F_417B_E193E4E1FEDC.set('enabled', false); this.overlay_0464F5B6_0B44_1E8F_4199_7B8F51267A76.set('enabled', false); this.overlay_046485B6_0B44_1E8F_4174_399A78C2CEA7.set('enabled', false); this.overlay_046495B6_0B44_1E8F_4177_8F3A390E70A7.set('enabled', false); this.overlay_046455B6_0B44_1E8F_417D_D4D6AE4238CD.set('enabled', false); this.overlay_046465B6_0B44_1E8F_4199_3ADCE33E7A16.set('enabled', false); this.overlay_046475B6_0B44_1E8F_41A0_D76E5A16DF8A.set('enabled', false); this.overlay_046405B6_0B44_1E8F_4194_A0767A061219.set('enabled', false)"
  }
 ],
 "data": {
  "label": "Sealing Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.52,
   "image": "this.AnimatedImageResource_137EE8D0_0B44_1683_4162_05606AB17A08",
   "pitch": 20.42,
   "yaw": 5.49,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_046415B6_0B44_1E8F_4168_473F89EFC81F",
 "maps": [
  {
   "hfov": 3.52,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_34_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 20.42
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_35_0.png",
      "class": "ImageResourceLevel",
      "width": 457,
      "height": 119
     }
    ]
   },
   "pitch": 24.07,
   "yaw": 6.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_046435B6_0B44_1E8F_4199_DDF509B87CB1",
 "data": {
  "label": "Seal System"
 },
 "maps": [
  {
   "hfov": 12.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_35_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 61,
      "height": 16
     }
    ]
   },
   "pitch": 24.07
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_36_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1066
     }
    ]
   },
   "pitch": 0.41,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0467C5B6_0B44_1E8F_4186_0051B110F40F",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_36_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": 0.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_37_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 387
     }
    ]
   },
   "pitch": -11.96,
   "yaw": 42.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0467D5B6_0B44_1E8F_41A4_E7FA2A7E1008",
 "data": {
  "label": "\u2022 Vertical joints between on Leaves are fitted with twin tapered EPDM wiper seals\u000d\u000d\u2022 The bottom of each leaf is fitted with a heavy-duty nylon brush seal"
 },
 "maps": [
  {
   "hfov": 35.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_37_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 49,
      "height": 16
     }
    ]
   },
   "pitch": -11.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_38_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 129
     }
    ]
   },
   "pitch": -5.31,
   "yaw": 43.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0467E5B6_0B44_1E8F_416C_9446BBFD4B37",
 "data": {
  "label": "Weather Seal System"
 },
 "maps": [
  {
   "hfov": 35.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_38_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 144,
      "height": 16
     }
    ]
   },
   "pitch": -5.31
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 },
 "hfov": 32.6,
 "autoplay": false,
 "id": "overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 5.81,
 "useHandCursor": true,
 "roll": -0.18,
 "yaw": 42.58,
 "rotationY": -4.04,
 "class": "VideoPanoramaOverlay",
 "rotationX": -3.18,
 "click": "this.overlay_0467F5B6_0B44_1E8F_4143_7C491914BC70.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.7,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1736D2ED_0B4D_FA9D_41A5_296BED597897, this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_1736D2ED_0B4D_FA9D_41A5_296BED597897); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.47,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_39_0.png",
      "class": "ImageResourceLevel",
      "width": 313,
      "height": 91
     }
    ]
   },
   "pitch": 1.15,
   "yaw": 20.46
  }
 ],
 "id": "overlay_046505B7_0B44_1E8D_41A5_F78FF6D33D2C",
 "maps": [
  {
   "hfov": 9.47,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 20.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_39_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 55,
      "height": 16
     }
    ]
   },
   "pitch": 1.15
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_10A0D2A7_0B4D_FA8E_419A_E4FEF7AA005F, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3); this.startPanoramaWithCamera(this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, this.camera_10A0D2A7_0B4D_FA8E_419A_E4FEF7AA005F); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.87,
   "image": "this.AnimatedImageResource_131708DF_0B44_16BD_419F_A2FAE6D134A3",
   "pitch": -13.78,
   "yaw": -1.06,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1848B474_0B44_7D83_4195_B1BD9F84FFAE",
 "maps": [
  {
   "hfov": 11.87,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -1.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -13.78
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_175242B0_0B4D_FA82_418A_F7476206A31C, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3); this.startPanoramaWithCamera(this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, this.camera_175242B0_0B4D_FA82_418A_F7476206A31C); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.97,
   "image": "this.AnimatedImageResource_131758DF_0B44_16BD_4196_1A0F09323301",
   "pitch": -11.47,
   "yaw": -104.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1848F474_0B44_7D83_4190_282C05797969",
 "maps": [
  {
   "hfov": 11.97,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -104.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -11.47
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_177E62C0_0B4D_FA83_4190_BC32AFE73070, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_177E62C0_0B4D_FA83_4190_BC32AFE73070); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 12.02,
   "image": "this.AnimatedImageResource_131798E0_0B44_1683_4195_2D1947D0C6C5",
   "pitch": -10.42,
   "yaw": -67.44,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1848C474_0B44_7D83_41A0_D158CD5FB76F",
 "maps": [
  {
   "hfov": 12.02,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -67.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -10.42
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'play'); this.setOverlayBehaviour(this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.setOverlayBehaviour(this.overlay_18484476_0B44_7D8F_41A5_082325240960, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.setOverlayBehaviour(this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.overlay_18480474_0B44_7D83_41A0_1A2AA403EF7B.set('enabled', true); this.overlay_18484474_0B44_7D83_4196_F156A10BC8DC.set('enabled', true); this.overlay_1857A474_0B44_7D83_41A2_6917A0D77367.set('enabled', true); this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5.set('enabled', true); this.overlay_18494474_0B44_7D83_418B_CF4BAD3333B8.set('enabled', false); this.overlay_18489474_0B44_7D83_4193_CC56286AB13F.set('enabled', false); this.overlay_1848F476_0B44_7D8F_419D_136DB0776FFA.set('enabled', false); this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071.set('enabled', false); this.overlay_18487476_0B44_7D8F_419F_50DC1D6EED62.set('enabled', false); this.overlay_18486476_0B44_7D8F_4177_3E25F5C6B675.set('enabled', false); this.overlay_18485476_0B44_7D8F_41A4_CD0564EE5C3F.set('enabled', false); this.overlay_18484476_0B44_7D8F_41A5_082325240960.set('enabled', false); this.overlay_1857E476_0B44_7D8F_4192_BF407212228C.set('enabled', false); this.overlay_18573476_0B44_7D8F_419D_3A8AE73485DB.set('enabled', false); this.overlay_18570476_0B44_7D8F_41A0_1431A009117D.set('enabled', false); this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.31,
   "image": "this.AnimatedImageResource_131638E0_0B44_1683_4194_BEB8C2A5774C",
   "pitch": 5.58,
   "yaw": 15.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_18483474_0B44_7D83_419E_24FABC3D4EC0",
 "maps": [
  {
   "hfov": 2.31,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 15.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 5.58
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_9_0.png",
      "class": "ImageResourceLevel",
      "width": 184,
      "height": 100
     }
    ]
   },
   "pitch": 8.3,
   "yaw": 15.73,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18481474_0B44_7D83_419E_53F2B57FAC9A",
 "data": {
  "label": "Door"
 },
 "maps": [
  {
   "hfov": 5.54,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 15.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_9_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": 8.3
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_10_0.png",
      "class": "ImageResourceLevel",
      "width": 1444,
      "height": 1156
     }
    ]
   },
   "pitch": 0.75,
   "yaw": -26.78
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18480474_0B44_7D83_41A0_1A2AA403EF7B",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_10_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_11_0.png",
      "class": "ImageResourceLevel",
      "width": 1160,
      "height": 129
     }
    ]
   },
   "pitch": -1.88,
   "yaw": -27.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18484474_0B44_7D83_4196_F156A10BC8DC",
 "data": {
  "label": "Multi \u2013 directional configuration with a tail gate"
 },
 "maps": [
  {
   "hfov": 35.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_11_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -1.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_12_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 404
     }
    ]
   },
   "pitch": -8.81,
   "yaw": -28.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1857A474_0B44_7D83_41A2_6917A0D77367",
 "data": {
  "label": "\u2022 Door Dimensions \u2013 46400 mm (CW) X 9000 mm (CH)\u000d\u000d\u2022 6 Independent Operation Leaves (every leaf has a motor for individual operations)\u000d\u000d\u2022 4 Pedestrian Access with Safety System Sensors (Wicket Doors  - 4 Leaves)\u000d\u000d"
 },
 "maps": [
  {
   "hfov": 35.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_12_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": -8.81
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 },
 "hfov": 31.12,
 "autoplay": false,
 "id": "overlay_18578474_0B44_7D83_4183_A6456D19ABD5",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_18578474_0B44_7D83_4183_A6456D19ABD5_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.63,
 "useHandCursor": true,
 "roll": -1.13,
 "yaw": -26.45,
 "rotationY": 4.4,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.94,
 "click": "this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.37,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'play'); this.setOverlayBehaviour(this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.setOverlayBehaviour(this.overlay_18484476_0B44_7D8F_41A5_082325240960, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.setOverlayBehaviour(this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.overlay_18494474_0B44_7D83_418B_CF4BAD3333B8.set('enabled', true); this.overlay_18489474_0B44_7D83_4193_CC56286AB13F.set('enabled', true); this.overlay_1848F476_0B44_7D8F_419D_136DB0776FFA.set('enabled', true); this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071.set('enabled', true); this.overlay_18480474_0B44_7D83_41A0_1A2AA403EF7B.set('enabled', false); this.overlay_18484474_0B44_7D83_4196_F156A10BC8DC.set('enabled', false); this.overlay_1857A474_0B44_7D83_41A2_6917A0D77367.set('enabled', false); this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5.set('enabled', false); this.overlay_18487476_0B44_7D8F_419F_50DC1D6EED62.set('enabled', false); this.overlay_18486476_0B44_7D8F_4177_3E25F5C6B675.set('enabled', false); this.overlay_18485476_0B44_7D8F_41A4_CD0564EE5C3F.set('enabled', false); this.overlay_18484476_0B44_7D8F_41A5_082325240960.set('enabled', false); this.overlay_1857E476_0B44_7D8F_4192_BF407212228C.set('enabled', false); this.overlay_18573476_0B44_7D8F_419D_3A8AE73485DB.set('enabled', false); this.overlay_18570476_0B44_7D8F_41A0_1431A009117D.set('enabled', false); this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D.set('enabled', false)"
  }
 ],
 "data": {
  "label": "ControlSystem"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.06,
   "image": "this.AnimatedImageResource_131568E1_0B44_1685_4152_755F115464D8",
   "pitch": 1.26,
   "yaw": 3.08,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1857F474_0B44_7D83_417F_8949BDA50E10",
 "maps": [
  {
   "hfov": 3.06,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 3.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_13_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 20.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_14_0.png",
      "class": "ImageResourceLevel",
      "width": 688,
      "height": 107
     }
    ]
   },
   "pitch": 3.46,
   "yaw": 5.68,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1857C474_0B44_7D83_418C_9821954CBF3C",
 "data": {
  "label": "Door Control System"
 },
 "maps": [
  {
   "hfov": 20.78,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_14_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 102,
      "height": 15
     }
    ]
   },
   "pitch": 3.46
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_15_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18494474_0B44_7D83_418B_CF4BAD3333B8",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_15_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_16_0.png",
      "class": "ImageResourceLevel",
      "width": 1169,
      "height": 158
     }
    ]
   },
   "pitch": -1.57,
   "yaw": 43.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18489474_0B44_7D83_4193_CC56286AB13F",
 "data": {
  "label": "Door Control System Safety & Warning Devices"
 },
 "maps": [
  {
   "hfov": 35.4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_16_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 118,
      "height": 16
     }
    ]
   },
   "pitch": -1.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_17_0.png",
      "class": "ImageResourceLevel",
      "width": 1248,
      "height": 561
     }
    ]
   },
   "pitch": -10.05,
   "yaw": 43.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1848F476_0B44_7D8F_419D_136DB0776FFA",
 "data": {
  "label": "\u2022 In compliance with EN 12453:2001 (Safety in use of power operated doors)\u000d\u2022 Pendant Push Button Controls for Movement, Closing and Emergency Stop\u000d\u2022 Can be integrated with the BMS (Building Management System) & Fire Detection System\u000d\u2022 Each Leaf is fitted with audible and a visual alarm for alerting the personal while door in operations\u000d\u2022 Safety Edge System\u000d\u2022 Anti-collision Sensors\u000d"
 },
 "maps": [
  {
   "hfov": 37.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_17_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 35,
      "height": 15
     }
    ]
   },
   "pitch": -10.05
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 },
 "hfov": 32.11,
 "autoplay": false,
 "id": "overlay_1848E476_0B44_7D8F_4198_1037DBD24071",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1848E476_0B44_7D8F_4198_1037DBD24071_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.67,
 "useHandCursor": true,
 "roll": 0.59,
 "yaw": 42.86,
 "rotationY": 2.52,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.81,
 "click": "this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_18484476_0B44_7D8F_41A5_082325240960, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'play'); this.setOverlayBehaviour(this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.setOverlayBehaviour(this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.setOverlayBehaviour(this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.overlay_18487476_0B44_7D8F_419F_50DC1D6EED62.set('enabled', true); this.overlay_18486476_0B44_7D8F_4177_3E25F5C6B675.set('enabled', true); this.overlay_18485476_0B44_7D8F_41A4_CD0564EE5C3F.set('enabled', true); this.overlay_18484476_0B44_7D8F_41A5_082325240960.set('enabled', true); this.overlay_18480474_0B44_7D83_41A0_1A2AA403EF7B.set('enabled', false); this.overlay_18484474_0B44_7D83_4196_F156A10BC8DC.set('enabled', false); this.overlay_1857A474_0B44_7D83_41A2_6917A0D77367.set('enabled', false); this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5.set('enabled', false); this.overlay_18494474_0B44_7D83_418B_CF4BAD3333B8.set('enabled', false); this.overlay_18489474_0B44_7D83_4193_CC56286AB13F.set('enabled', false); this.overlay_1848F476_0B44_7D8F_419D_136DB0776FFA.set('enabled', false); this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071.set('enabled', false); this.overlay_1857E476_0B44_7D8F_4192_BF407212228C.set('enabled', false); this.overlay_18573476_0B44_7D8F_419D_3A8AE73485DB.set('enabled', false); this.overlay_18570476_0B44_7D8F_41A0_1431A009117D.set('enabled', false); this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorCladding Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.3,
   "image": "this.AnimatedImageResource_1314B8E1_0B44_1685_4190_A850A0EB3F79",
   "pitch": 5.22,
   "yaw": -12.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1848D476_0B44_7D8F_41A0_714605F294FA",
 "maps": [
  {
   "hfov": 2.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -12.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_18_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 5.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_19_0.png",
      "class": "ImageResourceLevel",
      "width": 431,
      "height": 144
     }
    ]
   },
   "pitch": 7.26,
   "yaw": -11.31,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18482476_0B44_7D8F_4188_96B9E9151A54",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 12.94,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -11.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_19_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": 7.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_20_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18487476_0B44_7D8F_419F_50DC1D6EED62",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_20_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_21_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 361
     }
    ]
   },
   "pitch": -10.29,
   "yaw": 42.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18486476_0B44_7D8F_4177_3E25F5C6B675",
 "data": {
  "label": "\u2022 Insulated PUF Panel ensuring thermal & sound insulation\u000d\u2022 Double Glazed Window Sections"
 },
 "maps": [
  {
   "hfov": 35.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_21_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": -10.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_22_0.png",
      "class": "ImageResourceLevel",
      "width": 1160,
      "height": 129
     }
    ]
   },
   "pitch": -1.34,
   "yaw": 43.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18485476_0B44_7D8F_41A4_CD0564EE5C3F",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 35.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_22_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -1.34
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 },
 "hfov": 32.3,
 "autoplay": false,
 "id": "overlay_18484476_0B44_7D8F_41A5_082325240960",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_18484476_0B44_7D8F_41A5_082325240960_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.77,
 "useHandCursor": true,
 "roll": -1.16,
 "yaw": 43.01,
 "rotationY": 3.67,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.2,
 "click": "this.overlay_18484476_0B44_7D8F_41A5_082325240960.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'play'); this.setOverlayBehaviour(this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.setOverlayBehaviour(this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.setOverlayBehaviour(this.overlay_18484476_0B44_7D8F_41A5_082325240960, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, 'stop'); this.overlay_1857E476_0B44_7D8F_4192_BF407212228C.set('enabled', true); this.overlay_18573476_0B44_7D8F_419D_3A8AE73485DB.set('enabled', true); this.overlay_18570476_0B44_7D8F_41A0_1431A009117D.set('enabled', true); this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D.set('enabled', true); this.overlay_18480474_0B44_7D83_41A0_1A2AA403EF7B.set('enabled', false); this.overlay_18484474_0B44_7D83_4196_F156A10BC8DC.set('enabled', false); this.overlay_1857A474_0B44_7D83_41A2_6917A0D77367.set('enabled', false); this.overlay_18578474_0B44_7D83_4183_A6456D19ABD5.set('enabled', false); this.overlay_18494474_0B44_7D83_418B_CF4BAD3333B8.set('enabled', false); this.overlay_18489474_0B44_7D83_4193_CC56286AB13F.set('enabled', false); this.overlay_1848F476_0B44_7D8F_419D_136DB0776FFA.set('enabled', false); this.overlay_1848E476_0B44_7D8F_4198_1037DBD24071.set('enabled', false); this.overlay_18487476_0B44_7D8F_419F_50DC1D6EED62.set('enabled', false); this.overlay_18486476_0B44_7D8F_4177_3E25F5C6B675.set('enabled', false); this.overlay_18485476_0B44_7D8F_41A4_CD0564EE5C3F.set('enabled', false); this.overlay_18484476_0B44_7D8F_41A5_082325240960.set('enabled', false)"
  }
 ],
 "data": {
  "label": "Sealing Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.52,
   "image": "this.AnimatedImageResource_1313C8E1_0B44_1685_4193_0AB133A0FA92",
   "pitch": 10.18,
   "yaw": 3.43,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1857B476_0B44_7D8F_41A4_20C84C100CD6",
 "maps": [
  {
   "hfov": 2.52,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 3.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_23_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 10.18
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_24_0.png",
      "class": "ImageResourceLevel",
      "width": 382,
      "height": 103
     }
    ]
   },
   "pitch": 12.74,
   "yaw": 4.35,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18579476_0B44_7D8F_4161_44C176C71E55",
 "data": {
  "label": "Seal System"
 },
 "maps": [
  {
   "hfov": 11.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 4.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_24_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 59,
      "height": 15
     }
    ]
   },
   "pitch": 12.74
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_25_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1066
     }
    ]
   },
   "pitch": 0.41,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1857E476_0B44_7D8F_4192_BF407212228C",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_25_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": 0.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_26_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 387
     }
    ]
   },
   "pitch": -11.96,
   "yaw": 42.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18573476_0B44_7D8F_419D_3A8AE73485DB",
 "data": {
  "label": "\u2022 Vertical joints between on Leaves are fitted with twin tapered EPDM wiper seals\u000d\u000d\u2022 The bottom of each leaf is fitted with a heavy-duty nylon brush seal"
 },
 "maps": [
  {
   "hfov": 35.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_26_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 49,
      "height": 16
     }
    ]
   },
   "pitch": -11.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_27_0.png",
      "class": "ImageResourceLevel",
      "width": 1160,
      "height": 129
     }
    ]
   },
   "pitch": -5.31,
   "yaw": 43.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_18570476_0B44_7D8F_41A0_1431A009117D",
 "data": {
  "label": "Weather Seal System"
 },
 "maps": [
  {
   "hfov": 35.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_27_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -5.31
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 },
 "hfov": 32.6,
 "autoplay": false,
 "id": "overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 5.77,
 "useHandCursor": true,
 "roll": -0.18,
 "yaw": 42.58,
 "rotationY": -4.04,
 "class": "VideoPanoramaOverlay",
 "rotationX": -3.14,
 "click": "this.overlay_18577476_0B44_7D8F_418E_41D23B8B5E0D.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.7,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_174C42B8_0B4D_FA83_419F_533CC1E3A788, this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_174C42B8_0B4D_FA83_419F_533CC1E3A788); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.54,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_28_0.png",
      "class": "ImageResourceLevel",
      "width": 216,
      "height": 72
     }
    ]
   },
   "pitch": 1.5,
   "yaw": -11.41
  }
 ],
 "id": "overlay_18575476_0B44_7D8F_4197_2976450970E1",
 "maps": [
  {
   "hfov": 6.54,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -11.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_28_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 48,
      "height": 16
     }
    ]
   },
   "pitch": 1.5
  }
 ]
},
{
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.47",
     "zoomFactor": 1.1,
     "y": "0.54"
    },
    "duration": 5000,
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "scaleMode": "fit_outside"
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_E2A7D232_F814_2787_41C5_8B4B3B3E5CCE_0"
  }
 ],
 "id": "album_E2A7D232_F814_2787_41C5_8B4B3B3E5CCE_AlbumPlayList"
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_11B5C19B_0B4D_F685_4195_6ABA0D01CB64, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1); this.startPanoramaWithCamera(this.panorama_1AD21975_0B44_178D_419A_F21912320B19, this.camera_11B5C19B_0B4D_F685_4195_6ABA0D01CB64); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.94,
   "image": "this.AnimatedImageResource_137C68D0_0B44_1683_419E_8E113342740E",
   "pitch": -12.34,
   "yaw": -112.87,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C1FC25_0B47_ED8D_4178_814E8A285432",
 "maps": [
  {
   "hfov": 11.94,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -112.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -12.34
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_105071C9_0B4D_F685_41A5_D1F98862346E, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_105071C9_0B4D_F685_41A5_D1F98862346E); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.96,
   "image": "this.AnimatedImageResource_137CB8D0_0B44_1683_4198_7A744ED71F89",
   "pitch": -11.81,
   "yaw": 0.93,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C1CC25_0B47_ED8D_419C_BFCBF6EC8247",
 "maps": [
  {
   "hfov": 11.96,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.93,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -11.81
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1043A1DC_0B4D_F683_41A1_F5DCC11A86D4, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1); this.startPanoramaWithCamera(this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, this.camera_1043A1DC_0B4D_F683_41A1_F5DCC11A86D4); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.99,
   "image": "this.AnimatedImageResource_137CC8D0_0B44_1683_41A3_3A061072E2E1",
   "pitch": -10.96,
   "yaw": -76.15,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C1DC25_0B47_ED8D_41A1_DCBEAD0EEFD9",
 "maps": [
  {
   "hfov": 11.99,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -76.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_9_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -10.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_11A6A1B0_0B4D_F682_41A6_656B933A2FE9, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1); this.startPanoramaWithCamera(this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, this.camera_11A6A1B0_0B4D_F682_41A6_656B933A2FE9); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.94,
   "image": "this.AnimatedImageResource_137B68D0_0B44_1683_4192_112F7262E716",
   "pitch": -12.13,
   "yaw": 105.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C1AC25_0B47_ED8D_41A2_DFE9E5BA616F",
 "maps": [
  {
   "hfov": 11.94,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 105.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_10_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -12.13
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_107C31F1_0B4D_F682_419A_0B572ED72E48, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1); this.startPanoramaWithCamera(this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, this.camera_107C31F1_0B4D_F682_419A_0B572ED72E48); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 12.04,
   "image": "this.AnimatedImageResource_137BB8D0_0B44_1683_4198_BE95B7CB8FD2",
   "pitch": -9.87,
   "yaw": 68.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C1BC25_0B47_ED8D_4195_86B28079966C",
 "maps": [
  {
   "hfov": 12.04,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 68.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_11_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -9.87
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'play'); this.setOverlayBehaviour(this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.overlay_04C14C25_0B47_ED8D_41A4_C704EC50FA28.set('enabled', true); this.overlay_04C15C25_0B47_ED8D_4196_69D7AD6AD1E0.set('enabled', true); this.overlay_04C12C25_0B47_ED8D_41A1_C32E472FDC29.set('enabled', true); this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38.set('enabled', true); this.overlay_04C0EC26_0B47_ED8F_41A6_00AFCEA4C015.set('enabled', false); this.overlay_04C0FC26_0B47_ED8F_41A2_8F8BE25C4232.set('enabled', false); this.overlay_04C0CC26_0B47_ED8F_4197_A5D012ED7B24.set('enabled', false); this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B.set('enabled', false); this.overlay_04C09C26_0B47_ED8F_4192_C39A3975CC2C.set('enabled', false); this.overlay_04C06C26_0B47_ED8F_413B_CC6B5EC15A80.set('enabled', false); this.overlay_04C1CC26_0B47_ED8F_41A1_04BB47C27FF4.set('enabled', false); this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC.set('enabled', false); this.overlay_04C18C26_0B47_ED8F_419E_E3A53610D88B.set('enabled', false); this.overlay_04C16C26_0B47_ED8F_41A3_5480C5BE648E.set('enabled', false); this.overlay_04C14C26_0B47_ED8F_418B_FBC18F7B2E0E.set('enabled', false); this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A.set('enabled', false); this.overlay_04C10C27_0B47_ED8D_417C_4414BB05526F.set('enabled', false); this.overlay_04C0EC27_0B47_ED8D_4182_865CB3D18243.set('enabled', false); this.overlay_04C0FC27_0B47_ED8D_419F_46A4EEA5E646.set('enabled', false); this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33.set('enabled', false)"
  }
 ],
 "data": {
  "label": "TailButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.67,
   "image": "this.AnimatedImageResource_137BD8D0_0B44_1683_4166_57952C3CC9EC",
   "pitch": 15.99,
   "yaw": 0.41,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C19C25_0B47_ED8D_419C_8778BAC92B36",
 "maps": [
  {
   "hfov": 2.67,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_12_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 15.99
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_13_0.png",
      "class": "ImageResourceLevel",
      "width": 415,
      "height": 121
     }
    ]
   },
   "pitch": 18.7,
   "yaw": 2.85,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C17C25_0B47_ED8D_416E_0CA9410A0C0E",
 "data": {
  "label": "Tail Gate"
 },
 "maps": [
  {
   "hfov": 11.91,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.85,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_13_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 54,
      "height": 16
     }
    ]
   },
   "pitch": 18.7
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.38,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_14_0.png",
      "class": "ImageResourceLevel",
      "width": 1434,
      "height": 1155
     }
    ]
   },
   "pitch": 0.63,
   "yaw": -26.67
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C14C25_0B47_ED8D_41A4_C704EC50FA28",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.67,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_14_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.63
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_15_0.png",
      "class": "ImageResourceLevel",
      "width": 1228,
      "height": 113
     }
    ]
   },
   "pitch": -1.69,
   "yaw": -27.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C15C25_0B47_ED8D_4196_69D7AD6AD1E0",
 "data": {
  "label": "Tail Gate integrated with insulated rolling shutter"
 },
 "maps": [
  {
   "hfov": 37.15,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_15_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 173,
      "height": 16
     }
    ]
   },
   "pitch": -1.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 38.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_16_0.png",
      "class": "ImageResourceLevel",
      "width": 1277,
      "height": 425
     }
    ]
   },
   "pitch": -8.93,
   "yaw": -27.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C12C25_0B47_ED8D_41A1_C32E472FDC29",
 "data": {
  "label": "\u2022 Motorised Rolling Shutter Dimensions \u2013 3000 mm (W) X 4000 mm (H) \u000d\u000d\u2022 Simple push button operation\u000d\u000d\u2022 Backed by manual operation in case of emergency and power failure\u000d"
 },
 "maps": [
  {
   "hfov": 38.16,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_16_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 48,
      "height": 15
     }
    ]
   },
   "pitch": -8.93
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_DDF7B047_F912_3EE6_41C6_A905D91A483D.mp4"
 },
 "hfov": 30.43,
 "autoplay": false,
 "id": "overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.53,
 "useHandCursor": true,
 "roll": 0.19,
 "yaw": -26.58,
 "rotationY": 0.05,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.83,
 "click": "this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.41,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'play'); this.setOverlayBehaviour(this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.overlay_04C0EC26_0B47_ED8F_41A6_00AFCEA4C015.set('enabled', true); this.overlay_04C0FC26_0B47_ED8F_41A2_8F8BE25C4232.set('enabled', true); this.overlay_04C0CC26_0B47_ED8F_4197_A5D012ED7B24.set('enabled', true); this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B.set('enabled', true); this.overlay_04C14C25_0B47_ED8D_41A4_C704EC50FA28.set('enabled', false); this.overlay_04C15C25_0B47_ED8D_4196_69D7AD6AD1E0.set('enabled', false); this.overlay_04C12C25_0B47_ED8D_41A1_C32E472FDC29.set('enabled', false); this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38.set('enabled', false); this.overlay_04C09C26_0B47_ED8F_4192_C39A3975CC2C.set('enabled', false); this.overlay_04C06C26_0B47_ED8F_413B_CC6B5EC15A80.set('enabled', false); this.overlay_04C1CC26_0B47_ED8F_41A1_04BB47C27FF4.set('enabled', false); this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC.set('enabled', false); this.overlay_04C18C26_0B47_ED8F_419E_E3A53610D88B.set('enabled', false); this.overlay_04C16C26_0B47_ED8F_41A3_5480C5BE648E.set('enabled', false); this.overlay_04C14C26_0B47_ED8F_418B_FBC18F7B2E0E.set('enabled', false); this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A.set('enabled', false); this.overlay_04C10C27_0B47_ED8D_417C_4414BB05526F.set('enabled', false); this.overlay_04C0EC27_0B47_ED8D_4182_865CB3D18243.set('enabled', false); this.overlay_04C0FC27_0B47_ED8D_419F_46A4EEA5E646.set('enabled', false); this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.31,
   "image": "this.AnimatedImageResource_137938D2_0B44_1686_419C_B0B3F48FF609",
   "pitch": 5.09,
   "yaw": 10.35,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C10C25_0B47_ED8D_41A2_CA6A9014D379",
 "maps": [
  {
   "hfov": 2.31,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 10.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_17_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 5.09
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.56,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_18_0.png",
      "class": "ImageResourceLevel",
      "width": 185,
      "height": 102
     }
    ]
   },
   "pitch": 7.6,
   "yaw": 11.02,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C11C26_0B47_ED8F_4198_1088747F1370",
 "data": {
  "label": "Door"
 },
 "maps": [
  {
   "hfov": 5.56,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 11.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_18_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": 7.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_19_0.png",
      "class": "ImageResourceLevel",
      "width": 1444,
      "height": 1156
     }
    ]
   },
   "pitch": 0.75,
   "yaw": -26.78
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C0EC26_0B47_ED8F_41A6_00AFCEA4C015",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_19_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_20_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 131
     }
    ]
   },
   "pitch": -1.88,
   "yaw": -27.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C0FC26_0B47_ED8F_41A2_8F8BE25C4232",
 "data": {
  "label": "Multi \u2013 directional configuration with a tail gate"
 },
 "maps": [
  {
   "hfov": 35.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_20_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 141,
      "height": 16
     }
    ]
   },
   "pitch": -1.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_21_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 404
     }
    ]
   },
   "pitch": -8.81,
   "yaw": -28.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C0CC26_0B47_ED8F_4197_A5D012ED7B24",
 "data": {
  "label": "\u2022 Door Dimensions \u2013 46400 mm (CW) X 9000 mm (CH)\u000d\u000d\u2022 6 Independent Operation Leaves (every leaf has a motor for individual operations)\u000d\u000d\u2022 4 Pedestrian Access with Safety System Sensors (Wicket Doors  - 4 Leaves)\u000d\u000d"
 },
 "maps": [
  {
   "hfov": 35.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_21_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": -8.81
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 },
 "hfov": 31.12,
 "autoplay": false,
 "id": "overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.67,
 "useHandCursor": true,
 "roll": -1.13,
 "yaw": -26.41,
 "rotationY": 4.39,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.98,
 "click": "this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.37,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'play'); this.setOverlayBehaviour(this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.overlay_04C09C26_0B47_ED8F_4192_C39A3975CC2C.set('enabled', true); this.overlay_04C06C26_0B47_ED8F_413B_CC6B5EC15A80.set('enabled', true); this.overlay_04C1CC26_0B47_ED8F_41A1_04BB47C27FF4.set('enabled', true); this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC.set('enabled', true); this.overlay_04C14C25_0B47_ED8D_41A4_C704EC50FA28.set('enabled', false); this.overlay_04C15C25_0B47_ED8D_4196_69D7AD6AD1E0.set('enabled', false); this.overlay_04C12C25_0B47_ED8D_41A1_C32E472FDC29.set('enabled', false); this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38.set('enabled', false); this.overlay_04C0EC26_0B47_ED8F_41A6_00AFCEA4C015.set('enabled', false); this.overlay_04C0FC26_0B47_ED8F_41A2_8F8BE25C4232.set('enabled', false); this.overlay_04C0CC26_0B47_ED8F_4197_A5D012ED7B24.set('enabled', false); this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B.set('enabled', false); this.overlay_04C18C26_0B47_ED8F_419E_E3A53610D88B.set('enabled', false); this.overlay_04C16C26_0B47_ED8F_41A3_5480C5BE648E.set('enabled', false); this.overlay_04C14C26_0B47_ED8F_418B_FBC18F7B2E0E.set('enabled', false); this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A.set('enabled', false); this.overlay_04C10C27_0B47_ED8D_417C_4414BB05526F.set('enabled', false); this.overlay_04C0EC27_0B47_ED8D_4182_865CB3D18243.set('enabled', false); this.overlay_04C0FC27_0B47_ED8D_419F_46A4EEA5E646.set('enabled', false); this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33.set('enabled', false)"
  }
 ],
 "data": {
  "label": "ControlSystem"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.06,
   "image": "this.AnimatedImageResource_137868D2_0B44_1686_41A1_ECE8EFED5EBC",
   "pitch": 1.83,
   "yaw": 0.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C0BC26_0B47_ED8F_41A4_6BEA191B4684",
 "maps": [
  {
   "hfov": 3.06,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_22_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.83
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 20.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_23_0.png",
      "class": "ImageResourceLevel",
      "width": 692,
      "height": 110
     }
    ]
   },
   "pitch": 4.61,
   "yaw": 2.22,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C08C26_0B47_ED8F_419F_FD8A0F4E98C1",
 "data": {
  "label": "Door Control System"
 },
 "maps": [
  {
   "hfov": 20.87,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_23_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 100,
      "height": 16
     }
    ]
   },
   "pitch": 4.61
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_24_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C09C26_0B47_ED8F_4192_C39A3975CC2C",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_24_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_25_0.png",
      "class": "ImageResourceLevel",
      "width": 1169,
      "height": 159
     }
    ]
   },
   "pitch": -1.57,
   "yaw": 43.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C06C26_0B47_ED8F_413B_CC6B5EC15A80",
 "data": {
  "label": "Door Control System Safety & Warning Devices"
 },
 "maps": [
  {
   "hfov": 35.4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_25_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 117,
      "height": 16
     }
    ]
   },
   "pitch": -1.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_26_0.png",
      "class": "ImageResourceLevel",
      "width": 1249,
      "height": 561
     }
    ]
   },
   "pitch": -10.05,
   "yaw": 43.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C1CC26_0B47_ED8F_41A1_04BB47C27FF4",
 "data": {
  "label": "\u2022 In compliance with EN 12453:2001 (Safety in use of power operated doors)\u000d\u2022 Pendant Push Button Controls for Movement, Closing and Emergency Stop\u000d\u2022 Can be integrated with the BMS (Building Management System) & Fire Detection System\u000d\u2022 Each Leaf is fitted with audible and a visual alarm for alerting the personal while door in operations\u000d\u2022 Safety Edge System\u000d\u2022 Anti-collision Sensors\u000d"
 },
 "maps": [
  {
   "hfov": 37.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_26_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 35,
      "height": 15
     }
    ]
   },
   "pitch": -10.05
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 },
 "hfov": 32.11,
 "autoplay": false,
 "id": "overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.7,
 "useHandCursor": true,
 "roll": 0.59,
 "yaw": 42.87,
 "rotationY": 2.52,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.83,
 "click": "this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'play'); this.setOverlayBehaviour(this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.overlay_04C18C26_0B47_ED8F_419E_E3A53610D88B.set('enabled', true); this.overlay_04C16C26_0B47_ED8F_41A3_5480C5BE648E.set('enabled', true); this.overlay_04C14C26_0B47_ED8F_418B_FBC18F7B2E0E.set('enabled', true); this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A.set('enabled', true); this.overlay_04C14C25_0B47_ED8D_41A4_C704EC50FA28.set('enabled', false); this.overlay_04C15C25_0B47_ED8D_4196_69D7AD6AD1E0.set('enabled', false); this.overlay_04C12C25_0B47_ED8D_41A1_C32E472FDC29.set('enabled', false); this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38.set('enabled', false); this.overlay_04C0EC26_0B47_ED8F_41A6_00AFCEA4C015.set('enabled', false); this.overlay_04C0FC26_0B47_ED8F_41A2_8F8BE25C4232.set('enabled', false); this.overlay_04C0CC26_0B47_ED8F_4197_A5D012ED7B24.set('enabled', false); this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B.set('enabled', false); this.overlay_04C09C26_0B47_ED8F_4192_C39A3975CC2C.set('enabled', false); this.overlay_04C06C26_0B47_ED8F_413B_CC6B5EC15A80.set('enabled', false); this.overlay_04C1CC26_0B47_ED8F_41A1_04BB47C27FF4.set('enabled', false); this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC.set('enabled', false); this.overlay_04C10C27_0B47_ED8D_417C_4414BB05526F.set('enabled', false); this.overlay_04C0EC27_0B47_ED8D_4182_865CB3D18243.set('enabled', false); this.overlay_04C0FC27_0B47_ED8D_419F_46A4EEA5E646.set('enabled', false); this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorCladding Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.3,
   "image": "this.AnimatedImageResource_1377A8D2_0B44_1686_4186_402463C90F1E",
   "pitch": 6.26,
   "yaw": -9.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C1AC26_0B47_ED8F_4190_8EF55B87AED6",
 "maps": [
  {
   "hfov": 2.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -9.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_27_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 6.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_28_0.png",
      "class": "ImageResourceLevel",
      "width": 412,
      "height": 121
     }
    ]
   },
   "pitch": 8.85,
   "yaw": -9.67,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C1BC26_0B47_ED8F_41A5_3515CB067BFE",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 12.33,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -9.67,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_28_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 54,
      "height": 16
     }
    ]
   },
   "pitch": 8.85
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_29_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C18C26_0B47_ED8F_419E_E3A53610D88B",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_29_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_30_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 362
     }
    ]
   },
   "pitch": -10.29,
   "yaw": 42.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C16C26_0B47_ED8F_41A3_5480C5BE648E",
 "data": {
  "label": "\u2022 Insulated PUF Panel ensuring thermal & sound insulation\u000d\u2022 Double Glazed Window Sections"
 },
 "maps": [
  {
   "hfov": 35.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_30_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": -10.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_31_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 131
     }
    ]
   },
   "pitch": -1.34,
   "yaw": 43.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C14C26_0B47_ED8F_418B_FBC18F7B2E0E",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 35.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_31_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 141,
      "height": 16
     }
    ]
   },
   "pitch": -1.34
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 },
 "hfov": 32.3,
 "autoplay": false,
 "id": "overlay_04C15C26_0B47_ED8F_4193_179A992FE91A",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_04C15C26_0B47_ED8F_4193_179A992FE91A_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.81,
 "useHandCursor": true,
 "roll": -1.16,
 "yaw": 42.97,
 "rotationY": 3.67,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.23,
 "click": "this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'play'); this.setOverlayBehaviour(this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.setOverlayBehaviour(this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, 'stop'); this.overlay_04C10C27_0B47_ED8D_417C_4414BB05526F.set('enabled', true); this.overlay_04C0EC27_0B47_ED8D_4182_865CB3D18243.set('enabled', true); this.overlay_04C0FC27_0B47_ED8D_419F_46A4EEA5E646.set('enabled', true); this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33.set('enabled', true); this.overlay_04C14C25_0B47_ED8D_41A4_C704EC50FA28.set('enabled', false); this.overlay_04C15C25_0B47_ED8D_4196_69D7AD6AD1E0.set('enabled', false); this.overlay_04C12C25_0B47_ED8D_41A1_C32E472FDC29.set('enabled', false); this.overlay_04C13C25_0B47_ED8D_4197_CA48FFDFCF38.set('enabled', false); this.overlay_04C0EC26_0B47_ED8F_41A6_00AFCEA4C015.set('enabled', false); this.overlay_04C0FC26_0B47_ED8F_41A2_8F8BE25C4232.set('enabled', false); this.overlay_04C0CC26_0B47_ED8F_4197_A5D012ED7B24.set('enabled', false); this.overlay_04C0AC26_0B47_ED8F_41A2_4CD4AB737B8B.set('enabled', false); this.overlay_04C09C26_0B47_ED8F_4192_C39A3975CC2C.set('enabled', false); this.overlay_04C06C26_0B47_ED8F_413B_CC6B5EC15A80.set('enabled', false); this.overlay_04C1CC26_0B47_ED8F_41A1_04BB47C27FF4.set('enabled', false); this.overlay_04C1DC26_0B47_ED8F_41A5_DF1BBC0933BC.set('enabled', false); this.overlay_04C18C26_0B47_ED8F_419E_E3A53610D88B.set('enabled', false); this.overlay_04C16C26_0B47_ED8F_41A3_5480C5BE648E.set('enabled', false); this.overlay_04C14C26_0B47_ED8F_418B_FBC18F7B2E0E.set('enabled', false); this.overlay_04C15C26_0B47_ED8F_4193_179A992FE91A.set('enabled', false)"
  }
 ],
 "data": {
  "label": "Sealing Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.53,
   "image": "this.AnimatedImageResource_1376E8D3_0B44_1685_4170_A270913273EE",
   "pitch": 8.63,
   "yaw": 0.3,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_04C12C26_0B47_ED8F_419D_494C0B4D71FC",
 "maps": [
  {
   "hfov": 2.53,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_32_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 8.63
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_33_0.png",
      "class": "ImageResourceLevel",
      "width": 401,
      "height": 103
     }
    ]
   },
   "pitch": 11.28,
   "yaw": 0.97,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C13C27_0B47_ED8D_4185_724CB9C562C2",
 "data": {
  "label": "Seal System"
 },
 "maps": [
  {
   "hfov": 11.9,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.97,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_33_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 62,
      "height": 15
     }
    ]
   },
   "pitch": 11.28
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_34_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1066
     }
    ]
   },
   "pitch": 0.41,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C10C27_0B47_ED8D_417C_4414BB05526F",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_34_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": 0.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_35_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 388
     }
    ]
   },
   "pitch": -11.96,
   "yaw": 42.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C0EC27_0B47_ED8D_4182_865CB3D18243",
 "data": {
  "label": "\u2022 Vertical joints between on Leaves are fitted with twin tapered EPDM wiper seals\u000d\u000d\u2022 The bottom of each leaf is fitted with a heavy-duty nylon brush seal"
 },
 "maps": [
  {
   "hfov": 35.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_35_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 49,
      "height": 16
     }
    ]
   },
   "pitch": -11.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_36_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 131
     }
    ]
   },
   "pitch": -5.31,
   "yaw": 43.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C0FC27_0B47_ED8D_419F_46A4EEA5E646",
 "data": {
  "label": "Weather Seal System"
 },
 "maps": [
  {
   "hfov": 35.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_36_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 141,
      "height": 16
     }
    ]
   },
   "pitch": -5.31
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 },
 "hfov": 32.6,
 "autoplay": false,
 "id": "overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 5.76,
 "useHandCursor": true,
 "roll": -0.18,
 "yaw": 42.59,
 "rotationY": -4.04,
 "class": "VideoPanoramaOverlay",
 "rotationX": -3.13,
 "click": "this.overlay_04C0CC27_0B47_ED8D_4181_DCDC0123FE33.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.7,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_106E5205_0B4D_F58D_4192_82162A42827A, this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_106E5205_0B4D_F58D_4192_82162A42827A); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_37_0.png",
      "class": "ImageResourceLevel",
      "width": 221,
      "height": 67
     }
    ]
   },
   "pitch": 0.22,
   "yaw": 13.96
  }
 ],
 "id": "overlay_04C0DC27_0B47_ED8D_4193_046A5ABE7EB0",
 "maps": [
  {
   "hfov": 6.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 13.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_37_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": 0.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1139A10F_0B4D_F79D_419D_501C57850CB3, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC); this.startPanoramaWithCamera(this.panorama_1AD21975_0B44_178D_419A_F21912320B19, this.camera_1139A10F_0B4D_F79D_419D_501C57850CB3); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.58,
   "image": "this.AnimatedImageResource_130AD8D7_0B44_168D_4181_1DDBB0A86C42",
   "pitch": -18.61,
   "yaw": -177.37,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1B90FBD9_0B44_6A85_4192_0C49F8BFDAD2",
 "maps": [
  {
   "hfov": 11.58,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -177.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -18.61
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_11D6512B_0B4D_F785_417B_CC43A607FAB2, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC); this.startPanoramaWithCamera(this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, this.camera_11D6512B_0B4D_F785_417B_CC43A607FAB2); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.81,
   "image": "this.AnimatedImageResource_130918D7_0B44_168D_41A3_0DF8CC5EDBFB",
   "pitch": -14.76,
   "yaw": 5.66,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1B90CBD9_0B44_6A85_41A1_E42CC5BE026A",
 "maps": [
  {
   "hfov": 11.81,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -14.76
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1125B121_0B4D_F785_4198_ED1C854C6B00, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC); this.startPanoramaWithCamera(this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, this.camera_1125B121_0B4D_F785_4198_ED1C854C6B00); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.96,
   "image": "this.AnimatedImageResource_130988D7_0B44_168D_418D_3E673D2AF61F",
   "pitch": -11.79,
   "yaw": 50.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1B9F2BD9_0B44_6A85_41A5_F8DF4B81B731",
 "maps": [
  {
   "hfov": 11.96,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 50.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -11.79
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_11F2913B_0B4D_F785_41A6_9870F50E5437, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_11F2913B_0B4D_F785_41A6_9870F50E5437); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.8,
   "image": "this.AnimatedImageResource_1309D8D7_0B44_168D_41A4_520EA47844E5",
   "pitch": -15.01,
   "yaw": 93.24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1B9F0BD9_0B44_6A85_4195_415C66F484D5",
 "maps": [
  {
   "hfov": 11.8,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 93.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -15.01
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_112A5118_0B4D_F783_4199_624FA64F5A02, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC); this.startPanoramaWithCamera(this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, this.camera_112A5118_0B4D_F783_4199_624FA64F5A02); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.88,
   "image": "this.AnimatedImageResource_130868D9_0B44_1685_4196_5E5DAFFF78BC",
   "pitch": -13.44,
   "yaw": 134.63,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1B9F1BD9_0B44_6A85_4198_37053C0DC389",
 "maps": [
  {
   "hfov": 11.88,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 134.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_9_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -13.44
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'play'); this.setOverlayBehaviour(this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.setOverlayBehaviour(this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.setOverlayBehaviour(this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.overlay_1B9F5BD9_0B44_6A85_41A6_53BFC37027FB.set('enabled', true); this.overlay_1B9FABD9_0B44_6A85_418C_604802B094DB.set('enabled', true); this.overlay_1B9FBBD9_0B44_6A85_41A4_786B0A5E99A1.set('enabled', true); this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2.set('enabled', true); this.overlay_1B9E2BD9_0B44_6A85_41A0_661F623E706D.set('enabled', false); this.overlay_1B9E0BD9_0B44_6A85_41A2_8C0CCFA71A4D.set('enabled', false); this.overlay_1B9E7BD9_0B44_6A85_4190_812B4D399C21.set('enabled', false); this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E.set('enabled', false); this.overlay_1B9F0BDB_0B44_6A86_41A2_2D0E43849C8C.set('enabled', false); this.overlay_1B9F1BDB_0B44_6A86_41A2_0C54C57A2970.set('enabled', false); this.overlay_1B9F6BDB_0B44_6A86_4199_E54FB34CBF56.set('enabled', false); this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD.set('enabled', false); this.overlay_1B9FBBDB_0B44_6A86_4189_E690AB60AC94.set('enabled', false); this.overlay_1B9F9BDB_0B44_6A86_41A6_8AD969554DA2.set('enabled', false); this.overlay_1B9FFBDB_0B44_6A86_4185_5CC5D74E8AE8.set('enabled', false); this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.3,
   "image": "this.AnimatedImageResource_1308B8D9_0B44_1685_41A4_BE28188DC922",
   "pitch": 7.8,
   "yaw": 19.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1B9F6BD9_0B44_6A85_4185_D41BEFBA2732",
 "maps": [
  {
   "hfov": 2.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 19.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_10_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 7.8
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_11_0.png",
      "class": "ImageResourceLevel",
      "width": 185,
      "height": 100
     }
    ]
   },
   "pitch": 10.71,
   "yaw": 19.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9F7BD9_0B44_6A85_41A1_D86437408546",
 "data": {
  "label": "Door"
 },
 "maps": [
  {
   "hfov": 5.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 19.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_11_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": 10.71
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_12_0.png",
      "class": "ImageResourceLevel",
      "width": 1444,
      "height": 1156
     }
    ]
   },
   "pitch": 0.75,
   "yaw": -26.78
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9F5BD9_0B44_6A85_41A6_53BFC37027FB",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_12_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_13_0.png",
      "class": "ImageResourceLevel",
      "width": 1161,
      "height": 129
     }
    ]
   },
   "pitch": -1.88,
   "yaw": -27.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9FABD9_0B44_6A85_418C_604802B094DB",
 "data": {
  "label": "Multi \u2013 directional configuration with a tail gate"
 },
 "maps": [
  {
   "hfov": 35.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_13_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 144,
      "height": 16
     }
    ]
   },
   "pitch": -1.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_14_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 403
     }
    ]
   },
   "pitch": -8.81,
   "yaw": -28.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9FBBD9_0B44_6A85_41A4_786B0A5E99A1",
 "data": {
  "label": "\u2022 Door Dimensions \u2013 46400 mm (CW) X 9000 mm (CH)\u000d\u000d\u2022 6 Independent Operation Leaves (every leaf has a motor for individual operations)\u000d\u000d\u2022 4 Pedestrian Access with Safety System Sensors (Wicket Doors  - 4 Leaves)\u000d\u000d"
 },
 "maps": [
  {
   "hfov": 35.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_14_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": -8.81
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 },
 "hfov": 31.11,
 "autoplay": false,
 "id": "overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.68,
 "useHandCursor": true,
 "roll": -1.13,
 "yaw": -26.44,
 "rotationY": 4.39,
 "class": "VideoPanoramaOverlay",
 "rotationX": -7,
 "click": "this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.37,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'play'); this.setOverlayBehaviour(this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.setOverlayBehaviour(this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.setOverlayBehaviour(this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.overlay_1B9E2BD9_0B44_6A85_41A0_661F623E706D.set('enabled', true); this.overlay_1B9E0BD9_0B44_6A85_41A2_8C0CCFA71A4D.set('enabled', true); this.overlay_1B9E7BD9_0B44_6A85_4190_812B4D399C21.set('enabled', true); this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E.set('enabled', true); this.overlay_1B9F5BD9_0B44_6A85_41A6_53BFC37027FB.set('enabled', false); this.overlay_1B9FABD9_0B44_6A85_418C_604802B094DB.set('enabled', false); this.overlay_1B9FBBD9_0B44_6A85_41A4_786B0A5E99A1.set('enabled', false); this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2.set('enabled', false); this.overlay_1B9F0BDB_0B44_6A86_41A2_2D0E43849C8C.set('enabled', false); this.overlay_1B9F1BDB_0B44_6A86_41A2_0C54C57A2970.set('enabled', false); this.overlay_1B9F6BDB_0B44_6A86_4199_E54FB34CBF56.set('enabled', false); this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD.set('enabled', false); this.overlay_1B9FBBDB_0B44_6A86_4189_E690AB60AC94.set('enabled', false); this.overlay_1B9F9BDB_0B44_6A86_41A6_8AD969554DA2.set('enabled', false); this.overlay_1B9FFBDB_0B44_6A86_4185_5CC5D74E8AE8.set('enabled', false); this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B.set('enabled', false)"
  }
 ],
 "data": {
  "label": "ControlSystem"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.06,
   "image": "this.AnimatedImageResource_1307F8D9_0B44_1685_4170_22449EC9AFDA",
   "pitch": 1.15,
   "yaw": 4.34,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1B9FFBD9_0B44_6A85_4183_185BC234EB22",
 "maps": [
  {
   "hfov": 3.06,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 4.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_15_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.15
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 20.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_16_0.png",
      "class": "ImageResourceLevel",
      "width": 688,
      "height": 108
     }
    ]
   },
   "pitch": 4.07,
   "yaw": 6.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9FCBD9_0B44_6A85_4180_E3D42929A63F",
 "data": {
  "label": "Door Control System"
 },
 "maps": [
  {
   "hfov": 20.78,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_16_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 101,
      "height": 16
     }
    ]
   },
   "pitch": 4.07
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_17_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9E2BD9_0B44_6A85_41A0_661F623E706D",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_17_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_18_0.png",
      "class": "ImageResourceLevel",
      "width": 1169,
      "height": 158
     }
    ]
   },
   "pitch": -1.57,
   "yaw": 43.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9E0BD9_0B44_6A85_41A2_8C0CCFA71A4D",
 "data": {
  "label": "Door Control System Safety & Warning Devices"
 },
 "maps": [
  {
   "hfov": 35.4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_18_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 118,
      "height": 16
     }
    ]
   },
   "pitch": -1.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_19_0.png",
      "class": "ImageResourceLevel",
      "width": 1248,
      "height": 562
     }
    ]
   },
   "pitch": -10.05,
   "yaw": 43.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9E7BD9_0B44_6A85_4190_812B4D399C21",
 "data": {
  "label": "\u2022 In compliance with EN 12453:2001 (Safety in use of power operated doors)\u000d\u2022 Pendant Push Button Controls for Movement, Closing and Emergency Stop\u000d\u2022 Can be integrated with the BMS (Building Management System) & Fire Detection System\u000d\u2022 Each Leaf is fitted with audible and a visual alarm for alerting the personal while door in operations\u000d\u2022 Safety Edge System\u000d\u2022 Anti-collision Sensors\u000d"
 },
 "maps": [
  {
   "hfov": 37.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_19_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 35,
      "height": 16
     }
    ]
   },
   "pitch": -10.05
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 },
 "hfov": 32.11,
 "autoplay": false,
 "id": "overlay_1B90CBD9_0B44_6A85_4171_B607D820396E",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1B90CBD9_0B44_6A85_4171_B607D820396E_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.66,
 "useHandCursor": true,
 "roll": 0.59,
 "yaw": 42.87,
 "rotationY": 2.52,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.8,
 "click": "this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'play'); this.setOverlayBehaviour(this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.setOverlayBehaviour(this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.setOverlayBehaviour(this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.overlay_1B9F0BDB_0B44_6A86_41A2_2D0E43849C8C.set('enabled', true); this.overlay_1B9F1BDB_0B44_6A86_41A2_0C54C57A2970.set('enabled', true); this.overlay_1B9F6BDB_0B44_6A86_4199_E54FB34CBF56.set('enabled', true); this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD.set('enabled', true); this.overlay_1B9F5BD9_0B44_6A85_41A6_53BFC37027FB.set('enabled', false); this.overlay_1B9FABD9_0B44_6A85_418C_604802B094DB.set('enabled', false); this.overlay_1B9FBBD9_0B44_6A85_41A4_786B0A5E99A1.set('enabled', false); this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2.set('enabled', false); this.overlay_1B9E2BD9_0B44_6A85_41A0_661F623E706D.set('enabled', false); this.overlay_1B9E0BD9_0B44_6A85_41A2_8C0CCFA71A4D.set('enabled', false); this.overlay_1B9E7BD9_0B44_6A85_4190_812B4D399C21.set('enabled', false); this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E.set('enabled', false); this.overlay_1B9FBBDB_0B44_6A86_4189_E690AB60AC94.set('enabled', false); this.overlay_1B9F9BDB_0B44_6A86_41A6_8AD969554DA2.set('enabled', false); this.overlay_1B9FFBDB_0B44_6A86_4185_5CC5D74E8AE8.set('enabled', false); this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorCladding Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.29,
   "image": "this.AnimatedImageResource_1306C8D9_0B44_1685_4193_9EA80C2F97F5",
   "pitch": 7.58,
   "yaw": -8.91,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1B90DBD9_0B44_6A85_4194_1AFB30330DC2",
 "maps": [
  {
   "hfov": 2.29,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -8.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_20_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 7.58
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_21_0.png",
      "class": "ImageResourceLevel",
      "width": 432,
      "height": 120
     }
    ]
   },
   "pitch": 10.35,
   "yaw": -8.25,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9F3BD9_0B44_6A85_4149_7339BCC46C34",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 12.88,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -8.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_21_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 57,
      "height": 16
     }
    ]
   },
   "pitch": 10.35
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_22_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9F0BDB_0B44_6A86_41A2_2D0E43849C8C",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_22_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_23_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 362
     }
    ]
   },
   "pitch": -10.29,
   "yaw": 42.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9F1BDB_0B44_6A86_41A2_0C54C57A2970",
 "data": {
  "label": "\u2022 Insulated PUF Panel ensuring thermal & sound insulation\u000d\u2022 Double Glazed Window Sections"
 },
 "maps": [
  {
   "hfov": 35.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_23_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": -10.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_24_0.png",
      "class": "ImageResourceLevel",
      "width": 1161,
      "height": 129
     }
    ]
   },
   "pitch": -1.34,
   "yaw": 43.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9F6BDB_0B44_6A86_4199_E54FB34CBF56",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 35.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_24_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 144,
      "height": 16
     }
    ]
   },
   "pitch": -1.34
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 },
 "hfov": 32.3,
 "autoplay": false,
 "id": "overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.77,
 "useHandCursor": true,
 "roll": -1.16,
 "yaw": 42.99,
 "rotationY": 3.67,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.2,
 "click": "this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.setOverlayBehaviour(this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.setOverlayBehaviour(this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.setOverlayBehaviour(this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, 'stop'); this.overlay_1B9FBBDB_0B44_6A86_4189_E690AB60AC94.set('enabled', true); this.overlay_1B9F9BDB_0B44_6A86_41A6_8AD969554DA2.set('enabled', true); this.overlay_1B9FFBDB_0B44_6A86_4185_5CC5D74E8AE8.set('enabled', true); this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B.set('enabled', true); this.overlay_1B9F5BD9_0B44_6A85_41A6_53BFC37027FB.set('enabled', false); this.overlay_1B9FABD9_0B44_6A85_418C_604802B094DB.set('enabled', false); this.overlay_1B9FBBD9_0B44_6A85_41A4_786B0A5E99A1.set('enabled', false); this.overlay_1B9F9BD9_0B44_6A85_41A3_350B841F0CF2.set('enabled', false); this.overlay_1B9E2BD9_0B44_6A85_41A0_661F623E706D.set('enabled', false); this.overlay_1B9E0BD9_0B44_6A85_41A2_8C0CCFA71A4D.set('enabled', false); this.overlay_1B9E7BD9_0B44_6A85_4190_812B4D399C21.set('enabled', false); this.overlay_1B90CBD9_0B44_6A85_4171_B607D820396E.set('enabled', false); this.overlay_1B9F0BDB_0B44_6A86_41A2_2D0E43849C8C.set('enabled', false); this.overlay_1B9F1BDB_0B44_6A86_41A2_0C54C57A2970.set('enabled', false); this.overlay_1B9F6BDB_0B44_6A86_4199_E54FB34CBF56.set('enabled', false); this.overlay_1B9F4BDB_0B44_6A86_416A_0B21E2B075CD.set('enabled', false)"
  }
 ],
 "data": {
  "label": "Sealing Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.49,
   "image": "this.AnimatedImageResource_130418DA_0B44_1687_4194_F4D91FD6CEAA",
   "pitch": 13.45,
   "yaw": 5.24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1B9F5BDB_0B44_6A86_418B_08F4B96612F1",
 "maps": [
  {
   "hfov": 2.49,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_25_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 13.45
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_26_0.png",
      "class": "ImageResourceLevel",
      "width": 384,
      "height": 103
     }
    ]
   },
   "pitch": 16.53,
   "yaw": 6.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9FABDB_0B44_6A86_41A4_87D5A293739E",
 "data": {
  "label": "Seal System"
 },
 "maps": [
  {
   "hfov": 11.15,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_26_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 59,
      "height": 15
     }
    ]
   },
   "pitch": 16.53
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_27_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1066
     }
    ]
   },
   "pitch": 0.41,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9FBBDB_0B44_6A86_4189_E690AB60AC94",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_27_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": 0.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_28_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 388
     }
    ]
   },
   "pitch": -11.96,
   "yaw": 42.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9F9BDB_0B44_6A86_41A6_8AD969554DA2",
 "data": {
  "label": "\u2022 Vertical joints between on Leaves are fitted with twin tapered EPDM wiper seals\u000d\u000d\u2022 The bottom of each leaf is fitted with a heavy-duty nylon brush seal"
 },
 "maps": [
  {
   "hfov": 35.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_28_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 49,
      "height": 16
     }
    ]
   },
   "pitch": -11.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_29_0.png",
      "class": "ImageResourceLevel",
      "width": 1161,
      "height": 129
     }
    ]
   },
   "pitch": -5.31,
   "yaw": 43.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1B9FFBDB_0B44_6A86_4185_5CC5D74E8AE8",
 "data": {
  "label": "Weather Seal System"
 },
 "maps": [
  {
   "hfov": 35.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_29_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 144,
      "height": 16
     }
    ]
   },
   "pitch": -5.31
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 },
 "hfov": 32.6,
 "autoplay": false,
 "id": "overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 5.76,
 "useHandCursor": true,
 "roll": -0.18,
 "yaw": 42.57,
 "rotationY": -4.04,
 "class": "VideoPanoramaOverlay",
 "rotationX": -3.13,
 "click": "this.overlay_1B9FDBDB_0B44_6A86_4193_26F9BA442B3B.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.7,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_11C0A133_0B4D_F785_41A3_00129604BB09, this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_11C0A133_0B4D_F785_41A3_00129604BB09); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.02,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_30_0.png",
      "class": "ImageResourceLevel",
      "width": 232,
      "height": 78
     }
    ]
   },
   "pitch": 0.38,
   "yaw": 15.28
  }
 ],
 "id": "overlay_1B9E2BDB_0B44_6A86_4197_34D0C8225875",
 "maps": [
  {
   "hfov": 7.02,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 15.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_30_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": 0.38
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1098F282_0B4D_FA87_4181_0B5DC6676726, this.panorama_1AD21975_0B44_178D_419A_F21912320B19); this.startPanoramaWithCamera(this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, this.camera_1098F282_0B4D_FA87_4181_0B5DC6676726); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.61,
   "image": "this.AnimatedImageResource_131D28DD_0B44_16BD_417C_28012B85CB80",
   "pitch": -18.13,
   "yaw": 1.89,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1AD22975_0B44_178D_419D_EB278B52A346",
 "maps": [
  {
   "hfov": 11.61,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 1.89,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -18.13
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_10B6B29D_0B4D_FABD_4178_45EF7EF70E72, this.panorama_1AD21975_0B44_178D_419A_F21912320B19); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_10B6B29D_0B4D_FABD_4178_45EF7EF70E72); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.96,
   "image": "this.AnimatedImageResource_131D68DD_0B44_16BD_4194_7FF55DA5ED40",
   "pitch": -11.79,
   "yaw": 72.24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1AD24975_0B44_178D_4193_6BE425960D5A",
 "maps": [
  {
   "hfov": 11.96,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 72.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -11.79
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_108A628B_0B4D_FA85_41A6_23F7E00A36D0, this.panorama_1AD21975_0B44_178D_419A_F21912320B19); this.startPanoramaWithCamera(this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, this.camera_108A628B_0B4D_FA85_41A6_23F7E00A36D0); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.94,
   "image": "this.AnimatedImageResource_131DA8DD_0B44_16BD_4190_E68C19231E8C",
   "pitch": -12.22,
   "yaw": 108.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1AD25975_0B44_178D_4192_C7AA97F58622",
 "maps": [
  {
   "hfov": 11.94,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 108.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -12.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'play'); this.setOverlayBehaviour(this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.setOverlayBehaviour(this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.setOverlayBehaviour(this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.overlay_1AD18975_0B44_178D_419A_281713833B85.set('enabled', true); this.overlay_1AD19975_0B44_178D_419A_F41F5227AB5C.set('enabled', true); this.overlay_1AD1A975_0B44_178D_4179_C4A25ED05114.set('enabled', true); this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6.set('enabled', true); this.overlay_1AD1E975_0B44_178D_4111_93713CF09F50.set('enabled', false); this.overlay_1AD1F975_0B44_178D_4191_93833421CF6B.set('enabled', false); this.overlay_1AD10975_0B44_178D_419A_BBDE3147F9BE.set('enabled', false); this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201.set('enabled', false); this.overlay_1AD14975_0B44_178D_419E_103B3B87530C.set('enabled', false); this.overlay_1AD2F975_0B44_178D_4170_8AF0EDFE3907.set('enabled', false); this.overlay_1AD20975_0B44_178D_419B_842C923E756C.set('enabled', false); this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA.set('enabled', false); this.overlay_1AD25975_0B44_178D_4196_ABD743FF3FD8.set('enabled', false); this.overlay_1AD26975_0B44_178D_4193_1D3A45808E2B.set('enabled', false); this.overlay_1AD27975_0B44_178D_4183_50918EC63AAF.set('enabled', false); this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.31,
   "image": "this.AnimatedImageResource_131DC8DD_0B44_16BD_41A5_B0804AF1B994",
   "pitch": 5.58,
   "yaw": 15.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1AD26975_0B44_178D_41A5_46FB3AB4822A",
 "maps": [
  {
   "hfov": 2.31,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 15.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 5.58
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_9_0.png",
      "class": "ImageResourceLevel",
      "width": 184,
      "height": 100
     }
    ]
   },
   "pitch": 8.3,
   "yaw": 15.73,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD27975_0B44_178D_41A2_1C86F41F9C84",
 "data": {
  "label": "Door"
 },
 "maps": [
  {
   "hfov": 5.54,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 15.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_9_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": 8.3
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_10_0.png",
      "class": "ImageResourceLevel",
      "width": 1444,
      "height": 1156
     }
    ]
   },
   "pitch": 0.75,
   "yaw": -26.78
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD18975_0B44_178D_419A_281713833B85",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_10_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_11_0.png",
      "class": "ImageResourceLevel",
      "width": 1160,
      "height": 129
     }
    ]
   },
   "pitch": -1.88,
   "yaw": -27.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD19975_0B44_178D_419A_F41F5227AB5C",
 "data": {
  "label": "Multi \u2013 directional configuration with a tail gate"
 },
 "maps": [
  {
   "hfov": 35.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_11_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -1.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_12_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 404
     }
    ]
   },
   "pitch": -8.81,
   "yaw": -28.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD1A975_0B44_178D_4179_C4A25ED05114",
 "data": {
  "label": "\u2022 Door Dimensions \u2013 46400 mm (CW) X 9000 mm (CH)\u000d\u000d\u2022 6 Independent Operation Leaves (every leaf has a motor for individual operations)\u000d\u000d\u2022 4 Pedestrian Access with Safety System Sensors (Wicket Doors  - 4 Leaves)\u000d\u000d"
 },
 "maps": [
  {
   "hfov": 35.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_12_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": -8.81
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 },
 "hfov": 31.12,
 "autoplay": false,
 "id": "overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.68,
 "useHandCursor": true,
 "roll": -1.13,
 "yaw": -26.48,
 "rotationY": 4.39,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.99,
 "click": "this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.37,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'play'); this.setOverlayBehaviour(this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.setOverlayBehaviour(this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.setOverlayBehaviour(this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.overlay_1AD1E975_0B44_178D_4111_93713CF09F50.set('enabled', true); this.overlay_1AD1F975_0B44_178D_4191_93833421CF6B.set('enabled', true); this.overlay_1AD10975_0B44_178D_419A_BBDE3147F9BE.set('enabled', true); this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201.set('enabled', true); this.overlay_1AD18975_0B44_178D_419A_281713833B85.set('enabled', false); this.overlay_1AD19975_0B44_178D_419A_F41F5227AB5C.set('enabled', false); this.overlay_1AD1A975_0B44_178D_4179_C4A25ED05114.set('enabled', false); this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6.set('enabled', false); this.overlay_1AD14975_0B44_178D_419E_103B3B87530C.set('enabled', false); this.overlay_1AD2F975_0B44_178D_4170_8AF0EDFE3907.set('enabled', false); this.overlay_1AD20975_0B44_178D_419B_842C923E756C.set('enabled', false); this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA.set('enabled', false); this.overlay_1AD25975_0B44_178D_4196_ABD743FF3FD8.set('enabled', false); this.overlay_1AD26975_0B44_178D_4193_1D3A45808E2B.set('enabled', false); this.overlay_1AD27975_0B44_178D_4183_50918EC63AAF.set('enabled', false); this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3.set('enabled', false)"
  }
 ],
 "data": {
  "label": "ControlSystem"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.06,
   "image": "this.AnimatedImageResource_131B68DD_0B44_16BD_419A_74E5B06FE7A1",
   "pitch": 1.26,
   "yaw": 3.08,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1AD1C975_0B44_178D_4196_6926D059F9F3",
 "maps": [
  {
   "hfov": 3.06,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 3.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_13_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 20.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_14_0.png",
      "class": "ImageResourceLevel",
      "width": 687,
      "height": 107
     }
    ]
   },
   "pitch": 3.46,
   "yaw": 5.68,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD1D975_0B44_178D_4195_F638C2B46EA6",
 "data": {
  "label": "Door Control System"
 },
 "maps": [
  {
   "hfov": 20.78,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_14_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 102,
      "height": 15
     }
    ]
   },
   "pitch": 3.46
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_15_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD1E975_0B44_178D_4111_93713CF09F50",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_15_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_16_0.png",
      "class": "ImageResourceLevel",
      "width": 1169,
      "height": 158
     }
    ]
   },
   "pitch": -1.57,
   "yaw": 43.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD1F975_0B44_178D_4191_93833421CF6B",
 "data": {
  "label": "Door Control System Safety & Warning Devices"
 },
 "maps": [
  {
   "hfov": 35.4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_16_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 118,
      "height": 16
     }
    ]
   },
   "pitch": -1.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_17_0.png",
      "class": "ImageResourceLevel",
      "width": 1248,
      "height": 562
     }
    ]
   },
   "pitch": -10.05,
   "yaw": 43.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD10975_0B44_178D_419A_BBDE3147F9BE",
 "data": {
  "label": "\u2022 In compliance with EN 12453:2001 (Safety in use of power operated doors)\u000d\u2022 Pendant Push Button Controls for Movement, Closing and Emergency Stop\u000d\u2022 Can be integrated with the BMS (Building Management System) & Fire Detection System\u000d\u2022 Each Leaf is fitted with audible and a visual alarm for alerting the personal while door in operations\u000d\u2022 Safety Edge System\u000d\u2022 Anti-collision Sensors\u000d"
 },
 "maps": [
  {
   "hfov": 37.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_17_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 35,
      "height": 16
     }
    ]
   },
   "pitch": -10.05
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 },
 "hfov": 32.11,
 "autoplay": false,
 "id": "overlay_1AD11975_0B44_178D_417D_E307BDDE6201",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1AD11975_0B44_178D_417D_E307BDDE6201_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.65,
 "useHandCursor": true,
 "roll": 0.59,
 "yaw": 42.87,
 "rotationY": 2.52,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.79,
 "click": "this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'play'); this.setOverlayBehaviour(this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.setOverlayBehaviour(this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.setOverlayBehaviour(this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.overlay_1AD14975_0B44_178D_419E_103B3B87530C.set('enabled', true); this.overlay_1AD2F975_0B44_178D_4170_8AF0EDFE3907.set('enabled', true); this.overlay_1AD20975_0B44_178D_419B_842C923E756C.set('enabled', true); this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA.set('enabled', true); this.overlay_1AD18975_0B44_178D_419A_281713833B85.set('enabled', false); this.overlay_1AD19975_0B44_178D_419A_F41F5227AB5C.set('enabled', false); this.overlay_1AD1A975_0B44_178D_4179_C4A25ED05114.set('enabled', false); this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6.set('enabled', false); this.overlay_1AD1E975_0B44_178D_4111_93713CF09F50.set('enabled', false); this.overlay_1AD1F975_0B44_178D_4191_93833421CF6B.set('enabled', false); this.overlay_1AD10975_0B44_178D_419A_BBDE3147F9BE.set('enabled', false); this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201.set('enabled', false); this.overlay_1AD25975_0B44_178D_4196_ABD743FF3FD8.set('enabled', false); this.overlay_1AD26975_0B44_178D_4193_1D3A45808E2B.set('enabled', false); this.overlay_1AD27975_0B44_178D_4183_50918EC63AAF.set('enabled', false); this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorCladding Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.31,
   "image": "this.AnimatedImageResource_131A48DF_0B44_16BD_4181_8328E1FE663A",
   "pitch": 4.68,
   "yaw": -8.72,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1AD12975_0B44_178D_41A5_96D2E307C15D",
 "maps": [
  {
   "hfov": 2.31,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -8.72,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_18_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 4.68
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.97,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_19_0.png",
      "class": "ImageResourceLevel",
      "width": 431,
      "height": 144
     }
    ]
   },
   "pitch": 6.71,
   "yaw": -8.46,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD13975_0B44_178D_418C_2489CE5F9DAE",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 12.97,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -8.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_19_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": 6.71
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_20_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD14975_0B44_178D_419E_103B3B87530C",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_20_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_21_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 362
     }
    ]
   },
   "pitch": -10.29,
   "yaw": 42.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD2F975_0B44_178D_4170_8AF0EDFE3907",
 "data": {
  "label": "\u2022 Insulated PUF Panel ensuring thermal & sound insulation\u000d\u2022 Double Glazed Window Sections"
 },
 "maps": [
  {
   "hfov": 35.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_21_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": -10.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_22_0.png",
      "class": "ImageResourceLevel",
      "width": 1160,
      "height": 129
     }
    ]
   },
   "pitch": -1.34,
   "yaw": 43.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD20975_0B44_178D_419B_842C923E756C",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 35.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_22_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -1.34
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 },
 "hfov": 32.3,
 "autoplay": false,
 "id": "overlay_1AD21975_0B44_178D_41A0_C6614CF500EA",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1AD21975_0B44_178D_41A0_C6614CF500EA_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.79,
 "useHandCursor": true,
 "roll": -1.16,
 "yaw": 43.01,
 "rotationY": 3.67,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.21,
 "click": "this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'play'); this.setOverlayBehaviour(this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.setOverlayBehaviour(this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.setOverlayBehaviour(this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201, this.panorama_1AD21975_0B44_178D_419A_F21912320B19, 'stop'); this.overlay_1AD25975_0B44_178D_4196_ABD743FF3FD8.set('enabled', true); this.overlay_1AD26975_0B44_178D_4193_1D3A45808E2B.set('enabled', true); this.overlay_1AD27975_0B44_178D_4183_50918EC63AAF.set('enabled', true); this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3.set('enabled', true); this.overlay_1AD18975_0B44_178D_419A_281713833B85.set('enabled', false); this.overlay_1AD19975_0B44_178D_419A_F41F5227AB5C.set('enabled', false); this.overlay_1AD1A975_0B44_178D_4179_C4A25ED05114.set('enabled', false); this.overlay_1AD1B975_0B44_178D_419C_1DF970CEEAE6.set('enabled', false); this.overlay_1AD1E975_0B44_178D_4111_93713CF09F50.set('enabled', false); this.overlay_1AD1F975_0B44_178D_4191_93833421CF6B.set('enabled', false); this.overlay_1AD10975_0B44_178D_419A_BBDE3147F9BE.set('enabled', false); this.overlay_1AD11975_0B44_178D_417D_E307BDDE6201.set('enabled', false); this.overlay_1AD14975_0B44_178D_419E_103B3B87530C.set('enabled', false); this.overlay_1AD2F975_0B44_178D_4170_8AF0EDFE3907.set('enabled', false); this.overlay_1AD20975_0B44_178D_419B_842C923E756C.set('enabled', false); this.overlay_1AD21975_0B44_178D_41A0_C6614CF500EA.set('enabled', false)"
  }
 ],
 "data": {
  "label": "Sealing Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.51,
   "image": "this.AnimatedImageResource_131998DF_0B44_16BD_4157_E5ABE1E6D68D",
   "pitch": 11.26,
   "yaw": -0.89,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1AD22975_0B44_178D_41A1_9C43F426B030",
 "maps": [
  {
   "hfov": 2.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -0.89,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_23_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 11.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_24_0.png",
      "class": "ImageResourceLevel",
      "width": 383,
      "height": 103
     }
    ]
   },
   "pitch": 13.94,
   "yaw": 0.04,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD24975_0B44_178D_4178_FC9D4DC89902",
 "data": {
  "label": "Seal System"
 },
 "maps": [
  {
   "hfov": 11.26,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_24_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 59,
      "height": 15
     }
    ]
   },
   "pitch": 13.94
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_25_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1066
     }
    ]
   },
   "pitch": 0.41,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD25975_0B44_178D_4196_ABD743FF3FD8",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_25_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": 0.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_26_0.png",
      "class": "ImageResourceLevel",
      "width": 1193,
      "height": 388
     }
    ]
   },
   "pitch": -11.96,
   "yaw": 42.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD26975_0B44_178D_4193_1D3A45808E2B",
 "data": {
  "label": "\u2022 Vertical joints between on Leaves are fitted with twin tapered EPDM wiper seals\u000d\u000d\u2022 The bottom of each leaf is fitted with a heavy-duty nylon brush seal"
 },
 "maps": [
  {
   "hfov": 35.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_26_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 49,
      "height": 16
     }
    ]
   },
   "pitch": -11.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_27_0.png",
      "class": "ImageResourceLevel",
      "width": 1160,
      "height": 129
     }
    ]
   },
   "pitch": -5.31,
   "yaw": 43.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1AD27975_0B44_178D_4183_50918EC63AAF",
 "data": {
  "label": "Weather Seal System"
 },
 "maps": [
  {
   "hfov": 35.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_27_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 16
     }
    ]
   },
   "pitch": -5.31
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 },
 "hfov": 32.6,
 "autoplay": false,
 "id": "overlay_1AD18975_0B44_178D_4193_670B7753ABC3",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1AD18975_0B44_178D_4193_670B7753ABC3_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 5.78,
 "useHandCursor": true,
 "roll": -0.18,
 "yaw": 42.56,
 "rotationY": -4.04,
 "class": "VideoPanoramaOverlay",
 "rotationX": -3.14,
 "click": "this.overlay_1AD18975_0B44_178D_4193_670B7753ABC3.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.7,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_10846293_0B4D_FA85_41A4_4AA5FC6C0821, this.panorama_1AD21975_0B44_178D_419A_F21912320B19); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_10846293_0B4D_FA85_41A4_4AA5FC6C0821); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.99,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_28_0.png",
      "class": "ImageResourceLevel",
      "width": 231,
      "height": 63
     }
    ]
   },
   "pitch": 0.74,
   "yaw": 17.44
  }
 ],
 "id": "overlay_1AD19975_0B44_178D_41A4_AF4B4A5E6F1B",
 "maps": [
  {
   "hfov": 6.99,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 17.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_28_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 58,
      "height": 16
     }
    ]
   },
   "pitch": 0.74
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_119D9159_0B4D_F785_4185_86287DC077F0, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC); this.startPanoramaWithCamera(this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, this.camera_119D9159_0B4D_F785_4185_86287DC077F0); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.66,
   "image": "this.AnimatedImageResource_137478D3_0B44_1685_4192_9FD0D20E58B0",
   "pitch": -17.37,
   "yaw": -176.69,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1959E00A_0B44_7587_419C_BAEF1AAFC278",
 "maps": [
  {
   "hfov": 11.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -176.69,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -17.37
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_11EF0143_0B4D_F785_419E_E00E250A3145, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_11EF0143_0B4D_F785_419E_E00E250A3145); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 12.07,
   "image": "this.AnimatedImageResource_1374F8D3_0B44_1685_418B_27249EEF007B",
   "pitch": -8.97,
   "yaw": -119.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1959D00A_0B44_7587_419A_39CFE074BC5F",
 "maps": [
  {
   "hfov": 12.07,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -119.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -8.97
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_11BBF187_0B4D_F68E_4199_3F6048300656, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC); this.startPanoramaWithCamera(this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, this.camera_11BBF187_0B4D_F68E_4199_3F6048300656); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 12.08,
   "image": "this.AnimatedImageResource_137338D3_0B44_1685_41A3_538AB150916B",
   "pitch": -8.7,
   "yaw": -80.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1959C00A_0B44_7587_4196_24373B1621BA",
 "maps": [
  {
   "hfov": 12.08,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -80.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -8.7
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1966F00A_0B44_7587_4190_F0697A52551E, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'play'); this.setOverlayBehaviour(this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.setOverlayBehaviour(this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.setOverlayBehaviour(this.overlay_1967900B_0B44_7585_417B_7160773F61C9, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.overlay_1966400A_0B44_7587_4188_A6F8C5BAF5DC.set('enabled', true); this.overlay_1966B00A_0B44_7587_41A5_22A77F8FD457.set('enabled', true); this.overlay_1966800A_0B44_7587_418C_842CA13392D1.set('enabled', true); this.overlay_1966F00A_0B44_7587_4190_F0697A52551E.set('enabled', true); this.overlay_1959B00A_0B44_7587_419C_8D3DF5AC294C.set('enabled', false); this.overlay_1959A00A_0B44_7587_417F_6DC37DD62D11.set('enabled', false); this.overlay_1959800A_0B44_7587_41A5_38B8DD1EBFBC.set('enabled', false); this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5.set('enabled', false); this.overlay_1966000A_0B44_7587_4194_DC4EC9A10F6A.set('enabled', false); this.overlay_1966500A_0B44_7587_4166_779FDA17B025.set('enabled', false); this.overlay_1966400A_0B44_7587_4190_0F1C9650932F.set('enabled', false); this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF.set('enabled', false); this.overlay_1967200A_0B44_7587_418D_741B38C464A0.set('enabled', false); this.overlay_1967400B_0B44_7585_4195_1E27FC2CDC4F.set('enabled', false); this.overlay_1967B00B_0B44_7585_4197_B36D45E632D6.set('enabled', false); this.overlay_1967900B_0B44_7585_417B_7160773F61C9.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.26,
   "image": "this.AnimatedImageResource_137378D3_0B44_1685_4195_2BFFD9C9894C",
   "pitch": 13.69,
   "yaw": 22.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1966000A_0B44_7587_418D_EF73D571168C",
 "maps": [
  {
   "hfov": 2.26,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 22.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 13.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_9_0.png",
      "class": "ImageResourceLevel",
      "width": 184,
      "height": 100
     }
    ]
   },
   "pitch": 16.45,
   "yaw": 21.32,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1966600A_0B44_7587_418F_53B7DD9A06FE",
 "data": {
  "label": "Door"
 },
 "maps": [
  {
   "hfov": 5.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 21.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_9_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": 16.45
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_10_0.png",
      "class": "ImageResourceLevel",
      "width": 1444,
      "height": 1156
     }
    ]
   },
   "pitch": 0.75,
   "yaw": -26.78
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1966400A_0B44_7587_4188_A6F8C5BAF5DC",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_10_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_11_0.png",
      "class": "ImageResourceLevel",
      "width": 1161,
      "height": 130
     }
    ]
   },
   "pitch": -1.88,
   "yaw": -27.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1966B00A_0B44_7587_41A5_22A77F8FD457",
 "data": {
  "label": "Multi \u2013 directional configuration with a tail gate"
 },
 "maps": [
  {
   "hfov": 35.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_11_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 142,
      "height": 16
     }
    ]
   },
   "pitch": -1.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_12_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 404
     }
    ]
   },
   "pitch": -8.81,
   "yaw": -28.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1966800A_0B44_7587_418C_842CA13392D1",
 "data": {
  "label": "\u2022 Door Dimensions \u2013 46400 mm (CW) X 9000 mm (CH)\u000d\u000d\u2022 6 Independent Operation Leaves (every leaf has a motor for individual operations)\u000d\u000d\u2022 4 Pedestrian Access with Safety System Sensors (Wicket Doors  - 4 Leaves)\u000d\u000d"
 },
 "maps": [
  {
   "hfov": 35.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_12_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": -8.81
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 },
 "hfov": 31.12,
 "autoplay": false,
 "id": "overlay_1966F00A_0B44_7587_4190_F0697A52551E",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1966F00A_0B44_7587_4190_F0697A52551E_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.66,
 "useHandCursor": true,
 "roll": -1.13,
 "yaw": -26.39,
 "rotationY": 4.39,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.97,
 "click": "this.overlay_1966F00A_0B44_7587_4190_F0697A52551E.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.37,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'play'); this.setOverlayBehaviour(this.overlay_1966F00A_0B44_7587_4190_F0697A52551E, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.setOverlayBehaviour(this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.setOverlayBehaviour(this.overlay_1967900B_0B44_7585_417B_7160773F61C9, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.overlay_1959B00A_0B44_7587_419C_8D3DF5AC294C.set('enabled', true); this.overlay_1959A00A_0B44_7587_417F_6DC37DD62D11.set('enabled', true); this.overlay_1959800A_0B44_7587_41A5_38B8DD1EBFBC.set('enabled', true); this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5.set('enabled', true); this.overlay_1966400A_0B44_7587_4188_A6F8C5BAF5DC.set('enabled', false); this.overlay_1966B00A_0B44_7587_41A5_22A77F8FD457.set('enabled', false); this.overlay_1966800A_0B44_7587_418C_842CA13392D1.set('enabled', false); this.overlay_1966F00A_0B44_7587_4190_F0697A52551E.set('enabled', false); this.overlay_1966000A_0B44_7587_4194_DC4EC9A10F6A.set('enabled', false); this.overlay_1966500A_0B44_7587_4166_779FDA17B025.set('enabled', false); this.overlay_1966400A_0B44_7587_4190_0F1C9650932F.set('enabled', false); this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF.set('enabled', false); this.overlay_1967200A_0B44_7587_418D_741B38C464A0.set('enabled', false); this.overlay_1967400B_0B44_7585_4195_1E27FC2CDC4F.set('enabled', false); this.overlay_1967B00B_0B44_7585_4197_B36D45E632D6.set('enabled', false); this.overlay_1967900B_0B44_7585_417B_7160773F61C9.set('enabled', false)"
  }
 ],
 "data": {
  "label": "ControlSystem"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.06,
   "image": "this.AnimatedImageResource_137258D3_0B44_1685_419A_594A9FC17553",
   "pitch": 1.92,
   "yaw": 5.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1959600A_0B44_7587_4190_9CAB84707581",
 "maps": [
  {
   "hfov": 3.06,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_13_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.92
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 20.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_14_0.png",
      "class": "ImageResourceLevel",
      "width": 691,
      "height": 110
     }
    ]
   },
   "pitch": 5.43,
   "yaw": 8.09,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1959500A_0B44_7587_41A2_C1D878450BCC",
 "data": {
  "label": "Door Control System"
 },
 "maps": [
  {
   "hfov": 20.81,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 8.09,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_14_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 100,
      "height": 16
     }
    ]
   },
   "pitch": 5.43
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_15_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1959B00A_0B44_7587_419C_8D3DF5AC294C",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_15_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_16_0.png",
      "class": "ImageResourceLevel",
      "width": 1169,
      "height": 158
     }
    ]
   },
   "pitch": -1.57,
   "yaw": 43.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1959A00A_0B44_7587_417F_6DC37DD62D11",
 "data": {
  "label": "Door Control System Safety & Warning Devices"
 },
 "maps": [
  {
   "hfov": 35.4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_16_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 118,
      "height": 16
     }
    ]
   },
   "pitch": -1.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_17_0.png",
      "class": "ImageResourceLevel",
      "width": 1248,
      "height": 561
     }
    ]
   },
   "pitch": -10.05,
   "yaw": 43.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1959800A_0B44_7587_41A5_38B8DD1EBFBC",
 "data": {
  "label": "\u2022 In compliance with EN 12453:2001 (Safety in use of power operated doors)\u000d\u2022 Pendant Push Button Controls for Movement, Closing and Emergency Stop\u000d\u2022 Can be integrated with the BMS (Building Management System) & Fire Detection System\u000d\u2022 Each Leaf is fitted with audible and a visual alarm for alerting the personal while door in operations\u000d\u2022 Safety Edge System\u000d\u2022 Anti-collision Sensors\u000d"
 },
 "maps": [
  {
   "hfov": 37.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_17_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 35,
      "height": 15
     }
    ]
   },
   "pitch": -10.05
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 },
 "hfov": 32.11,
 "autoplay": false,
 "id": "overlay_1959E00A_0B44_7587_4191_CF8758968AB5",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1959E00A_0B44_7587_4191_CF8758968AB5_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.71,
 "useHandCursor": true,
 "roll": 0.59,
 "yaw": 42.91,
 "rotationY": 2.52,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.85,
 "click": "this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'play'); this.setOverlayBehaviour(this.overlay_1966F00A_0B44_7587_4190_F0697A52551E, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.setOverlayBehaviour(this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.setOverlayBehaviour(this.overlay_1967900B_0B44_7585_417B_7160773F61C9, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.overlay_1966000A_0B44_7587_4194_DC4EC9A10F6A.set('enabled', true); this.overlay_1966500A_0B44_7587_4166_779FDA17B025.set('enabled', true); this.overlay_1966400A_0B44_7587_4190_0F1C9650932F.set('enabled', true); this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF.set('enabled', true); this.overlay_1966400A_0B44_7587_4188_A6F8C5BAF5DC.set('enabled', false); this.overlay_1966B00A_0B44_7587_41A5_22A77F8FD457.set('enabled', false); this.overlay_1966800A_0B44_7587_418C_842CA13392D1.set('enabled', false); this.overlay_1966F00A_0B44_7587_4190_F0697A52551E.set('enabled', false); this.overlay_1959B00A_0B44_7587_419C_8D3DF5AC294C.set('enabled', false); this.overlay_1959A00A_0B44_7587_417F_6DC37DD62D11.set('enabled', false); this.overlay_1959800A_0B44_7587_41A5_38B8DD1EBFBC.set('enabled', false); this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5.set('enabled', false); this.overlay_1967200A_0B44_7587_418D_741B38C464A0.set('enabled', false); this.overlay_1967400B_0B44_7585_4195_1E27FC2CDC4F.set('enabled', false); this.overlay_1967B00B_0B44_7585_4197_B36D45E632D6.set('enabled', false); this.overlay_1967900B_0B44_7585_417B_7160773F61C9.set('enabled', false)"
  }
 ],
 "data": {
  "label": "DoorCladding Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.26,
   "image": "this.AnimatedImageResource_1371E8D5_0B44_168D_41A1_7B7D626CA57E",
   "pitch": 12.72,
   "yaw": -16.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1966300A_0B44_7587_4193_D63D8567615D",
 "maps": [
  {
   "hfov": 2.26,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -16.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_18_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 12.72
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_19_0.png",
      "class": "ImageResourceLevel",
      "width": 411,
      "height": 121
     }
    ]
   },
   "pitch": 15.32,
   "yaw": -14.92,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1966200A_0B44_7587_41A6_46A24831F9BC",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 12.02,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -14.92,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_19_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 54,
      "height": 16
     }
    ]
   },
   "pitch": 15.32
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_20_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1966000A_0B44_7587_4194_DC4EC9A10F6A",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_20_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_21_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 361
     }
    ]
   },
   "pitch": -10.29,
   "yaw": 42.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1966500A_0B44_7587_4166_779FDA17B025",
 "data": {
  "label": "\u2022 Insulated PUF Panel ensuring thermal & sound insulation\u000d\u2022 Double Glazed Window Sections"
 },
 "maps": [
  {
   "hfov": 35.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_21_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": -10.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_22_0.png",
      "class": "ImageResourceLevel",
      "width": 1161,
      "height": 130
     }
    ]
   },
   "pitch": -1.34,
   "yaw": 43.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1966400A_0B44_7587_4190_0F1C9650932F",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 35.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_22_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 142,
      "height": 16
     }
    ]
   },
   "pitch": -1.34
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 },
 "hfov": 32.3,
 "autoplay": false,
 "id": "overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.78,
 "useHandCursor": true,
 "roll": -1.16,
 "yaw": 42.96,
 "rotationY": 3.67,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.2,
 "click": "this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_1967900B_0B44_7585_417B_7160773F61C9, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'play'); this.setOverlayBehaviour(this.overlay_1966F00A_0B44_7587_4190_F0697A52551E, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.setOverlayBehaviour(this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.setOverlayBehaviour(this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, 'stop'); this.overlay_1967200A_0B44_7587_418D_741B38C464A0.set('enabled', true); this.overlay_1967400B_0B44_7585_4195_1E27FC2CDC4F.set('enabled', true); this.overlay_1967B00B_0B44_7585_4197_B36D45E632D6.set('enabled', true); this.overlay_1967900B_0B44_7585_417B_7160773F61C9.set('enabled', true); this.overlay_1966400A_0B44_7587_4188_A6F8C5BAF5DC.set('enabled', false); this.overlay_1966B00A_0B44_7587_41A5_22A77F8FD457.set('enabled', false); this.overlay_1966800A_0B44_7587_418C_842CA13392D1.set('enabled', false); this.overlay_1966F00A_0B44_7587_4190_F0697A52551E.set('enabled', false); this.overlay_1959B00A_0B44_7587_419C_8D3DF5AC294C.set('enabled', false); this.overlay_1959A00A_0B44_7587_417F_6DC37DD62D11.set('enabled', false); this.overlay_1959800A_0B44_7587_41A5_38B8DD1EBFBC.set('enabled', false); this.overlay_1959E00A_0B44_7587_4191_CF8758968AB5.set('enabled', false); this.overlay_1966000A_0B44_7587_4194_DC4EC9A10F6A.set('enabled', false); this.overlay_1966500A_0B44_7587_4166_779FDA17B025.set('enabled', false); this.overlay_1966400A_0B44_7587_4190_0F1C9650932F.set('enabled', false); this.overlay_1966900A_0B44_7587_41A2_8DA0A0E9E2BF.set('enabled', false)"
  }
 ],
 "data": {
  "label": "Sealing Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.36,
   "image": "this.AnimatedImageResource_1371A8D5_0B44_168D_417D_6F6EB2E9DFA8",
   "pitch": 23.03,
   "yaw": 3.33,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1966800A_0B44_7587_416F_C7530C34A16C",
 "maps": [
  {
   "hfov": 2.36,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 3.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_23_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 23.03
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_24_0.png",
      "class": "ImageResourceLevel",
      "width": 419,
      "height": 103
     }
    ]
   },
   "pitch": 26.5,
   "yaw": 4.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1966D00A_0B44_7587_4195_F15916CC4DCF",
 "data": {
  "label": "Seal System"
 },
 "maps": [
  {
   "hfov": 11.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 4.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_24_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 65,
      "height": 15
     }
    ]
   },
   "pitch": 26.5
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_25_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1066
     }
    ]
   },
   "pitch": 0.41,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1967200A_0B44_7587_418D_741B38C464A0",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_25_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": 0.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_26_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 388
     }
    ]
   },
   "pitch": -11.96,
   "yaw": 42.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1967400B_0B44_7585_4195_1E27FC2CDC4F",
 "data": {
  "label": "\u2022 Vertical joints between on Leaves are fitted with twin tapered EPDM wiper seals\u000d\u000d\u2022 The bottom of each leaf is fitted with a heavy-duty nylon brush seal"
 },
 "maps": [
  {
   "hfov": 35.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_26_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 49,
      "height": 16
     }
    ]
   },
   "pitch": -11.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_27_0.png",
      "class": "ImageResourceLevel",
      "width": 1161,
      "height": 130
     }
    ]
   },
   "pitch": -5.31,
   "yaw": 43.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1967B00B_0B44_7585_4197_B36D45E632D6",
 "data": {
  "label": "Weather Seal System"
 },
 "maps": [
  {
   "hfov": 35.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_27_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 142,
      "height": 16
     }
    ]
   },
   "pitch": -5.31
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 },
 "hfov": 32.6,
 "autoplay": false,
 "id": "overlay_1967900B_0B44_7585_417B_7160773F61C9",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_1967900B_0B44_7585_417B_7160773F61C9_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 5.76,
 "useHandCursor": true,
 "roll": -0.18,
 "yaw": 42.59,
 "rotationY": -4.04,
 "class": "VideoPanoramaOverlay",
 "rotationX": -3.13,
 "click": "this.overlay_1967900B_0B44_7585_417B_7160773F61C9.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.7,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_118EB172_0B4D_F787_4174_B50FDDBACC80, this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_118EB172_0B4D_F787_4174_B50FDDBACC80); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.35,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_28_0.png",
      "class": "ImageResourceLevel",
      "width": 276,
      "height": 81
     }
    ]
   },
   "pitch": 1.08,
   "yaw": 18.34
  }
 ],
 "id": "overlay_1967F00B_0B44_7585_418C_DD969FDAA188",
 "maps": [
  {
   "hfov": 8.35,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 18.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_28_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 54,
      "height": 16
     }
    ]
   },
   "pitch": 1.08
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1294F075_0B4D_F58D_4177_D212991A985F, this.panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_1294F075_0B4D_F58D_4177_D212991A985F); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.55,
   "image": "this.AnimatedImageResource_D81D6E27_FC03_5572_41CE_39D2A0E4CD87",
   "pitch": -18.72,
   "yaw": -70.8,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_E2143EA3_FC01_5572_41EC_ED71B9AC48DE",
 "maps": [
  {
   "hfov": 17.55,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -70.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -18.72
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1289D07E_0B4D_F67F_41A2_4692FFC2EC69, this.panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_1289D07E_0B4D_F67F_41A2_4692FFC2EC69); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 27.61,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0_HS_1_0.png",
      "class": "ImageResourceLevel",
      "width": 917,
      "height": 267
     }
    ]
   },
   "pitch": 5.44,
   "yaw": 0.31
  }
 ],
 "id": "overlay_E36B5B5B_FC01_D3D2_4197_E9443ED69D9F",
 "maps": [
  {
   "hfov": 27.61,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 54,
      "height": 16
     }
    ]
   },
   "pitch": 5.44
  }
 ]
},
{
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.42",
     "zoomFactor": 1.1,
     "y": "0.74"
    },
    "duration": 5000,
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "scaleMode": "fit_outside"
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_E376AACD_F814_249C_41CD_ACBEA1B83814_0"
  }
 ],
 "id": "album_E376AACD_F814_249C_41CD_ACBEA1B83814_AlbumPlayList"
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_117BD0E2_0B4D_F687_418E_6DF683C77BC4, this.panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_117BD0E2_0B4D_F687_418E_6DF683C77BC4); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 16.73,
   "image": "this.AnimatedImageResource_D81DEE26_FC03_5572_41ED_63DC59390ECC",
   "pitch": -25.45,
   "yaw": 67.02,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_E21C6E8D_FC03_7536_41E1_F2B426D5BBF3",
 "maps": [
  {
   "hfov": 16.73,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 67.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -25.45
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_117130EB_0B4D_F685_41A5_78F3E79CCC74, this.panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_117130EB_0B4D_F685_41A5_78F3E79CCC74); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 31,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0_HS_1_0.png",
      "class": "ImageResourceLevel",
      "width": 1026,
      "height": 304
     }
    ]
   },
   "pitch": 2.49,
   "yaw": 0.04
  }
 ],
 "id": "overlay_E219CA38_FC03_7D5E_41E5_0DACEEC1BA80",
 "maps": [
  {
   "hfov": 31,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 54,
      "height": 16
     }
    ]
   },
   "pitch": 2.49
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_110E6106_0B4D_F78F_417E_2C8195988072, this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A); this.startPanoramaWithCamera(this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, this.camera_110E6106_0B4D_F78F_417E_2C8195988072); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "playbackPositions": [
    {
     "class": "PanoramaOverlayPlaybackPosition",
     "timestamp": 0,
     "pitch": 6.69,
     "opacity": 1,
     "hfov": 30.37,
     "roll": 0,
     "yaw": -5.38
    }
   ],
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_HS_0_0.png",
      "class": "ImageResourceLevel",
      "width": 820,
      "height": 244
     }
    ]
   },
   "pitch": 0,
   "yaw": 0
  }
 ],
 "id": "overlay_E60F307D_FC07_CDD7_41E2_D9E0027B6315",
 "maps": [
  {
   "playbackPositions": [
    {
     "class": "PanoramaOverlayPlaybackPosition",
     "timestamp": 0,
     "pitch": 6.69,
     "opacity": 1,
     "hfov": 30.37,
     "roll": 0,
     "yaw": -5.38
    }
   ],
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 53,
      "height": 16
     }
    ]
   },
   "pitch": 0
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_116350F4_0B4D_F683_4171_E03E2D547A54, this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A); this.startPanoramaWithCamera(this.panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9, this.camera_116350F4_0B4D_F683_4171_E03E2D547A54); this.mainPlayList.set('selectedIndex', 11)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "playbackPositions": [
    {
     "class": "PanoramaOverlayPlaybackPosition",
     "timestamp": 0,
     "pitch": -18.55,
     "opacity": 1,
     "hfov": 19.47,
     "roll": 0,
     "yaw": -78.64
    }
   ],
   "image": "this.AnimatedImageResource_D81C2E26_FC03_5572_41E9_E002352BFF28",
   "pitch": 0,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_E1E02FC2_FC0F_D332_41EC_99615A3C0424",
 "maps": [
  {
   "playbackPositions": [
    {
     "class": "PanoramaOverlayPlaybackPosition",
     "timestamp": 0,
     "pitch": -18.55,
     "opacity": 1,
     "hfov": 19.47,
     "roll": 0,
     "yaw": -78.64
    }
   ],
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": 0
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_111C60FE_0B4D_F67F_419C_D7D6CCB60626, this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A); this.startPanoramaWithCamera(this.panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372, this.camera_111C60FE_0B4D_F67F_419C_D7D6CCB60626); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "playbackPositions": [
    {
     "class": "PanoramaOverlayPlaybackPosition",
     "timestamp": 0,
     "pitch": -17.49,
     "opacity": 1,
     "hfov": 18.75,
     "roll": 0,
     "yaw": 63.56
    }
   ],
   "image": "this.AnimatedImageResource_D81C5E26_FC03_5572_41DC_836A548D2163",
   "pitch": 0,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_E1F54768_FC00_F3FD_41AA_BB5CB4820CCA",
 "maps": [
  {
   "playbackPositions": [
    {
     "class": "PanoramaOverlayPlaybackPosition",
     "timestamp": 0,
     "pitch": -17.49,
     "opacity": 1,
     "hfov": 18.75,
     "roll": 0,
     "yaw": 63.56
    }
   ],
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": 0
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_10EE4278_0B4D_F583_4189_5FAA38A80A8C, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E); this.startPanoramaWithCamera(this.panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0, this.camera_10EE4278_0B4D_F583_4189_5FAA38A80A8C); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.99,
   "image": "this.AnimatedImageResource_136E78C9_0B44_1685_419A_D3226F486063",
   "pitch": -15.97,
   "yaw": 1.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054CE7A7_0B44_7A8D_4172_5759A8F5ADBE",
 "maps": [
  {
   "hfov": 7.99,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 1.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_16_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -15.97
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1019A21F_0B4D_F5BE_41A1_385813F71F0F, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E); this.startPanoramaWithCamera(this.panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC, this.camera_1019A21F_0B4D_F5BE_41A1_385813F71F0F); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.42,
   "image": "this.AnimatedImageResource_136DA8CB_0B44_1686_4193_00088F942B88",
   "pitch": -7.72,
   "yaw": 53.59,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054F37A7_0B44_7A8D_4190_26ABDCACE833",
 "maps": [
  {
   "hfov": 7.42,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 53.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_17_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -7.72
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1008B232_0B4D_F586_41A5_47115DDE510B, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E); this.startPanoramaWithCamera(this.panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8, this.camera_1008B232_0B4D_F586_41A5_47115DDE510B); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 8.18,
   "image": "this.AnimatedImageResource_136CC8CB_0B44_1686_4194_776FF217BDE1",
   "pitch": -8.98,
   "yaw": 91.86,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054F27A7_0B44_7A8D_419A_7AA5AD1DEED3",
 "maps": [
  {
   "hfov": 8.18,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 91.86,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_18_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -8.98
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_10C2E267_0B4D_F58E_413A_4429D6D34102, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E); this.startPanoramaWithCamera(this.panorama_18495474_0B44_7D83_419A_E00B5DBA73C3, this.camera_10C2E267_0B4D_F58E_413A_4429D6D34102); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.86,
   "image": "this.AnimatedImageResource_136B08CB_0B44_1686_41A5_38385E52397D",
   "pitch": -7.86,
   "yaw": 125.3,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054F17A7_0B44_7A8D_4187_FBDF00862FA2",
 "maps": [
  {
   "hfov": 6.86,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 125.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_19_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -7.86
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_1034B24C_0B4D_F583_4196_B016967A7263, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E); this.startPanoramaWithCamera(this.panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5, this.camera_1034B24C_0B4D_F583_4196_B016967A7263); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.29,
   "image": "this.AnimatedImageResource_136B58CB_0B44_1686_41A5_77031D2E84AF",
   "pitch": -8.99,
   "yaw": -64.95,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054F07A7_0B44_7A8D_416D_712A01451393",
 "maps": [
  {
   "hfov": 7.29,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -64.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_20_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -8.99
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_10215253_0B4D_F585_418A_011E988DE18F, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E); this.startPanoramaWithCamera(this.panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC, this.camera_10215253_0B4D_F585_418A_011E988DE18F); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 8.18,
   "image": "this.AnimatedImageResource_136BF8CB_0B44_1686_413D_519E37D7FED2",
   "pitch": -9.09,
   "yaw": -96.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054F77A7_0B44_7A8D_4194_D9D555855D1E",
 "maps": [
  {
   "hfov": 8.18,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -96.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_21_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -9.09
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_10D0725E_0B4D_F5BE_418A_C21FC7732B1A, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E); this.startPanoramaWithCamera(this.panorama_1AD21975_0B44_178D_419A_F21912320B19, this.camera_10D0725E_0B4D_F5BE_418A_C21FC7732B1A); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.32,
   "image": "this.AnimatedImageResource_136A38CB_0B44_1686_41A2_EB0FEDF07C2E",
   "pitch": -7.41,
   "yaw": -125.95,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054F57A7_0B44_7A8D_4189_B391D763DC4E",
 "maps": [
  {
   "hfov": 7.32,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -125.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_22_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -7.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_10058241_0B4D_F585_41A0_C2A581D572E5, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E); this.startPanoramaWithCamera(this.panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1, this.camera_10058241_0B4D_F585_41A0_C2A581D572E5); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.84,
   "image": "this.AnimatedImageResource_136AA8CB_0B44_1686_4194_E0DB1005741A",
   "pitch": -18.95,
   "yaw": -179.08,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054FB7A7_0B44_7A8D_419E_5FF43EEB84F7",
 "maps": [
  {
   "hfov": 7.84,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -179.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_23_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -18.95
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.overlay_054F87A7_0B44_7A8D_4199_3E1838804155.set('enabled', true); this.overlay_054FE7A7_0B44_7A8D_41A5_AAF4817D782A.set('enabled', true); this.overlay_054FC7A7_0B44_7A8D_41A6_759926EEC8A4.set('enabled', true); this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415.set('enabled', true); this.setOverlayBehaviour(this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'play'); this.overlay_054C97A8_0B44_7A83_41A2_011BA609A134.set('enabled', false); this.overlay_054C87A8_0B44_7A83_4191_75A9EF3E96B4.set('enabled', false); this.overlay_054CF7A8_0B44_7A83_41A0_554B6DFBE264.set('enabled', false); this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12.set('enabled', false); this.overlay_054F17A8_0B44_7A83_41A5_45DD79CEF73A.set('enabled', false); this.overlay_054F07A8_0B44_7A83_41A0_A6138E6B0AFE.set('enabled', false); this.overlay_054F77A8_0B44_7A83_419F_EFA55282625F.set('enabled', false); this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796.set('enabled', false); this.overlay_054FB7A8_0B44_7A83_418A_7B507B9CA5AC.set('enabled', false); this.overlay_054FA7A8_0B44_7A83_4196_35869C98EBD6.set('enabled', false); this.overlay_054F97A8_0B44_7A83_41A0_28E6C7B2C794.set('enabled', false); this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023.set('enabled', false); this.overlay_054E37A8_0B44_7A83_41A0_F51E84FDBC77.set('enabled', false); this.overlay_054E27A8_0B44_7A83_41A3_15ADF28AC904.set('enabled', false); this.overlay_054E17A8_0B44_7A83_419B_C214D618B765.set('enabled', false); this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD.set('enabled', false); this.setOverlayBehaviour(this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop')"
  }
 ],
 "data": {
  "label": "TailButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.48,
   "image": "this.AnimatedImageResource_136A98CB_0B44_1686_41A6_1B57CF5A560C",
   "pitch": 22.43,
   "yaw": 1.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054FA7A7_0B44_7A8D_41A5_CF9975DA0618",
 "maps": [
  {
   "hfov": 3.48,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 1.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_27_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 22.43
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_29_0.png",
      "class": "ImageResourceLevel",
      "width": 313,
      "height": 103
     }
    ]
   },
   "pitch": 25.86,
   "yaw": 2.07,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054F97A7_0B44_7A8D_418B_33F33E7A3C16",
 "data": {
  "label": "Tail Gate"
 },
 "maps": [
  {
   "hfov": 8.54,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_29_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 48,
      "height": 15
     }
    ]
   },
   "pitch": 25.86
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.38,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_30_0.png",
      "class": "ImageResourceLevel",
      "width": 1434,
      "height": 1155
     }
    ]
   },
   "pitch": 0.63,
   "yaw": -26.67
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054F87A7_0B44_7A8D_4199_3E1838804155",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.67,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_30_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.63
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_31_0.png",
      "class": "ImageResourceLevel",
      "width": 1228,
      "height": 114
     }
    ]
   },
   "pitch": -1.69,
   "yaw": -27.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054FE7A7_0B44_7A8D_41A5_AAF4817D782A",
 "data": {
  "label": "Tail Gate integrated with insulated rolling shutter"
 },
 "maps": [
  {
   "hfov": 37.15,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_31_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 172,
      "height": 16
     }
    ]
   },
   "pitch": -1.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 38.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_32_0.png",
      "class": "ImageResourceLevel",
      "width": 1276,
      "height": 425
     }
    ]
   },
   "pitch": -8.93,
   "yaw": -27.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054FC7A7_0B44_7A8D_41A6_759926EEC8A4",
 "data": {
  "label": "\u2022 Motorised Rolling Shutter Dimensions \u2013 3000 mm (W) X 4000 mm (H) \u000d\u000d\u2022 Simple push button operation\u000d\u000d\u2022 Backed by manual operation in case of emergency and power failure\u000d"
 },
 "maps": [
  {
   "hfov": 38.16,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_32_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 48,
      "height": 15
     }
    ]
   },
   "pitch": -8.93
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_DDF7B047_F912_3EE6_41C6_A905D91A483D.mp4"
 },
 "hfov": 30.43,
 "autoplay": false,
 "id": "overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.62,
 "useHandCursor": true,
 "roll": 0.19,
 "yaw": -26.68,
 "rotationY": 0.05,
 "class": "VideoPanoramaOverlay",
 "rotationX": -6.92,
 "click": "this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.41,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.overlay_054C97A8_0B44_7A83_41A2_011BA609A134.set('enabled', true); this.overlay_054C87A8_0B44_7A83_4191_75A9EF3E96B4.set('enabled', true); this.overlay_054CF7A8_0B44_7A83_41A0_554B6DFBE264.set('enabled', true); this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12.set('enabled', true); this.setOverlayBehaviour(this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'play'); this.overlay_054F87A7_0B44_7A8D_4199_3E1838804155.set('enabled', false); this.overlay_054FE7A7_0B44_7A8D_41A5_AAF4817D782A.set('enabled', false); this.overlay_054FC7A7_0B44_7A8D_41A6_759926EEC8A4.set('enabled', false); this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415.set('enabled', false); this.overlay_054F17A8_0B44_7A83_41A5_45DD79CEF73A.set('enabled', false); this.overlay_054F07A8_0B44_7A83_41A0_A6138E6B0AFE.set('enabled', false); this.overlay_054F77A8_0B44_7A83_419F_EFA55282625F.set('enabled', false); this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796.set('enabled', false); this.overlay_054FB7A8_0B44_7A83_418A_7B507B9CA5AC.set('enabled', false); this.overlay_054FA7A8_0B44_7A83_4196_35869C98EBD6.set('enabled', false); this.overlay_054F97A8_0B44_7A83_41A0_28E6C7B2C794.set('enabled', false); this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023.set('enabled', false); this.overlay_054E37A8_0B44_7A83_41A0_F51E84FDBC77.set('enabled', false); this.overlay_054E27A8_0B44_7A83_41A3_15ADF28AC904.set('enabled', false); this.overlay_054E17A8_0B44_7A83_419B_C214D618B765.set('enabled', false); this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD.set('enabled', false); this.setOverlayBehaviour(this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop')"
  }
 ],
 "data": {
  "label": "DoorButton"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.09,
   "image": "this.AnimatedImageResource_136828CC_0B44_1683_41A4_FEA75AB267DB",
   "pitch": 8.61,
   "yaw": 16.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054E27A8_0B44_7A83_4198_03DEBE908DCB",
 "maps": [
  {
   "hfov": 3.09,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 16.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_33_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 8.61
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 7.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_34_0.png",
      "class": "ImageResourceLevel",
      "width": 240,
      "height": 120
     }
    ]
   },
   "pitch": 11.65,
   "yaw": 17.38,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054CA7A8_0B44_7A83_4187_5FF0627E65DE",
 "data": {
  "label": "Door"
 },
 "maps": [
  {
   "hfov": 7.11,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 17.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_34_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 32,
      "height": 16
     }
    ]
   },
   "pitch": 11.65
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 43.69,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_35_0.png",
      "class": "ImageResourceLevel",
      "width": 1444,
      "height": 1156
     }
    ]
   },
   "pitch": 0.75,
   "yaw": -26.78
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054C97A8_0B44_7A83_41A2_011BA609A134",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 43.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_35_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 0.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_36_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 131
     }
    ]
   },
   "pitch": -1.88,
   "yaw": -27.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054C87A8_0B44_7A83_4191_75A9EF3E96B4",
 "data": {
  "label": "Multi \u2013 directional configuration with a tail gate"
 },
 "maps": [
  {
   "hfov": 35.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_36_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 141,
      "height": 16
     }
    ]
   },
   "pitch": -1.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_37_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 405
     }
    ]
   },
   "pitch": -8.81,
   "yaw": -28.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054CF7A8_0B44_7A83_41A0_554B6DFBE264",
 "data": {
  "label": "\u2022 Door Dimensions \u2013 46400 mm (CW) X 9000 mm (CH)\u000d\u000d\u2022 6 Independent Operation Leaves (every leaf has a motor for individual operations)\u000d\u000d\u2022 4 Pedestrian Access with Safety System Sensors (Wicket Doors  - 4 Leaves)\u000d\u000d"
 },
 "maps": [
  {
   "hfov": 35.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_37_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 47,
      "height": 16
     }
    ]
   },
   "pitch": -8.81
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_ED4C97C5_F814_EC8C_41C3_679D56F23F45.mp4"
 },
 "hfov": 31.11,
 "autoplay": false,
 "id": "overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 7.81,
 "useHandCursor": true,
 "roll": -1.13,
 "yaw": -26.43,
 "rotationY": 4.4,
 "class": "VideoPanoramaOverlay",
 "rotationX": -7.12,
 "click": "this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 15.38,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.overlay_054F17A8_0B44_7A83_41A5_45DD79CEF73A.set('enabled', true); this.overlay_054F07A8_0B44_7A83_41A0_A6138E6B0AFE.set('enabled', true); this.overlay_054F77A8_0B44_7A83_419F_EFA55282625F.set('enabled', true); this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796.set('enabled', true); this.overlay_054F87A7_0B44_7A8D_4199_3E1838804155.set('enabled', false); this.overlay_054FE7A7_0B44_7A8D_41A5_AAF4817D782A.set('enabled', false); this.overlay_054FC7A7_0B44_7A8D_41A6_759926EEC8A4.set('enabled', false); this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415.set('enabled', false); this.overlay_054C97A8_0B44_7A83_41A2_011BA609A134.set('enabled', false); this.overlay_054C87A8_0B44_7A83_4191_75A9EF3E96B4.set('enabled', false); this.overlay_054CF7A8_0B44_7A83_41A0_554B6DFBE264.set('enabled', false); this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12.set('enabled', false); this.overlay_054FB7A8_0B44_7A83_418A_7B507B9CA5AC.set('enabled', false); this.overlay_054FA7A8_0B44_7A83_4196_35869C98EBD6.set('enabled', false); this.overlay_054F97A8_0B44_7A83_41A0_28E6C7B2C794.set('enabled', false); this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023.set('enabled', false); this.overlay_054E37A8_0B44_7A83_41A0_F51E84FDBC77.set('enabled', false); this.overlay_054E27A8_0B44_7A83_41A3_15ADF28AC904.set('enabled', false); this.overlay_054E17A8_0B44_7A83_419B_C214D618B765.set('enabled', false); this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD.set('enabled', false); this.setOverlayBehaviour(this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'play'); this.setOverlayBehaviour(this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop')"
  }
 ],
 "data": {
  "label": "ControlSystem"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.75,
   "image": "this.AnimatedImageResource_136718CD_0B44_1682_4180_C019A9E71416",
   "pitch": 2.04,
   "yaw": 1.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054CC7A8_0B44_7A83_41A4_0ADEF619E0B7",
 "maps": [
  {
   "hfov": 2.75,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 1.56,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_38_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 2.04
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_40_0.png",
      "class": "ImageResourceLevel",
      "width": 592,
      "height": 125
     }
    ]
   },
   "pitch": 6.01,
   "yaw": 2.32,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054F37A8_0B44_7A83_41A5_58A5C5D2B5CC",
 "data": {
  "label": "Door Control System"
 },
 "maps": [
  {
   "hfov": 17.82,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_40_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 75,
      "height": 16
     }
    ]
   },
   "pitch": 6.01
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_41_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054F17A8_0B44_7A83_41A5_45DD79CEF73A",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_41_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_42_0.png",
      "class": "ImageResourceLevel",
      "width": 1169,
      "height": 159
     }
    ]
   },
   "pitch": -1.57,
   "yaw": 43.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054F07A8_0B44_7A83_41A0_A6138E6B0AFE",
 "data": {
  "label": "Door Control System Safety & Warning Devices"
 },
 "maps": [
  {
   "hfov": 35.4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_42_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 117,
      "height": 16
     }
    ]
   },
   "pitch": -1.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 37.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_43_0.png",
      "class": "ImageResourceLevel",
      "width": 1249,
      "height": 562
     }
    ]
   },
   "pitch": -10.05,
   "yaw": 43.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054F77A8_0B44_7A83_419F_EFA55282625F",
 "data": {
  "label": "\u2022 In compliance with EN 12453:2001 (Safety in use of power operated doors)\u000d\u2022 Pendant Push Button Controls for Movement, Closing and Emergency Stop\u000d\u2022 Can be integrated with the BMS (Building Management System) & Fire Detection System\u000d\u2022 Each Leaf is fitted with audible and a visual alarm for alerting the personal while door in operations\u000d\u2022 Safety Edge System\u000d\u2022 Anti-collision Sensors\u000d"
 },
 "maps": [
  {
   "hfov": 37.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_43_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 35,
      "height": 16
     }
    ]
   },
   "pitch": -10.05
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E297D754_F834_2D83_41DA_21A74AD71847.mp4"
 },
 "hfov": 32.12,
 "autoplay": false,
 "id": "overlay_054F67A8_0B44_7A83_419F_DAC35B465796",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_054F67A8_0B44_7A83_419F_DAC35B465796_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.57,
 "useHandCursor": true,
 "roll": 0.59,
 "yaw": 42.97,
 "rotationY": 2.52,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.71,
 "click": "this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'play'); this.setOverlayBehaviour(this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.overlay_054FB7A8_0B44_7A83_418A_7B507B9CA5AC.set('enabled', true); this.overlay_054FA7A8_0B44_7A83_4196_35869C98EBD6.set('enabled', true); this.overlay_054F97A8_0B44_7A83_41A0_28E6C7B2C794.set('enabled', true); this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023.set('enabled', true); this.overlay_054F87A7_0B44_7A8D_4199_3E1838804155.set('enabled', false); this.overlay_054FE7A7_0B44_7A8D_41A5_AAF4817D782A.set('enabled', false); this.overlay_054FC7A7_0B44_7A8D_41A6_759926EEC8A4.set('enabled', false); this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415.set('enabled', false); this.overlay_054C97A8_0B44_7A83_41A2_011BA609A134.set('enabled', false); this.overlay_054C87A8_0B44_7A83_4191_75A9EF3E96B4.set('enabled', false); this.overlay_054CF7A8_0B44_7A83_41A0_554B6DFBE264.set('enabled', false); this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12.set('enabled', false); this.overlay_054F17A8_0B44_7A83_41A5_45DD79CEF73A.set('enabled', false); this.overlay_054F07A8_0B44_7A83_41A0_A6138E6B0AFE.set('enabled', false); this.overlay_054F77A8_0B44_7A83_419F_EFA55282625F.set('enabled', false); this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796.set('enabled', false); this.overlay_054E37A8_0B44_7A83_41A0_F51E84FDBC77.set('enabled', false); this.overlay_054E27A8_0B44_7A83_41A3_15ADF28AC904.set('enabled', false); this.overlay_054E17A8_0B44_7A83_419B_C214D618B765.set('enabled', false); this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD.set('enabled', false); this.setOverlayBehaviour(this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop')"
  }
 ],
 "data": {
  "label": "DoorCladding Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.04,
   "image": "this.AnimatedImageResource_136648CD_0B44_169D_41A4_51A4A95CC4E6",
   "pitch": 6.82,
   "yaw": -12.93,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054F57A8_0B44_7A83_41A2_75219AA77DCB",
 "maps": [
  {
   "hfov": 3.04,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -12.93,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_44_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 6.82
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.29,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_45_0.png",
      "class": "ImageResourceLevel",
      "width": 446,
      "height": 115
     }
    ]
   },
   "pitch": 10.33,
   "yaw": -12.6,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054F47A8_0B44_7A83_419D_3DADBED40658",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 13.29,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -12.6,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_45_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 62,
      "height": 16
     }
    ]
   },
   "pitch": 10.33
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_46_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1325
     }
    ]
   },
   "pitch": 0.6,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054FB7A8_0B44_7A83_418A_7B507B9CA5AC",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_46_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_47_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 363
     }
    ]
   },
   "pitch": -10.29,
   "yaw": 42.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054FA7A8_0B44_7A83_4196_35869C98EBD6",
 "data": {
  "label": "\u2022 Insulated PUF Panel ensuring thermal & sound insulation\u000d\u2022 Double Glazed Window Sections"
 },
 "maps": [
  {
   "hfov": 35.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_47_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 16
     }
    ]
   },
   "pitch": -10.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_48_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 131
     }
    ]
   },
   "pitch": -1.34,
   "yaw": 43.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054F97A8_0B44_7A83_41A0_28E6C7B2C794",
 "data": {
  "label": "Door Cladding"
 },
 "maps": [
  {
   "hfov": 35.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_48_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 141,
      "height": 16
     }
    ]
   },
   "pitch": -1.34
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E60F718F_F81C_649C_41E1_1B361DFD2D16.mp4"
 },
 "hfov": 32.29,
 "autoplay": false,
 "id": "overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 9.89,
 "useHandCursor": true,
 "roll": -1.16,
 "yaw": 42.89,
 "rotationY": 3.66,
 "class": "VideoPanoramaOverlay",
 "rotationX": -8.32,
 "click": "this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.42,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setOverlayBehaviour(this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'play'); this.setOverlayBehaviour(this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.setOverlayBehaviour(this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop'); this.overlay_054E37A8_0B44_7A83_41A0_F51E84FDBC77.set('enabled', true); this.overlay_054E27A8_0B44_7A83_41A3_15ADF28AC904.set('enabled', true); this.overlay_054E17A8_0B44_7A83_419B_C214D618B765.set('enabled', true); this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD.set('enabled', true); this.overlay_054F87A7_0B44_7A8D_4199_3E1838804155.set('enabled', false); this.overlay_054FE7A7_0B44_7A8D_41A5_AAF4817D782A.set('enabled', false); this.overlay_054FC7A7_0B44_7A8D_41A6_759926EEC8A4.set('enabled', false); this.overlay_054E37A7_0B44_7A8D_41A0_E4E9FA1AA415.set('enabled', false); this.overlay_054C97A8_0B44_7A83_41A2_011BA609A134.set('enabled', false); this.overlay_054C87A8_0B44_7A83_4191_75A9EF3E96B4.set('enabled', false); this.overlay_054CF7A8_0B44_7A83_41A0_554B6DFBE264.set('enabled', false); this.overlay_054CD7A8_0B44_7A83_419E_13C48D4B7A12.set('enabled', false); this.overlay_054F17A8_0B44_7A83_41A5_45DD79CEF73A.set('enabled', false); this.overlay_054F07A8_0B44_7A83_41A0_A6138E6B0AFE.set('enabled', false); this.overlay_054F77A8_0B44_7A83_419F_EFA55282625F.set('enabled', false); this.overlay_054F67A8_0B44_7A83_419F_DAC35B465796.set('enabled', false); this.overlay_054FB7A8_0B44_7A83_418A_7B507B9CA5AC.set('enabled', false); this.overlay_054FA7A8_0B44_7A83_4196_35869C98EBD6.set('enabled', false); this.overlay_054F97A8_0B44_7A83_41A0_28E6C7B2C794.set('enabled', false); this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023.set('enabled', false); this.setOverlayBehaviour(this.overlay_054FF7A8_0B44_7A83_41A5_346CF5BAD023, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E, 'stop')"
  }
 ],
 "data": {
  "label": "Sealing Button"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.68,
   "image": "this.AnimatedImageResource_136588CD_0B44_169D_418E_6BF385D18EBE",
   "pitch": 13.52,
   "yaw": 1.3,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_054FE7A8_0B44_7A83_41A1_AACBB4DBC0A5",
 "maps": [
  {
   "hfov": 2.68,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 1.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_49_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 13.52
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_50_0.png",
      "class": "ImageResourceLevel",
      "width": 372,
      "height": 131
     }
    ]
   },
   "pitch": 16.54,
   "yaw": 2.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054FC7A8_0B44_7A83_4169_11658F6760B8",
 "data": {
  "label": "Seal System"
 },
 "maps": [
  {
   "hfov": 10.81,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_50_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 45,
      "height": 16
     }
    ]
   },
   "pitch": 16.54
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 41.77,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_51_0.png",
      "class": "ImageResourceLevel",
      "width": 1381,
      "height": 1066
     }
    ]
   },
   "pitch": 0.41,
   "yaw": 42.82
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054E37A8_0B44_7A83_41A0_F51E84FDBC77",
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 41.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_51_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": 0.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_52_0.png",
      "class": "ImageResourceLevel",
      "width": 1192,
      "height": 388
     }
    ]
   },
   "pitch": -11.96,
   "yaw": 42.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054E27A8_0B44_7A83_41A3_15ADF28AC904",
 "data": {
  "label": "\u2022 Vertical joints between on Leaves are fitted with twin tapered EPDM wiper seals\u000d\u000d\u2022 The bottom of each leaf is fitted with a heavy-duty nylon brush seal"
 },
 "maps": [
  {
   "hfov": 35.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_52_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 49,
      "height": 16
     }
    ]
   },
   "pitch": -11.96
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 35.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_53_0.png",
      "class": "ImageResourceLevel",
      "width": 1162,
      "height": 131
     }
    ]
   },
   "pitch": -5.31,
   "yaw": 43.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "enabled": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_054E17A8_0B44_7A83_419B_C214D618B765",
 "data": {
  "label": "Weather Seal System"
 },
 "maps": [
  {
   "hfov": 35.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 43.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_53_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 141,
      "height": 16
     }
    ]
   },
   "pitch": -5.31
  }
 ]
},
{
 "blending": 0,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D835DB01_F8ED_E584_41E0_C65F5E1D702C.mp4"
 },
 "hfov": 32.6,
 "autoplay": false,
 "id": "overlay_054E07A8_0B44_7A83_417E_616567C16CCD",
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_054E07A8_0B44_7A83_417E_616567C16CCD_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "pitch": 5.76,
 "useHandCursor": true,
 "roll": -0.18,
 "yaw": 42.7,
 "rotationY": -4.04,
 "class": "VideoPanoramaOverlay",
 "rotationX": -3.13,
 "click": "this.overlay_054E07A8_0B44_7A83_417E_616567C16CCD.play()",
 "videoVisibleOnStop": false,
 "enabled": false,
 "data": {
  "label": "Video"
 },
 "vfov": 16.7,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setCameraSameSpotAsMedia(this.camera_10FF626F_0B4D_F59D_4188_2BEF2F490F5D, this.panorama_054C47A7_0B44_7A8D_4190_A81955A5705E); this.startPanoramaWithCamera(this.media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A, this.camera_10FF626F_0B4D_F59D_4188_2BEF2F490F5D); this.mainPlayList.set('selectedIndex', 10); this.MainViewerPanoramaPlayer.play()"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.47,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_54_0.png",
      "class": "ImageResourceLevel",
      "width": 313,
      "height": 91
     }
    ]
   },
   "pitch": 0.42,
   "yaw": 12.66
  }
 ],
 "id": "overlay_054E67A8_0B44_7A83_4176_BEEC0F791ED6",
 "maps": [
  {
   "hfov": 9.47,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 12.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_54_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 55,
      "height": 16
     }
    ]
   },
   "pitch": 0.42
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1303F8DA_0B44_1687_4195_9BB0F8A0FD4F",
 "levels": [
  {
   "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130208DA_0B44_1687_414A_937D1E8ACC68",
 "levels": [
  {
   "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1302A8DA_0B44_1687_41A3_D6945EAAFC3A",
 "levels": [
  {
   "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1302E8DA_0B44_1687_41A1_B070F1BFAC97",
 "levels": [
  {
   "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130118DA_0B44_1687_41A2_7B49715A3C0A",
 "levels": [
  {
   "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_9_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130148DA_0B44_1687_4191_6DE4FD6FC4D7",
 "levels": [
  {
   "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_10_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130098DC_0B44_1683_4196_9017E8C2608D",
 "levels": [
  {
   "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_15_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131FF8DC_0B44_1683_419F_29E03E3380CD",
 "levels": [
  {
   "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_20_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131D28DC_0B44_1683_41A3_EC7341481E04",
 "levels": [
  {
   "url": "media/panorama_1BBF3880_0B44_3683_41A5_EE06CE0A70D8_1_HS_25_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1370D8D5_0B44_168D_418A_E466CDD79948",
 "levels": [
  {
   "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130F68D5_0B44_168D_418E_ECDC85CBB4B1",
 "levels": [
  {
   "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130FB8D6_0B44_168F_4193_CC9FB8BAE22B",
 "levels": [
  {
   "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130FF8D6_0B44_168F_4176_9561B9C36F11",
 "levels": [
  {
   "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130D08D7_0B44_168D_4187_E51352FE77EC",
 "levels": [
  {
   "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_13_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130C48D7_0B44_168D_41A3_576FBD8374CC",
 "levels": [
  {
   "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_18_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130BA8D7_0B44_168D_419E_6EF8129E02E9",
 "levels": [
  {
   "url": "media/panorama_1BC0973B_0B44_1B85_419E_45BB5D991DA5_1_HS_23_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136318CD_0B44_169D_419E_8A5A269615B4",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_9_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136358CD_0B44_169D_4190_6708EF4FDE63",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_10_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136398CD_0B44_169D_4160_BA67DC202141",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_11_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136208CD_0B44_169D_4165_31FD93F16662",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_12_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1364C8CD_0B44_169D_4175_8BF4488BF693",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_13_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136318CF_0B44_169E_417D_B9A709C503E2",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_14_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136248CF_0B44_169E_419F_A3C00504E369",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_19_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136188CF_0B44_169E_41A5_C520E07858D6",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_24_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1360F8CF_0B44_169E_41A2_E48FACCF12B6",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_29_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137EE8D0_0B44_1683_4162_05606AB17A08",
 "levels": [
  {
   "url": "media/panorama_045A05B5_0B44_1E8D_4180_422FB73C7EE0_1_HS_34_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131708DF_0B44_16BD_419F_A2FAE6D134A3",
 "levels": [
  {
   "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131758DF_0B44_16BD_4196_1A0F09323301",
 "levels": [
  {
   "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131798E0_0B44_1683_4195_2D1947D0C6C5",
 "levels": [
  {
   "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131638E0_0B44_1683_4194_BEB8C2A5774C",
 "levels": [
  {
   "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131568E1_0B44_1685_4152_755F115464D8",
 "levels": [
  {
   "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_13_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1314B8E1_0B44_1685_4190_A850A0EB3F79",
 "levels": [
  {
   "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_18_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1313C8E1_0B44_1685_4193_0AB133A0FA92",
 "levels": [
  {
   "url": "media/panorama_18495474_0B44_7D83_419A_E00B5DBA73C3_1_HS_23_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137C68D0_0B44_1683_419E_8E113342740E",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137CB8D0_0B44_1683_4198_7A744ED71F89",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137CC8D0_0B44_1683_41A3_3A061072E2E1",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_9_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137B68D0_0B44_1683_4192_112F7262E716",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_10_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137BB8D0_0B44_1683_4198_BE95B7CB8FD2",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_11_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137BD8D0_0B44_1683_4166_57952C3CC9EC",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_12_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137938D2_0B44_1686_419C_B0B3F48FF609",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_17_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137868D2_0B44_1686_41A1_ECE8EFED5EBC",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_22_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1377A8D2_0B44_1686_4186_402463C90F1E",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_27_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1376E8D3_0B44_1685_4170_A270913273EE",
 "levels": [
  {
   "url": "media/panorama_04C1EC25_0B47_ED8D_4182_47CD07186CE1_1_HS_32_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130AD8D7_0B44_168D_4181_1DDBB0A86C42",
 "levels": [
  {
   "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130918D7_0B44_168D_41A3_0DF8CC5EDBFB",
 "levels": [
  {
   "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130988D7_0B44_168D_418D_3E673D2AF61F",
 "levels": [
  {
   "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1309D8D7_0B44_168D_41A4_520EA47844E5",
 "levels": [
  {
   "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130868D9_0B44_1685_4196_5E5DAFFF78BC",
 "levels": [
  {
   "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_9_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1308B8D9_0B44_1685_41A4_BE28188DC922",
 "levels": [
  {
   "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_10_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1307F8D9_0B44_1685_4170_22449EC9AFDA",
 "levels": [
  {
   "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_15_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1306C8D9_0B44_1685_4193_9EA80C2F97F5",
 "levels": [
  {
   "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_20_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_130418DA_0B44_1687_4194_F4D91FD6CEAA",
 "levels": [
  {
   "url": "media/panorama_1B90EBD9_0B44_6A85_41A3_1FC50E4515EC_1_HS_25_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131D28DD_0B44_16BD_417C_28012B85CB80",
 "levels": [
  {
   "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131D68DD_0B44_16BD_4194_7FF55DA5ED40",
 "levels": [
  {
   "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131DA8DD_0B44_16BD_4190_E68C19231E8C",
 "levels": [
  {
   "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131DC8DD_0B44_16BD_41A5_B0804AF1B994",
 "levels": [
  {
   "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131B68DD_0B44_16BD_419A_74E5B06FE7A1",
 "levels": [
  {
   "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_13_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131A48DF_0B44_16BD_4181_8328E1FE663A",
 "levels": [
  {
   "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_18_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_131998DF_0B44_16BD_4157_E5ABE1E6D68D",
 "levels": [
  {
   "url": "media/panorama_1AD21975_0B44_178D_419A_F21912320B19_1_HS_23_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137478D3_0B44_1685_4192_9FD0D20E58B0",
 "levels": [
  {
   "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1374F8D3_0B44_1685_418B_27249EEF007B",
 "levels": [
  {
   "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137338D3_0B44_1685_41A3_538AB150916B",
 "levels": [
  {
   "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137378D3_0B44_1685_4195_2BFFD9C9894C",
 "levels": [
  {
   "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_137258D3_0B44_1685_419A_594A9FC17553",
 "levels": [
  {
   "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_13_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1371E8D5_0B44_168D_41A1_7B7D626CA57E",
 "levels": [
  {
   "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_18_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_1371A8D5_0B44_168D_417D_6F6EB2E9DFA8",
 "levels": [
  {
   "url": "media/panorama_1959F00A_0B44_7587_4192_152A4E5F0FEC_1_HS_23_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_D81D6E27_FC03_5572_41CE_39D2A0E4CD87",
 "levels": [
  {
   "url": "media/panorama_E2167103_FC01_4F33_41D5_E0E33FB6F372_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_D81DEE26_FC03_5572_41ED_63DC59390ECC",
 "levels": [
  {
   "url": "media/panorama_E39B9ECB_FC07_F533_41E6_8C9594D0FAB9_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_D81C2E26_FC03_5572_41E9_E002352BFF28",
 "levels": [
  {
   "url": "media/media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_D81C5E26_FC03_5572_41DC_836A548D2163",
 "levels": [
  {
   "url": "media/media_E5549D1D_FC01_B757_41D6_1BDC73EFB11A_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136E78C9_0B44_1685_419A_D3226F486063",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_16_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136DA8CB_0B44_1686_4193_00088F942B88",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_17_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136CC8CB_0B44_1686_4194_776FF217BDE1",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_18_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136B08CB_0B44_1686_41A5_38385E52397D",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_19_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136B58CB_0B44_1686_41A5_77031D2E84AF",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_20_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136BF8CB_0B44_1686_413D_519E37D7FED2",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_21_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136A38CB_0B44_1686_41A2_EB0FEDF07C2E",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_22_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136AA8CB_0B44_1686_4194_E0DB1005741A",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_23_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136A98CB_0B44_1686_41A6_1B57CF5A560C",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_27_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136828CC_0B44_1683_41A4_FEA75AB267DB",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_33_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136718CD_0B44_1682_4180_C019A9E71416",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_38_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136648CD_0B44_169D_41A4_51A4A95CC4E6",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_44_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_136588CD_0B44_169D_418E_6BF385D18EBE",
 "levels": [
  {
   "url": "media/panorama_054C47A7_0B44_7A8D_4190_A81955A5705E_1_HS_49_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
}],
 "width": "100%"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
