const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class RPrendasImgs extends RegDB{
    constructor(IdPrendaImg, FhCreated, FhModified, CdCreatedBy, CdModifiedBy, ChActive, CdPrenda, CdImg){
        super();
        this.IdPrendaImg = IdPrendaImg;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdCreatedBy = CdCreatedBy;
        this.CdModifiedBy = CdModifiedBy;
        this.ChActive = ChActive;
        this.CdPrenda = CdPrenda;
        this.CdImg = CdImg;
    };

    static TxTable = "R_PRENDAS_IMGS";

    static ListFields = {
        IdPrendaImg: new Fields('ID_PRENDA_IMG','Number' ,'PK' , null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdImg: new Fields('CD_IMG', 'Number', null, null),
        CdPrenda: new Fields('CD_PRENDA', 'Number', null, null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null)
    };
}

module.exports = RPrendasImgs;