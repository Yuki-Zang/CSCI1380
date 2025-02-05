/*
    Checklist:

    1. Serialize strings ok!!!!!
    2. Serialize numbers ok!!!!!
    3. Serialize booleans ok!!!!!
    4. Serialize (non-circular) Objects ok!!!!!
    5. Serialize (non-circular) Arrays ok!!!!!
    6. Serialize undefined and null ok!!!!!
    7. Serialize Date, Error objects ok!!!!!
    8. Serialize (non-native) functions
    9. Serialize circular objects and arrays
    10. Serialize native functions
*/


function serialize(object) {
    // specify data type
    let objType;
    if (object === null){
        objType = "null";
    }else if (object instanceof Date){//TODO: may need to add sanity check to ensure that this is valid
        objType = "date";
    }else if (object instanceof Error){
        objType = "error";
    }else if (Array.isArray(object)){
        objType = "array";
    }
    else{
        objType = typeof object;
    }

    let totalLens;
    switch (objType) {
        case "number":
        case "boolean":
        case "string":
        case "function":
            totalLens = 3 + objType.length + object.toString().length;
            return `${totalLens}{${objType},${object.toString()}}`;
        case "undefined":
        case "null":
            totalLens = 3 + objType.length;
            return `${totalLens}{${objType},}`;
        case "date":
            totalLens = 3 + objType.length + object.toISOString().length;
            return `${totalLens}{${objType},${object.toISOString()}}`;
        case "error":
            totalLens = 3 + objType.length + object.message.length;
            return `${totalLens}{${objType},${object.message}}`;
        case "array":
            totalLens = 5 + objType.length;
            let parsedArray= "{array,["
            for (let ele of object){
                parsedArray += serialize(ele);
            }
            parsedArray += "]}";
            parsedArray = `${parsedArray.length}` + parsedArray;
            return parsedArray;
        case "object":
            let parsedObject = "{object,{";
            for (let [key, value] of Object.entries(object)){
                parsedObject += `${key.length}`+"("+key+":"+serialize(value)+")";
            }
            parsedObject += "}}";
            parsedObject = `${parsedObject.length}` + parsedObject;
            return parsedObject;
        default:
            throw new Error(`Unrecognized type: ${objType}`);
      }
}


function deserialize(string) {
    // extract the length first
    let elementLength;
    for (let i=0; i<string.length; i++){
        if (string[i] === "{"){
            elementLength = Number(string.slice(0, i));
            string = string.slice(i, i+elementLength);
            break
        }
    }
    
    // extract the type and the actual value
    let objType;
    let value;
    string = string.slice(1, -1); // strip the outermost {}
    for (let i = 0; i < string.length; i++){
        if (string[i] === ","){ //first part is the data type
            objType = string.slice(0, i);
            value = string.slice(i+1);
            break
        }
    }

    let idx;
    let numberStartAt;
    switch (objType) {
        case "number":
            return Number(value);
        case "boolean":
            return JSON.parse(value);
        case "undefined":
            return undefined;
        case "null":
            return null;
        case "string":
            return value;
        case "function":
            return new Function('return ' + value)();
        case "date":
            return new Date(value);
        case "error":
            return new Error(value)
        case "array":
            let arr = []
            value = value.slice(1, -1); //get rid of the []
            idx = 0;
            numberStartAt = 0;
            while (idx < value.length){
                if (value[idx] === "{"){
                    elementLength = Number(value.slice(numberStartAt, idx));
                    arr.push(deserialize(value.slice(numberStartAt, idx+elementLength)));
                    idx += elementLength;
                    numberStartAt = idx;
                }else{
                    idx += 1;
                }
            }
            return arr;
        case "object": // example: {4(city:17{string,New York})3(zip:14{string,10001})}
            value = value.slice(1, -1); //get rid of the {}
            let obj = {};
            let key;
            let keyLength;
            idx = 0
            numberStartAt = 0;
            
            //traverse over the string
            while (idx < value.length){
                if (value[idx] === "("){
                    keyLength = Number(value.slice(numberStartAt, idx));
                    key = value.slice(idx+1, idx+1+keyLength);

                    idx += keyLength + 2; //so that now o_idx pointing at the value for this pair
                    numberStartAt = idx;
                    
                    while (value[idx] !== "{"){
                        idx += 1;
                    }
                    elementLength = Number(value.slice(numberStartAt, idx));
                    obj[key] = deserialize(value.slice(numberStartAt, idx+elementLength));
                    idx += elementLength + 1; //1 is for the closing paranthesis )
                    numberStartAt = idx;
                }else{
                    idx += 1;
                }
            }
            return obj;
        default:
            throw new Error(`Unrecognized type: ${objType}`);
      }
}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};


function test(){
    // primitive types
    console.log(deserialize(serialize("Hello, World!")));
    console.log(deserialize(serialize(1291234)));
    console.log(deserialize(serialize(undefined)));
    console.log(deserialize(serialize(null)));
    console.log(deserialize(serialize(true)));

    // function; without global var
    let f = (a) => {
        console.log('gets called');
        return a + 2;
    }
    console.log(deserialize(serialize(f))(12));
    
    // date object
    const date = new Date();
    console.log(deserialize(serialize(date)));

    // error object
    const error = new Error('This is an error message');
    console.log(deserialize(serialize(error)));

    //array
    let arr = [12, false, new Error("testing inside the array"), "aksd{v}jna[", new Date(), undefined, [121, [null, f, "\""], false]];
    sd_arr = deserialize(serialize(arr));
    console.log(sd_arr[6][1][1](99));
    console.log(sd_arr);

    //object
    let person = {
        name: "Alice",
        age: 25,
        isStudent: false,
        hobbies: ["reading", "coding", "hiking"],
        myFunc: f,
        address: {
            city: "New York",
            zip: "10001"
        }
    };
    console.log(deserialize(serialize(person)));
}  

// test();