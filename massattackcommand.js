/*
 * Script Name: Mass Command Timer
 * Version: v2.5.2
 * Last Updated: 2022-07-15
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: RedAlert#9859 (Discord)
 * Approved: t14258011
 * Approved Date: 2020-10-03
 * Mod: JawJaw
 */

/*--------------------------------------------------------------------------------------
 * This script can NOT be cloned and modified without permission from the script author.
 --------------------------------------------------------------------------------------*/

var scriptData = {
    prefix: 'massCommandTimer',
    name: 'Mass Command Timer',
    version: 'v2.5.2',
    author: 'RedAlert',
    authorUrl: 'https://twscripts.dev/',
    helpLink:
        'https://forum.tribalwars.net/index.php?threads/mass-command-timer.286017/',
};

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;
if (typeof SEND_UNITS !== 'string') SEND_UNITS = '';

// Globals
var coord_regex = /[0-9]{1,3}\|[0-9]{1,3}/g;
var allowedScreens = ['overview_villages'];
var allowedModes = ['combined'];
var ownVillagesCoords = [];

var unitInfo;
$.ajax({
    url: '/interface.php?func=get_unit_info',
}).done(function (response) {
    unitInfo = xml2json($(response));
});

// Translations
var translations = {
    en_DK: {
        'Mass Command Timer': 'Mass Command Timer',
        Help: 'Help',
        'Select Unit': 'Select Unit',
        'Enter Coordinates': 'Enter Coordinates',
        'Calculate Times': 'Calculate Times',
        'Select Landing Time': 'Select Landing Time',
        'Coordinates field is empty!': 'Coordinates field is empty!',
        'Target coordinates are invalid!': 'Target coordinates are invalid!',
        From: 'From',
        To: 'To',
        Distance: 'Distance',
        'Travel Time': 'Travel Time',
        'Launch Time': 'Launch Time',
        Send: 'Send',
        'No village can reach in time!': 'No village can reach in time!',
        'This script requires Premium Account to be active!':
            'This script requires Premium Account to be active!',
        'possible combinations found': 'possible combinations found',
        Unit: 'Unit',
        Status: 'Status',
        'Commands List Export': 'Commands List Export',
        'Landing Time': 'Landing Time',
        Command: 'Command',
        'Send In': 'Send In',
        'Export Plan': 'Export Plan',
        'Reset Config': 'Reset Config',
        'Script configuration has been reset!':
            'Script configuration has been reset!',
    },
    pl_PL: {
        'Mass Command Timer': 'Masowe komendy',
        Help: 'Pomoc',
        'Select Unit': 'Wybierz jednostki',
        'Enter Coordinates': 'Wprowadź koordynaty',
        'Calculate Times': 'Oblicz czas',
        'Select Landing Time': 'Czas dojścia Wojsk',
        'Coordinates field is empty!': 'Brak wpisanych kordów!',
        'Target coordinates are invalid!': 'Wpisane kordy są błędne!',
        From: 'Z',
        To: 'Do',
        Distance: 'Dystans',
        'Travel Time': 'Czas trwania',
        'Launch Time': 'Czas wyjścia',
        Send: 'Wyślij',
        'No village can reach in time!':
            'Brak wioski o określonym czasie wyjścia!',
        'This script requires Premium Account to be active!':
            'Wymagane konto premium!',
        'possible combinations found': 'Ilość możliwych ataków',
        Unit: 'Jednostka',
        Status: 'Status',
        'Commands List Export': 'Wyexportowano',
        'Landing Time': 'Czas wysłania',
        Command: 'Komenda',
        'Send In': 'Wyślij Za',
        'Export Plan': 'Exportuj Plan',
        'Reset Config': 'Zreset Config',
        'Script configuration has been reset!':
            'Script configuration has been reset!',
    },
    sk_SK: {
        'Mass Command Timer': 'HromadnĂ˝ plĂĄnovaÄ',
        Help: 'Pomoc',
        'Select Unit': 'VybraĹĽ jednotku',
        'Enter Coordinates': 'ZadaĹĽ koordinĂĄty',
        'Calculate Times': 'VypoÄĂ­taĹĽ Äasy',
        'Select Landing Time': 'ZadaĹĽ Äas prĂ­chodu',
        'Coordinates field is empty!': 'KoordinĂĄty nie sĂş vyplnenĂŠ!',
        'Target coordinates are invalid!': 'Target coordinates are invalid!',
        From: 'Z',
        To: 'Do',
        Distance: 'VzdialenosĹĽ',
        'Travel Time': 'Trvanie',
        'Launch Time': 'Äas odoslania',
        Send: 'OdoslaĹĽ',
        'No village can reach in time!':
            'Jednotky zo Ĺžiadnej dediny nestihnĂş doraziĹĽ vÄas!',
        'This script requires Premium Account to be active!':
            'Tento skript vyĹžaduje aktĂ­vny prĂŠmiovĂ˝ ĂşÄet!',
        'possible combinations found': 'moĹžnĂ˝ch kombinĂĄciĂ­ nĂĄjdenĂ˝ch',
        Unit: 'Jednotka',
        Status: 'Stav',
        'Commands List Export': 'ExportovaĹĽ zoznam prĂ­kazov',
        'Landing Time': 'Äas prĂ­chodu',
        Command: 'PrĂ­kaz',
        'Send In': 'Send In',
        'Export Plan': 'Export Plan',
        'Reset Config': 'Reset Config',
        'Script configuration has been reset!':
            'Script configuration has been reset!',
    },
    pt_PT: {
        'Mass Command Timer': 'Temporizador de comandos em massa',
        Help: 'Ajuda',
        'Select Unit': 'Selecionar unidade',
        'Enter Coordinates': 'Digitar coordenadas',
        'Calculate Times': 'Calcular tempos',
        'Select Landing Time': 'Selecionar o tempo de chegada',
        'Coordinates field is empty!': 'O espaĂ§o das coordenadas estĂĄ vazio!',
        From: 'De',
        To: 'Para',
        Distance: 'DistĂ˘ncia',
        'Travel Time': 'Tempo de viagem',
        'Launch Time': 'Tempo de partida',
        Send: 'Enviar',
        'No village can reach in time!':
            'Nenhuma aldeia consegue chegar a tempo',
        'This script requires Premium Account to be active!':
            'Este script precisa de conta premium ativa para funcionar!',
        'possible combinations found': 'combinaĂ§Ăľes possĂ­veis encontradas',
        Unit: 'Unidade',
        Status: 'Estado',
        'Commands List Export': 'Exportar a lista de comandos',
        'Landing Time': 'Tempo de chegada',
        Command: 'Comando',
        'Send In': 'Enviar Em',
        'Export Plan': 'Export Plan',
        'Reset Config': 'Reset Config',
        'Script configuration has been reset!':
            'Script configuration has been reset!',
    },
    tr_TR: {
        'Mass Command Timer': 'Toplu Komut ZamanlayÄącÄą',
        Help: 'YardÄąm',
        'Select Unit': 'Birim SeĂ§',
        'Enter Coordinates': 'KoodinatlarÄą Girin',
        'Calculate Times': 'ZamanlarÄą Hesapla',
        'Select Landing Time': 'VarÄąĹ ZamanÄąnÄą SeĂ§in',
        'Coordinates field is empty!': 'Koordinatlar alanÄą boĹ!',
        From: 'dan',
        To: 'a',
        Distance: 'Mesafe',
        'Travel Time': 'Seyehat SĂźresi',
        'Launch Time': 'BaĹlatma ZamanÄą',
        Send: 'GĂśnder',
        'No village can reach in time!': 'HiĂ§bir kĂśy zamanÄąnda ulaĹamaz!',
        'This script requires Premium Account to be active!':
            'Bu komut dosyasÄą, Premium HesabÄąn etkin olmasÄąnÄą gerektirir!',
        'possible combinations found': 'bulunan olasÄą kombinasyonlar',
        Unit: 'Birim',
        Status: 'Durum',
        'Commands List Export': 'Komut Listesini DÄąĹa Aktar',
        'Landing Time': 'VarÄąĹ ZamanÄą',
        Command: 'Komut',
        'Send In': 'Send In',
        'Export Plan': 'Export Plan',
        'Reset Config': 'Reset Config',
        'Script configuration has been reset!':
            'Script configuration has been reset!',
    },
    fr_FR: {
        'Mass Command Timer': "Calcul d'envoi de masse",
        Help: 'Aide',
        'Select Unit': "Selection d'unitĂÂŠ",
        'Enter Coordinates': 'CoordonnĂÂŠes cibles',
        'Calculate Times': 'Calculer les temps',
        'Select Landing Time': "Heure d'arrivĂÂŠe",
        'Coordinates field is empty!': 'Aucune coordonnĂÂŠes de renseignĂÂŠe!',
        'Target coordinates are invalid!': 'CoordonnĂÂŠes cibles invalides!',
        From: 'De',
        To: 'Vers',
        Distance: 'Distance',
        'Travel Time': 'DurĂÂŠe du trajet',
        'Launch Time': 'Heure de lancement',
        Send: 'Envoyer',
        'No village can reach in time!':
            'Aucun village ne peut arriver Ă  temps!',
        'This script requires Premium Account to be active!':
            'Ce script nĂÂŠcessite un compte Premium actif!',
        'possible combinations found': 'Combinaisons possibles trouvĂÂŠes',
        Unit: 'UnitĂÂŠ',
        Status: 'Statut',
        'Commands List Export': 'Exporter la liste des envois',
        'Landing Time': "Heure d'arrivĂÂŠe",
        Command: 'Ordre',
        'Send In': 'Envoyer',
        'Export Plan': 'Exporter OpĂÂŠration',
        'Reset Config': 'RĂÂŠinitialiser la configuration',
        'Script configuration has been reset!':
            'La configuration du script est rĂÂŠinitialisĂÂŠe!',
    },
};

