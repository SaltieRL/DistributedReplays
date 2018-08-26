define([''], function () {
    // CONSTANTS
    // Only standard maps here
    const FIELD_WIDTH = 4120.0;
    const FIELD_HEIGHT = 1000.0;
    const FIELD_LENGTH = 5140.0;

    return {
        CAR_LENGTH : 240,
        CAR_WIDTH : 160,
        CAR_HEIGHT : 80,
        FIELD_RATIO : FIELD_LENGTH / FIELD_WIDTH,
        FIELD_WIDTH : FIELD_WIDTH * 2,
        FIELD_HEIGHT : FIELD_HEIGHT * 2,
        FIELD_LENGTH : FIELD_LENGTH * 2
    }
});
