var versi     = 1; 
// $.getScript("http://drmetzskincareshop.com/function.js", function(){ });
// $.getScript("http://localhost/drmetzskincareshop/function.js", function(){ });

var url = "http://localhost/drmetzskincareshop/app/";
var url_admin ="http://localhost/drmetzskincareshop/";

var token         = 'uTtGYkYVpE';
var nama_aplikasi = 'Dr Metz Skincare';
var id_pel  = cek_id_pel();

$(document).ready(function() {
    var id_pel = cek_id_pel();
    buka_halaman('beranda');
    panggil_menu();
});

window.setInterval(function(){
   jml_pesan();
}, 5000);

function jml_item(){
  $.ajax({
    url: url+'/jml_item',
    type: 'POST',
    dataType: 'html',
    data: {id_pel: cek_id_pel()}
  })
  .done(function(data) {
       //var data = JSON.parse(data);
       $('.badge').attr('data-badge',data);
  });
}

function jml_pesan(){
  $.ajax({
    url: url+'/jml_pesan',
    type: 'POST',
    dataType: 'html',
    data: {id_pel: cek_id_pel()}
  })
  .done(function(data) {
       //var data = JSON.parse(data);
       $('#badgepesan').attr('data-badge',data); 
  });
}

function logout() {
    //konfirm logout hapus storage
    var a = confirm("Yakin akan keluar dari akun ini?");
    if (a == true) {
        localStorage.removeItem('id_pel');
        location.reload();
        panggil_menu();
    }
}

function cek_akses_login(){
  $.ajax({
    url: url+'/cek_akses_login',
    type: 'POST',
    dataType: 'html',
    data: {id_pel: cek_id_pel()}
  })
  .done(function(data) {
    	 var data = JSON.parse(data);
       if(data.status=="N"){
         localStorage.removeItem('id_pel');
       }
  });
}

function cek_wajib_login(){
  $.ajax({
    url: url+'/cek_wajib_login',
    type: 'POST',
    dataType: 'html'
  })
  .done(function(data) {
    var data = JSON.parse(data);
        if(data.status=="Y"){
            if(!cek_id_pel()){
              buka_halaman('login');
              $('.bottom').css('display','none');
              $('#menu_kiri').css('display','none');
            }
        }
  });
}

function buka_halaman(nama_file,param_1,param_2,param_3,param_4){
  //panggil id
      for (var i = 1; i < 99999; i++)  window.clearInterval(i);

      if(nama_file=="beranda"){
        $('#isi_halaman').css('padding-bottom','0px');
      }else{
        $('#isi_halaman').css('padding-bottom','50px');
      }

      cek_akses_login();

      var id_device = cek_id_device();//localStorage.getItem('id_device');
      var id_pel    = cek_id_pel();
      $("html, body").animate({ scrollTop: 0 }, "slow");
      $("#loading").show();
      $.ajax({
        //url dan nama file di server
        url:url+'/'+nama_file,
        data: { token:token,param_1:param_1,param_2:param_2,param_3:param_3,param_4:param_4,id_pel:id_pel,id_device:id_device},
        method: 'POST',
      })
      .done(function(data) {
        //masukan data ke elemen class
        if(nama_file=="beranda"){
          cek_wajib_login();
        }
        $("#isi_halaman").html(data);
        jml_item();
        jml_pesan();
        $("#loading").hide();
      })
      .fail(function() {
        //jika gagal tampil gagal konek
        $("#isi_halaman").html("<div class=\"halaman-gagal-konek\">"+
          "<div class=\"koneksi_gagal\">"+
            "<img src=\"image/sedih.gif\"><br>"+
            "Upps.. gagal memuat halaman<br>"+
            "Pastikan terkoneksi dengan jaringan internet<br><br>"+
            "<a class=\"waves-effect waves-light btn\" id=\"tombol_coba_lagi\" onclick=\"location.reload()\">Coba Lagi</a>"+
          "</div>"+
        "</div>");
        //function tombol refresh
        $("#loading").hide();
      })
      .always(function() {
        $("#loading").hide();
      });
}

function panggil_menu(){
  $.ajax({
    url:url+'/menu',
    data: {id_pel:id_pel, status_pel:cek_status_pel()},
    method: 'POST',
  })
  .done(function(data) {
    $("#menu_kiri").html(data);
    $("#loading").hide();
  })
  .fail(function() {
    $("#loading").hide();
  })
  .always(function() {
    $("#loading").hide();
  });
}

