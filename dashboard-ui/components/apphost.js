define(["appStorage","browser"],function(appStorage,browser){"use strict";function getDeviceProfile(){return null}function getCapabilities(){var caps={PlayableMediaTypes:["Audio","Video"],SupportsPersistentIdentifier:!1,DeviceProfile:getDeviceProfile()};return caps}function generateDeviceId(){return new Promise(function(resolve,reject){require(["cryptojs-sha1"],function(){var keys=[];keys.push(navigator.userAgent),keys.push((new Date).getTime()),resolve(CryptoJS.SHA1(keys.join("|")).toString())})})}function getDeviceId(){var key="_deviceId2",deviceId=appStorage.getItem(key);return deviceId?Promise.resolve(deviceId):generateDeviceId().then(function(deviceId){return appStorage.setItem(key,deviceId),deviceId})}function getDeviceName(){var deviceName;return deviceName=browser.tizen?"Samsung Smart TV":browser.web0S?"LG Smart TV":browser.operaTv?"Opera TV":browser.xboxOne?"Xbox One":browser.ps4?"Sony PS4":browser.chrome?"Chrome":browser.edge?"Edge":browser.firefox?"Firefox":browser.msie?"Internet Explorer":"Web Browser",browser.version&&(deviceName+=" "+browser.version),browser.ipad?deviceName+=" Ipad":browser.iphone?deviceName+=" Iphone":browser.android&&(deviceName+=" Android"),deviceName}function supportsVoiceInput(){return!browser.tv&&(window.SpeechRecognition||window.webkitSpeechRecognition||window.mozSpeechRecognition||window.oSpeechRecognition||window.msSpeechRecognition)}function supportsFullscreen(){if(browser.tv)return!1;var element=document.documentElement;return element.requestFullscreen||element.mozRequestFullScreen||element.webkitRequestFullscreen||element.msRequestFullscreen}function getSyncProfile(){return new Promise(function(resolve,reject){require(["browserdeviceprofile","appSettings"],function(profileBuilder,appSettings){var profile=profileBuilder();profile.MaxStaticMusicBitrate=appSettings.maxStaticMusicBitrate(),resolve(profile)})})}function supportsHtmlMediaAutoplay(){if(browser.edgeUwp||browser.tv||browser.ps4||browser.xboxOne)return!0;if(browser.mobile)return!1;var savedResult=appStorage.getItem(htmlMediaAutoplayAppStorageKey);return"true"===savedResult||"false"!==savedResult&&null}var htmlMediaAutoplayAppStorageKey="supportshtmlmediaautoplay0",supportedFeatures=function(){var features=["sharing","externalpremium"];return browser.edgeUwp||browser.tv||browser.xboxOne||browser.ps4||features.push("filedownload"),browser.operaTv||browser.tizen||browser.web0s?features.push("exit"):features.push("exitmenu"),browser.operaTv||features.push("externallinks"),supportsVoiceInput()&&features.push("voiceinput"),supportsHtmlMediaAutoplay()&&(features.push("htmlaudioautoplay"),features.push("htmlvideoautoplay")),window.SyncRegistered,supportsFullscreen()&&features.push("fullscreenchange"),(browser.chrome||browser.edge&&!browser.slow)&&features.push("imageanalysis"),Dashboard.isConnectMode()&&features.push("multiserver"),(browser.tv||browser.xboxOne||browser.ps4||browser.mobile)&&features.push("physicalvolumecontrol"),browser.tv||browser.xboxOne||browser.ps4||features.push("remotecontrol"),features}();supportedFeatures.indexOf("htmlvideoautoplay")===-1&&supportsHtmlMediaAutoplay()!==!1&&require(["autoPlayDetect"],function(autoPlayDetect){autoPlayDetect.supportsHtmlMediaAutoplay().then(function(){appStorage.setItem(htmlMediaAutoplayAppStorageKey,"true"),supportedFeatures.push("htmlvideoautoplay"),supportedFeatures.push("htmlaudioautoplay")},function(){appStorage.setItem(htmlMediaAutoplayAppStorageKey,"false")})});var appInfo,version=window.dashboardVersion||"3.0";return{getWindowState:function(){return document.windowState||"Normal"},setWindowState:function(state){alert("setWindowState is not supported and should not be called")},exit:function(){if(browser.tizen)try{tizen.application.getCurrentApplication().exit()}catch(err){console.log("error closing application: "+err)}else window.close()},supports:function(command){return supportedFeatures.indexOf(command.toLowerCase())!=-1},appInfo:function(){return appInfo?Promise.resolve(appInfo):getDeviceId().then(function(deviceId){return appInfo={deviceId:deviceId,deviceName:getDeviceName(),appName:"Emby Mobile",appVersion:version}})},capabilities:getCapabilities,preferVisualCards:browser.android||browser.chrome,moreIcon:browser.safari||browser.edge?"dots-horiz":"dots-vert",getSyncProfile:getSyncProfile}});