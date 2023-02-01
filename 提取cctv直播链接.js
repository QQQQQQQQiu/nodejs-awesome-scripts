import {request} from './utils/request.js'
import CryptoJS from "crypto-js";
import {question} from './utils/询问输入.js'

async function getm3u8(pageUrl) {
  let text = await request('GET', pageUrl)
  let pid = text.match(/var guid = "(.*?)"/)?.[1]
  if (!pid) {
    pid = text.match(/var guid_Ad_VideoCode = "(.*?)"/)?.[1]
  }
  console.log('pid :', pid)
  let ts = +new Date()
  let fp = getFP()
  let enstr = ts + '2049' + '47899B86370B879139C08EA3B5E88267' + fp
  let vc = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(enstr)).toString().toUpperCase()
  let url = `https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${pid}&client=flash&im=0&tsp=${ts}&vn=2049&vc=${vc}&uid=${fp}&wlan=`
  let res = JSON.parse(await request('GET', url))
  console.log('res :', res)
  console.log('标题 :', res.title)
  console.log('播放链接 :', res.hls_url)
  res.video.chapters4.forEach(({url}, index) => {
    console.log(`${index + 1}=>${url}`)
  });
}

async function main() {
    // let linkStr = 'https://tv.cctv.com/2022/11/21/VIDE0LGv20wQg61xGQk1rhne221121.shtml?spm=C31267.Ps4TvsHCiPx5.EFhA5EKLlcYD.33'
    let linkStr = await question('目标页面链接：')
    getm3u8(linkStr)
}
main()