// Init Debug
initDebug();

// Init Count API
countAPI();

// Initialize Mass Command Timer
function initMassCommandTimer() {
    collectOwnVillages();

    const savedData = readStorage();
    const { landingTime, unit, targets } = savedData;

    // Show popup
    const content = `
        <div class="ra-mb15">
            <label class="ra-fw600 ra-mb5 ra-dblock" for="raLandingTime">
                ${tt('Select Landing Time')} (dd/mm/yyyy HH:mm:ss)
            </label>
            <input type="text" id="raLandingTime" value="${landingTime ?? ''}">
        </div>
        <div class="ra-mb15">
            <label class="ra-fw600 ra-mb5 ra-dblock">
                ${tt('Select Unit')}
            </label>
            <table width="100%" class="vis ra-table ra-units-table">
                <thead>
                    <tr>
                        <th>
                            <label for="unitSpear">
                                <img src="/graphic/unit/unit_spear.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitSword">
                                <img src="/graphic/unit/unit_sword.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitAxe">
                                <img src="/graphic/unit/unit_axe.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitArcher">
                                <img src="/graphic/unit/unit_archer.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitSpy">
                                <img src="/graphic/unit/unit_spy.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitLight">
                                <img src="/graphic/unit/unit_light.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitMarcher">
                                <img src="/graphic/unit/unit_marcher.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitHeavy">
                                <img src="/graphic/unit/unit_heavy.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitRam">
                                <img src="/graphic/unit/unit_ram.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitCatapult">
                                <img src="/graphic/unit/unit_catapult.png">
                            </label>
                        </th>
                        <th>
                            <label for="unitKnight">
                                <img src="/graphic/unit/unit_knight.png">
                            </label>
                        </th>
						<th>
                            <label for="unitSnob">
                                <img src="/graphic/unit/unit_snob.png">
                            </label>
                        </th>
			        </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input type="radio" value="spear" name="unit_type" id="unitSpear" />
                        </td>
                        <td>
                            <input type="radio" value="sword" name="unit_type" id="unitSword" />
                        </td>
                        <td>
                            <input type="radio" value="axe" name="unit_type" id="unitAxe" />
                        </td>
                        <td>
                            <input type="radio" value="archer" name="unit_type" id="unitArcher" />
                        </td>
                        <td>
                            <input type="radio" value="spy" name="unit_type" id="unitSpy" />
                        </td>
                        <td>
                            <input type="radio" value="light" name="unit_type" id="unitLight" />
                        </td>
                        <td>
                            <input type="radio" value="marcher" name="unit_type" id="unitMarcher" />
                        </td>
                        <td>
                            <input type="radio" value="heavy" name="unit_type" id="unitHeavy" />
                        </td>
                        <td>
                            <input type="radio" value="ram" name="unit_type" checked="checked" id="unitRam" />
                        </td>
                        <td>
                            <input type="radio" value="catapult" name="unit_type" id="unitCatapult" />
                        </td>
                        <td>
                            <input type="radio" value="knight" name="unit_type" id="unitKnight" />
                        </td>
						<td>
                            <input type="radio" value="snob" name="unit_type" id="unitSnob" />
                        </td>
			        </tr>
                </tbody>
            </table>
        </div>
        <div class="ra-mb15">
            <label class="ra-fw600 ra-mb5 ra-dblock" for="raCoordinates">
                ${tt('Enter Coordinates')} <span id="raCoordinatesCount"></span>
            </label>
            <textarea class="ra-textarea" id="raCoordinates">${
                targets ?? ''
            }</textarea>
        </div>
        <div class="ra-mb15" id="raCommandsListBox" style="display:none;">
            <label class="ra-fw600 ra-mb5 ra-dblock" for="raCommandsList">
                ${tt('Commands List Export')}
            </label>
            <textarea class="ra-textarea" id="raCommandsList"></textarea>
        </div>
        <div class="ra-mb15">
            <a href="#" onClick="calculateTimes();" class="btn" id="raCalculateTimesBtn">
                ${tt('Calculate Times')}
            </a>
			<a href="#" class="btn" id="raExportPlanBtn" disabled>
                ${tt('Export Plan')}
            </a>
			<a href="#" class="btn" id="raResetConfigBtn">
                ${tt('Reset Config')}
            </a>
        </div>
        <div class="ra-mb15" id="combinationsStatus" style="display:none;">
            <b>
                <span id="combinationsFound">0</span>
                ${tt('possible combinations found')}
            </b>
        </div>
        <div id="timesTable" style="display:none;"></div>
    `;

    const popupContent = preparePopupContent(content, '640px', '640px');
    Dialog.show('content', popupContent);

    setTimeout(function () {
        const today = new Date().toLocaleString('en-GB').replace(',', '');
        const landingTimeIsNotEmpty =
            landingTime !== null && landingTime !== undefined;

        if (landingTime !== null && landingTime !== undefined) {
            jQuery('#raLandingTime').val(landingTime);
        } else {
            jQuery('#raLandingTime').val(today);
        }

        if (unit !== '') {
            jQuery(`.ra-table input[value="${unit}"]`).prop('checked', true);
        }

        if (unit !== '' && landingTimeIsNotEmpty && targets !== '') {
            jQuery('#raCalculateTimesBtn').trigger('click');
        }
    }, 200);

    handleExportPlan();
    handleResetConfig();
}

