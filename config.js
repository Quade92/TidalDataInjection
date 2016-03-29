parserConfig = {
    sn: "1234567890123",
    mode: "backward",
    AN1: "current 1",
    AN2: "current 2",
    AN3: "current 3",
    AN4: "current 4",
    AN5: "voltage 1",
    AN6: "voltage 2",
    AN7: "voltage 3",
    AN8: "voltage 4"
};

apiConfig = {
    host: "localhost",
    port: "5000",
    path: "/record"
};

dbConfig = {
    host: "localhost",
    port: "27999",
    db: "data_db"
};

spConfig = {
    COM: "COM7",
    br: 9600
};

exports.parserConfig = parserConfig;
exports.apiConfig = apiConfig;
exports.dbConfig = dbConfig;
exports.spConfig = spConfig;