/* ********************** */

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        var k;
        if (this == null) {
            throw new TypeError("'this' is null or undefined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = +fromIndex || 0;
        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}
var Fingerprint2 = function(options) {

    if (!(this instanceof Fingerprint2)) {
        return new Fingerprint2(options);
    }

    var defaultOptions = {
        swfContainerId: "fingerprintjs2",
        swfPath: "flash/compiled/FontList.swf",
        detectScreenOrientation: true,
        sortPluginsFor: [/palemoon/i],
        userDefinedFonts: []
    };
    this.options = this.extend(options, defaultOptions);
    this.nativeForEach = Array.prototype.forEach;
    this.nativeMap = Array.prototype.map;
};
Fingerprint2.prototype = {
    extend: function(source, target) {
        if (source == null) { return target; }
        for (var k in source) {
            if(source[k] != null && target[k] !== source[k]) {
                target[k] = source[k];
            }
        }
        return target;
    },
    log: function(msg){
        if(window.console){
            console.log(msg);
        }
    },
    get: function(done){
        var keys = [];
        keys = this.userAgentKey(keys);
        keys = this.languageKey(keys);
        keys = this.colorDepthKey(keys);
        keys = this.pixelRatioKey(keys);
        keys = this.hardwareConcurrencyKey(keys);
        keys = this.screenResolutionKey(keys);
        keys = this.availableScreenResolutionKey(keys);
        keys = this.timezoneOffsetKey(keys);
        keys = this.sessionStorageKey(keys);
        keys = this.localStorageKey(keys);
        keys = this.indexedDbKey(keys);
        keys = this.addBehaviorKey(keys);
        keys = this.openDatabaseKey(keys);
        keys = this.cpuClassKey(keys);
        keys = this.platformKey(keys);
        keys = this.doNotTrackKey(keys);
        keys = this.pluginsKey(keys);
        keys = this.canvasKey(keys);
        keys = this.webglKey(keys);
        keys = this.adBlockKey(keys);
        keys = this.hasLiedLanguagesKey(keys);
        keys = this.hasLiedResolutionKey(keys);
        keys = this.hasLiedOsKey(keys);
        keys = this.hasLiedBrowserKey(keys);
        keys = this.touchSupportKey(keys);
        var that = this;
        this.fontsKey(keys, function(newKeys){
            var values = [];
            that.each(newKeys, function(pair) {
                var value = pair.value;
                if (typeof pair.value.join !== "undefined") {
                    value = pair.value.join(";");
                }
                values.push(value);
            });
            var murmur = that.x64hash128(values.join("~~~"), 31);
            return done(murmur, newKeys);
        });
    },
    userAgentKey: function(keys) {
        if(!this.options.excludeUserAgent) {
            keys.push({key: "user_agent", value: this.getUserAgent()});
        }
        return keys;
    },
    // for tests
    getUserAgent: function(){
        return navigator.userAgent;
    },
    languageKey: function(keys) {
        if(!this.options.excludeLanguage) {
            // IE 9,10 on Windows 10 does not have the `navigator.language` property any longer
            keys.push({ key: "language", value: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "" });
        }
        return keys;
    },
    colorDepthKey: function(keys) {
        if(!this.options.excludeColorDepth) {
            keys.push({key: "color_depth", value: screen.colorDepth || -1});
        }
        return keys;
    },
    pixelRatioKey: function(keys) {
        if(!this.options.excludePixelRatio) {
            keys.push({key: "pixel_ratio", value: this.getPixelRatio()});
        }
        return keys;
    },
    getPixelRatio: function() {
        return window.devicePixelRatio || "";
    },
    screenResolutionKey: function(keys) {
        if(!this.options.excludeScreenResolution) {
            return this.getScreenResolution(keys);
        }
        return keys;
    },
    getScreenResolution: function(keys) {
        var resolution;
        if(this.options.detectScreenOrientation) {
            resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
        } else {
            resolution = [screen.width, screen.height];
        }
        if(typeof resolution !== "undefined") { // headless browsers
            keys.push({key: "resolution", value: resolution});
        }
        return keys;
    },
    availableScreenResolutionKey: function(keys) {
        if (!this.options.excludeAvailableScreenResolution) {
            return this.getAvailableScreenResolution(keys);
        }
        return keys;
    },
    getAvailableScreenResolution: function(keys) {
        var available;
        if(screen.availWidth && screen.availHeight) {
            if(this.options.detectScreenOrientation) {
                available = (screen.availHeight > screen.availWidth) ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight];
            } else {
                available = [screen.availHeight, screen.availWidth];
            }
        }
        if(typeof available !== "undefined") { // headless browsers
            keys.push({key: "available_resolution", value: available});
        }
        return keys;
    },
    timezoneOffsetKey: function(keys) {
        if(!this.options.excludeTimezoneOffset) {
            keys.push({key: "timezone_offset", value: new Date().getTimezoneOffset()});
        }
        return keys;
    },
    sessionStorageKey: function(keys) {
        if(!this.options.excludeSessionStorage && this.hasSessionStorage()) {
            keys.push({key: "session_storage", value: 1});
        }
        return keys;
    },
    localStorageKey: function(keys) {
        if(!this.options.excludeSessionStorage && this.hasLocalStorage()) {
            keys.push({key: "local_storage", value: 1});
        }
        return keys;
    },
    indexedDbKey: function(keys) {
        if(!this.options.excludeIndexedDB && this.hasIndexedDB()) {
            keys.push({key: "indexed_db", value: 1});
        }
        return keys;
    },
    addBehaviorKey: function(keys) {
        //body might not be defined at this point or removed programmatically
        if(document.body && !this.options.excludeAddBehavior && document.body.addBehavior) {
            keys.push({key: "add_behavior", value: 1});
        }
        return keys;
    },
    openDatabaseKey: function(keys) {
        if(!this.options.excludeOpenDatabase && window.openDatabase) {
            keys.push({key: "open_database", value: 1});
        }
        return keys;
    },
    cpuClassKey: function(keys) {
        if(!this.options.excludeCpuClass) {
            keys.push({key: "cpu_class", value: this.getNavigatorCpuClass()});
        }
        return keys;
    },
    platformKey: function(keys) {
        if(!this.options.excludePlatform) {
            keys.push({key: "navigator_platform", value: this.getNavigatorPlatform()});
        }
        return keys;
    },
    doNotTrackKey: function(keys) {
        if(!this.options.excludeDoNotTrack) {
            keys.push({key: "do_not_track", value: this.getDoNotTrack()});
        }
        return keys;
    },
    canvasKey: function(keys) {
        if(!this.options.excludeCanvas && this.isCanvasSupported()) {
            keys.push({key: "canvas", value: this.getCanvasFp()});
        }
        return keys;
    },
    webglKey: function(keys) {
        if(this.options.excludeWebGL) {
            if(typeof NODEBUG === "undefined"){
                this.log("Skipping WebGL fingerprinting per excludeWebGL configuration option");
            }
            return keys;
        }
        if(!this.isWebGlSupported()) {
            if(typeof NODEBUG === "undefined"){
                this.log("Skipping WebGL fingerprinting because it is not supported in this browser");
            }
            return keys;
        }
        keys.push({key: "webgl", value: this.getWebglFp()});
        return keys;
    },
    adBlockKey: function(keys){
        if(!this.options.excludeAdBlock) {
            keys.push({key: "adblock", value: this.getAdBlock()});
        }
        return keys;
    },
    hasLiedLanguagesKey: function(keys){
        if(!this.options.excludeHasLiedLanguages){
            keys.push({key: "has_lied_languages", value: this.getHasLiedLanguages()});
        }
        return keys;
    },
    hasLiedResolutionKey: function(keys){
        if(!this.options.excludeHasLiedResolution){
            keys.push({key: "has_lied_resolution", value: this.getHasLiedResolution()});
        }
        return keys;
    },
    hasLiedOsKey: function(keys){
        if(!this.options.excludeHasLiedOs){
            keys.push({key: "has_lied_os", value: this.getHasLiedOs()});
        }
        return keys;
    },
    hasLiedBrowserKey: function(keys){
        if(!this.options.excludeHasLiedBrowser){
            keys.push({key: "has_lied_browser", value: this.getHasLiedBrowser()});
        }
        return keys;
    },
    fontsKey: function(keys, done) {
        if (this.options.excludeJsFonts) {
            return this.flashFontsKey(keys, done);
        }
        return this.jsFontsKey(keys, done);
    },
    // flash fonts (will increase fingerprinting time 20X to ~ 130-150ms)
    flashFontsKey: function(keys, done) {
        if(this.options.excludeFlashFonts) {
            if(typeof NODEBUG === "undefined"){
                this.log("Skipping flash fonts detection per excludeFlashFonts configuration option");
            }
            return done(keys);
        }
        // we do flash if swfobject is loaded
        if(!this.hasSwfObjectLoaded()){
            if(typeof NODEBUG === "undefined"){
                this.log("Swfobject is not detected, Flash fonts enumeration is skipped");
            }
            return done(keys);
        }
        if(!this.hasMinFlashInstalled()){
            if(typeof NODEBUG === "undefined"){
                this.log("Flash is not installed, skipping Flash fonts enumeration");
            }
            return done(keys);
        }
        if(typeof this.options.swfPath === "undefined"){
            if(typeof NODEBUG === "undefined"){
                this.log("To use Flash fonts detection, you must pass a valid swfPath option, skipping Flash fonts enumeration");
            }
            return done(keys);
        }
        this.loadSwfAndDetectFonts(function(fonts){
            keys.push({key: "swf_fonts", value: fonts.join(";")});
            done(keys);
        });
    },
    // kudos to http://www.lalit.org/lab/javascript-css-font-detect/
    jsFontsKey: function(keys, done) {
        var that = this;
        // doing js fonts detection in a pseudo-async fashion
        return setTimeout(function(){

            // a font will be compared against all the three default fonts.
            // and if it doesn't match all 3 then that font is not available.
            var baseFonts = ["monospace", "sans-serif", "serif"];

            var fontList = [
                "Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
                "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
                "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
                "Garamond", "Geneva", "Georgia",
                "Helvetica", "Helvetica Neue",
                "Impact",
                "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
                "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
                "Palatino", "Palatino Linotype",
                "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
                "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
                "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
            ];
            var extendedFontList = [
                "Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter",
                "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER",
                "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
                "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
                "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed",
                "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara",
                "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
                "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
                "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark",
                "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
                "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte",
                "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
                "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT",
                "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
                "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV",
                "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
                "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
                "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
                "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
                "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
                "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti",
                "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli",
                "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
                "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
                "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
                "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
                "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
                "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
                "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
                "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin",
                "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];

            if(that.options.extendedJsFonts) {
                fontList = fontList.concat(extendedFontList);
            }

            fontList = fontList.concat(that.options.userDefinedFonts);

            //we use m or w because these two characters take up the maximum width.
            // And we use a LLi so that the same matching fonts can get separated
            var testString = "mmmmmmmmmmlli";

            //we test using 72px font size, we may use any size. I guess larger the better.
            var testSize = "72px";

            var h = document.getElementsByTagName("body")[0];

            // div to load spans for the base fonts
            var baseFontsDiv = document.createElement("div");

            // div to load spans for the fonts to detect
            var fontsDiv = document.createElement("div");

            var defaultWidth = {};
            var defaultHeight = {};

            // creates a span where the fonts will be loaded
            var createSpan = function() {
                var s = document.createElement("span");
                /*
                 * We need this css as in some weird browser this
                 * span elements shows up for a microSec which creates a
                 * bad user experience
                 */
                s.style.position = "absolute";
                s.style.left = "-9999px";
                s.style.fontSize = testSize;
                s.style.lineHeight = "normal";
                s.innerHTML = testString;
                return s;
            };

            // creates a span and load the font to detect and a base font for fallback
            var createSpanWithFonts = function(fontToDetect, baseFont) {
                var s = createSpan();
                s.style.fontFamily = "'" + fontToDetect + "'," + baseFont;
                return s;
            };

            // creates spans for the base fonts and adds them to baseFontsDiv
            var initializeBaseFontsSpans = function() {
                var spans = [];
                for (var index = 0, length = baseFonts.length; index < length; index++) {
                    var s = createSpan();
                    s.style.fontFamily = baseFonts[index];
                    baseFontsDiv.appendChild(s);
                    spans.push(s);
                }
                return spans;
            };

            // creates spans for the fonts to detect and adds them to fontsDiv
            var initializeFontsSpans = function() {
                var spans = {};
                for(var i = 0, l = fontList.length; i < l; i++) {
                    var fontSpans = [];
                    for(var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
                        var s = createSpanWithFonts(fontList[i], baseFonts[j]);
                        fontsDiv.appendChild(s);
                        fontSpans.push(s);
                    }
                    spans[fontList[i]] = fontSpans; // Stores {fontName : [spans for that font]}
                }
                return spans;
            };

            // checks if a font is available
            var isFontAvailable = function(fontSpans) {
                var detected = false;
                for(var i = 0; i < baseFonts.length; i++) {
                    detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]]);
                    if(detected) {
                        return detected;
                    }
                }
                return detected;
            };

            // create spans for base fonts
            var baseFontsSpans = initializeBaseFontsSpans();

            // add the spans to the DOM
            h.appendChild(baseFontsDiv);

            // get the default width for the three base fonts
            for (var index = 0, length = baseFonts.length; index < length; index++) {
                defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
                defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
            }

            // create spans for fonts to detect
            var fontsSpans = initializeFontsSpans();

            // add all the spans to the DOM
            h.appendChild(fontsDiv);

            // check available fonts
            var available = [];
            for(var i = 0, l = fontList.length; i < l; i++) {
                if(isFontAvailable(fontsSpans[fontList[i]])) {
                    available.push(fontList[i]);
                }
            }

            // remove spans from DOM
            h.removeChild(fontsDiv);
            h.removeChild(baseFontsDiv);

            keys.push({key: "js_fonts", value: available});
            done(keys);
        }, 1);
    },
    pluginsKey: function(keys) {
        if(!this.options.excludePlugins){
            if(this.isIE()){
                if(!this.options.excludeIEPlugins) {
                    keys.push({key: "ie_plugins", value: this.getIEPlugins()});
                }
            } else {
                keys.push({key: "regular_plugins", value: this.getRegularPlugins()});
            }
        }
        return keys;
    },
    getRegularPlugins: function () {
        var plugins = [];
        for(var i = 0, l = navigator.plugins.length; i < l; i++) {
            plugins.push(navigator.plugins[i]);
        }
        // sorting plugins only for those user agents, that we know randomize the plugins
        // every time we try to enumerate them
        if(this.pluginsShouldBeSorted()) {
            plugins = plugins.sort(function(a, b) {
                if(a.name > b.name){ return 1; }
                if(a.name < b.name){ return -1; }
                return 0;
            });
        }
        return this.map(plugins, function (p) {
            var mimeTypes = this.map(p, function(mt){
                return [mt.type, mt.suffixes].join("~");
            }).join(",");
            return [p.name, p.description, mimeTypes].join("::");
        }, this);
    },
    getIEPlugins: function () {
        var result = [];
        if((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject")) || ("ActiveXObject" in window)) {
            var names = [
                "AcroPDF.PDF", // Adobe PDF reader 7+
                "Adodb.Stream",
                "AgControl.AgControl", // Silverlight
                "DevalVRXCtrl.DevalVRXCtrl.1",
                "MacromediaFlashPaper.MacromediaFlashPaper",
                "Msxml2.DOMDocument",
                "Msxml2.XMLHTTP",
                "PDF.PdfCtrl", // Adobe PDF reader 6 and earlier, brrr
                "QuickTime.QuickTime", // QuickTime
                "QuickTimeCheckObject.QuickTimeCheck.1",
                "RealPlayer",
                "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
                "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
                "Scripting.Dictionary",
                "SWCtl.SWCtl", // ShockWave player
                "Shell.UIHelper",
                "ShockwaveFlash.ShockwaveFlash", //flash plugin
                "Skype.Detection",
                "TDCCtl.TDCCtl",
                "WMPlayer.OCX", // Windows media player
                "rmocx.RealPlayer G2 Control",
                "rmocx.RealPlayer G2 Control.1"
            ];
            // starting to detect plugins in IE
            result = this.map(names, function(name) {
                try {
                    new ActiveXObject(name); // eslint-disable-no-new
                    return name;
                } catch(e) {
                    return null;
                }
            });
        }
        if(navigator.plugins) {
            result = result.concat(this.getRegularPlugins());
        }
        return result;
    },
    pluginsShouldBeSorted: function () {
        var should = false;
        for(var i = 0, l = this.options.sortPluginsFor.length; i < l; i++) {
            var re = this.options.sortPluginsFor[i];
            if(navigator.userAgent.match(re)) {
                should = true;
                break;
            }
        }
        return should;
    },
    touchSupportKey: function (keys) {
        if(!this.options.excludeTouchSupport){
            keys.push({key: "touch_support", value: this.getTouchSupport()});
        }
        return keys;
    },
    hardwareConcurrencyKey: function(keys){
        if(!this.options.excludeHardwareConcurrency){
            keys.push({key: "hardware_concurrency", value: this.getHardwareConcurrency()});
        }
        return keys;
    },
    hasSessionStorage: function () {
        try {
            return !!window.sessionStorage;
        } catch(e) {
            return true; // SecurityError when referencing it means it exists
        }
    },
    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    hasLocalStorage: function () {
        try {
            return !!window.localStorage;
        } catch(e) {
            return true; // SecurityError when referencing it means it exists
        }
    },
    hasIndexedDB: function (){
        try {
            return !!window.indexedDB;
        } catch(e) {
            return true; // SecurityError when referencing it means it exists
        }
    },
    getHardwareConcurrency: function(){
        if(navigator.hardwareConcurrency){
            return navigator.hardwareConcurrency;
        }
        return "unknown";
    },
    getNavigatorCpuClass: function () {
        if(navigator.cpuClass){
            return navigator.cpuClass;
        } else {
            return "unknown";
        }
    },
    getNavigatorPlatform: function () {
        if(navigator.platform) {
            return navigator.platform;
        } else {
            return "unknown";
        }
    },
    getDoNotTrack: function () {
        if(navigator.doNotTrack) {
            return navigator.doNotTrack;
        } else if (navigator.msDoNotTrack) {
            return navigator.msDoNotTrack;
        } else if (window.doNotTrack) {
            return window.doNotTrack;
        } else {
            return "unknown";
        }
    },
    // This is a crude and primitive touch screen detection.
    // It's not possible to currently reliably detect the  availability of a touch screen
    // with a JS, without actually subscribing to a touch event.
    // http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
    // https://github.com/Modernizr/Modernizr/issues/548
    // method returns an array of 3 values:
    // maxTouchPoints, the success or failure of creating a TouchEvent,
    // and the availability of the 'ontouchstart' property
    getTouchSupport: function () {
        var maxTouchPoints = 0;
        var touchEvent = false;
        if(typeof navigator.maxTouchPoints !== "undefined") {
            maxTouchPoints = navigator.maxTouchPoints;
        } else if (typeof navigator.msMaxTouchPoints !== "undefined") {
            maxTouchPoints = navigator.msMaxTouchPoints;
        }
        try {
            document.createEvent("TouchEvent");
            touchEvent = true;
        } catch(_) { /* squelch */ }
        var touchStart = "ontouchstart" in window;
        return [maxTouchPoints, touchEvent, touchStart];
    },
    // https://www.browserleaks.com/canvas#how-does-it-work
    getCanvasFp: function() {
        var result = [];
        // Very simple now, need to make it more complex (geo shapes etc)
        var canvas = document.createElement("canvas");
        canvas.width = 2000;
        canvas.height = 200;
        canvas.style.display = "inline";
        var ctx = canvas.getContext("2d");
        // detect browser support of canvas winding
        // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
        // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
        ctx.rect(0, 0, 10, 10);
        ctx.rect(2, 2, 6, 6);
        result.push("canvas winding:" + ((ctx.isPointInPath(5, 5, "evenodd") === false) ? "yes" : "no"));

        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        // https://github.com/Valve/fingerprintjs2/issues/66
        if(this.options.dontUseFakeFontInCanvas) {
            ctx.font = "11pt Arial";
        } else {
            ctx.font = "11pt no-real-font-123";
        }
        ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.2)";
        ctx.font = "18pt Arial";
        ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

        // canvas blending
        // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
        // http://jsfiddle.net/NDYV8/16/
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = "rgb(255,0,255)";
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgb(0,255,255)";
        ctx.beginPath();
        ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgb(255,255,0)";
        ctx.beginPath();
        ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgb(255,0,255)";
        // canvas winding
        // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
        // http://jsfiddle.net/NDYV8/19/
        ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
        ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
        ctx.fill("evenodd");

        result.push("canvas fp:" + canvas.toDataURL());
        return result.join("~");
    },

    getWebglFp: function() {
        var gl;
        var fa2s = function(fa) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            return "[" + fa[0] + ", " + fa[1] + "]";
        };
        var maxAnisotropy = function(gl) {
            var anisotropy, ext = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
            return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
        };
        gl = this.getWebglCanvas();
        if(!gl) { return null; }
        // WebGL fingerprinting is a combination of techniques, found in MaxMind antifraud script & Augur fingerprinting.
        // First it draws a gradient object with shaders and convers the image to the Base64 string.
        // Then it enumerates all WebGL extensions & capabilities and appends them to the Base64 string, resulting in a huge WebGL string, potentially very unique on each device
        // Since iOS supports webgl starting from version 8.1 and 8.1 runs on several graphics chips, the results may be different across ios devices, but we need to verify it.
        var result = [];
        var vShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
        var fShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        var vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        vertexPosBuffer.itemSize = 3;
        vertexPosBuffer.numItems = 3;
        var program = gl.createProgram(), vshader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vshader, vShaderTemplate);
        gl.compileShader(vshader);
        var fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fshader, fShaderTemplate);
        gl.compileShader(fshader);
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        gl.linkProgram(program);
        gl.useProgram(program);
        program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
        program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
        gl.enableVertexAttribArray(program.vertexPosArray);
        gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
        gl.uniform2f(program.offsetUniform, 1, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
        if (gl.canvas != null) { result.push(gl.canvas.toDataURL()); }
        result.push("extensions:" + gl.getSupportedExtensions().join(";"));
        result.push("webgl aliased line width range:" + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
        result.push("webgl aliased point size range:" + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
        result.push("webgl alpha bits:" + gl.getParameter(gl.ALPHA_BITS));
        result.push("webgl antialiasing:" + (gl.getContextAttributes().antialias ? "yes" : "no"));
        result.push("webgl blue bits:" + gl.getParameter(gl.BLUE_BITS));
        result.push("webgl depth bits:" + gl.getParameter(gl.DEPTH_BITS));
        result.push("webgl green bits:" + gl.getParameter(gl.GREEN_BITS));
        result.push("webgl max anisotropy:" + maxAnisotropy(gl));
        result.push("webgl max combined texture image units:" + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
        result.push("webgl max cube map texture size:" + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
        result.push("webgl max fragment uniform vectors:" + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
        result.push("webgl max render buffer size:" + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
        result.push("webgl max texture image units:" + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
        result.push("webgl max texture size:" + gl.getParameter(gl.MAX_TEXTURE_SIZE));
        result.push("webgl max varying vectors:" + gl.getParameter(gl.MAX_VARYING_VECTORS));
        result.push("webgl max vertex attribs:" + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
        result.push("webgl max vertex texture image units:" + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
        result.push("webgl max vertex uniform vectors:" + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
        result.push("webgl max viewport dims:" + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
        result.push("webgl red bits:" + gl.getParameter(gl.RED_BITS));
        result.push("webgl renderer:" + gl.getParameter(gl.RENDERER));
        result.push("webgl shading language version:" + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
        result.push("webgl stencil bits:" + gl.getParameter(gl.STENCIL_BITS));
        result.push("webgl vendor:" + gl.getParameter(gl.VENDOR));
        result.push("webgl version:" + gl.getParameter(gl.VERSION));

        try {
            // Add the unmasked vendor and unmasked renderer if the debug_renderer_info extension is available
            var extensionDebugRendererInfo = gl.getExtension("WEBGL_debug_renderer_info");
            if (!extensionDebugRendererInfo) {
                if (typeof NODEBUG === "undefined") {
                    this.log("WebGL fingerprinting is incomplete, because your browser does not have the extension WEBGL_debug_renderer_info");
                }
            } else {
                result.push("webgl unmasked vendor:" + gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL));
                result.push("webgl unmasked renderer:" + gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL));
            }
        } catch(e) { /* squelch */ }

        if (!gl.getShaderPrecisionFormat) {
            if (typeof NODEBUG === "undefined") {
                this.log("WebGL fingerprinting is incomplete, because your browser does not support getShaderPrecisionFormat");
            }
            return result.join("~");
        }

        result.push("webgl vertex shader high float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision);
        result.push("webgl vertex shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMin);
        result.push("webgl vertex shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMax);
        result.push("webgl vertex shader medium float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision);
        result.push("webgl vertex shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
        result.push("webgl vertex shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
        result.push("webgl vertex shader low float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).precision);
        result.push("webgl vertex shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMin);
        result.push("webgl vertex shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMax);
        result.push("webgl fragment shader high float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision);
        result.push("webgl fragment shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMin);
        result.push("webgl fragment shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMax);
        result.push("webgl fragment shader medium float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision);
        result.push("webgl fragment shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
        result.push("webgl fragment shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
        result.push("webgl fragment shader low float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).precision);
        result.push("webgl fragment shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMin);
        result.push("webgl fragment shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMax);
        result.push("webgl vertex shader high int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).precision);
        result.push("webgl vertex shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMin);
        result.push("webgl vertex shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMax);
        result.push("webgl vertex shader medium int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).precision);
        result.push("webgl vertex shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMin);
        result.push("webgl vertex shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMax);
        result.push("webgl vertex shader low int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).precision);
        result.push("webgl vertex shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMin);
        result.push("webgl vertex shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMax);
        result.push("webgl fragment shader high int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).precision);
        result.push("webgl fragment shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMin);
        result.push("webgl fragment shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMax);
        result.push("webgl fragment shader medium int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).precision);
        result.push("webgl fragment shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMin);
        result.push("webgl fragment shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMax);
        result.push("webgl fragment shader low int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).precision);
        result.push("webgl fragment shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMin);
        result.push("webgl fragment shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMax);
        return result.join("~");
    },
    getAdBlock: function(){
        var ads = document.createElement("div");
        ads.innerHTML = "&nbsp;";
        ads.className = "adsbox";
        var result = false;
        try {
            // body may not exist, that's why we need try/catch
            document.body.appendChild(ads);
            result = document.getElementsByClassName("adsbox")[0].offsetHeight === 0;
            document.body.removeChild(ads);
        } catch (e) {
            result = false;
        }
        return result;
    },
    getHasLiedLanguages: function(){
        //We check if navigator.language is equal to the first language of navigator.languages
        if(typeof navigator.languages !== "undefined"){
            try {
                var firstLanguages = navigator.languages[0].substr(0, 2);
                if(firstLanguages !== navigator.language.substr(0, 2)){
                    return true;
                }
            } catch(err) {
                return true;
            }
        }
        return false;
    },
    getHasLiedResolution: function(){
        if(screen.width < screen.availWidth){
            return true;
        }
        if(screen.height < screen.availHeight){
            return true;
        }
        return false;
    },
    getHasLiedOs: function(){
        var userAgent = navigator.userAgent.toLowerCase();
        var oscpu = navigator.oscpu;
        var platform = navigator.platform.toLowerCase();
        var os;
        //We extract the OS from the user agent (respect the order of the if else if statement)
        if(userAgent.indexOf("windows phone") >= 0){
            os = "Windows Phone";
        } else if(userAgent.indexOf("win") >= 0){
            os = "Windows";
        } else if(userAgent.indexOf("android") >= 0){
            os = "Android";
        } else if(userAgent.indexOf("linux") >= 0){
            os = "Linux";
        } else if(userAgent.indexOf("iphone") >= 0 || userAgent.indexOf("ipad") >= 0 ){
            os = "iOS";
        } else if(userAgent.indexOf("mac") >= 0){
            os = "Mac";
        } else{
            os = "Other";
        }
        // We detect if the person uses a mobile device
        var mobileDevice;
        if (("ontouchstart" in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0)) {
            mobileDevice = true;
        } else{
            mobileDevice = false;
        }

        if(mobileDevice && os !== "Windows Phone" && os !== "Android" && os !== "iOS" && os !== "Other"){
            return true;
        }

        // We compare oscpu with the OS extracted from the UA
        if(typeof oscpu !== "undefined"){
            oscpu = oscpu.toLowerCase();
            if(oscpu.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
                return true;
            } else if(oscpu.indexOf("linux") >= 0 && os !== "Linux" && os !== "Android"){
                return true;
            } else if(oscpu.indexOf("mac") >= 0 && os !== "Mac" && os !== "iOS"){
                return true;
            } else if(oscpu.indexOf("win") === 0 && oscpu.indexOf("linux") === 0 && oscpu.indexOf("mac") >= 0 && os !== "other"){
                return true;
            }
        }

        //We compare platform with the OS extracted from the UA
        if(platform.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
            return true;
        } else if((platform.indexOf("linux") >= 0 || platform.indexOf("android") >= 0 || platform.indexOf("pike") >= 0) && os !== "Linux" && os !== "Android"){
            return true;
        } else if((platform.indexOf("mac") >= 0 || platform.indexOf("ipad") >= 0 || platform.indexOf("ipod") >= 0 || platform.indexOf("iphone") >= 0) && os !== "Mac" && os !== "iOS"){
            return true;
        } else if(platform.indexOf("win") === 0 && platform.indexOf("linux") === 0 && platform.indexOf("mac") >= 0 && os !== "other"){
            return true;
        }

        if(typeof navigator.plugins === "undefined" && os !== "Windows" && os !== "Windows Phone"){
            //We are are in the case where the person uses ie, therefore we can infer that it's windows
            return true;
        }

        return false;
    },
    getHasLiedBrowser: function () {
        var userAgent = navigator.userAgent.toLowerCase();
        var productSub = navigator.productSub;

        //we extract the browser from the user agent (respect the order of the tests)
        var browser;
        if(userAgent.indexOf("firefox") >= 0){
            browser = "Firefox";
        } else if(userAgent.indexOf("opera") >= 0 || userAgent.indexOf("opr") >= 0){
            browser = "Opera";
        } else if(userAgent.indexOf("chrome") >= 0){
            browser = "Chrome";
        } else if(userAgent.indexOf("safari") >= 0){
            browser = "Safari";
        } else if(userAgent.indexOf("trident") >= 0){
            browser = "Internet Explorer";
        } else{
            browser = "Other";
        }

        if((browser === "Chrome" || browser === "Safari" || browser === "Opera") && productSub !== "20030107"){
            return true;
        }

        var tempRes = eval.toString().length;
        if(tempRes === 37 && browser !== "Safari" && browser !== "Firefox" && browser !== "Other"){
            return true;
        } else if(tempRes === 39 && browser !== "Internet Explorer" && browser !== "Other"){
            return true;
        } else if(tempRes === 33 && browser !== "Chrome" && browser !== "Opera" && browser !== "Other"){
            return true;
        }

        //We create an error to see how it is handled
        var errFirefox;
        try {
            throw "a";
        } catch(err){
            try{
                err.toSource();
                errFirefox = true;
            } catch(errOfErr){
                errFirefox = false;
            }
        }
        if(errFirefox && browser !== "Firefox" && browser !== "Other"){
            return true;
        }
        return false;
    },
    isCanvasSupported: function () {
        var elem = document.createElement("canvas");
        return !!(elem.getContext && elem.getContext("2d"));
    },
    isWebGlSupported: function() {
        // code taken from Modernizr
        if (!this.isCanvasSupported()) {
            return false;
        }

        var canvas = document.createElement("canvas"),
            glContext;

        try {
            glContext = canvas.getContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
        } catch(e) {
            glContext = false;
        }

        return !!window.WebGLRenderingContext && !!glContext;
    },
    isIE: function () {
        if(navigator.appName === "Microsoft Internet Explorer") {
            return true;
        } else if(navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent)) { // IE 11
            return true;
        }
        return false;
    },
    hasSwfObjectLoaded: function(){
        return typeof window.swfobject !== "undefined";
    },
    hasMinFlashInstalled: function () {
        return swfobject.hasFlashPlayerVersion("9.0.0");
    },
    addFlashDivNode: function() {
        var node = document.createElement("div");
        node.setAttribute("id", this.options.swfContainerId);
        document.body.appendChild(node);
    },
    loadSwfAndDetectFonts: function(done) {
        var hiddenCallback = "___fp_swf_loaded";
        window[hiddenCallback] = function(fonts) {
            done(fonts);
        };
        var id = this.options.swfContainerId;
        this.addFlashDivNode();
        var flashvars = { onReady: hiddenCallback};
        var flashparams = { allowScriptAccess: "always", menu: "false" };
        swfobject.embedSWF(this.options.swfPath, id, "1", "1", "9.0.0", false, flashvars, flashparams, {});
    },
    getWebglCanvas: function() {
        var canvas = document.createElement("canvas");
        var gl = null;
        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch(e) { /* squelch */ }
        if (!gl) { gl = null; }
        return gl;
    },
    each: function (obj, iterator, context) {
        if (obj === null) {
            return;
        }
        if (this.nativeForEach && obj.forEach === this.nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === {}) { return; }
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (iterator.call(context, obj[key], key, obj) === {}) { return; }
                }
            }
        }
    },

    map: function(obj, iterator, context) {
        var results = [];
        // Not using strict equality so that this acts as a
        // shortcut to checking for `null` and `undefined`.
        if (obj == null) { return results; }
        if (this.nativeMap && obj.map === this.nativeMap) { return obj.map(iterator, context); }
        this.each(obj, function(value, index, list) {
            results[results.length] = iterator.call(context, value, index, list);
        });
        return results;
    },

    /// MurmurHash3 related functions

    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // added together as a 64bit int (as an array of two 32bit ints).
    //
    x64Add: function(m, n) {
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        var o = [0, 0, 0, 0];
        o[3] += m[3] + n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] + n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] + n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += m[0] + n[0];
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    },

    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // multiplied together as a 64bit int (as an array of two 32bit ints).
    //
    x64Multiply: function(m, n) {
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        var o = [0, 0, 0, 0];
        o[3] += m[3] * n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] * n[3];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[2] += m[3] * n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] * n[3];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[2] * n[2];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[3] * n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    },
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) rotated left by that number of positions.
    //
    x64Rotl: function(m, n) {
        n %= 64;
        if (n === 32) {
            return [m[1], m[0]];
        }
        else if (n < 32) {
            return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
        }
        else {
            n -= 32;
            return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
        }
    },
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) shifted left by that number of positions.
    //
    x64LeftShift: function(m, n) {
        n %= 64;
        if (n === 0) {
            return m;
        }
        else if (n < 32) {
            return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
        }
        else {
            return [m[1] << (n - 32), 0];
        }
    },
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // xored together as a 64bit int (as an array of two 32bit ints).
    //
    x64Xor: function(m, n) {
        return [m[0] ^ n[0], m[1] ^ n[1]];
    },
    //
    // Given a block, returns murmurHash3's final x64 mix of that block.
    // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
    // only place where we need to right shift 64bit ints.)
    //
    x64Fmix: function(h) {
        h = this.x64Xor(h, [0, h[0] >>> 1]);
        h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
        h = this.x64Xor(h, [0, h[0] >>> 1]);
        h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
        h = this.x64Xor(h, [0, h[0] >>> 1]);
        return h;
    },

    //
    // Given a string and an optional seed as an int, returns a 128 bit
    // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
    //
    x64hash128: function (key, seed) {
        key = key || "";
        seed = seed || 0;
        var remainder = key.length % 16;
        var bytes = key.length - remainder;
        var h1 = [0, seed];
        var h2 = [0, seed];
        var k1 = [0, 0];
        var k2 = [0, 0];
        var c1 = [0x87c37b91, 0x114253d5];
        var c2 = [0x4cf5ad43, 0x2745937f];
        for (var i = 0; i < bytes; i = i + 16) {
            k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
            k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
            k1 = this.x64Multiply(k1, c1);
            k1 = this.x64Rotl(k1, 31);
            k1 = this.x64Multiply(k1, c2);
            h1 = this.x64Xor(h1, k1);
            h1 = this.x64Rotl(h1, 27);
            h1 = this.x64Add(h1, h2);
            h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
            k2 = this.x64Multiply(k2, c2);
            k2 = this.x64Rotl(k2, 33);
            k2 = this.x64Multiply(k2, c1);
            h2 = this.x64Xor(h2, k2);
            h2 = this.x64Rotl(h2, 31);
            h2 = this.x64Add(h2, h1);
            h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
        }
        k1 = [0, 0];
        k2 = [0, 0];
        switch(remainder) {
            case 15:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
            case 14:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
            case 13:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
            case 12:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
            case 11:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
            case 10:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
            case 9:
                k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
                k2 = this.x64Multiply(k2, c2);
                k2 = this.x64Rotl(k2, 33);
                k2 = this.x64Multiply(k2, c1);
                h2 = this.x64Xor(h2, k2);
            case 8:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
            case 7:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
            case 6:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
            case 5:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
            case 4:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
            case 3:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
            case 2:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
            case 1:
                k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
                k1 = this.x64Multiply(k1, c1);
                k1 = this.x64Rotl(k1, 31);
                k1 = this.x64Multiply(k1, c2);
                h1 = this.x64Xor(h1, k1);
        }
        h1 = this.x64Xor(h1, [0, key.length]);
        h2 = this.x64Xor(h2, [0, key.length]);
        h1 = this.x64Add(h1, h2);
        h2 = this.x64Add(h2, h1);
        h1 = this.x64Fmix(h1);
        h2 = this.x64Fmix(h2);
        h1 = this.x64Add(h1, h2);
        h2 = this.x64Add(h2, h1);
        return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
    }
};
Fingerprint2.VERSION = "1.5.0";
var values=[
    "",
    "zh-CN",
    24,
    1,
    4,
    "2560;1440",
    "2560;1392",
    -480,
    1,
    1,
    1,
    1,
    "unknown",
    "Win32",
    "unknown",
    "PDF Viewer::Portable Document Format::application/pdf~pdf,text/pdf~pdf;Chrome PDF Viewer::Portable Document Format::application/pdf~pdf,text/pdf~pdf;Chromium PDF Viewer::Portable Document Format::application/pdf~pdf,text/pdf~pdf;Microsoft Edge PDF Viewer::Portable Document Format::application/pdf~pdf,text/pdf~pdf;WebKit built-in PDF::Portable Document Format::application/pdf~pdf,text/pdf~pdf",
    "canvas winding:yes~canvas fp:data:image/png;base64,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ua4737grn73/4pxY+ZpJ53s2yY+T/KhJs31Wnt2hCBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgMACBoS7Q+x5t2jcl+UCvSF98itOSL+7JXV8az3UvTi6aB8A5A5e874znc/vn92ffF5ZNmtbdzL0rzn/SpPnTDFzJCAIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBA4SaCKAr2ft0071ivRuzJ95X/OcSi56sN78/V7l+atle73j0k+dcPePPj9pckpd2zf2ZXmXXnepJmo9HRiEyBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAYOgFqirQ+5q9Z6S/N8m1vfdZr3y240Ru/MSefG3r8owPvf0rAfcn+fSa3bnnW8uSS/vPdP9nkvt77581aTzjvJJ1ikmAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQL0CVRboJ3O3aS86qUi/+uXP5m7/Wz50677c/dDqvHpIl/OvJLdduS0//MaSHF/1+l7KB/rFeZPmySFNLhYBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgRmpUD1BfrJW2nTXprkXUnWJVmduQd3ZO3nJvKRjZdk3bPj6f9/96BWeSLJ5nP353sbHs+WL4/l+MIu77but0l+3aTZMahorkuAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIFRF5hVBfqkMr27ifuaJJcnuSJzt47n8u8eyPt+syDrn1mURf+n1R/oqvHzDuTn1xzJIx99Q46v6W7a/nCSR5JsbdJ0P3sRIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAwIAFZm2BPtm1TTvWK9SvzGsfvSrzuyL9V8/lpp3n54oXLpjRPTx85l/z05WHsun6c3L0msP5+1seTPJQrzCfmNFrGUaAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECMyIwMgX6VFpt2nlJLsvC7Ven2f22HH56Rc5+/EQW730hS55us+zwq7L8mfm5OHn53b2e6L13n3c0exa8lH0XNnlq6Zn5xyVzsuDCXcny3+cvq7pnmf+hSXNsRrZkCAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgUFxjpAr24rgsQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQDUCCvRqViUoAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECJQUUKCX1DWbAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBKoRUKBXsypBCRAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQKCkgAK9pK7ZBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIFCNgAK9mlUJSoAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIlBRToJXXNJkCAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIFqBBTo1axKUAIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoKaBAL6lrNgECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAhUI6BAr2ZVghIgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBASQEFekldswkQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECgGgEFejWrEpQAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIESgoo0Evqmk2AAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAEC1Qgo0KtZlaAECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgUFJAgV5S12wCBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQqEZAgV7NqgQlQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgZICCvSSumYTIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQDUCCvRqViUoAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECJQUUKCX1DWbAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBKoRUKBXsypBCRAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQKCkgAK9pK7ZBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIFCNgAK9mlUJSoAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIlBRToJXXNJkCAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIFqBBTo1axKUAIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoKaBAL6lrNgECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAhUI6BAr2ZVghIgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBASQEFekldswkQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECgGgEFejWrEpQAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIESgoo0Evqmk2AAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAEC1Qgo0KtZlaAECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgUFJAgV5S12wCBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQqEZAgV7NqgQlQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgZICCvSSumYTIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQomozPQAAAqZJREFUIECAQDUCCvRqViUoAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECJQUUKCX1DWbAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBKoRUKBXsypBCRAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQKCkgAK9pK7ZBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIFCNgAK9mlUJSoAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIlBRToJXXNJkCAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIFqBBTo1axKUAIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoKaBAL6lrNgECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAhUI6BAr2ZVghIgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBASQEFekldswkQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECgGgEFejWrEpQAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIESgoo0Evqmk2AAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAEC1Qgo0KtZlaAECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgUFJAgV5S12wCBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQqEZAgV7NqgQlQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgZICCvSSumYTIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQDUCCvRqViUoAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECJQU+DesmBVthOVLwQAAAABJRU5ErkJggg==",
    "data:image/png;base64,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~extensions:ANGLE_instanced_arrays;EXT_blend_minmax;EXT_color_buffer_half_float;EXT_disjoint_timer_query;EXT_float_blend;EXT_frag_depth;EXT_shader_texture_lod;EXT_texture_compression_bptc;EXT_texture_compression_rgtc;EXT_texture_filter_anisotropic;EXT_sRGB;KHR_parallel_shader_compile;OES_element_index_uint;OES_fbo_render_mipmap;OES_standard_derivatives;OES_texture_float;OES_texture_float_linear;OES_texture_half_float;OES_texture_half_float_linear;OES_vertex_array_object;WEBGL_color_buffer_float;WEBGL_compressed_texture_s3tc;WEBGL_compressed_texture_s3tc_srgb;WEBGL_debug_renderer_info;WEBGL_debug_shaders;WEBGL_depth_texture;WEBGL_draw_buffers;WEBGL_lose_context;WEBGL_multi_draw~webgl aliased line width range:[1, 1]~webgl aliased point size range:[1, 1024]~webgl alpha bits:8~webgl antialiasing:yes~webgl blue bits:8~webgl depth bits:24~webgl green bits:8~webgl max anisotropy:16~webgl max combined texture image units:32~webgl max cube map texture size:16384~webgl max fragment uniform vectors:1024~webgl max render buffer size:16384~webgl max texture image units:16~webgl max texture size:16384~webgl max varying vectors:30~webgl max vertex attribs:16~webgl max vertex texture image units:16~webgl max vertex uniform vectors:4095~webgl max viewport dims:[32767, 32767]~webgl red bits:8~webgl renderer:WebKit WebGL~webgl shading language version:WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)~webgl stencil bits:0~webgl vendor:WebKit~webgl version:WebGL 1.0 (OpenGL ES 2.0 Chromium)~webgl unmasked vendor:Google Inc. (NVIDIA)~webgl unmasked renderer:ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)~webgl vertex shader high float precision:23~webgl vertex shader high float precision rangeMin:127~webgl vertex shader high float precision rangeMax:127~webgl vertex shader medium float precision:23~webgl vertex shader medium float precision rangeMin:127~webgl vertex shader medium float precision rangeMax:127~webgl vertex shader low float precision:23~webgl vertex shader low float precision rangeMin:127~webgl vertex shader low float precision rangeMax:127~webgl fragment shader high float precision:23~webgl fragment shader high float precision rangeMin:127~webgl fragment shader high float precision rangeMax:127~webgl fragment shader medium float precision:23~webgl fragment shader medium float precision rangeMin:127~webgl fragment shader medium float precision rangeMax:127~webgl fragment shader low float precision:23~webgl fragment shader low float precision rangeMin:127~webgl fragment shader low float precision rangeMax:127~webgl vertex shader high int precision:0~webgl vertex shader high int precision rangeMin:31~webgl vertex shader high int precision rangeMax:30~webgl vertex shader medium int precision:0~webgl vertex shader medium int precision rangeMin:31~webgl vertex shader medium int precision rangeMax:30~webgl vertex shader low int precision:0~webgl vertex shader low int precision rangeMin:31~webgl vertex shader low int precision rangeMax:30~webgl fragment shader high int precision:0~webgl fragment shader high int precision rangeMin:31~webgl fragment shader high int precision rangeMax:30~webgl fragment shader medium int precision:0~webgl fragment shader medium int precision rangeMin:31~webgl fragment shader medium int precision rangeMax:30~webgl fragment shader low int precision:0~webgl fragment shader low int precision rangeMin:31~webgl fragment shader low int precision rangeMax:30",
    false,
    false,
    false,
    false,
    false,
    "0;false;false",
    "Arial;Arial Black;Arial Narrow;Book Antiqua;Bookman Old Style;Calibri;Cambria;Cambria Math;Century;Century Gothic;Century Schoolbook;Comic Sans MS;Consolas;Courier;Courier New;Garamond;Georgia;Helvetica;Impact;Lucida Bright;Lucida Calligraphy;Lucida Console;Lucida Fax;Lucida Handwriting;Lucida Sans;Lucida Sans Typewriter;Lucida Sans Unicode;Microsoft Sans Serif;Monotype Corsiva;MS Gothic;MS PGothic;MS Reference Sans Serif;MS Sans Serif;MS Serif;Palatino Linotype;Segoe Print;Segoe Script;Segoe UI;Segoe UI Light;Segoe UI Semibold;Segoe UI Symbol;Tahoma;Times;Times New Roman;Trebuchet MS;Verdana;Wingdings;Wingdings 2;Wingdings 3"
]
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
function getFP(){
    var n=getRndInteger(1,37)
    var ua='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.'+n+' (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.'+n+' Edg/107.0.1418.'+getRndInteger(1,42)
    values[0]=ua;
    return Fingerprint2.prototype.x64hash128(values.join("~~~"), 31);
}
//console.log(getFP())