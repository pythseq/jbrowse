define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'JBrowse/Util/DeferredGenerator',
            'JBrowse/Store',
            'JBrowse/Store/LRUCache'
        ],
        function(
            declare,
            lang,
            DeferredGenerator,
            Store,
            LRUCache
        ) {

/**
 * Base class for JBrowse data backends that hold sequences and
 * features.
 *
 * @class JBrowse.SeqFeatureStore
 * @extends JBrowse.Store
 * @constructor
 */
return declare( Store,
{

    constructor: function( args ) {
        this.globalStats = {};
        this._dataHub = args.dataHub;
        if( ! this._dataHub ) throw new Error('dataHub arg required');
    },

    deflate: function() {
        return {
            dataHub: 'FAKE',
            config: this.exportMergedConfig(),
            app: '$context.app'
        };
    },

    configSchema: {
        slots: [
            { name: 'name', type: 'string',
              defaultValue: function(store) {
                  return 'Store '+store.serialNumber;
              }
            }
        ]
    },

    openResource: function( class_, resource, opts ) {
        return this.browser.openResource( class_, this.resolveUrl( resource, (opts||{}).templateVars ) );
    },

    /**
     * Fetch statistics about the features in a specific region.
     *
     * @param {String} query.ref    the name of the reference sequence
     * @param {Number} query.start  start of the region in interbase coordinates
     * @param {Number} query.end    end of the region in interbase coordinates
     */
    getRegionStats: function( query, successCallback, errorCallback ) {
        if( successCallback ) throw new Error('getRegionStats no longer takes callback arguments');

        return this._getRegionStats.apply( this, arguments );
    },

    _getRegionStats: function( query, successCallback, errorCallback ) {
        var thisB = this;
        var cache = thisB._regionStatsCache = thisB._regionStatsCache || new LRUCache({
            name: 'regionStatsCache',
            maxSize: 1000, // cache stats for up to 1000 different regions
            sizeFunction: function( stats ) { return 1; },
            fillCallback: function( query, callback ) {
                //console.log( '_getRegionStats', query );
                var s = {
                    scoreMax: -Infinity,
                    scoreMin: Infinity,
                    scoreSum: 0,
                    scoreSumSquares: 0,
                    basesCovered: query.end - query.start,
                    featureCount: 0
                };
                thisB.getFeatures( query,
                                  function( feature ) {
                                      var score = feature.get('score') || 0;
                                      s.scoreMax = Math.max( score, s.scoreMax );
                                      s.scoreMin = Math.min( score, s.scoreMin );
                                      s.scoreSum += score;
                                      s.scoreSumSquares += score*score;
                                      s.featureCount++;
                                  },
                                  function() {
                                      s.scoreMean = s.featureCount ? s.scoreSum / s.featureCount : 0;
                                      s.scoreStdDev = thisB._calcStdFromSums( s.scoreSum, s.scoreSumSquares, s.featureCount );
                                      s.featureDensity = s.featureCount / s.basesCovered;
                                      //console.log( '_getRegionStats done', s );
                                      callback( s );
                                  },
                                  function(error) {
                                      callback( null, error );
                                  }
                                );
            }
         });

         cache.get( query,
                    function( stats, error ) {
                        if( error )
                            errorCallback( error );
                        else
                            successCallback( stats );
                    });

    },

    // most stores can't store sequences, override this if you can.
    getSequenceFragments: function() {
        var d = new DeferredGenerator();
        d.resolve( undefined );
        return d;
    },

    // utility method that calculates standard deviation from sum and sum of squares
    _calcStdFromSums: function( sum, sumSquares, n ) {
        if( n == 0 )
            return 0;

        var variance = sumSquares - sum*sum/n;
        if (n > 1) {
	    variance /= n-1;
        }
        return variance < 0 ? 0 : Math.sqrt(variance);
    },

    /**
     * Fetch feature data from this store.
     *
     * @param {String} query.ref    the name of the reference sequence
     * @param {Number} query.start  start of the region in interbase coordinates
     * @param {Number} query.end    end of the region in interbase coordinates
     * @param {Function} featureCallback(feature) callback that is called once
     *   for each feature in the region of interest, with a single
     *   argument; the feature.
     * @param {Function} endCallback() callback that is called once
     *   for each feature in the region of interest, with a single
     *   argument; the feature.
     * @param {Function} errorCallback(error) in the event of an error, this
     *   callback will be called with one argument, which is anything
     *   that can stringify to an error message.
     */
    getFeatures: function( query ) {
        throw new Error('getFeatures is abstract');
    }

});
});