'use strict'
module.exports = function AutoWine(mod) {
    const { command } = mod;

    let enabled = false;

    const redwine = 80062;
    const whitewine = 80063;
    const mana_potion = 6562;
    const fish_friters = 206035;

    const redwine_abn = 70258;
    const whitewine_abn = 70259;
    const fish_friters_abn = 70233;

    const zones = [
        3205,
        3036,
        9044
    ];

    let aZone = 0;
    let alive = true;
    let mp;
    let physicals = [0, 1, 2, 3, 5, 10, 12];
    let magicals = [4, 6, 7, 8, 9, 11];
    let phys = false;
    let mag = false;
    let gameId;
    let model;
    let job;
    let drunk;
    let fish;
    let potMp = true;
    let isRedWineUp = true;
    let isWhiteWineUp = true;

    let myAngle;
    let myPosition;

    command.add('autowine', {
        '$default'() {
            enabled = !enabled;
            command.message(`${enabled ? "enabled" : "disabled"}`);
        }
    })

    mod.hook('S_LOAD_TOPO', 3, (event) => {
        aZone = event.zone;
    })

    mod.hook('C_PLAYER_LOCATION', 5, (event) => {
        myPosition = event.loc;
        myAngle = event.w;
    });

    mod.hook('S_PLAYER_STAT_UPDATE', 17, (event) => {
        if (!enabled) return;
        alive = event.alive;
        mp = event.mp;
        if (event.status == 1 && event.alive && !drunk && isRedWineUp == true && zones.includes(aZone)) {
            if (phys) {
                mod.send('C_USE_ITEM', 3, {
                    gameId: gameId,
                    id: redwine,
                    dbid: 0n,
                    target: 0n,
                    amount: 1,
                    dest: { x: 0, y: 0, z: 0 },
                    loc: myPosition,
                    w: myAngle,
                    unk1: 0,
                    unk2: 0,
                    unk3: 0,
                    unk4: true
                });
                isRedWineUp = false;
                setTimeout(function () {
                        isRedWineUp = true;
                }, 60000);
            } else if (mag && isWhiteWineUp == true) {
                mod.send('C_USE_ITEM', 3, {
                    gameId: gameId,
                    id: whitewine,
                    dbid: 0n,
                    target: 0n,
                    amount: 1,
                    dest: { x: 0, y: 0, z: 0 },
                    loc: myPosition,
                    w: myAngle,
                    unk1: 0,
                    unk2: 0,
                    unk3: 0,
                    unk4: true
                });
                isWhiteWineUp = false;
                setTimeout(function () {
                        isWhiteWineUp = true;
                }, 60000);
            }
        }
        if (event.status == 1 && event.alive && !fish && zones.includes(aZone)) {
            mod.send('C_USE_ITEM', 3, {
                gameId: gameId,
                id: fish_friters,
                dbid: 0n,
                target: 0n,
                amount: 1,
                dest: { x: 0, y: 0, z: 0 },
                loc: myPosition,
                w: myAngle,
                unk1: 0,
                unk2: 0,
                unk3: 0,
                unk4: true
            });
        }
        if (event.alive && mp < 1000 && potMp == true) {
            mod.send('C_USE_ITEM', 3, {
                gameId: gameId,
                id: mana_potion,
                dbid: 0n,
                target: 0n,
                amount: 1,
                dest: { x: 0, y: 0, z: 0 },
                loc: myPosition,
                w: myAngle,
                unk1: 0,
                unk2: 0,
                unk3: 0,
                unk4: true
            });
            potMp = false;
            setTimeout(function () {
                    potMp = true;
			}, 10000);
        }
    })

    mod.hook('S_LOGIN', mod.majorPatchVersion >= 81 ? 15 : 14, (event) => {
        enabled = true;
        gameId = event.gameId;
        model = event.templateId;
        job = (model - 10101) % 100;
        if (physicals.includes(job)) {
            phys = true;
            mag = false;
        }
        else if (magicals.includes(job)) {
            phys = false;
            mag = true;
        }
    })

    mod.hook('S_ABNORMALITY_BEGIN', 5, (event) => {
        if ((event.id === redwine_abn || event.id === whitewine_abn) && gameId === event.target) {
            drunk = true;
        }
        if (event.id === fish_friters_abn && gameId === event.target) {
            fish = true;
        }
    })

    mod.hook('S_ABNORMALITY_REFRESH', 2, (event) => {
        if ((event.id === redwine_abn || event.id === whitewine_abn) && gameId === event.target) {
            drunk = true;
        }
        if (event.id === fish_friters_abn && gameId === event.target) {
            fish = true;
        }
    })

    mod.hook('S_ABNORMALITY_END', 1, (event) => {
        if ((event.id === redwine_abn || event.id === whitewine_abn) && gameId === event.target) {
            drunk = false;
        }
        if (event.id === fish_friters_abn && gameId === event.target) {
            fish = false;
        }
    })
}