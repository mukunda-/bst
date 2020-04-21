///////////////////////////////////////////////////////////////////////////////
// TESTS AND DIAGNOSTICS SUITE
///////////////////////////////////////////////////////////////////////////////
import BST from './bst.mjs';

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

function getTime() {
    return new Date().getTime();
}

let recordStartTime = 0;

function startRecord() {
    recordStartTime = getTime();
}

function printRecord() {
    
    let recordEndTime = getTime();
    console.log( `Time: ${recordEndTime - recordStartTime}ms` );
}

function expect_eq( a, b ) {
    if( a !== b ) {
        console.log( "expect failed.", a, "!==", b );
    }
}

{
    const testInput = [ 23, 52, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88,
                        87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74,
                        73, 72, 72, 72, 72, 16, 2,  4,  8,  16, 32, 101 ];
    
    const bst = new BST();
    testInput.map( e => bst.add( e ));
    bst.dumpToConsole();

    const sorted = bst.testSorted();
    testInput.sort( (a, b) => a - b );
    // Remove duplicates
    for( let i = 0; i < testInput.length; i++ ) {
        while( testInput[i] == testInput[i - 1] ) {
            testInput.splice( i, 1 );
        }
    }
    if( !arraysEqual( sorted, testInput ) ) {
        console.log( "error: bst didn't return sorted array." );
        console.log( testInput );
        console.log( sorted );
    }
    
    function findClosestAbove( bst, threshold ) {
        let best = null;
        bst.search( v => {
            if( v > threshold ) {
                best = v;
                if( best == v + 1 ) return 0;
                return -1;
            } else {
                return 1;
            }
        });
        return best;
    }

    {
        expect_eq( findClosestAbove( bst, 8 ), 16 );
        expect_eq( findClosestAbove( bst, 2 ), 4 );
        expect_eq( findClosestAbove( bst, 83 ), 84 );
        expect_eq( findClosestAbove( bst, 101 ), null );
    }
}

{
    
    const testInput = [];

    for( let test = 1; test <= 5; test++ ) {

        {
            let bst = new BST();
            startRecord();
            console.log( `Feeding 10^${test} sorted values.` );
            for( let i = 0, limit = Math.pow( 10, test ); i < limit; i++ ) {
                if( i % Math.floor(limit / 10) == 0 ) {
                    process.stdout.write("|");
                }
                //process.stdout.write( bst._height + " ");
                bst.add( i );
            }
            console.log("");
            printRecord();
        }
        {
            let bst = new BST();
            startRecord();
            console.log( `Feeding 10^${test} random values.` );
            for( let i = 0, limit = Math.pow( 10, test ); i < limit; i++ ) {
                if( i % Math.floor(limit / 10) == 0 ) {
                    process.stdout.write("|");
                }
                
                
                bst.add( Math.floor(Math.random() * 99999999) );
            }
            console.log("");
            printRecord();

            startRecord();

            console.log( `Querying 10^${test} random values.` );
            for( let i = 0, limit = Math.pow( 10, test ); i < limit; i++ ) {
                if( i % Math.floor(limit / 10) == 0 ) {
                    process.stdout.write("|");
                }
                
                let desired = Math.floor(Math.random() * 9999999);
                bst.search( a => {
                    if( a > desired ) return -1;
                    if( a < desired ) return 1;
                    return 0;
                });
            }
            console.log("");
            printRecord();
        }

    }

    
}

console.log( "done." );