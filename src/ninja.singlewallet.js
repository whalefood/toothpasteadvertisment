ninja.wallets.singlewallet = {
	open: function () {
		if (document.getElementById("btcaddress").innerHTML == "") {
			ninja.wallets.singlewallet.generateNewAddressAndKey();
		}
		document.getElementById("singlearea").style.display = "block";
	},

	close: function () {
		document.getElementById("singlearea").style.display = "none";
	},

	// generate bitcoin address and private key and update information in the HTML
	generateNewAddressAndKey: function () {
        var canvas = document.getElementById('cvmain');
        bitcom.initializeCanvasWithImage(canvas,
            'backgrounds/Dorian.png',
            function()
            {
                var key = new Bitcoin.ECKey(false);
                var bitcoinAddress = key.getBitcoinAddress();
                var privateKeyWif = key.getBitcoinWalletImportFormat();

                bitcom.printQrCodeOnCanvas(canvas, bitcoinAddress,29,332,219,521);
                bitcom.printQrCodeOnCanvas(canvas, privateKeyWif,1072, 33,1261,221);
                bitcom.printTextOnCanvas(canvas, bitcoinAddress,246,488,736,524 )

            }

        );
        return;
	}
};