yVehicleInit = function() {
	// Vehicle
    yVehicleGet('vehicle');
	$('#vehicle .filter-button').prop("disabled", true);

	// Brand
    $('select.y-vehicle').on('change', function() {
    	$('select.y-brand, select.y-model').val('').prop("disabled", true).children().remove();
        $('select.y-brand, select.y-model').parent(".filter-select-container").removeClass("loading").addClass("disabled");
        $('#vehicle .filter-button').prop("disabled", true);
        if($('select.y-vehicle').val()){
    	    yVehicleGet('brand');
        }
	});

	// Model
	$('select.y-brand').on('change', function() {
    	$('select.y-model').val('').prop("disabled", true).children().remove().hide();
		$('#vehicle .filter-button').prop("disabled", true);
        $('select.y-model').parent(".filter-select-container").removeClass("loading").addClass("disabled");
        if($('select.y-brand').val()){
            yVehicleGet('model');
        }
	});

	// Year
	$('select.y-model').on('change', function() {
		$('#vehicle .filter-button').prop("disabled", false);
    	yVehicleGet('year');
	});

	$('input.y-year').on('keyup', function() {
		yearAct = $('input.y-year').val();
		$('#vehicle .filter-button').prop("disabled", false);
	});

	yFilterBt();
};

ySearchSelects = function() {
    // urlFilter = $('#urlFilter').val();

    // if (typeof(urlFilter) != "undefined") {

    //     yVehicleSel = $('#vehicle .y-vehicle').prop("disabled", true).select2({
    //         placeholder: urlFilter == 'equipamentos'?'Equipamento':'Veículo'
    //     });
    //     yMakeSel = $('#vehicle .y-brand').prop("disabled", true).select2({
    //         placeholder: 'Marca'
    //     });
    //     yModelSel = $('#vehicle .y-model').prop("disabled", true).select2({
    //         placeholder: 'Modelo'
    //     });

    //     if (urlFilter != 'equipamentos') {
    //         yYearSel = $('#vehicle .y-year').prop("disabled", true).select2({
    //             placeholder: 'Ano'
    //         });
    //     }
	// }
};

yVehicleGet = function(ySelect) {
    urlFilter = $('#urlFilter').val();

	vehicleAct = $('select.y-vehicle').val() == null
	? ''
	: $('select.y-vehicle').val().ySlug();

	brandAct = $('select.y-brand').val() == null
	? ''
	: $('select.y-brand').val().ySlug();

	modelAct = $('select.y-model').val() == null
	? ''
	: $('select.y-model').val().ySlug();

    if (typeof(urlFilter) != "undefined") {

    	yUrl = '/' + urlFilter + '/' + (vehicleAct?vehicleAct+'/':'') + (brandAct?brandAct+'/':'') + (modelAct?modelAct+'/':'') + '?t=' + Date.now();

        $('select.y-'+ySelect).parent(".filter-select-container").removeClass("disabled").addClass("loading");

        $.ajax({
            url: yUrl,
            dataType: 'json',
            // async: false,
            success: function(data) {
                yVehicleConstruct(data, ySelect);
                yFilteredSelects();
            }
        });

	}

};

yVehicleConstruct = function(data, yVehicle) {
	$('select.y-'+yVehicle).prop("disabled", true)
    $('select.y-'+yVehicle).children().remove();
    var yVehiclePlaceholder = $('select.y-'+yVehicle).data("placeholder");

	yVehicleConstructMod(yVehicle,'', yVehiclePlaceholder);
    $.each(data.items, function(i, y) {
        yVehicleConstructMod(yVehicle,y.displayValue,y.displayValue);
    });

    // $('select.y-'+yVehicle).select2({
	// 	placeholder: yVehicle.yName()
	// });

	$('select.y-'+yVehicle).prop("disabled", false)
    $('select.y-'+yVehicle).parent(".filter-select-container").removeClass("disabled").removeClass("loading");
	$('input.y-'+yVehicle).prop("disabled", false)

	//yVehicle != 'vehicle' ? $('select.y-'+yVehicle).select2("open") : null;
};

yVehicleConstructMod = function(yVehicle, yVal, yText) {
	$('select.y-'+yVehicle).append(
	    $('<option>', {
	        value: yVal,
	        text: yText
	    }
    ));
};

String.prototype.ySlug = function() {

	var string = this.toLowerCase().replace(/^\s+|\s+$/g, "");
	var mapaAcentosHex = {
		a : /[\xE0-\xE6]/g, e : /[\xE8-\xEB]/g, i : /[\xEC-\xEF]/g, o : /[\xF2-\xF6]/g, u : /[\xF9-\xFC]/g, c : /\xE7/g, n : /\xF1/g
	};

	for ( var letra in mapaAcentosHex ) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace( expressaoRegular, letra );
	}

	string = string.split(' ').join('-').replace(/\./, '');

	return string;
};

String.prototype.yName = function() {


	string =
	this == 'vehicle' && urlFilter == 'equipamentos' ? 'Equipamento' : 'Veículo'
	this == 'brand' ? 'Marca' :
	this == 'model' ? 'Modelo' :
	this == 'year' ? 'Ano' : '';

	return string;

};

yFilterBt = function() {
	$('#vehicle .filter-button').click(function() {


		if ($('#urlFilter').val() != "equipamentos") {
			if (typeof(yearAct) != "undefined") {
	            var uri = "/busca/veiculo-" + vehicleAct + "/montadora-" + brandAct + "/modelo-" + modelAct + "?ano=" + yearAct;
	        } else {
	            var uri = "/busca/veiculo-" + vehicleAct + "/montadora-" + brandAct + "/modelo-" + modelAct;
			}
		} else {
	        if (typeof(yearAct) != "undefined") {
	            var uri = "/busca/equipamento-" + vehicleAct + "/fabricante-" + brandAct + "/maquina-" + modelAct + "?serial=" + yearAct;
	        } else {
	            var uri = "/busca/equipamento-" + vehicleAct + "/fabricante-" + brandAct + "/maquina-" + modelAct;
			}
		}

        window.location.href = uri

	});
};

$(function() {
	ySearchSelects();
	yVehicleInit();
});
