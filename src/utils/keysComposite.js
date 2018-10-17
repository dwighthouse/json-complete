// Composite types have a value, made up of other types, that must be manually encoded and decoded
// This is above and beyond any attachment values
module.exports = {
    'da': 1, // Date
    'sy': 1, // Symbol
    're': 1, // Regex
    'fu': 1, // Function
    'er': 1, // Error
    'BO': 1, // Object-wrapped Boolean
    'NM': 1, // Object-wrapped Number
    'ST': 1, // Object-wrapped String
    'I1': 1, // Int8Array
    'U1': 1, // Uint8Array
    'C1': 1, // Uint8ClampedArray
    'I2': 1, // Int16Array
    'U2': 1, // Uint16Array
    'I3': 1, // Int32Array
    'U3': 1, // Uint32Array
    'F3': 1, // Float32Array
    'F4': 1, // Float64Array
    'AB': 1, // ArrayBuffer
    'Se': 1, // Set
    'Ma': 1, // Map
    'Bl': 1, // Blob
    'Fi': 1, // File
};