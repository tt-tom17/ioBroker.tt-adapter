/*
    ioBroker.vis public-transport Widget-Set - Abfahrtstafel

    Copyright 2026 tt-tom17 tgb@kabelmail.de
*/
'use strict';

// Übersetzungen für den Edit-Modus
$.extend(true, systemDictionary, {
    headerText: { en: 'Headline', de: 'Überschrift' },
    oidDepartures: { en: 'Departures Object ID', de: 'Abfahrten Objekt ID' },
    maxDepartures: { en: 'Max. Departures', de: 'Max. Abfahrten' },
    showClock: { en: 'Show Clock', de: 'Uhr anzeigen' },
    updateInterval: {
        en: 'Update Interval (seconds)',
        de: 'Aktualisierungsintervall (Sekunden)',
    },
    remarkhint: { en: 'Show hints', de: 'Hinweise anzeigen' },
    remarkwarning: { en: 'Show warnings', de: 'Warnungen anzeigen' },
    remarkstatus: { en: 'Show status messages', de: 'Statusmeldungen anzeigen' },
});

// Widget Binding
vis.binds['public-transportDepTt'] = {
    version: '0.0.1',

    showVersion: function () {
        if (vis.binds['public-transportDepTt'].version) {
            console.log('Version public-transportDepTt: ' + vis.binds['public-transportDepTt'].version);
            vis.binds['public-transportDepTt'].version = null;
        }
    },

    /**
     * Erstellt das Abfahrtstafel-Widget
     *
     * @param    widgetID - Die ID des Widgets
     * @param    view - Die aktuelle Ansicht
     * @param    data - Die Konfigurationsdaten des Widgets
     * @param    style - Die Stil-Daten des Widgets
     */
    createDepTt: function (widgetID, view, data, style) {
        const $div = $('#' + widgetID);

        // Falls Element nicht gefunden => warten
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['public-transportDepTt'].createDepTt(widgetID, view, data, style);
            }, 100);
        }

        // Standard-Werte setzen
        const headerText = data.headerText || 'Abfahrten';
        const maxDepartures = data.maxDepartures || 10;
        const showClock = data.showClock === true;
        const updateInterval = data.updateInterval || 60;
        const showRemarkHint = data.remarkhint === true;
        const showRemarkWarning = data.remarkwarning === true;
        const showRemarkStatus = data.remarkstatus === true;

        // HTML-Struktur erstellen
        let html = '';
        html += '<div class="pub-trans-deptt-container ' + data.class + '" style="width: 100%; height: 100%;">';

        // Header
        html += '<div class="pub-trans-deptt-header">';
        html += headerText;
        if (showClock) {
            html += '<div class="pub-trans-deptt-clock" id="clock-' + widgetID + '">--:--</div>';
        }
        html += '</div>';

        // Spaltenüberschriften
        html += '<div class="pub-trans-deptt-column-header">';
        html += '<div class="col-time">Zeit</div>';
        html += '<div class="col-line">Linie / Ziel</div>';
        html += '<div class="col-delay">Verspätung</div>';
        html += '<div class="col-platform">Gleis</div>';
        html += '<div class="col-info">Info</div>';
        html += '</div>';

        // Content-Bereich für Abfahrten
        html += '<div class="pub-trans-deptt-content" id="content-' + widgetID + '">';
        html += '<div class="pub-trans-deptt-loading">Lade Daten</div>';
        html += '</div>';

        html += '</div>';

        $div.html(html);

        // Funktionen zum Aktualisieren der Anzeige
        function updateClock() {
            if (!showClock) return;

            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            $('#clock-' + widgetID).text(hours + ':' + minutes);
        }

        function groupRemarksByType(remarks) {
            const hints = [];
            const warnings = [];
            const statuses = [];
        
            for (const remark of remarks) {
                switch (remark.type) {
                    case 'hint':
                        hints.push(remark.text ?? '');
                        break;
                    case 'warning':
                        warnings.push(remark.text ?? '');
                        break;
                    case 'status':
                        statuses.push(remark.text ?? '');
                        break;
                }
            }
        
            return {
                hint: hints.length > 0 ? hints.join('\n') : undefined,
                warning: warnings.length > 0 ? warnings.join('\n') : undefined,
                status: statuses.length > 0 ? statuses.join('\n') : undefined,
            };
        }

        function getProductClass(productName) {
            if (!productName) return 'train';

            const product = productName.toLowerCase();
            if (product.includes('bus')) return 'bus';
            if (product.includes('tram') || product.includes('straßenbahn')) return 'tram';
            if (product.includes('u-bahn') || product.includes('ubahn') || product.includes('subway')) return 'subway';
            if (product.includes('s-bahn') || product.includes('sbahn') || product.includes('suburban')) return 'sbahn';
            return 'train';
        }

        function formatDelay(delay) {
            if (!delay || delay === 0) {
                return '<span class="pub-trans-deptt-delay ontime">pünktlich</span>';
            } else if (delay > 0) {
                return '<span class="pub-trans-deptt-delay delayed">+' + delay/60 + ' min</span>';
            } else {
                return '<span class="pub-trans-deptt-delay ontime">' + delay/60 + ' min</span>';
            }
        }

        function updateDepartures(e, newVal, oldVal) {
            let departures = [];

            try {
                if (typeof newVal === 'string') {
                    departures = JSON.parse(newVal);
                } else if (Array.isArray(newVal)) {
                    departures = newVal;
                } else if (newVal && typeof newVal === 'object') {
                    departures = [newVal];
                }
            } catch (err) {
                console.error('Error parsing departures data:', err);
                $('#content-' + widgetID).html(
                    '<div class="pub-trans-deptt-no-data">Fehler beim Laden der Daten</div>',
                );
                return;
            }

            const $content = $('#content-' + widgetID);

            if (!departures || departures.length === 0) {
                $content.html('<div class="pub-trans-deptt-no-data">Keine Abfahrten verfügbar</div>');
                return;
            }

            // Begrenze auf maxDepartures
            const displayDepartures = departures.slice(0, maxDepartures);

            let html = '';
            displayDepartures.forEach(function (dep) {
                const time = dep.when || dep.time || dep.scheduledWhen || '--:--';
                const line = dep.line.name || dep.lineName || dep.number || '?';
                const direction = dep.direction || dep.destination || '';
                const delay = dep.delay || 0;
                const platform = dep.platform || dep.track || '--';
                const plannedPlatform = dep.plannedPlatform || dep.plannedTrack || null;
                const changedPlatform = plannedPlatform && plannedPlatform !== platform;
                const cancelled = dep.cancelled || false;
                const product = dep.line.product || dep.productName || 'train';
                const remarks = dep.remarks && dep.remarks.length > 0 ? groupRemarksByType(dep.remarks) : {};

                // Zeit formatieren
                let displayTime = time;
                if (time !== '--:--' && typeof time === 'string') {
                    const timeObj = new Date(time);
                    if (!isNaN(timeObj.getTime())) {
                        displayTime =
                            String(timeObj.getHours()).padStart(2, '0') +
                            ':' +
                            String(timeObj.getMinutes()).padStart(2, '0');
                    }
                }

                html += '<div class="pub-trans-deptt-row">';
                html += '<div class="pub-trans-deptt-time">' + displayTime + '</div>';

                html += '<div class="pub-trans-deptt-line">';
                html += '<span class="pub-trans-deptt-line-icon ' + getProductClass(product) + '">' + line + '</span>';
                html += '<span class="pub-trans-deptt-direction">' + direction + '</span>';
                html += '</div>';

                html +=
                    '<div>' +
                    (cancelled ? '<span class="pub-trans-deptt-delay cancelled">Ausfall</span>' : formatDelay(delay)) +
                    '</div>';
                html += '<div class="pub-trans-deptt-platform' + (changedPlatform ? ' changed' : '') + '">' + platform + '</div>';
                html += '<div>' + (cancelled ? 'Fällt aus' : (showRemarkWarning ? remarks.warning : '') || (showRemarkStatus ? remarks.status : '') || (showRemarkHint ? remarks.hint : '') || '') + '</div>';
                html += '</div>';
            });

            $content.html(html);
        }

        // State-Binding einrichten
        if (data.oidDepartures) {
            vis.states.bind(data.oidDepartures + '.val', updateDepartures);
            $div.data('bound', [data.oidDepartures + '.val']);
            $div.data('bindHandler', updateDepartures);

            // Initiale Aktualisierung
            if (vis.states[data.oidDepartures + '.val']) {
                updateDepartures(null, vis.states[data.oidDepartures + '.val'], null);
            }
        }

        // Uhr aktualisieren
        if (showClock) {
            updateClock();
            setInterval(updateClock, 1000);
        }

        // Periodische Aktualisierung
        if (updateInterval > 0) {
            setInterval(function () {
                if (data.oidDepartures && vis.states[data.oidDepartures + '.val']) {
                    updateDepartures(null, vis.states[data.oidDepartures + '.val'], null);
                }
            }, updateInterval * 1000);
        }
    },
};

vis.binds['public-transportDepTt'].showVersion();