// Calculate Times
function calculateTimes() {
    const landingTime = jQuery('#raLandingTime').val();
    const targetCoordinatesArray = jQuery('#raCoordinates')
        .val()
        .match(coord_regex);
    const landingTimeObject = getLandingTime(landingTime);
    const unit = jQuery('input[name="unit_type"]:checked').val();
    if (targetCoordinatesArray?.length) {
        jQuery('#raCoordinatesCount').text(targetCoordinatesArray.length);
    }

    if (DEBUG) {
        console.debug(`${scriptInfo()} landingTime:`, landingTime);
        console.debug(`${scriptInfo()} unit:`, unit);
        console.debug(
            `${scriptInfo()} targetCoordinatesArray:`,
            targetCoordinatesArray
        );
    }

    if (jQuery('#raCoordinates').val() === '') {
        UI.ErrorMessage(tt('Coordinates field is empty!'));
        return;
    }

    if (!targetCoordinatesArray) {
        UI.ErrorMessage(tt('Target coordinates are invalid!'));
        return;
    }

    const targetCoordinates = targetCoordinatesArray.join(' ');
    jQuery('#raCoordinates').val(targetCoordinates);

    var timesArray = [];

    if (targetCoordinatesArray.length) {
        // save data in localStorage
        writeStorage({
            landingTime: landingTime,
            targets: targetCoordinates,
            unit: unit,
        });

        // Collect times array
        targetCoordinatesArray.forEach((targetVillageCoord) => {
            ownVillagesCoords.forEach((ownVillageCoord) => {
                const distance = calculateDistance(
                    targetVillageCoord,
                    ownVillageCoord.coord
                );
                const launchTime = getLaunchTime(
                    unit,
                    landingTimeObject,
                    distance
                );
                const formattedDistance = parseFloat(distance).toFixed(2);
                const unformattedTime =
                    (landingTimeObject.getTime() - launchTime) / 1000;
                const formattedTime = secondsToHms(unformattedTime);
                const formattedLaunchTime = formatDateTime(launchTime);

                const chosenUnitTroopAmount =
                    ownVillageCoord.troops[0][game_data.units.indexOf(unit)];

                if (chosenUnitTroopAmount > 0) {
                    timesArray.push({
                        start: ownVillageCoord.coord,
                        destination: targetVillageCoord,
                        distance: distance,
                        formattedDistance: formattedDistance,
                        unformattedTime: unformattedTime,
                        formattedTime: formattedTime,
                        startVillageId: ownVillageCoord.villageId,
                        launchTime: launchTime,
                        formattedLaunchTime: formattedLaunchTime,
                    });
                }
            });
        });

        // Sort times array by nearest launch time
        timesArray.sort((a, b) => {
            return a.launchTime - b.launchTime;
        });

        // Filter only valid launch times
        let filteredTimes = timesArray.filter((item) => {
            return item.launchTime >= getServerTime().getTime();
        });

        // Keep at maximum the first 1000 items in the times array
        filteredTimes = filteredTimes.slice(0, 1000);

        // Render times table
        if (filteredTimes.length > 0) {
            const tableContent = renderTable(filteredTimes);
            jQuery('#timesTable').fadeIn(200).html(tableContent);
            jQuery('#combinationsStatus').fadeIn(200);
            jQuery('#combinationsFound').text(filteredTimes.length);
            jQuery('#raExportPlanBtn').attr('disabled', false);
            exportCommands(filteredTimes, unit, landingTime);
            Timing.tickHandlers.timers.init();
        } else {
            UI.ErrorMessage(tt('No village can reach in time!'));
            jQuery('#timesTable').html('').fadeOut(0);
            jQuery('#combinationsStatus').fadeOut(0);
            jQuery('#combinationsFound').text(0);
            jQuery('#raExportPlanBtn').attr('disabled', true);
            jQuery('#raCommandsList').text('');
        }
    } else {
        UI.ErrorMessage('Coordinates field is empty!');
    }
}

