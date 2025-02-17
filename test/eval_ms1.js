const { serialize, deserialize } = require('../distribution/util/serialization');

// Provide support for Number, String, Boolean, null, and undefined.

function time_ds(toBeTransferred){
    let start = performance.now();

    deserialize(serialize(toBeTransferred));

    return performance.now() - start;
}

function latency_basic_type (){
    let totalLatency = 0;
    let list_basic_types = [
        3, 113, 1234, 5364, 
        "dfasdva", "random garbage", "lalala", "CSCI1380", 
        true, false,
        null, undefined
    ]
    
    for (let item of list_basic_types){
        totalLatency += time_ds(item);
    }

    console.log("The average latency for basic data types is", totalLatency / list_basic_types.length);
}

function latency_function (){
    let totalLatency = 0;

    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function randomString(length) {
        return Math.random().toString(36).substr(2, length);
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function factorial(n){
        console.assert(n>0 && Number.isInteger(n));
        if (n==1){
            return n;
        }
        return n * factorial(n-1);
    }

    function addTwo(n){
        return n+2;
    }

    let list_function = [
        deepClone, randomString, capitalize, 
        shuffleArray, isEmpty, formatDate, sleep, factorial, addTwo,
        latency_basic_type, time_ds, latency_complex_type
    ]
    
    for (let item of list_function){
        totalLatency += time_ds(item);
    }

    console.log("The average latency for function is", totalLatency / list_function.length);
}

function latency_complex_type(){
    let totalLatency = 0;

    let person = {
        name: "Alice",
        age: 25,
        isStudent: false,
        hobbies: ["reading", "coding", "hiking"],
        address: {
            city: "New York",
            zip: "10001"
        }
    };

    let arr_mixed = [12, false, new Error("testing inside the array"), "aksd{v}jna[", new Date(), undefined, [121, [null, "\""], false]];

    let date = new Date();
    let err = new Error("Something went wrong");

    let matrix = [
        [1, 1, 1],
        [2, 2, 2], 
        [3, 3, 3], 
        [4, 4, 4]]

    let counter = {
        value: 0
    };

    let company = {
        name: "TechCorp",
        location: {
            country: "USA",
            state: "California",
            city: "San Francisco",
            address: {
                street: "123 Tech Street",
                zip: "94105"
            }
        },
        employees: [
            {
                id: 1,
                name: "Alice",
                role: "Software Engineer",
                skills: ["JavaScript", "React", "Node.js"],
                contact: {
                    email: "alice@techcorp.com",
                    phone: "123-456-7890"
                }
            },
            {
                id: 2,
                name: "Bob",
                role: "Data Scientist",
                skills: ["Python", "Machine Learning", "SQL"],
                contact: {
                    email: "bob@techcorp.com",
                    phone: "987-654-3210"
                }
            }
        ],
        departments: {
            engineering: {
                manager: "Charlie",
                team: ["Alice", "David", "Eve"]
            },
            data: {
                manager: "Dave",
                team: ["Bob", "Frank"]
            }
        },
        isHiring: true
    };

    list_complex_types = [person, arr_mixed, date, err, matrix, counter, company]
    
    for (let item of list_complex_types){
        totalLatency += time_ds(item);
    }

    console.log("The average latency for complex data types is", totalLatency / list_complex_types.length);
}

latency_basic_type();
latency_function();
latency_complex_type();