function cek_id_pel() {
    var id_pel = localStorage.getItem('id_pel');
    return id_pel;
}

function cek_status_pel() {
    var status_pel = localStorage.getItem('status_pel');
    return status_pel;
}

function cek_id_device() {
    var id_device = localStorage.getItem('id_device');
    if(id_device=="" || id_device==null){
      var id_device = Math.floor((Math.random() * 11111) + 99999);
      localStorage.setItem('id_device',id_device);
    }
    return id_device;
}


// END ALTERNATIVE //

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

function onLoad() {
    document.addEventListener('deviceready', deviceReady, false);


}

function deviceReady() {
    localStorage.setItem('id_device', device.uuid);
    document.addEventListener('backbutton', backButtonCallback, false);

    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

function backButtonCallback() {
   // bb();
   
   var back_halaman = $('#back_halaman').val();
   var param_1      = $('#param_1').val();
   var param_2      = $('#param_2').val();
   var param_3      = $('#param_3').val();
   var param_4      = $('#param_4').val();
   
   if(back_halaman==null){ keluar();return false; } 
   
   if(back_halaman=='cari_produk'){
       cari_produk();
   }else{
       buka_halaman(back_halaman,param_1,param_2,param_3,param_4);
   }
   
}
function bb() {
    /*if (window.location.hash) { // ambil data hash dari url
        $('.halaman').hide(); // hide smua class halaman
        //alert(window.location.hash)
        $('.' + window.location.hash.replace(/^#/, "")).css('display', 'block'); // maka tampilkan halaman berdasarkan hash
    } else {*/
        keluar();
   // }
}

function cari_produk(){
  var kata_kunci = $('#kata_kunci').val();
  if(kata_kunci==""){ $('#kata_kunci').focus(); }
  else{
    buka_halaman('cari_produk',kata_kunci);
  }
}

function keluar(){
        navigator.notification.confirm('Keluar dari aplikasi?', confirmCallback,
        nama_aplikasi,
        'Ok,Cancel');
}

function confirmCallback(buttonIndex) {
    if (buttonIndex == 1) {
        navigator.app.exitApp();
        return true;
    } else {
        return false
    }
}

function louncher_app(url){
	window.open(url, '_system', 'location=no');
}

function download(file_img, Folder_Name, base_download_url, filename) {
//step to request a file system
	$("#loading").show();
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

	function fileSystemSuccess(fileSystem) {
		var download_link = encodeURI(base_download_url+"download.php?img="+file_img);
		ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

		//var directoryEntry = fileSystem.root ;//"///storage/emulated/0/"; // to get root path of directory
		//directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
		//ar rootdir = fileSystem.root;

		var fp = "///storage/emulated/0/"; // Returns Fulpath of local directory

		fp = fp + "/" + "Pictures" + "/" + filename; // fullpath and name of the file which we want to give
		// download function call
		filetransfer(download_link, fp,"Pictures");
	}

	function onDirectorySuccess(parent) {
		// Directory created successfuly
	}

	function onDirectoryFail(error) {
		//Error while creating directory
		alert("Unable to create new directory: " + error.code);
	}

	function fileSystemFail(evt) {
		//Unable to access file system
		alert(evt.target.error.code);
	 }
}

function filetransfer(download_link, fp,Folder_Name) {

var fileTransfer = new FileTransfer();
// File download function with URL and local path

fileTransfer.download(
		download_link,
		fp,
		function(entry) {
            refreshMedia.refresh(fp); // Refresh the image gallery
			alert("Gambar berhasil disimpan, ke direktori "+Folder_Name);
			$("#loading").hide();
		},
		function(error) {
                        window.open(download_link, '_system', 'location=no');
			$("#loading").hide();
		},
		false,
		{
			headers: {
				"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
			}
		}
	);
}

function token_push(){
var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
  if(isAndroid) {

      var push = PushNotification.init({
          android: {
              senderID: "659588743728"
          }
      });

      push.on('registration', function(data) {
          document.getElementById('token_pel').value=data.registrationId;
      });

      push.on('notification', function(data) { });

      push.on('error', function(e) { });
  }
}
