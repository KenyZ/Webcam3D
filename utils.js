const Utils = {

    putFromSpherical(x, y, count, rad, step = null){

        let pos = new THREE.Vector3()
        
        pos.setFromSphericalCoords(
            rad,
            step ? step.phi * x : Math.PI * 2 * (x / count.x),
            step ? step.theta * y : Math.PI * 2 * (y / count.y)
        )

        return pos
    },

    change_uvs: function( geometry, unitx, unity, offsetx, offsety ) {
        var uvs = geometry.attributes.uv.array;
        for ( var i = 0; i < uvs.length; i += 2 ) {
            uvs[ i ] = ( uvs[ i ] + offsetx ) * unitx;
            uvs[ i + 1 ] = ( uvs[ i + 1 ] + offsety ) * unity;
        }
    },

    shuffle: function(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    },

    allIndexTill(limit){
        let output = []
        for(let i = 0; i < limit; i++){
            output.push(i)
        }
        return output
    },

    nearestPow2: function( aSize ){
        return Math.pow( 2, Math.ceil( Math.log( aSize ) / Math.log( 2 ) ) ); 
    },

    averageIncreaseTo: function(data, dataCount){
        if(dataCount < data.length){
            console.error('dataCount must be lower than data.length')
        } else {
    
            let output = []
    
            let n = Math.floor(dataCount / data.length)
    
            for(let i = 0; i < data.length; i++){
                let copies = Array(n).fill(data[i])
    
                for(let j = 0; j < copies.length; j++){
                    if(output.length < dataCount){
                        output.push(copies[j])
                    } else {
                        return output
                    }
                }
            }
    
            if(output.length < dataCount){
    
                let rest = dataCount - output.length
    
                for(let k = 0; k < rest; k++){
                    output.push(data[data.length - 1])
                }
            }
    
            return output
        }
    }
}