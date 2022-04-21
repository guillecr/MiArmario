const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class ExtImgs extends RegDB{
    constructor(IdImg, ChPrincipal, NuOrder, ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy, BiStream){
        super();
        this.IdImg = IdImg;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
        this.ChPrincipal = ChPrincipal;
        this.NuOrder = NuOrder;
        this.ChActive = ChActive;
        this.BiStream = BiStream;

    };

    static TxTable = 'EXT_IMGS';

    static ListFields = {
        IdImg: new Fields('ID_IMG','Number' ,'PK' , null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        ChPrincipal: new Fields('CH_PRINCIPAL', 'Boolean', null , null),
        NuOrder: new Fields('NU_ORDER', 'Number', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        BiStream: new Fields('BI_STREAM', 'String', null, null)
    };
}

module.exports = ExtImgs;