// Export Plan
function handleExportPlan() {
    jQuery('#raExportPlanBtn').on('click', function (e) {
        e.preventDefault();
        jQuery('#raCommandsListBox').toggle();
    });
}

// Reset script configuration saved on localStorage
function handleResetConfig() {
    jQuery('#raResetConfigBtn').on('click', function (e) {
        e.preventDefault();

        writeStorage({
            targets: '',
            landingTime: '',
            unit: '',
        });

        UI.SuccessMessage(tt('Script configuration has been reset!'));
    });
}

// Export possible command combinations
function exportCommands(commands, unit, landingTime) {
    let bbCodeTableRows = '';
    commands.forEach((command) => {
        const { startVillageId, start, destination, formattedLaunchTime } =
            command;
        const [toX, toY] = destination.split('|');

        let commandUrl = '';

        if (game_data.player.sitter > 0) {
            commandUrl = `/game.php?t=${game_data.player.id}&village=${startVillageId}&screen=place&x=${toX}&y=${toY}${SEND_UNITS}`;
        } else {
            commandUrl = `/game.php?village=${startVillageId}&screen=place&x=${toX}&y=${toY}${SEND_UNITS}`;
        }

        bbCodeTableRows += `\n[*]${formattedLaunchTime}[|]${tt(
            'From'
        )} ${start} ${tt('To')} ${destination} [url=${
            window.location.origin
        }${commandUrl}]${tt('Send')}[/url] [|]`;
    });

    const bbExport = `[size=12][b]${tt(
        'Landing Time'
    )}:[/b] ${landingTime} - [b]${tt(
        'Unit'
    )}:[/b] ${unit}[/size]\n\n[table][**]${tt('Launch Time')}[||]${tt(
        'Command'
    )}[||]${tt('Status')}[/**]${bbCodeTableRows}\n[/table]`;
    jQuery('#raCommandsList').text(bbExport.trim());
}

