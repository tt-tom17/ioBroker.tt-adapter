/*
    ioBroker.vis Bahnhof-Tafel Widget-Set

    Copyright 2025 bahnhof-tafel
*/
'use strict';

// add translations for edit mode
$.extend(true, systemDictionary, {
    oid_destination: {
        en: 'Destination OID',
        de: 'Ziel Datenpunkt',
        ru: 'OID пункта назначения',
        pt: 'OID de destino',
        nl: 'Bestemming OID',
        fr: 'OID de destination',
        it: 'OID di destinazione',
        es: 'OID de destino',
        pl: 'OID miejsca przeznaczenia',
        uk: 'OID призначення',
        'zh-cn': '目的地 OID',
    },
    oid_time: {
        en: 'Time OID',
        de: 'Zeit Datenpunkt',
        ru: 'Время OID',
        pt: 'Tempo OID',
        nl: 'Tijd OID',
        fr: 'Heure OID',
        it: 'Tempo OID',
        es: 'Tiempo OID',
        pl: 'Czas OID',
        uk: 'Час OID',
        'zh-cn': '时间 OID',
    },
    oid_platform: {
        en: 'Platform OID',
        de: 'Gleis Datenpunkt',
        ru: 'OID платформы',
        pt: 'OID da plataforma',
        nl: 'Platform OID',
        fr: 'OID de quai',
        it: 'OID piattaforma',
        es: 'OID de plataforma',
        pl: 'OID platformy',
        uk: 'OID платформи',
        'zh-cn': '平台 OID',
    },
    oid_status: {
        en: 'Status OID',
        de: 'Status Datenpunkt',
        ru: 'Статус OID',
        pt: 'Status OID',
        nl: 'Status OID',
        fr: 'Statut OID',
        it: 'Stato OID',
        es: 'Estado OID',
        pl: 'Status OID',
        uk: 'Статус OID',
        'zh-cn': '状态 OID',
    },
});

// Helper functions
function renderBahnhofSplitFlap(text, maxLength, $container) {
    text = text || '';
    var paddedText = (text.toString().toUpperCase() + ' '.repeat(maxLength)).substring(0, maxLength);
    $container.empty();

    for (var i = 0; i < paddedText.length; i++) {
        var char = paddedText[i];
        var $flipChar = $('<div class="bahnhof-flip-char"></div>');
        var $flipCard = $('<div class="bahnhof-flip-card"></div>');
        var $flipFront = $('<div class="bahnhof-flip-front">' + char + '</div>');
        var $flipBack = $('<div class="bahnhof-flip-back">' + char + '</div>');

        $flipCard.append($flipFront).append($flipBack);
        $flipChar.append($flipCard);
        $container.append($flipChar);
    }
}

function updateBahnhofDisplay($div, field, value, maxLength) {
    var $container = $div.find('.bahnhof-flip-display[data-field="' + field + '"]');
    if ($container.length === 0) return;

    $container.find('.bahnhof-flip-card').addClass('bahnhof-flipping');

    setTimeout(function () {
        renderBahnhofSplitFlap(value, maxLength, $container);
        setTimeout(function () {
            $container.find('.bahnhof-flip-card').removeClass('bahnhof-flipping');
        }, 50);
    }, 300);
}

vis.binds['bahnhof-tafel'] = {
    version: '1.0.0',
    showVersion: function () {
        if (vis.binds['bahnhof-tafel'].version) {
            console.log('Version bahnhof-tafel: ' + vis.binds['bahnhof-tafel'].version);
            vis.binds['bahnhof-tafel'].version = null;
        }
    },
    createWidget: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);

        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['bahnhof-tafel'].createWidget(widgetID, view, data, style);
            }, 100);
        }

        console.log('Bahnhof-Tafel Widget initialized:', widgetID);

        // Initial render with timeout to ensure DOM is ready
        setTimeout(function () {
            renderBahnhofSplitFlap('12:45', 5, $div.find('.bahnhof-time-display'));
            renderBahnhofSplitFlap('MÜNCHEN HBF', 25, $div.find('.bahnhof-destination-display'));
            renderBahnhofSplitFlap('7', 3, $div.find('.bahnhof-platform-display'));
        }, 100);

        // Bind Destination
        if (data.oid_destination && data.oid_destination !== 'nothing_selected') {
            vis.states.bind(data.oid_destination + '.val', function (e, newVal, oldVal) {
                updateBahnhofDisplay($div, 'destination', newVal, 25);
            });

            var val = vis.states.attr(data.oid_destination + '.val');
            if (val !== null && val !== undefined) {
                setTimeout(function () {
                    updateBahnhofDisplay($div, 'destination', val, 25);
                }, 200);
            }
        }

        // Bind Time
        if (data.oid_time && data.oid_time !== 'nothing_selected') {
            vis.states.bind(data.oid_time + '.val', function (e, newVal, oldVal) {
                updateBahnhofDisplay($div, 'time', newVal, 5);
            });

            var val = vis.states.attr(data.oid_time + '.val');
            if (val !== null && val !== undefined) {
                setTimeout(function () {
                    updateBahnhofDisplay($div, 'time', val, 5);
                }, 200);
            }
        }

        // Bind Platform
        if (data.oid_platform && data.oid_platform !== 'nothing_selected') {
            vis.states.bind(data.oid_platform + '.val', function (e, newVal, oldVal) {
                updateBahnhofDisplay($div, 'platform', newVal, 3);
            });

            var val = vis.states.attr(data.oid_platform + '.val');
            if (val !== null && val !== undefined) {
                setTimeout(function () {
                    updateBahnhofDisplay($div, 'platform', val, 3);
                }, 200);
            }
        }

        // Bind Status
        if (data.oid_status && data.oid_status !== 'nothing_selected') {
            vis.states.bind(data.oid_status + '.val', function (e, newVal, oldVal) {
                var $status = $div.find('.bahnhof-status-display[data-field="status"]');
                var statusText = newVal ? newVal.toString().toUpperCase() : 'PÜNKTLICH';
                $status.text(statusText);

                if (statusText.includes('VERSPÄTUNG') || statusText.includes('DELAY')) {
                    $status.addClass('bahnhof-delayed');
                } else {
                    $status.removeClass('bahnhof-delayed');
                }
            });

            var val = vis.states.attr(data.oid_status + '.val');
            if (val !== null && val !== undefined) {
                var $status = $div.find('.bahnhof-status-display[data-field="status"]');
                var statusText = val ? val.toString().toUpperCase() : 'PÜNKTLICH';
                $status.text(statusText);

                if (statusText.includes('VERSPÄTUNG') || statusText.includes('DELAY')) {
                    $status.addClass('bahnhof-delayed');
                } else {
                    $status.removeClass('bahnhof-delayed');
                }
            }
        }
    },
};

vis.binds['bahnhof-tafel'].showVersion();
