define([
           'dojo/_base/declare',
           'JBrowse/Util',
           'JBrowse/Model/FileBlob',
           'JBrowse/Model/XHRBlob'
       ],
       function( declare, Util, FileBlob, XHRBlob ) {
var uniqCounter = 0;
return declare( null, {

    storeType: 'JBrowse/Store/SeqFeature/GFF3',

    tryResource: function( configs, resource ) {
        if( resource.type == 'gff3' ) {
            var basename = Util.basename(
                resource.file ? resource.file.name :
                resource.url  ? resource.url       :
                                ''
            );
            if( !basename )
                return false;

            var newName = 'GFF3_'+basename+'_'+uniqCounter++;
            configs[newName] = {
                type: this.storeType,
                blob: resource.file || resource.url,
                name: newName
            };
            return true;
        }
        else
            return false;
    },

    // try to merge any singleton BAM and BAI stores.  currently can only do this if there is one of each
    finalizeConfiguration: function( configs ) {
    },

    confIsValid: function( conf ) {
        return conf.blob || conf.urlTemplate;
    }
});
});