// Render times table
function renderTable(commands) {
    let tableContent = '';

    const serverTime = getServerTime().getTime();

    commands.forEach((command) => {
        const from = command.start;
        const to = command.destination;
        const distance = command.formattedDistance;
        const travelTime = command.formattedTime;
        const launchTime = command.formattedLaunchTime;
        const startVillageId = command.startVillageId;
        const unformattedLaunchTime = command.launchTime;

        const [toX, toY] = to.split('|');
        const toCoords = to.split('|').join(';');

        const timeTillLaunch = secondsToHms(
            (unformattedLaunchTime - serverTime) / 1000
        );

        let commandUrl = '';

        if (game_data.player.sitter > 0) {
            commandUrl = `/game.php?t=${game_data.player.id}&village=${startVillageId}&screen=place&x=${toX}&y=${toY}${SEND_UNITS}`;
        } else {
            commandUrl = `/game.php?village=${startVillageId}&screen=place&x=${toX}&y=${toY}${SEND_UNITS}`;
        }

        tableContent += `
            <tr>
                <td>
                    <a href="/game.php?screen=info_village&id=${startVillageId}" target="_blank" rel="noopener noreferrer">
                        ${from}
                    </a>
                </td>
                <td>
                    <a href="/game.php?screen=map&x=${toX}&y=${toY}&beacon#${toCoords}" target="_blank" rel="noopener noreferrer">
                        ${to}
                    </a>
                </td>
                <td>
                    ${distance}
                </td>
                <td>
                    ${travelTime}
                </td>
                <td>
                    ${launchTime}
                </td>
				<td>
                   <span class="timer">${timeTillLaunch}</span>
                </td>
                <td>
                    <a href="${commandUrl}" onClick="highlightOpenedCommands(this);" class="btn" target="_blank" rel="noopener noreferrer">
                        ${tt('Send')}
                    </a>
                </td>
            </tr>
        `;
    });

    const renderedTable = `
        <table class="vis ra-table" width="100%">
            <thead>
                <tr>
                    <th>
                        ${tt('From')}
                    </th>
                    <th>
                        ${tt('To')}
                    </th>
                    <th>
                        ${tt('Distance')}
                    </th>
                    <th>
                        ${tt('Travel Time')}
                    </th>
                    <th>
                        ${tt('Launch Time')}
                    </th>
					<th>
                        ${tt('Send In')}
                    </th>
                    <th>
                        ${tt('Send')}
                    </th>
                </tr>
            </thead>
            <tbody>
                ${tableContent}
            </tbody>
        </table>
    `;

    return renderedTable;
}

