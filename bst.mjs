// A balanced BST tree class.
///////////////////////////////////////////////////////////////////////////////
class BST {
    // An array of tree nodes, each entry containing:
    // [
    //    0: Value of node.
    //    1: Index of left branch, null if not present.
    //    2: Index of right branch, null if not present.
    // ]
    //_tree = [];
    //-------------------------------------------------------------------------
    // The current height of the tree, updated whenever a node is added. The
    //  tree is rebalanced when the height exceeds too far past the balancing
    //  threshold - log2( nodeCount ).
    //_height = 0;

    constructor() {
        this._tree   = [];
        this._height = 0;
    }

    //-------------------------------------------------------------------------
    // Recursive (tail-calls) function to add a node to the tree.
    _addScan( index, value, height ) {
        const tree = this._tree;
        const [nodeValue, left, right] = tree[index];

        if( value < nodeValue ) {
            // Add to left side.
            if( left !== null ) {
                // Tail call.
                return this._addScan( left, value, height + 1 );
            } else {
                tree.push( [value, null, null] );
                tree[index][1] = tree.length - 1;
                this._height = Math.max( this._height, height + 1 );
            }
        } else if( value > nodeValue ) {
            // Add to right side.
            if( right !== null ) {
                // Tail call.
                return this._addScan( right, value, height + 1 );
            } else {
                tree.push( [value, null, null] );
                tree[index][2] = tree.length - 1;
                this._height = Math.max( this._height, height + 1 );
            }
        } else {
            // Value already exists in tree.
        }
    }

    //-------------------------------------------------------------------------
    // Recursive function to fill the array with all nodes sorted.
    _fillNodeArray( index, array ) {
        const [value, left, right] = this._tree[index];
        // Scan left branches first, then add ourselves, and then continue
        //  to right branches with tail calls.
        if( left !== null ) {
            this._fillNodeArray( left, array );
        }
        array.push( value );
        if( right !== null ) {
            return this._fillNodeArray( right, array );
        }
    }

    //-------------------------------------------------------------------------
    // Recursive function to build a binary search tree from the input array.
    //  `start` and `end` are the inclusive ranges of elements to create a node
    //  set from (set to 0, length-1 for start).
    _rebuildTree( tree, array, start, end ) {
        if( start > end ) return null;

        const mid     = Math.floor( (start + end) / 2 );
        const newNode = [array[mid], null, null];
        tree.push( newNode );
        const newNodeIndex = tree.length - 1;

        newNode[1] = this._rebuildTree( tree, array, start, mid - 1 );
        newNode[2] = this._rebuildTree( tree, array, mid + 1, end );

        return newNodeIndex;
    }

    //-------------------------------------------------------------------------
    // Transforms the current tree into a balanced version, where height
    //  doesn't exceed log2(nodeCount).
    _rebalance() {
        if( this._tree.length <= 1 ) return;

        const nodeArray = [];
        this._fillNodeArray( 0, nodeArray );

        const newTree = [];
        this._rebuildTree( newTree, nodeArray, 0, nodeArray.length - 1 );

        this._tree = newTree;
    }
    
    //-------------------------------------------------------------------------
    // Add a value to the tree. Duplicate values are ignored.
    add( value ) {
        const tree = this._tree;
        if( tree.length === 0 ) {
            tree.push( [value, null, null] );
            this._height = 1;
        } else {
            this._addScan( 0, value, 1 );
            
            const totalNodes = tree.length;
            if( this._height > Math.log2(totalNodes) * 2 + 1000 ) {
                // Needs to be rebalanced.
                //console.log( 'rebalanced' );
                this._rebalance();
                this._height = 1;
            }
        }
    }

    //-------------------------------------------------------------------------
    // Searches through the tree using the condition function provided.
    _searchLoop( index, condition, previous ) {
        if( index === null ) return previous;
        const node = this._tree[index];
        previous = node[0];
        const action = condition( node[0] );
        if( action === -1 ) {
            return this._searchLoop( node[1], condition, previous );
        } else if( action === 1 ) {
            return this._searchLoop( node[2], condition, previous );
        } else {
            return previous;
        }
    }
    
    //-------------------------------------------------------------------------
    // Search the tree using the given condition.
    // `condition` is a function that accepts one parameter - the node value
    //  being checked. Return 0 to stop the search, -1 to search for something
    //  lesser, and 1 to search for something greater.
    search( condition ) {
        if( this._tree.length == 0 ) return null;
        return this._searchLoop( 0, condition, null );
    }

    _walkTreeForDump( rows, index, height ) {
        rows[height] = rows[height] || [];
        const [value, left, right] = this._tree[index];
        if( left ) {
            this._walkTreeForDump( rows, left, height + 1 );
        }
        rows[height].push( value );
        if( right ) {
            this._walkTreeForDump( rows, right, height + 1 );
        }
    }

    //-------------------------------------------------------------------------
    // Debug function that prints the map to the console.
    dumpToConsole() {
        console.log( "BST Tree Data:", this._tree );
        const dumpRows = {};
        this._walkTreeForDump( dumpRows, 0, 0 );
        console.log( "Rows:" );
        for( let i = 0; ; i++ ) {
            const row = dumpRows[i];
            if( !row ) break;
            console.log( row.join(" ") );
        }
    }

    // Returns all values sorted.
    testSorted() {
        const array = [];
        this._fillNodeArray( 0, array );
        return array;
    }
}

///////////////////////////////////////////////////////////////////////////////
export default BST;
