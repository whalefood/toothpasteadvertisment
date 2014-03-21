bitcom = (function () {

    var public = {};

// sets up the canvas with an image for background
    public.initializeCanvasWithImage = function (canvas, imgSrc, onDoneCallback) {
        var context = canvas.getContext('2d');
        var backImg = new Image();
        backImg.src = imgSrc;
        backImg.onload = function () {
            canvas.width = this.width;
            canvas.height = this.height;
            canvas.style.width = this.width + 'px';
            canvas.style.height = this.height + 'px';
            context.drawImage(this, 0, 0);
            if (onDoneCallback) {
                return onDoneCallback();
            }
        }
    }

    function initializeCanvasWithImageObj(canvas, imgObj) {

        var context = canvas.getContext('2d');
        canvas.width = imgObj.width;
        canvas.height = imgObj.height;
        canvas.style.width = imgObj.width + 'px';
        canvas.style.height = imgObj.height + 'px';
        context.drawImage(imgObj, 0, 0);
    }

// prints a qr code on a canvas at location x0, y0
    function printQrCodeOnCanvas(canvas, qrstring, x0, y0, x1, y1) {
        var typeNumber = ninja.qrCode.getTypeNumber(qrstring);
        var qrcode = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
        qrcode.addData(qrstring);
        qrcode.make();

        //take the smaller dimention
        var codeSize = Math.abs(x1 - x0);
        if (Math.abs(y1 - y0) < codeSize)
            codeSize = Math.abs(y1 - y0);

        var tileSize = codeSize / qrcode.getModuleCount();

        var ctx = canvas.getContext('2d');

        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                ctx.fillStyle = qrcode.isDark(row, col) ? "#000000" : "#ffffff";
                ctx.fillRect(col * tileSize + x0, row * tileSize + y0, tileSize, tileSize);
            }
        }

    }

//prints text on canvas within a rect
    function printTextOnCanvas(canvas, text, x0, y0, x1, y1) {
        var context = canvas.getContext('2d');

        context.font = '20px Calibri';
        var textHeight = 20;
        var textWidth = context.measureText(text).width;

        var rectWidth = Math.abs(x1 - x0);
        var rectHeight = Math.abs(y1 - y0);

        //make sure text fits
        var baseOffRectHeight = true;
        if (rectHeight / rectWidth > textHeight / textWidth)
            baseOffRectHeight = false;

        var textScl = baseOffRectHeight ? rectHeight / textHeight : rectWidth / textWidth;

        var newTextSize = textScl * textHeight;
        context.font = newTextSize + "px Calibri";

        context.textAlign = 'center';
        context.fillStyle = '#000000';
        context.fillText(text, (x0 + x1) / 2, (y0 + y1) / 2 + newTextSize / 3);

    }


    function printKeysOnCanvas(canvas, backgroundConfig, publicKey, privateKey) {
        var rect;
        if (backgroundConfig.pubQrRect) {
            rect = backgroundConfig.pubQrRect;
            printQrCodeOnCanvas(canvas, publicKey, rect[0], rect[1], rect[2], rect[3]);
        }

        if (backgroundConfig.privQrRect) {
            rect = backgroundConfig.privQrRect;
            printQrCodeOnCanvas(canvas, privateKey, rect[0], rect[1], rect[2], rect[3]);
        }


        if (backgroundConfig.pubTextRect) {
            rect = backgroundConfig.pubTextRect;
            printTextOnCanvas(canvas, publicKey, rect[0], rect[1], rect[2], rect[3]);
        }

        if (backgroundConfig.privTextRect) {
            rect = backgroundConfig.privTextRect;
            printTextOnCanvas(canvas, publicKey, rect[0], rect[1], rect[2], rect[3]);
        }
    }

    public.generateWallets(outputDiv, backgroundConfig, count)
    {
        if (count > 500) {
            alert("Whoa there.  That's a lota wallets.  I don't wanna freeze your computer here. Try something less than 500.")
        }

        var canvi = [];

        for (var cntr = 0; cntr < count; cntr++) {
            canvi[cntr] = document.createElement('canvas');
            outputDiv.appendChild(canvi[cntr]);
            outputDiv.appendChild(document.createElement('br'));
            outputDiv.appendChild(document.createElement('br'));
        }

        var backImg = new Image();
        backImg.src = backgroundConfig.imgSrc;
        backImg.onload = function () {
            for (var cntr = 0; cntr < count; cntr++) {
                var key = new Bitcoin.ECKey(false);
                initializeCanvasWithImageObj(canvi[cntr], this);
                printKeysOnCanvas(canvi[cntr], backgroundConfig, key.getBitcoinAddress(), key.getBitcoinWalletImportFormat());
            }
        }
    }

    return public;
})()