// Highlight Opened Commands
function highlightOpenedCommands(element) {
    element.classList.add('btn-confirm-yes');
    element.classList.add('btn-already-sent');
    element.parentElement.parentElement.classList.add('already-sent-command');
}

// Helper: Get launch time of command
function getLaunchTime(unit, landingTime, distance) {
    const msPerSec = 1000;
    const secsPerMin = 60;
    const msPerMin = msPerSec * secsPerMin;

    const unitSpeed = unitInfo.config[unit].speed;
    const unitTime = distance * unitSpeed * msPerMin;

    const launchTime = new Date();
    launchTime.setTime(
        Math.round((landingTime - unitTime) / msPerSec) * msPerSec
    );

    return launchTime.getTime();
}

// Helper: Get landing time date object
function getLandingTime(landingTime) {
    const [landingDay, landingHour] = landingTime.split(' ');
    const [day, month, year] = landingDay.split('/');
    const landingTimeFormatted =
        year + '-' + month + '-' + day + ' ' + landingHour;
    const landingTimeObject = new Date(landingTimeFormatted);
    return landingTimeObject;
}

// Helper: Get server time
function getServerTime() {
    const serverTime = jQuery('#serverTime').text();
    const serverDate = jQuery('#serverDate').text();

    const [day, month, year] = serverDate.split('/');
    const serverTimeFormatted =
        year + '-' + month + '-' + day + ' ' + serverTime;
    const serverTimeObject = new Date(serverTimeFormatted);

    return serverTimeObject;
}

// Helper: Calculate distance between 2 villages
function calculateDistance(villageA, villageB) {
    const x1 = villageA.split('|')[0];
    const y1 = villageA.split('|')[1];

    const x2 = villageB.split('|')[0];
    const y2 = villageB.split('|')[1];

    const deltaX = Math.abs(x1 - x2);
    const deltaY = Math.abs(y1 - y2);

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    return distance;
}

