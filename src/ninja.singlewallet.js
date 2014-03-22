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
        bitcom.generateWallets(document.getElementById('dvOutput'),bitcom.backgrounds[2],1);
	}
};