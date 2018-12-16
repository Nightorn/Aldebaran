module.exports = function(bitfield) {
    const mods = {
        PF: 16384,
        SO: 4096,
        FL: 1024,
        NC: 512,
        HT: 256,
        RX: 128,
        DT: 64,
        SD: 32,
        HR: 16,
        HD: 8,
        EZ: 2,
        NF: 1,
        None: 0
    };
    var actualBitfield = bitfield;
    var foundMods = [];

    do {
        for (let [key, value] of Object.entries(mods)) {
            if (value <= actualBitfield) {
                foundMods.push(key);
                actualBitfield -= value;
            }
        }
    } while (actualBitfield != 0);

    foundMods != [] && foundMods.indexOf('None') != -1 ? foundMods.pop() : foundMods;
    return foundMods;
}