// Helper: Format date
function formatDateTime(date) {
    let currentDateTime = new Date(date);

    var currentYear = currentDateTime.getFullYear();
    var currentMonth = currentDateTime.getMonth();
    var currentDate = currentDateTime.getDate();
    var currentHours = '' + currentDateTime.getHours();
    var currentMinutes = '' + currentDateTime.getMinutes();
    var currentSeconds = '' + currentDateTime.getSeconds();

    currentMonth = currentMonth + 1;
    currentMonth = '' + currentMonth;
    currentMonth = currentMonth.padStart(2, '0');

    currentHours = currentHours.padStart(2, '0');
    currentMinutes = currentMinutes.padStart(2, '0');
    currentSeconds = currentSeconds.padStart(2, '0');

    let formatted_date =
        currentDate +
        '/' +
        currentMonth +
        '/' +
        currentYear +
        ' ' +
        currentHours +
        ':' +
        currentMinutes +
        ':' +
        currentSeconds;

    return formatted_date;
}

// Helper: Convert Seconds to Hour:Minutes:Seconds
function secondsToHms(timestamp) {
    const hours = Math.floor(timestamp / 60 / 60);
    const minutes = Math.floor(timestamp / 60) - hours * 60;
    const seconds = timestamp % 60;
    const formatted =
        hours.toString().padStart(2, '0') +
        ':' +
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');
    return formatted;
}

// Helper: Collect own villages
function collectOwnVillages() {
    const combinedTable = jQuery('#combined_table tr:not(:eq(0))');
    combinedTable.each(function () {
        const coordText = jQuery(this).find('.quickedit-content').text().trim();
        const villageId = jQuery(this)
            .find('.quickedit-content')
            .parent()
            .attr('data-id');

        const coord = fnExtractCoords(coordText);

        const villageTroops = getVillageTroops(jQuery(this));

        ownVillagesCoords.push({
            coord: coord,
            villageId: parseInt(villageId),
            troops: villageTroops,
        });
    });

    if (DEBUG) {
        console.debug(`${scriptInfo()} ownVillagesCoords:`, ownVillagesCoords);
    }
}

// Helper: Get village troops
function getVillageTroops(object) {
    const homeTroops = [];
    jQuery(object).each(function () {
        let rowTroops = [];
        const units = jQuery(this).find('td.unit-item, a[href*="screen=snob"]');
        units.each(function () {
            const unit = parseInt(jQuery(this).text().trim());
            rowTroops.push(unit);
        });
        homeTroops.push(rowTroops);
    });
    return homeTroops;
}

// Helper: XML to JSON converter
var xml2json = function ($xml) {
    var data = {};
    $.each($xml.children(), function (i) {
        var $this = $(this);
        if ($this.children().length > 0) {
            data[$this.prop('tagName')] = xml2json($this);
        } else {
            data[$this.prop('tagName')] = $.trim($this.text());
        }
    });
    return data;
};

// Helper: Get parameter by name
function getParameterByName(name, url = window.location.href) {
    return new URL(url).searchParams.get(name);
}

// Helper: Extract coords from string
function fnExtractCoords(string) {
    const vv = string.match(/\d+\|\d+/gi);
    return vv ? vv[vv.length - 1] : null;
}

