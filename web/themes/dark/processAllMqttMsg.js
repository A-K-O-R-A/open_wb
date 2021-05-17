/**
 * Functions to update graph and gui values via MQTT-messages
 *
 * @author Kevin Wieland
 * @author Michael Ortenstein
 * @author Lutz Bender
 */

var graphrefreshcounter = 0;

var chargemodeTemplate = {};

function getCol(matrix, col){
	var column = [];
	for(var i=0; i<matrix.length; i++){
		column.push(matrix[i][col]);
	}
	return column;
}

function convertToKw(dataColum) {
	var convertedDataColumn = [];
	dataColum.forEach((value) => {
		convertedDataColumn.push(value / 1000);
	});
	return convertedDataColumn;
}

function getIndex(topic) {
	// get occurence of numbers between / / in topic
	// since this is supposed to be the index like in openwb/lp/4/w
	// no lookbehind supported by safari, so workaround with replace needed
	var index = topic.match(/(?:\/)([0-9]+)(?=\/)/g)[0].replace(/[^0-9]+/g, '');
	if ( typeof index === 'undefined' ) {
		index = '';
	}
	return index;
}

function createChargepoint(hierarchy) {
	// console.log(hierarchy);
	if ( hierarchy.id.match(/cp([0-9]+)/g) ){
		var chargepointIndex = hierarchy.id.replace( 'cp', '');
		if( $('.chargepoint-card[data-cp='+chargepointIndex+']').length == 0 ){
			// console.log( "index: "+chargepointIndex);
			if ( typeof chargepointIndex !== 'undefined' && chargepointIndex != 1 ) {
				// console.log("creating chargepoint "+chargepointIndex);
				var sourceElement = $('.chargepoint-card[data-cp=1]');
				// remove checkbox toggle button style as they will not function after cloning
				sourceElement.find('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle('destroy');
				var clonedElement = sourceElement.clone();
				// recreate checkbox toggle button styles in source element
				sourceElement.find('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();
				// update all data referencing the old index in our clone
				clonedElement.attr('data-cp', chargepointIndex).data('cp', chargepointIndex);
				clonedElement.find('.card-header').attr('data-target', '#collapseChargepoint'+chargepointIndex).data('target', '#collapseChargepoint'+chargepointIndex).addClass('collapsed');
				clonedElement.find('.card-body').attr('id', 'collapseChargepoint'+chargepointIndex).removeClass('show');
				clonedElement.find('label[for=minCurrentPvCp1]').attr('for', 'minCurrentPvCp'+chargepointIndex);
				clonedElement.find('#minCurrentPvCp1').attr('id', 'minCurrentPvCp'+chargepointIndex);
				clonedElement.find('label[for=minSocPvCp1]').attr('for', 'minSocPvCp'+chargepointIndex);
				clonedElement.find('#minSocPvCp1').attr('id', 'minSocPvCp'+chargepointIndex);
				clonedElement.find('label[for=maxSocPvCp1]').attr('for', 'maxSocPvCp'+chargepointIndex);
				clonedElement.find('#maxSocPvCp1').attr('id', 'maxSocPvCp'+chargepointIndex);
				clonedElement.find('label[for=minSocCurrentPvCp1]').attr('for', 'minSocCurrentPvCp'+chargepointIndex);
				clonedElement.find('#minSocCurrentPvCp1').attr('id', 'minSocCurrentPvCp'+chargepointIndex);
				clonedElement.find('label[for=currentInstantChargeCp1]').attr('for', 'currentInstantChargeCp'+chargepointIndex);
				clonedElement.find('#currentInstantChargeCp1').attr('id', 'currentInstantChargeCp'+chargepointIndex);
				clonedElement.find('label[for=limitInstantChargeCp1]').attr('for', 'limitInstantChargeCp'+chargepointIndex);
				clonedElement.find('#limitInstantChargeCp1').attr('id', 'limitInstantChargeCp'+chargepointIndex);
				clonedElement.find('label[for=soclimitCp1]').attr('for', 'soclimitCp'+chargepointIndex);
				clonedElement.find('#soclimitCp1').attr('id', 'soclimitCp'+chargepointIndex);
				clonedElement.find('label[for=amountlimitCp1]').attr('for', 'amountlimitCp'+chargepointIndex);
				clonedElement.find('#amountlimitCp1').attr('id', 'amountlimitCp'+chargepointIndex);
				// insert after last existing chargepoint to honor sorting from the array
				target = $('.chargepoint-card[data-cp]').last();
				// console.log("target: "+target.data('cp')+" index: "+chargepointIndex);
				// insert clone into DOM
				clonedElement.insertAfter( $(target) );
				// now get our created element and add checkbox toggle buttons
				chargepointElement = $('.chargepoint-card[data-cp="' + chargepointIndex + '"]');
				chargepointElement.find('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();
			}
		} else {
			console.log("chargepoint '"+chargepointIndex+"' already exists");
		}
	}
	hierarchy.children.forEach(element => {
		createChargepoint(element);
	});
}

function refreshChargetemplate(templateIndex) {
	if( chargemodeTemplate.hasOwnProperty(templateIndex) ) {
		parent = $('.chargepoint-card[data-chargetemplate='+templateIndex+']');
		// time_charging.active
		element = parent.find('.chargepoint-timechargingactive');
		if ( chargemodeTemplate[templateIndex].time_charging.active ) {
			element.bootstrapToggle('on', true);
		}else {
			element.bootstrapToggle('off', true);
		}
		// chargemode.instant_charging.current
		element = parent.find('.chargepoint-instantchargecurrent');
		setInputValue(element.attr('id'), chargemodeTemplate[templateIndex].chargemode.instant_charging.current);
		// chargemode.instant_charging.limit.selected
		element = parent.find('.chargepoint-instantchargelimitselected');
		setToggleBtnGroup(element.attr('id'), chargemodeTemplate[templateIndex].chargemode.instant_charging.limit.selected);
		// chargemode.instant_charging.limit.soc
		element = parent.find('.chargepoint-instantchargelimitsoc');
		setInputValue(element.attr('id'), chargemodeTemplate[templateIndex].chargemode.instant_charging.limit.soc);
		// chargemode.instant_charging.limit.soc
		element = parent.find('.chargepoint-instantchargelimitamount');
		setInputValue(element.attr('id'), chargemodeTemplate[templateIndex].chargemode.instant_charging.limit.amount);
		// chargemode.pv_charging.min_current
		element = parent.find('.chargepoint-pvchargemincurrent');
		setInputValue(element.attr('id'), chargemodeTemplate[templateIndex].chargemode.pv_charging.min_current);
		// chargemode.pv_charging.min_soc
		element = parent.find('.chargepoint-pvchargeminsoc');
		setInputValue(element.attr('id'), chargemodeTemplate[templateIndex].chargemode.pv_charging.min_soc);
		// chargemode.pv_charging.max_soc
		element = parent.find('.chargepoint-pvchargemaxsoc');
		setInputValue(element.attr('id'), chargemodeTemplate[templateIndex].chargemode.pv_charging.max_soc);
		// chargemode.pv_charging.min_soc_current
		element = parent.find('.chargepoint-pvchargeminsoccurrent');
		setInputValue(element.attr('id'), chargemodeTemplate[templateIndex].chargemode.pv_charging.min_soc_current);
		// chargemode.pv_charging.feed_in_limit
		var element = parent.find('.chargepoint-pvchargefeedinlimit');  // now get parents respective child element
		if ( chargemodeTemplate[templateIndex].chargemode.pv_charging.feed_in_limit == 1 ) {
			// element.prop('checked', true);
			element.bootstrapToggle('on', true); // do not fire a changed-event to prevent a loop!
		} else {
			// element.prop('checked', false);
			element.bootstrapToggle('off', true); // do not fire a changed-event to prevent a loop!
		}

	}
}

function handlevar(mqttmsg, mqttpayload) {
	// receives all messages and calls respective function to process them
	// console.log("newmessage: "+mqttmsg+": "+mqttpayload);
	processPreloader(mqttmsg);
	if ( mqttmsg.match( /^openwb\/counter\/0\//i) ) { processEvuMessages(mqttmsg, mqttpayload); } // counter/0 is always EVU
	else if ( mqttmsg.match( /^openwb\/counter\/[0-9]+\//i) ) { /* nothing here yet */ }
	else if ( mqttmsg.match( /^openwb\/counter\//i) ) { processGlobalCounterMessages(mqttmsg, mqttpayload); } // counter/0 is always EVU
	else if ( mqttmsg.match( /^openwb\/bat\//i) ) { processBatteryMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/pv\//i) ) { processPvMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/chargepoint\//i) ) { processChargepointMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/vehicle\//i) ) { processVehicleMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/general\/chargemode_config\/pv_charging\//i) ) { processPvConfigMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/graph\//i ) ) { processGraphMessages(mqttmsg, mqttpayload); }
	// else if ( mqttmsg.match( /^openwb\/global\/awattar\//i) ) { processETProviderMessages(mqttmsg, mqttpayload); }
	// else if ( mqttmsg.match( /^openwb\/global\/ETProvider\//i) ) { processETProviderMessages(mqttmsg, mqttpayload); }
	// else if ( mqttmsg.match( /^openwb\/global\//i) ) { processGlobalMessages(mqttmsg, mqttpayload); }
	// else if ( mqttmsg.match( /^openwb\/system\//i) ) { processSystemMessages(mqttmsg, mqttpayload); }
	// else if ( mqttmsg.match( /^openwb\/verbraucher\//i) ) { processVerbraucherMessages(mqttmsg, mqttpayload); }
	// else if ( mqttmsg.match( /^openwb\/hook\//i) ) { processHookMessages(mqttmsg, mqttpayload); }
	// else if ( mqttmsg.match( /^openwb\/SmartHome\/Devices\//i) ) { processSmartHomeDevicesMessages(mqttmsg, mqttpayload); }
	// else if ( mqttmsg.match( /^openwb\/config\/get\/SmartHome\/Devices\//i) ) { processSmartHomeDevicesConfigMessages(mqttmsg, mqttpayload); }
	// else if ( mqttmsg.match( /^openwb\/config\/get\/sofort\/lp\//i) ) { processSofortConfigMessages(mqttmsg, mqttpayload); }
}  // end handlevar

function processGlobalCounterMessages(mqttmsg, mqttpayload) {
	if ( mqttmsg.match( /^openwb\/counter\/get\/hierarchy$/i ) ) {
		// this topic is used to populate the chargepoint list
		// unsubscribe from other topics relevant for chargepoints
		topicsToSubscribe.forEach((topic) => {
			if ( topic[0].match( /^openwb\/(chargepoint|vehicle)\//i ) ) {
				client.unsubscribe(topic[0]);
			}
		});
		// first remove all chargepoints exept the first
		$('.chargepoint-card[data-cp]').not('[data-cp=1]').remove();
		// now create any other chargepoint
		var hierarchy = JSON.parse(mqttpayload);
		createChargepoint(hierarchy[0]);
		// subscribe to other topics relevant for chargepoints
		topicsToSubscribe.forEach((topic) => {
			if ( topic[0].match( /^openwb\/(chargepoint|vehicle)\//i ) ) {
				client.subscribe(topic[0], {qos: 0});
			}
		});
	}
}

function processEvuMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/counter/0
	// called by handlevar
	if ( mqttmsg == 'openWB/counter/0/get/power_all' ) {
		var unit = 'W';
		var powerEvu = parseInt(mqttpayload, 10);
		if ( isNaN(powerEvu) ) {
			powerEvu = 0;
		}
		var importing = (powerEvu >= 0);
		if ( powerEvu < 0 ) {
			powerEvu *= -1;
		}
		if ( powerEvu > 999 ) {
			powerEvu = (powerEvu / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			unit = 'k'+unit;
		}
		if(importing){
			$('.grid-importing').removeClass('hide');
			$('.grid-exporting').addClass('hide');
		} else {
			$('.grid-exporting').removeClass('hide');
			$('.grid-importing').addClass('hide');
		}
		$('.grid-power').text(powerEvu+' '+unit);
	}
	else if ( mqttmsg == 'openWB/counter/0/get/daily_yield_import') {
		var unit = "Wh";
		var unitPrefix = "k";
		var gridDailyYield = parseFloat(mqttpayload);
		if ( isNaN(gridDailyYield) ) {
			gridDailyYield = 0;
		}
		if ( gridDailyYield > 999 ) {
			gridDailyYield = (gridDailyYield / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			unitPrefix = "M";
		}
		$('.grid-import').text(gridDailyYield+' '+unitPrefix+unit);
	}
	else if ( mqttmsg == 'openWB/counter/0/get/daily_yield_export') {
		var unit = "Wh";
		var unitPrefix = "k";
		var gridDailyYield = parseFloat(mqttpayload);
		if ( isNaN(gridDailyYield) ) {
			gridDailyYield = 0;
		}
		if ( gridDailyYield > 999 ) {
			gridDailyYield = (gridDailyYield / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			unitPrefix = "M";
		}
		$('.grid-export').text(gridDailyYield+' '+unitPrefix+unit);
	}
}

function processBatteryMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/housebattery
	// called by handlevar
	if ( mqttmsg == 'openWB/bat/config/configured' ) {
		if ( mqttpayload == "true" ) {
			$('.housebattery-configured').removeClass('hide');
		} else {
			$('.housebattery-configured').addClass('hide');
		}
	}
	else if ( mqttmsg == 'openWB/bat/get/power' ) {
		var unit = 'W';
		var speicherwatt = parseInt(mqttpayload, 10);
		var charging = (speicherwatt >= 0);
		if ( isNaN(speicherwatt) ) {
			speicherwatt = 0;
		}
		if ( speicherwatt < 0 ) {
			speicherwatt *= -1;
		}
		if ( speicherwatt > 999 ) {
			speicherwatt = (speicherwatt / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			unit = 'k'+unit;
		}
		$('.housebattery-sum-power').text(speicherwatt+' '+unit);
		if(charging == true){
			$('.housebattery-sum-charging').removeClass('hide');
			$('.housebattery-sum-discharging').addClass('hide');
		} else {
			$('.housebattery-sum-discharging').removeClass('hide');
			$('.housebattery-sum-charging').addClass('hide');
		}
	}
	else if ( mqttmsg == 'openWB/bat/get/soc' ) {
		var unit = "%";
		var speicherSoc = parseInt(mqttpayload, 10);
		if ( isNaN(speicherSoc) || speicherSoc < 0 || speicherSoc > 100 ) {
			speicherSoc = '--';
		}
		$('.housebattery-sum-soc').text(speicherSoc+' '+unit);
	}
	else if ( mqttmsg == 'openWB/bat/get/daily_yield_export') {
		var unit = "kWh";
		var batDailyYield = parseFloat(mqttpayload);
		if ( isNaN(batDailyYield) ) {
			batDailyYield = 0;
		}
		var batDailyYieldStr = "--";
		if ( batDailyYield >= 0 ) {
			batDailyYieldStr = batDailyYield.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		}
		$('.housebattery-sum-import').text(batDailyYieldStr+' '+unit);
	}
	else if ( mqttmsg == 'openWB/bat/get/daily_yield_import') {
		var unit = "kWh";
		var batDailyYield = parseFloat(mqttpayload);
		if ( isNaN(batDailyYield) ) {
			batDailyYield = 0;
		}
		var batDailyYieldStr = "--";
		if ( batDailyYield >= 0 ) {
			batDailyYieldStr = batDailyYield.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		}
		$('.housebattery-sum-export').text(batDailyYieldStr+' '+unit);
	}
}

function processPvMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/pv
	// called by handlevar
	if ( mqttmsg == 'openWB/pv/config/configured' ) {
		if ( mqttpayload == "true" ) {
			$('.pv-configured').removeClass('hide');
		} else {
			$('.pv-configured').addClass('hide');
		}
	}
	else if ( mqttmsg == 'openWB/pv/get/power') {
		var unit = 'W';
		var unitPrefix = '';
		var pvwatt = parseInt(mqttpayload, 10);
		if ( isNaN(pvwatt) ) {
			pvwatt = 0;
		}
		if ( pvwatt <= 0){
			// production is negative for calculations so adjust for display
			pvwatt *= -1;
		}
		// adjust and add unit
		if (pvwatt > 999) {
			pvwatt = (pvwatt / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			unitPrefix = 'k'
		}
		$('.pv-sum-power').text(pvwatt+' '+unitPrefix+unit);
	}
	else if ( mqttmsg == 'openWB/pv/get/daily_yield') {
		var unit = "Wh";
		var unitPrefix = "k";
		var pvDailyYield = parseFloat(mqttpayload);
		if ( isNaN(pvDailyYield) ) {
			pvDailyYield = 0;
		}
		if ( pvDailyYield > 999 ) {
			pvDailyYield = (pvDailyYield / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			unitPrefix = "M";
		}
		$('.pv-sum-production').text(pvDailyYield+' '+unitPrefix+unit);
	}
	// else if ( mqttmsg == 'openWB/pv/bool70PVDynStatus') {
	// 	switch (mqttpayload) {
	// 		case '0':
	// 			// deaktiviert
	// 			$('#70PvBtn').removeClass('btn-success');
	// 			break;
	// 		case '1':
	// 			// ev priority
	// 			$('#70PvBtn').addClass('btn-success');
	// 		break;
	// 	}
	// }
}

function processPvConfigMessages(mqttmsg, mqttpayload) {
	if ( mqttmsg == 'openWB/general/chargemode_config/pv_charging/bat_prio' ) {
		// console.log("pv config: bat_prio");
		var element = $('.housebattery-priority');
		if ( mqttpayload == 1 ) {
			// element.prop('checked', true);
			element.bootstrapToggle('on', true); // do not fire a changed-event to prevent a loop!
		} else {
			// element.prop('checked', false);
			element.bootstrapToggle('off', true); // do not fire a changed-event to prevent a loop!
		}
	}
	// else if ( mqttmsg == 'openWB/config/get/pv/nurpv70dynact' ) {
	// 	//  and sets icon in mode select button
	// 	switch (mqttpayload) {
	// 		case '0':
	// 			// deaktiviert
	// 			$('#70ModeBtn').addClass('hide');
	// 			break;
	// 		case '1':
	// 			// activiert
	// 			$('#70ModeBtn').removeClass('hide');
	// 		break;
	// 	}
	// }
	// else if ( mqttmsg == 'openWB/config/get/pv/minCurrentMinPv' ) {
	// 	setInputValue('minCurrentMinPv', mqttpayload);
	// }
}

function processChargepointMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/chargepoint
	// called by handlevar
	if ( mqttmsg == 'openWB/chargepoint/get/power_all') {
		var unit = "W";
		var unitPrefix = "";
		var powerAllLp = parseInt(mqttpayload, 10);
		if ( isNaN(powerAllLp) ) {
			powerAllLp = 0;
		}
		if (powerAllLp > 999) {
			powerAllLp = (powerAllLp / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			unitPrefix = 'k';
		}
		$('.chargepoint-sum-power').text(powerAllLp+' '+unitPrefix+unit);
	}
	else if ( mqttmsg == 'openWB/chargepoint/get/daily_yield_import') {
		var unit = "kWh";
		var dailyYield = parseFloat(mqttpayload);
		if ( isNaN(dailyYield) ) {
			dailyYield = 0;
		}
		var dailyYieldStr = "--";
		if ( dailyYield >= 0 ) {
			dailyYieldStr = dailyYield.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		}
		$('.chargepoint-sum-importdaily').text(dailyYieldStr+' '+unit);
	}
	else if ( mqttmsg == 'openWB/chargepoint/get/daily_yield_export') {
		var unit = "kWh";
		var dailyYield = parseFloat(mqttpayload);
		if ( isNaN(dailyYield) ) {
			dailyYield = 0;
		}
		var dailyYieldStr = "--";
		if ( dailyYield >= 0 ) {
			dailyYieldStr = dailyYield.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		}
		$('.chargepoint-sum-exportdaily').text(dailyYieldStr+' '+unit);
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/config\/name$/i ) ) {
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-name');  // now get parents respective child element
		$(element).text(JSON.parse(mqttpayload));
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/state_str$/i ) ) {
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-statestr');  // now get parents respective child element
		element.text(JSON.parse(mqttpayload));
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/fault_str$/i ) ) {
		// console.log("fault str");
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-faultstr');  // now get parents respective child element
		element.text(JSON.parse(mqttpayload));
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/fault_state$/i ) ) {
		// console.log("fault state");
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		parent.find('.chargepoint-faultstate[data-option="'+mqttpayload+'"').removeClass('hide');
		parent.find('.chargepoint-faultstate').not('[data-option="'+mqttpayload+'"]').addClass('hide');
		textElement = parent.find('.chargepoint-faultstr');
		switch (parseInt(mqttpayload, 10)){
			case 1: // warning
				$(textElement).removeClass('hide');
				$(textElement).addClass('alert-warning');
				$(textElement).removeClass('alert-danger');
				break;
			case 2: // error
				$(textElement).removeClass('hide');
				$(textElement).removeClass('alert-warning');
				$(textElement).addClass('alert-danger');
				break;
			default:
				$(textElement).addClass('hide');
		}
	}
	else if ( mqttmsg.match( /^openWB\/chargepoint\/[1-9][0-9]*\/get\/power_all$/i ) ) {
		var unit = "W";
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-power');  // now get parents respective child element
		var actualPower = parseInt(mqttpayload, 10);
		if ( isNaN(actualPower) ) {
			actualPower = 0;
		}
		if (actualPower > 999) {
			actualPower = (actualPower / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			unit = 'k'+unit;
		}
		element.text(actualPower+' '+unit);
	}
	else if ( mqttmsg.match( /^openWB\/chargepoint\/[1-9][0-9]*\/get\/charged_since_plugged_counter$/i ) ) {
		// energy charged since ev was plugged in
		// also calculates and displays km charged
		// console.log("charged since plugged counter");
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-energysinceplugged');  // now get parents respective child element
		var energyCharged = parseFloat(mqttpayload, 10);
		if ( isNaN(energyCharged) ) {
			energyCharged = 0;
		}
		element.text(energyCharged.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + ' kWh');
		var rangeChargedElement = parent.find('.chargepoint-rangesinceplugged');  // now get parents child element
		var consumption = parseFloat($(rangeChargedElement).data('consumption'));
		var rangeCharged = '';
		if ( !isNaN(consumption) && consumption > 0 ) {
			rangeCharged = (energyCharged / consumption) * 100;
			rangeCharged = ' / ' + rangeCharged.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + ' km';
		}
		$(rangeChargedElement).text(rangeCharged);
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/plug_state$/i ) ) {
		// status ev plugged in or not
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-plugstate');  // now get parents respective child element
		if ( mqttpayload == 1 ) {
			element.removeClass('hide');
		} else {
			element.addClass('hide');
		}
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/charge_state$/i ) ) {
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-chargestate');  // now get parents respective child element
		if ( mqttpayload == 1 ) {
			element.removeClass('text-orange').addClass('text-green');
		} else {
			element.removeClass('text-green').addClass('text-orange');
		}
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/manual_lock$/i ) ) {
		// console.log("chargepoint manual_lock");
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-manuallock');  // now get parents respective child element
		if ( mqttpayload == 1 ) {
			// element.prop('checked', true);
			element.bootstrapToggle('on', true); // do not fire a changed-event to prevent a loop!
		} else {
			// element.prop('checked', false);
			element.bootstrapToggle('off', true); // do not fire a changed-event to prevent a loop!
		}
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/enabled$/i ) ) {
		// console.log("chargepoint enabled");
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		element = parent.find('.chargepoint-stateenabled');
		if ( mqttpayload == 1 ) {
			$(element).addClass('chargepoint-enabled');
			$(element).removeClass('chargepoint-disabled');
		} else {
			$(element).removeClass('chargepoint-enabled');
			$(element).addClass('chargepoint-disabled');
		}
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/phases_in_use/i ) ) {
		// console.log("chargepoint phases_in_use");
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-phasesinuse');  // now get parents respective child element
		var phasesInUse = parseInt(mqttpayload, 10);
		if ( isNaN(phasesInUse) || phasesInUse < 1 || phasesInUse > 3 ) {
			element.text('/');
		} else {
			var phaseSymbols = ['', '\u2460', '\u2461', '\u2462'];
			element.text(phaseSymbols[phasesInUse]);
		}
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/set\/current/i ) ) {
		// target current value at charge point
		// console.log("chargepoint set current");
		var unit = "A";
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		var element = parent.find('.chargepoint-setcurrent');  // now get parents respective child element
		var targetCurrent = parseInt(mqttpayload, 10);
		if ( isNaN(targetCurrent) ) {
			targetCurrent = 0;
		}
		element.text(targetCurrent+' '+unit);
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/connected_vehicle\/soc$/i ) ) {
		// { "soc", "range", "range_unit", "timestamp", "fault_stat", "fault_str" }
		var index = getIndex(mqttmsg);  // extract number between two / /
		var socData = JSON.parse(mqttpayload);
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		// "soc" float unit: %
		var element = parent.find('.chargepoint-soc');  // now get parents respective child element
		var soc = socData.soc;
		if ( isNaN(soc) || soc < 0 || soc > 100 ) {
			soc = '--';
		}
		element.text(soc);
		var spinner = parent.find('.chargepoint-reloadsocsymbol');
		spinner.removeClass('fa-spin');
		// "range" ToDo
		// "range_unit" ToDo
		// "timestamp" ToDo
		// "fault_stat" ToDo
		// "fault_str" ToDo
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/connected_vehicle\/soc_config$/i ) ) {
		// { "socconfigured", "manual" }
		var configData = JSON.parse(mqttpayload);
		var index = getIndex(mqttmsg);  // extract number between two / /
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		// "socconfigured" bool
		var elementIsConfigured = $(parent).find('.chargepoint-socconfigured');  // now get parents respective child element
		var elementIsNotConfigured = $(parent).find('.chargepoint-socnotconfigured');  // now get parents respective child element
		if (configData.socconfigured == true) {
			$(elementIsNotConfigured).addClass('hide');
			$(elementIsConfigured).removeClass('hide');
		} else {
			$(elementIsNotConfigured).removeClass('hide');
			$(elementIsConfigured).addClass('hide');
		}
		// "manual"
		if (configData.manual == true) {
			$(elementIsConfigured).addClass('manualSoC');
			$(elementIsConfigured).find('.chargepoint-manualsocsymbol').removeClass('hide');
			$(elementIsConfigured).find('.chargepoint-reloadsocsymbol').addClass('hide');
		} else {
			$(elementIsConfigured).removeClass('manualSoC');
			$(elementIsConfigured).find('.chargepoint-manualsocsymbol').addClass('hide');
			$(elementIsConfigured).find('.chargepoint-reloadsocsymbol').removeClass('hide');
		}
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/connected_vehicle\/info$/i ) ) {
		// info of the vehicle if connected
		// { "id", "name" }
		var index = getIndex(mqttmsg);  // extract number between two / /
		var infoData = JSON.parse(mqttpayload);
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		// "id" int
		parent.find('.chargepoint-vehicleselect').val(infoData.id);  // set selectBox to received id
		parent.find('.chargepoint-vehicledata[data-ev]').attr('data-ev', infoData.id).data('ev', infoData.id);  // set data-ev setting for this chargepoint
		// "name" str
		parent.find('.chargepoint-vehiclename').text(infoData.name);
	}
	else if ( mqttmsg.match( /^openwb\/chargepoint\/[1-9][0-9]*\/get\/connected_vehicle\/config$/i ) ) {
		// settings of the vehicle if connected
		// { "charge_template", "ev_template", "chargemode", "priority", "average_consumption" }
		var index = getIndex(mqttmsg);  // extract number between two / /
		var configData = JSON.parse(mqttpayload);
		var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
		// "charge_template" int
		parent.attr('data-chargetemplate', configData.charge_template).data('chargetemplate', configData.charge_template);
		refreshChargetemplate(configData.charge_template);
		// "ev_template" int
		parent.attr('data-evtemplate', configData.ev_template).data('evtemplate', configData.ev_template);
		// "chargemode" str
		chargemodeRadio = parent.find('.chargepoint-chargemode input[type=radio][data-option="'+configData.chargemode+'"]');
		chargemodeRadio.prop('checked', true);  // check selected chargemode radio button
		friendlyChargemode = chargemodeRadio.parent().text();
		parent.find('.chargepoint-vehiclechargemode').text(friendlyChargemode);  // set chargemode in card header
		chargemodeRadio.parent().addClass('active');  // activate selected chargemode button
		parent.find('.chargepoint-chargemode input[type=radio]').not('[data-option="'+configData.chargemode+'"]').each(function() {
			$(this).prop('checked', false);  // uncheck all other radio buttons
			$(this).parent().removeClass('active');  // deselect all other chargemode buttons
		});
		chargemodeOptionsShowHide(chargemodeRadio, configData.chargemode);
		// "priority" bool
		var priorityElement = parent.find('.chargepoint-vehiclepriority');  // now get parents respective child element
		if ( configData.priority == true ) {
			// element.prop('checked', true);
			priorityElement.bootstrapToggle('on', true); // do not fire a changed-event to prevent a loop!
		} else {
			// element.prop('checked', false);
			priorityElement.bootstrapToggle('off', true); // do not fire a changed-event to prevent a loop!
		}
		// "average_consumption" int unit: Wh/100km
		var rangeChargedElement = parent.find('.chargepoint-rangesinceplugged');
		rangeChargedElement.data('consumption', configData.average_consumption).attr('data-consumption', configData.average_consumption);
		// if already energyCharged-displayed, update rangeCharged
		var energyCharged = parseFloat(parent.find('.chargepoint-energysinceplugged').text());  // now get parents respective energyCharged child element
		var rangeCharged = '';
		if ( !isNaN(energyCharged) && consumption > 0 ) {
			rangeCharged = (energyCharged / consumption) * 100;
			rangeCharged = ' / ' + rangeCharged.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + ' km';
		}
		$(rangeChargedElement).text(rangeCharged);
	}
	// else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/kWhactualcharged$/i ) ) {
	// 	// energy charged since reset of limitation
	// 	var index = getIndex(mqttmsg);  // extract number between two / /
	// 	if ( isNaN(mqttpayload) ) {
	// 		mqttpayload = 0;
	// 	}
	// 	var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent div element for charge limitation
	// 	var element = parent.find('.progress-bar');  // now get parents progressbar
	// 	element.data('actualCharged', mqttpayload);  // store value received
	// 	var limitElementId = 'lp/' + index + '/energyToCharge';
	// 	var limit = $('#' + $.escapeSelector(limitElementId)).val();  // slider value
	// 	if ( isNaN(limit) || limit < 2 ) {
	// 		limit = 2;  // minimum value
	// 	}
	// 	var progress = (mqttpayload / limit * 100).toFixed(0);
	// 	element.width(progress+"%");
	// }
	// else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/timeremaining$/i ) ) {
	// 	// time remaining for charging to target value
	// 	var index = getIndex(mqttmsg);  // extract number between two / /
	// 	var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent div element for charge limitation
	// 	var element = parent.find('.restzeitLp');  // get element
	// 	element.text('Restzeit ' + mqttpayload);
	// }
	// else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/boolchargeatnight$/i ) ) {
	// 	var index = getIndex(mqttmsg);  // extract number between two / /
	// 	var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
	// 	var element = parent.find('.nightChargingLp');  // now get parents respective child element
	// 	if ( mqttpayload == 1 ) {
	// 		element.removeClass('hide');
	// 	} else {
	// 		element.addClass('hide');
	// 	}
	// }
	// else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/autolockconfigured$/i ) ) {
	// 	var index = getIndex(mqttmsg);  // extract first match = number from
	// 	var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
	// 	var element = parent.find('.autolockConfiguredLp');  // now get parents respective child element
	// 	if ( mqttpayload == 0 ) {
	// 		element.addClass('hide');
	// 	} else {
	// 		element.removeClass('hide');
	// 	}
	// }
	// else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/autolockstatus$/i ) ) {
	// 	// values used for AutolockStatus flag:
	// 	// 0 = standby
	// 	// 1 = waiting for autolock
	// 	// 2 = autolock performed
	// 	// 3 = auto-unlock performed
	// 	var index = getIndex(mqttmsg);  // extract number between two / /
	// 	var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
	// 	var element = parent.find('.autolockConfiguredLp');  // now get parents respective child element
	// 	switch ( mqttpayload ) {
	// 		case '0':
	// 			// remove animation from span and set standard colored key icon
	// 			element.removeClass('fa-lock fa-lock-open animate-alertPulsation text-red text-green');
	// 			element.addClass('fa-key');
	// 			break;
	// 		case '1':
	// 			// add animation to standard icon
	// 			element.removeClass('fa-lock fa-lock-open text-red text-green');
	// 			element.addClass('fa-key animate-alertPulsation');
	// 			break;
	// 		case '2':
	// 			// add red locked icon
	// 			element.removeClass('fa-lock-open fa-key animate-alertPulsation text-green');
	// 			element.addClass('fa-lock text-red');
	// 			break;
	// 		case '3':
	// 			// add green unlock icon
	// 			element.removeClass('fa-lock fa-key animate-alertPulsation text-red');
	// 			element.addClass('fa-lock-open text-green');
	// 			break;
	// 	}
	// }
	// else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/boolfinishattimechargeactive$/i ) ) {
	// 	// respective charge point configured
	// 	var index = getIndex(mqttmsg);  // extract number between two / /
	// 	var parent = $('.chargepoint-card[data-cp="' + index + '"]');  // get parent row element for charge point
	// 	var element = parent.find('.targetChargingLp');  // now get parents respective child element
	// 	if (mqttpayload == 1) {
	// 		element.removeClass('hide');
	// 	} else {
	// 		element.addClass('hide');
	// 	}
	// }
}

function processVehicleMessages(mqttmsg, mqttpayload) {
	if ( mqttmsg.match( /^openwb\/vehicle\/[1-9][0-9]*\/name$/i ) ) {
		// this topic is used to populate the chargepoint list
		var index = getIndex(mqttmsg);  // extract number between two / /
		$('.chargepoint-vehicleselect').each(function(){
			myOption = $(this).find('option[value='+index+']');
			if( myOption.length > 0 ){
				myOption.text(JSON.parse(mqttpayload));  // update vehicle name if option with index is present
			} else {
				$(this).append('<option value="'+index+'">'+JSON.parse(mqttpayload)+'</option>');  // add option with index
				if( parseInt($(this).closest('.chargepoint-vehicledata[data-ev]').data('ev')) == index) { // update selected element if match with our index
					$(this).val(index);
				}
			}
		});
	}
	else if ( mqttmsg.match( /^openwb\/vehicle\/template\/charge_template\/[1-9][0-9]*$/i ) ) {
		// console.log("charge_template");
		templateIndex = mqttmsg.match( /[1-9][0-9]*$/i );
		chargemodeTemplate[templateIndex] = JSON.parse(mqttpayload);
		refreshChargetemplate(templateIndex);
	}
}

function processGraphMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/graph
	// called by handlevar
	// console.log("received graph msg: " + mqttmsg + ": " + mqttpayload);
	if ( mqttmsg == 'openWB/graph/boolDisplayHouseConsumption' ) {
		if ( mqttpayload == 1) {
			boolDisplayHouseConsumption = false;
			hidehaus = 'foo';
		} else {
			boolDisplayHouseConsumption = true;
			hidehaus = 'Hausverbrauch';
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayLegend' ) {
		if ( mqttpayload == 0) {
			boolDisplayLegend = false;
		} else {
			boolDisplayLegend = true;
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayLiveGraph' ) {
		if ( mqttpayload == 0) {
			$('#thegraph').addClass('hide');
			boolDisplayLiveGraph = false;
		} else {
			$('#thegraph').removeClass('hide');
			boolDisplayLiveGraph = true;
		}
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayEvu' ) {
		if ( mqttpayload == 1) {
			boolDisplayEvu = false;
			hideevu = 'foo';
		} else {
			boolDisplayEvu = true;
			hideevu = 'Bezug';
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayPv' ) {
		if ( mqttpayload == 1) {
			boolDisplayPv = false;
			hidepv = 'foo';
		} else {
			boolDisplayPv = true;
			hidepv = 'PV';
		}
		checkgraphload();
	}
	else if ( mqttmsg.match( /^openwb\/graph\/booldisplaylp[1-9][0-9]*$/i ) ) {
		var index = mqttmsg.match(/(\d+)(?!.*\d)/g)[0];  // extract last match = number from mqttmsg
		// now call functions or set variables corresponding to the index
		if ( mqttpayload == 1) {
			window['boolDisplayLp'+index] = false;
			window['hidelp'+index] = 'foo';
		} else {
			window['boolDisplayLp'+index] = true;
			window['hidelp'+index] = 'Lp' + index;
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayLpAll' ) {
		if ( mqttpayload == 1) {
			boolDisplayLpAll = false;
			hidelpa = 'foo';
		} else {
			boolDisplayLpAll = true;
			hidelpa = 'LP Gesamt';
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplaySpeicher' ) {
		if ( mqttpayload == 1) {
			boolDisplaySpeicher = false;
			hidespeicher = 'foo';
		} else {
			hidespeicher = 'Speicher';
			boolDisplaySpeicher = true;
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplaySpeicherSoc' ) {
		if ( mqttpayload == 1) {
			hidespeichersoc = 'foo';
			boolDisplaySpeicherSoc = false;
		} else {
			hidespeichersoc = 'Speicher SoC';
			boolDisplaySpeicherSoc = true;
		}
		checkgraphload();
	}
	else if ( mqttmsg.match( /^openwb\/graph\/booldisplaylp[1-9][0-9]*soc$/i ) ) {
		var index = mqttmsg.match(/(\d+)(?!.*\d)/g)[0];  // extract last match = number from mqttmsg
		if ( mqttpayload == 1) {
			$('#socenabledlp' + index).removeClass('hide');
			window['boolDisplayLp' + index + 'Soc'] = false;
			window['hidelp' + index + 'soc'] = 'foo';
		} else {
			$('#socenabledlp' + index).addClass('hide');
			window['boolDisplayLp' + index + 'Soc'] = true;
			window['hidelp' + index + 'soc'] = 'LP' + index + ' SoC';
		}
		checkgraphload();
	}
	else if ( mqttmsg.match( /^openwb\/graph\/booldisplayload[1-9][0-9]*$/i ) ) {
		var index = mqttmsg.match(/(\d+)(?!.*\d)/g)[0];  // extract last match = number from mqttmsg
		// now call functions or set variables corresponding to the index
		if ( mqttpayload == 1) {
			window['hideload'+index] = 'foo';
			window['boolDisplayLoad'+index] = false;
		} else {
			window['hideload'+index] = 'Verbraucher ' + index;
			window['boolDisplayLoad'+index] = true;
		}
		checkgraphload();
	}
	else if ( mqttmsg.match( /^openwb\/graph\/[1-9][0-9]*alllivevalues$/i ) ) {
		// graph messages if local connection
		var index = mqttmsg.match(/(\d+)(?!.*\d)/g)[0];  // extract last match = number from mqttmsg
		// now call functions or set variables corresponding to the index
		if (initialread == 0) {
			window['all'+index+'p'] = mqttpayload;
			window['all'+index] = 1;
			putgraphtogether();
		}
	}
	else if ( mqttmsg == 'openWB/graph/lastlivevalues' ) {
		// graph messages if local connection
		if ( initialread > 0) {
			updateGraph(mqttpayload);
		}
		if (graphrefreshcounter > 60) {
			// reload graph completety
			initialread = 0;
			all1 = 0;
			all2 = 0;
			all3 = 0;
			all4 = 0;
			all5 = 0;
			all6 = 0;
			all7 = 0;
			all8 = 0;
			all9 = 0;
			all10 = 0;
			all11 = 0;
			all12 = 0;
			all13 = 0;
			all14 = 0;
			all15 = 0;
			all16 = 0;
			graphrefreshcounter = 0;
			subscribeMqttGraphSegments();
		}
		graphrefreshcounter += 1;
	}
}  // end processGraphMessages

// function processETProviderMessages(mqttmsg, mqttpayload) {
// 	// processes mqttmsg for topic openWB/global
// 	// called by handlevar
// 	if ( mqttmsg == 'openWB/global/ETProvider/providerName' ) {
// 		$('.etproviderName').text(mqttpayload);
// 	}
// 	else if ( mqttmsg == 'openWB/global/ETProvider/modulePath' ) {
// 		$('.etproviderLink').attr("href", "/openWB/modules/"+mqttpayload+"/stromtarifinfo/infopage.php");
// 	}
// 	else if ( mqttmsg == 'openWB/global/awattar/boolAwattarEnabled' ) {
// 		// sets icon, graph and price-info-field visible/invisible
// 		if ( mqttpayload == '1' ) {
// 			$('#etproviderEnabledIcon').removeClass('hide');
// 			$('#priceBasedCharging').removeClass('hide');
// 			$('#strompreis').removeClass('hide');
// 			$('#navStromtarifInfo').removeClass('hide');
// 		} else {
// 			$('#etproviderEnabledIcon').addClass('hide');
// 			$('#priceBasedCharging').addClass('hide');
// 			$('#strompreis').addClass('hide');
// 			$('#navStromtarifInfo').addClass('hide');
// 		}
// 	}
// 	else if ( mqttmsg == 'openWB/global/awattar/pricelist' ) {
// 		// read etprovider values and trigger graph creation
// 		// loadElectricityPriceChart will show electricityPriceChartCanvas if etprovideraktiv=1 in openwb.conf
// 		// graph will be redrawn after 5 minutes (new data pushed from cron5min.sh)
// 		var csvData = [];
// 		var rawcsv = mqttpayload.split(/\r?\n|\r/);
// 		// skip first entry: it is module-name responsible for list
// 		for (var i = 1; i < rawcsv.length; i++) {
// 			csvData.push(rawcsv[i].split(','));
// 		}
// 		// Timeline (x-Achse) ist UNIX Timestamp in UTC, deshalb Umrechnung (*1000) in Javascript-Timestamp (mit Millisekunden)
// 		electricityPriceTimeline = getCol(csvData, 0).map(function(x) { return x * 1000; });
// 		// Chartline (y-Achse) ist Preis in ct/kWh
// 		electricityPriceChartline = getCol(csvData, 1);

// 		loadElectricityPriceChart();
// 	}
// 	else if ( mqttmsg == 'openWB/global/awattar/MaxPriceForCharging' ) {
// 		setInputValue('MaxPriceForCharging', mqttpayload);
// 	}
// 	else if ( mqttmsg == 'openWB/global/awattar/ActualPriceForCharging' ) {
// 		$('#aktuellerStrompreis').text(parseFloat(mqttpayload).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' ct/kWh');
// 	}
// }

// function processSofortConfigMessages(mqttmsg, mqttpayload) {
// 	// processes mqttmsg for topic openWB/config/get/sofort/
// 	// called by handlevar
// 	var elementId = mqttmsg.replace('openWB/config/get/sofort/', '');
// 	var element = $('#' + $.escapeSelector(elementId));
// 	if ( element.attr('type') == 'range' ) {
// 		setInputValue(elementId, mqttpayload);
// 	} else if ( element.hasClass('btn-group-toggle') ) {
// 		setToggleBtnGroup(elementId, mqttpayload);
// 	}
// }

// function processGlobalMessages(mqttmsg, mqttpayload) {
// 	// processes mqttmsg for topic openWB/global
// 	// called by handlevar
// 	if ( mqttmsg == 'openWB/global/WHouseConsumption' ) {
// 		var powerHouse = parseInt(mqttpayload, 10);
// 		if ( isNaN(powerHouse) ) {
// 			powerHouse = 0;
// 		}
// 		if ( powerHouse > 999 ) {
// 			powerHouse = (powerHouse / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' kW';
// 		} else {
// 			powerHouse += ' W';
// 		}
// 		$('#hausverbrauch').text(powerHouse);
// 	}
// 	else if ( mqttmsg == 'openWB/global/strLastmanagementActive' ) {
// 		if ( mqttpayload.length >= 5 ) {
// 			// if there is info-text in payload for topic, show the text
// 			$('#lastregelungaktiv').text(mqttpayload);
// 		} else {
// 			// if there is no text, show nothing (hides row)
// 			$('#lastregelungaktiv').text('');
// 		}
// 	}
// 	else if ( mqttmsg == 'openWB/global/ChargeMode' ) {
// 		// set modal button colors depending on charge mode
// 		// set visibility of divs
// 		// set visibility of priority icon depending on charge mode
// 		// (priority icon is encapsulated in another element hidden/shown by housebattery configured or not)
// 		switch (mqttpayload) {
// 			case '0':
// 				// mode sofort
// 				$('#chargeModeSelectBtnText').text('Sofortladen');  // text btn mainpage
// 				$('.chargeModeBtn').removeClass('btn-success');  // changes to select btns in modal
// 				$('#chargeModeSofortBtn').addClass('btn-success');
// 				$('#targetChargingProgress').removeClass('hide');  // visibility of divs for special settings
// 				$('#sofortladenEinstellungen').removeClass('hide');
// 				$('#priorityEvBatteryIcon').addClass('hide');  // visibility of priority icon
// 				$('#minundpvladenEinstellungen').addClass('hide');

// 				break;
// 			case '1':
// 				// mode min+pv
// 				$('#chargeModeSelectBtnText').text('Min+PV-Laden');
// 				$('.chargeModeBtn').removeClass('btn-success');
// 				$('#chargeModeMinPVBtn').addClass('btn-success');
// 				$('#targetChargingProgress').addClass('hide');
// 				$('#sofortladenEinstellungen').addClass('hide');
// 				$('#priorityEvBatteryIcon').addClass('hide');
// 				$('#minundpvladenEinstellungen').removeClass('hide');

// 				break;
// 			case '2':
// 				// mode pv
// 				$('#chargeModeSelectBtnText').text('PV-Laden');
// 				$('.chargeModeBtn').removeClass('btn-success');
// 				$('#chargeModePVBtn').addClass('btn-success');
// 				$('#targetChargingProgress').addClass('hide');
// 				$('#sofortladenEinstellungen').addClass('hide');
// 				$('#priorityEvBatteryIcon').removeClass('hide');
// 				$('#minundpvladenEinstellungen').addClass('hide');

// 				break;
// 			case '3':
// 				// mode stop
// 				$('#chargeModeSelectBtnText').text('Stop');
// 				$('.chargeModeBtn').removeClass('btn-success');
// 				$('#chargeModeStopBtn').addClass('btn-success');
// 				$('#targetChargingProgress').addClass('hide');
// 				$('#sofortladenEinstellungen').addClass('hide');
// 				$('#priorityEvBatteryIcon').addClass('hide');
// 				$('#minundpvladenEinstellungen').addClass('hide');

// 				break;
// 			case '4':
// 				// mode standby
// 				$('#chargeModeSelectBtnText').text('Standby');
// 				$('.chargeModeBtn').removeClass('btn-success');
// 				$('#chargeModeStdbyBtn').addClass('btn-success');
// 				$('#targetChargingProgress').addClass('hide');
// 				$('#sofortladenEinstellungen').addClass('hide');
// 				$('#priorityEvBatteryIcon').addClass('hide');
// 				$('#minundpvladenEinstellungen').addClass('hide');
// 		}
// 	}
// 	else if ( mqttmsg == 'openWB/global/DailyYieldAllChargePointsKwh') {
// 		var llaDailyYield = parseFloat(mqttpayload);
// 		if ( isNaN(llaDailyYield) ) {
// 			llaDailyYield = 0;
// 		}
// 		if ( llaDailyYield >= 0 ) {
// 			var llaDailyYieldStr = ' (' + llaDailyYield.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' kWh)';
// 			$('#lladailyyield').text(llaDailyYieldStr);
// 		} else {
// 			$('#lladailyyield').text("");
// 		}

// 	}
// 	else if ( mqttmsg == 'openWB/global/DailyYieldHausverbrauchKwh') {
// 		var hausverbrauchDailyYield = parseFloat(mqttpayload);
// 		if ( isNaN(hausverbrauchDailyYield) ) {
// 			hausverbrauchDailyYield = 0;
// 		}
// 		if ( hausverbrauchDailyYield >= 0 ) {
// 			var hausverbrauchDailyYieldStr = ' (' + hausverbrauchDailyYield.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' kWh)';
// 			$('#hausverbrauchdailyyield').text(hausverbrauchDailyYieldStr);
// 		} else {
// 			$('#hausverbrauchdailyyield').text("");
// 		}

// 	}
// }

// function processSystemMessages(mqttmsg, mqttpayload) {
// 	// processes mqttmsg for topic openWB/system
// 	// called by handlevar
// 	// console.log("received system msg: " + mqttmsg + ": " + mqttpayload);
// 	if ( mqttmsg == 'openWB/system/Timestamp') {
// 		var dateObject = new Date(mqttpayload * 1000);  // Unix timestamp to date-object
// 		var time = '&nbsp;';
// 		var date = '&nbsp;';
// 		if ( dateObject instanceof Date && !isNaN(dateObject.valueOf()) ) {
// 			// timestamp is valid date so process
// 			var HH = String(dateObject.getHours()).padStart(2, '0');
// 			var MM = String(dateObject.getMinutes()).padStart(2, '0');
// 			time = HH + ':'  + MM;
// 			var dd = String(dateObject.getDate()).padStart(2, '0');  // format with leading zeros
// 			var mm = String(dateObject.getMonth() + 1).padStart(2, '0'); //January is 0 so add +1!
// 			var dayOfWeek = dateObject.toLocaleDateString('de-DE', { weekday: 'short'});
// 			date = dayOfWeek + ', ' + dd + '.' + mm + '.' + dateObject.getFullYear();
// 		}
// 		$('#time').text(time);
// 		$('#date').text(date);
// 	}
// }

// function processVerbraucherMessages(mqttmsg, mqttpayload) {
// 	// processes mqttmsg for topic openWB/Verbraucher
// 	// called by handlevar
// 	var index = getIndex(mqttmsg);  // extract number between two / /
// 	if ( mqttmsg.match( /^openwb\/Verbraucher\/[1-2]\/Configured$/i ) ) {
// 		if ( mqttpayload == 1 ) {
// 			// if at least one device is configured, show info-div
// 			$('#verbraucher').removeClass("hide");
// 			// now show info-div for this device
// 			$('#verbraucher'+index).removeClass("hide");
// 		} else {
// 			$('#verbraucher'+index).addClass("hide");
// 		}
// 	} else if ( mqttmsg.match( /^openwb\/Verbraucher\/[1-2]\/Name$/i ) ) {
// 		if ( mqttpayload != "Name" ){
// 			$('#verbraucher'+index+'name').text(mqttpayload);
// 		}
// 	} else if ( mqttmsg.match( /^openwb\/Verbraucher\/[1-2]\/Watt$/i ) ) {
// 		var unit = ' W';
// 		var verbraucherwatt = parseInt(mqttpayload, 10);
// 		if ( isNaN(verbraucherwatt) ) {
// 			verbraucherwatt = 0;
// 		}
// 		if ( verbraucherwatt > 999 ) {
// 			verbraucherwatt = (verbraucherwatt / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
// 			unit = ' kW';
// 		}
// 		$('#verbraucher'+index+'leistung').text(verbraucherwatt + unit);
// 	} else if ( mqttmsg.match( /^openwb\/Verbraucher\/[1-2]\/DailyYieldImportkWh$/i ) ) {
// 		var verbraucherDailyYield = parseFloat(mqttpayload);
// 		if ( isNaN(verbraucherDailyYield) ) {
// 			verbraucherDailyYield = 0;
// 		}
// 		if ( verbraucherDailyYield >= 0 ) {
// 			var verbraucherDailyYieldStr = ' (' + verbraucherDailyYield.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' kWh)';
// 			$('#verbraucher'+index+'dailyyield').text(verbraucherDailyYieldStr);
// 		} else {
// 			$('#verbraucher'+index+'dailyyield').text("");
// 		}

// 	}
// }

// function processHookMessages(mqttmsg, mqttpayload) {
// 	// processes mqttmsg for topic openWB/hook
// 	// called by handlevar
// 	if ( mqttmsg.match( /^openwb\/hook\/[1-9][0-9]*\/boolhookstatus$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		if ( mqttpayload == 1 ) {
// 			$('#hook' + index).removeClass("bg-danger").addClass("bg-success");
// 		} else {
// 			$('#hook' + index).removeClass("bg-success").addClass("bg-danger");
// 		}
// 	}
// 	else if ( mqttmsg.match( /^openwb\/hook\/[1-9][0-9]*\/boolhookconfigured$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		if ( mqttpayload == 1 ) {
// 			$('#hook' + index).removeClass('hide');
// 		} else {
// 			$('#hook' + index).addClass('hide');
// 		}
// 	}
// }

// function processSmartHomeDevicesMessages(mqttmsg, mqttpayload) {
// 	// processes mqttmsg for topic openWB/SmartHomeDevices - actual values only!
// 	// called by handlevar
// 	if ( mqttmsg.match( /^openwb\/SmartHome\/Devices\/[1-9][0-9]*\/Watt$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		var parent = $('[data-dev="' + index + '"]');  // get parent row element for SH Device
// 		var element = parent.find('.actualPowerDevice');  // now get parents respective child element
// 		var actualPower = parseInt(mqttpayload, 10);
// 		if ( isNaN(actualPower) ) {
// 			actualPower = 0;
// 		}
// 		if (actualPower > 999) {
// 			actualPower = (actualPower / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
// 			actualPower += ' kW';
// 		} else {
// 			actualPower += ' W';
// 		}
// 		element.text(actualPower);
// 	}
// 	else if ( mqttmsg.match( /^openwb\/SmartHome\/Devices\/[1-9][0-9]*\/DailyYieldKwh$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		var parent = $('[data-dev="' + index + '"]');  // get parent row element for SH Device
// 		var element = parent.find('.actualDailyYieldDevice');  // now get parents respective child element
// 		var actualDailyYield = parseFloat(mqttpayload);
// 		if ( isNaN(actualDailyYield) ) {
// 			siiDailyYield = 0;
// 		}
// 		if ( actualDailyYield >= 0 ) {
// 			var actualDailyYieldStr = ' (' + actualDailyYield.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' kWh)';
// 			element.text(actualDailyYieldStr);
// 		} else {
// 			element.text("");
// 		}
// 	}
// 	else if ( mqttmsg.match( /^openwb\/SmartHome\/Devices\/[1-9][0-9]*\/RunningTimeToday$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		var parent = $('[data-dev="' + index + '"]');  // get parent row element for SH Device
// 		var element = parent.find('.actualRunningTimeDevice');  // now get parents respective child element
// 		var actualPower = parseInt(mqttpayload, 10);
// 		if ( isNaN(actualPower) ) {
// 			actualPower = 0;
// 		}
// 		if (actualPower < 3600) {
// 			actualPower = (actualPower / 60).toFixed(0);
// 			actualPower += ' Min';
// 		} else {
// 			rest = (actualPower % 3600 / 60).toFixed(0);
// 			ganz = (actualPower / 3600).toFixed(0);
// 			actualPower = ganz + ' H ' + rest +' Min';
// 		}
// 		element.text(actualPower);
// 	}
// 	else if ( mqttmsg.match( /^openwb\/SmartHome\/Devices\/[1-9][0-9]*\/RelayStatus$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		$('.nameDevice').each(function() {  // check all elements of class '.nameLp'
// 			var dev = $(this).closest('[data-dev]').data('dev');  // get attribute lp from parent
// 			if ( dev == index ) {
// 				if ( $(this).hasClass('enableDevice') ) {
// 					// but only apply styles to element in chargepoint info data block
// 					if ( mqttpayload == 0 ) {
// 						$(this).removeClass('lpEnabledStyle').removeClass('lpWaitingStyle').addClass('lpDisabledStyle');
// 					} else {
// 						$(this).removeClass('lpDisabledStyle').removeClass('lpWaitingStyle').addClass('lpEnabledStyle');
// 					}
// 				}
// 			}
// 		});
// 	}
// 	else if ( mqttmsg.match( /^openwb\/SmartHome\/Devices\/[1-9][0-9]*\/TemperatureSensor0$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		var parent = $('.SmartHomeTemp[data-dev="' + index + '"]');  // get parent row element for SH Device
// 		var element = parent.find('.actualTemp0Device');  // now get parents respective child element
// 		var actualTemp = parseFloat(mqttpayload);
// 		if ( isNaN(actualTemp) ) {
// 			StringTemp = '';
// 			parent.addClass('hide');
// 		} else {
// 			if (actualTemp > 200) {
// 				StringTemp = ''; // display only something if we got a value
// 				parent.addClass('hide');
// 			} else {
// 				StringTemp = 'Temp1 ' + actualTemp.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); // make complete string to display
// 				parent.removeClass('hide');
// 			}
// 		}
// 		element.text(StringTemp);
// 	}
// 	else if ( mqttmsg.match( /^openwb\/SmartHome\/Devices\/[1-9][0-9]*\/TemperatureSensor1$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		var parent = $('.SmartHomeTemp[data-dev="' + index + '"]');  // get parent row element for charge point
// 		var element = parent.find('.actualTemp1Device');  // now get parents respective child element
// 		var actualTemp = parseFloat(mqttpayload);
// 		if ( isNaN(actualTemp) ) {
// 			StringTemp = '';
// 		} else {
// 			if (actualTemp > 200) {
// 				StringTemp = ''; // display only something if we got a value
// 			} else {
// 				StringTemp = 'Temp2 ' + actualTemp.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); // make complete string to display
// 			}
// 		}
// 		element.text(StringTemp);
// 	}
// 	else if ( mqttmsg.match( /^openwb\/SmartHome\/Devices\/[1-9][0-9]*\/TemperatureSensor2$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		var parent = $('.SmartHomeTemp[data-dev="' + index + '"]');  // get parent row element for charge point
// 		var element = parent.find('.actualTemp2Device');  // now get parents respective child element
// 		var actualTemp = parseFloat(mqttpayload);
// 		if ( isNaN(actualTemp) ) {
// 			StringTemp = '';
// 		} else {
// 			if (actualTemp > 200) {
// 				StringTemp = ''; // display only something if we got a value
// 			} else {
// 				StringTemp = 'Temp3 ' + actualTemp.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); // make complete string to display
// 			}
// 		}
// 		element.text(StringTemp);
// 	}
// }

// function processSmartHomeDevicesConfigMessages(mqttmsg, mqttpayload) {
// 	// processes mqttmsg for topic openWB/config/get/SmartHome/Devices - config variables (Name / configured only!), actual Variables in proccessSMartHomeDevices
// 	// called by handlevar
// 	if ( mqttmsg.match( /^openwb\/config\/get\/SmartHome\/Devices\/[1-9][0-9]*\/device_configured$/i ) ) {
// 		// respective SH Device configured
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		var infoElement = $('[data-dev="' + index + '"]');  // get row of SH Device
// 		if (mqttpayload == 1) {
// 			infoElement.removeClass('hide');
// 		} else {
// 			infoElement.addClass('hide');
// 		}
// 		var visibleRows = $('[data-dev]:visible');  // show/hide complete block depending on visible rows within
// 		if ( visibleRows.length > 0 ) {
// 			$('.smartHome').removeClass('hide');
// 		} else {
// 			$('.smartHome').addClass('hide');
// 		}
// 	}
// 	else if ( mqttmsg.match( /^openwb\/config\/get\/SmartHome\/Devices\/[1-9][0-9]*\/mode$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		var parent = $('[data-dev="' + index + '"]');  // get parent row element for SH Device
// 		var element = parent.find('.actualModeDevice');  // now get parents respective child element
// 		if ( mqttpayload == 0 ) {
// 			actualMode = "Automatik"
// 		} else {
// 			actualMode = "Manuell"
// 		}
// 		element.text(actualMode);
// 		$('.nameDevice').each(function() {  // check all elements of class '.nameDevice'
// 			var dev = $(this).closest('[data-dev]').data('dev');  // get attribute Device from parent
// 			if ( dev == index ) {
// 				if ( $(this).hasClass('enableDevice') ) {
// 					// but only apply styles to element in chargepoint info data block
// 					if ( mqttpayload == 1 ) {
// 						$(this).addClass('cursor-pointer').addClass('locked');
// 					} else {
// 						$(this).removeClass('cursor-pointer').removeClass('locked');
// 					}
// 				}
// 			}
// 		});
// 	}
// 	else if ( mqttmsg.match( /^openWB\/config\/get\/SmartHome\/Devices\/[1-9][0-9]*\/device_name$/i ) ) {
// 		var index = getIndex(mqttmsg);  // extract number between two / /
// 		var parent = $('[data-dev="' + index + '"]');  // get parent row element for SH Device
// 		var element = parent.find('.nameDevice');  // now get parents respective child element
// 		element.text(mqttpayload);
// 		window['d'+index+'name']=mqttpayload;
// 	}
// }