// Helper: Prepare Popup Content
function preparePopupContent(
    popupBody,
    minWidth = '340px',
    maxWidth = '360px'
) {
    const popupHeader = `
		<h3 class="ra-fs18 ra-fw600">
			${tt(scriptData.name)}
		</h3>
		<div class="ra-body">`;
    const popupFooter = `</div><small class="ra-footer"><strong>${tt(
        scriptData.name
    )} ${scriptData.version}</strong> - <a href="${
        scriptData.authorUrl
    }" target="_blank" rel="noreferrer noopener">${
        scriptData.author
    }</a> - <a href="${
        scriptData.helpLink
    }" target="_blank" rel="noreferrer noopener">${tt('Help')}</a></small>`;
    const popupStyle = `
		<style>
			.popup_box_content { overflow-y: hidden; }
			.ra-body { width: 100%; min-width: ${minWidth}; max-width: ${maxWidth}; box-sizing: border-box; }
			.ra-fs12 { font-size: 12px; }
			.ra-fs16 { font-size: 16px; }
			.ra-fs18 { font-size: 18px; }
            .ra-fw600 { font-weight: 600; }
            .ra-mb5 { margin-bottom: 5px; }
			.ra-mb10 { margin-bottom: 10px; }
			.ra-mb15 { margin-bottom: 15px; }
            .ra-tac { text-align: center; }
            .ra-dblock { display: block; }
            .ra-table { border-spacing: 2px; border-collapse: separate; margin-bottom: 5px; border: 2px solid #f0e2be; }
            .ra-table th { text-align: center; text-align: center; }
            .ra-table td { padding: 1px 2px; text-align: center; }
            .ra-table td a { word-break: break-all; }
			.ra-table tr:nth-of-type(2n) td { background-color: #f0e2be }
            .ra-table tr:nth-of-type(2n+1) td { background-color: #fff5da; }
            .ra-units-table th:hover { background-color: rgba(97, 48, 0, 0.6) !important; background-image: none !important; cursor: pointer !important; }
            .ra-units-table th label { display: block; width: 100%; cursor: pointer !important; }
			.ra-textarea { width: 100%; height: 60px; box-sizing: border-box; padding: 5px; resize: none; }
			.ra-textarea:focus { box-shadow: none; outline: none; border: 1px solid #000; background-color: #eee; }
			.ra-form-control { font-size: 12px; padding: 4px; width: 100%; box-sizing: border-box; }
			.ra-flex { display: flex; flex-flow: row wrap; justify-content: space-between; }
			.ra-flex-6 { flex: 0 0 48%; }
            .ra-flex-4 { flex: 0 0 30.5%; }
            .ra-footer { display: block; width: 100%; margin-top: 15px; }
            #raLandingTime { font-size: 16px; display: block; width: 100%; padding: 5px; box-sizing: border-box; }
            #timesTable { max-height: 250px; overflow-y: auto; }
            .btn-disabled { pointer-events: none; display: none; }
            .btn-already-sent { padding: 3px; }
            .already-sent-command { opacity: 0.6; }
		</style>
	`;

    let popupContent = `
		${popupHeader}
		${popupBody}
		${popupFooter}
		${popupStyle}
	`;

    return popupContent;
}

// Helper: Save data into localStorage
function writeStorage(data) {
    const initialStateData = readStorage();

    const dataToSave = {
        ...initialStateData,
        ...data,
    };

    localStorage.setItem(
        `${scriptData.prefix}_data`,
        JSON.stringify(dataToSave)
    );
}

// Helper: Function read data from localStorage
function readStorage() {
    const data = localStorage.getItem(`${scriptData.prefix}_data`) ?? null;
    if (data !== null) {
        const dataJSON = JSON.parse(data);
        return dataJSON;
    }
    return {};
}

// Helper: Format as number
function formatAsNumber(number) {
    return parseInt(number).toLocaleString('de');
}

// Helper: Count API
function countAPI() {
    const { author, prefix } = scriptData;
    jQuery.getJSON(
        `https://api.countapi.xyz/hit/${author}/${prefix}`,
        function ({ value }) {
            console.debug(
                `${scriptInfo()} This script has been run ${formatAsNumber(
                    parseInt(value)
                )} times.`
            );
        }
    );
}

// Helper: Generates script info
function scriptInfo() {
    return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Prints universal debug information
function initDebug() {
    console.debug(`${scriptInfo()} It works đ!`);
    console.debug(`${scriptInfo()} HELP:`, scriptData.helpLink);
    if (DEBUG) {
        console.debug(`${scriptInfo()} Market:`, game_data.market);
        console.debug(`${scriptInfo()} World:`, game_data.world);
        console.debug(`${scriptInfo()} Screen:`, game_data.screen);
        console.debug(`${scriptInfo()} Game Version:`, game_data.majorVersion);
        console.debug(`${scriptInfo()} Game Build:`, game_data.version);
        console.debug(`${scriptInfo()} Locale:`, game_data.locale);
        console.debug(
            `${scriptInfo()} Premium:`,
            game_data.features.Premium.active
        );
    }
}

// Helper: Text Translator
function tt(string) {
    var gameLocale = game_data.locale;

    if (translations[gameLocale] !== undefined) {
        return translations[gameLocale][string];
    } else {
        return translations['en_DK'][string];
    }
}

(function () {
    if (game_data.features.Premium.active) {
        const gameScreen = getParameterByName('screen');
        const gameMode = getParameterByName('mode');

        if (
            allowedScreens.includes(gameScreen) &&
            allowedModes.includes(gameMode)
        ) {
            initMassCommandTimer();
        } else {
            window.location.assign(
                game_data.link_base_pure + 'overview_villages&mode=combined'
            );
        }
    } else {
        UI.ErrorMessage(
            tt('This script requires Premium Account to be active!')
        );
    }
})();